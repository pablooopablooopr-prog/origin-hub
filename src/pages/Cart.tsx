import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Trash2, Plus, Minus, Gift, Package, ArrowRight, Tag, Loader2, LogIn, CheckCircle, MapPin, Store, Info, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useProducerCarts, type ProducerCart } from "@/hooks/useProducerCarts";
import { usePromotionalCode } from "@/hooks/usePromotionalCode";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Cart = () => {
  const [searchParams] = useSearchParams();
  const productorId = searchParams.get('productor');
  
  const { carts, loading, isLoggedIn, updateQuantity, removeFromCart, clearCartForCompany, refetch, customerId } = useProducerCarts();
  const { appliedCodeId, discount, loading: promoLoading, validateCode, removeCode, incrementCodeUsage } = usePromotionalCode();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [promoInput, setPromoInput] = useState("");
  const [checkoutForm, setCheckoutForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    notes: ""
  });

  // Get the specific cart for the selected producer
  const selectedCart: ProducerCart | null = productorId 
    ? carts.find(c => c.company.id === productorId) || null 
    : carts[0] || null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // If no productor param and multiple carts, redirect to mis-carritos
  useEffect(() => {
    if (!loading && isLoggedIn && carts.length > 1 && !productorId) {
      navigate('/mis-carritos');
    }
  }, [loading, isLoggedIn, carts, productorId, navigate]);

  const handleUpdateQuantity = async (itemId: string, change: number, currentQty: number) => {
    const newQty = currentQty + change;
    const { error } = await updateQuantity(itemId, newQty);
    if (error) {
      toast.error("Error al actualizar cantidad");
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    const { error } = await removeFromCart(itemId);
    if (error) {
      toast.error("Error al eliminar producto");
    } else {
      toast.success("Producto eliminado del carrito");
    }
  };

  const proceedToCheckout = () => {
    if (!selectedCart || selectedCart.items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleConfirmOrder = async () => {
    if (!checkoutForm.address || !checkoutForm.city || !checkoutForm.postalCode) {
      toast.error("Por favor completa la dirección de envío");
      return;
    }

    if (!selectedCart || !customerId) {
      toast.error("Error al procesar el pedido");
      return;
    }

    setIsCheckingOut(true);

    // Get customer info
    const { data: customer } = await supabase
      .from('customers')
      .select('id, email, full_name')
      .eq('id', customerId)
      .single();

    if (!customer) {
      toast.error("Error: cliente no encontrado");
      setIsCheckingOut(false);
      return;
    }

    const orderItems = selectedCart.items.map(item => ({
      pack_id: item.pack?.id,
      product_id: item.product?.id,
      quantity: item.quantity,
      unit_price: Number(item.pack?.price || item.product?.price || 0)
    }));

    const shippingAddress = `${checkoutForm.address}, ${checkoutForm.postalCode} ${checkoutForm.city}`;

    // Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    // Create order for this specific producer
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        company_id: selectedCart.company.id,
        shipping_address: shippingAddress,
        notes: checkoutForm.notes,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      toast.error("Error al crear el pedido");
      setIsCheckingOut(false);
      return;
    }

    // Create order items
    const orderItemsData = orderItems.map(item => ({
      order_id: order.id,
      pack_id: item.pack_id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
      product_snapshot: { price: item.unit_price }
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) {
      // Rollback
      await supabase.from('orders').delete().eq('id', order.id);
      toast.error("Error al crear los items del pedido");
      setIsCheckingOut(false);
      return;
    }

    // Clear only this producer's cart
    await clearCartForCompany(selectedCart.company.id);

    // Send confirmation email
    try {
      await supabase.functions.invoke('send-order-confirmation', {
        body: {
          to: customer.email,
          customerName: customer.full_name,
          orderId: order.id,
          producerName: selectedCart.company.business_name,
          items: orderItems.map(item => ({
            name: item.pack_id ? 'Pack' : 'Producto',
            quantity: item.quantity,
            price: item.unit_price
          })),
          total: totalAmount
        }
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    setIsCheckingOut(false);
    setOrderId(order.id);
    setShowCheckoutDialog(false);
    setShowSuccessDialog(true);
    refetch();
  };

  const subtotal = selectedCart?.total || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-4">Inicia sesión para ver tu carrito</h1>
            <p className="text-muted-foreground mb-6">
              Necesitas una cuenta para guardar productos en tu carrito
            </p>
            <Button asChild>
              <Link to="/customer-auth">
                <LogIn className="w-4 h-4 mr-2" />
                Iniciar Sesión
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!selectedCart) {
    return (
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-primary mb-4">Carrito vacío</h1>
            <p className="text-muted-foreground mb-6">
              No tienes productos en tu carrito
            </p>
            <Button asChild>
              <Link to="/packs">Explorar Packs</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section with Producer Info */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Link to="/mis-carritos" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Mis Carritos</span>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedCart.company.logo_url ? (
              <img 
                src={selectedCart.company.logo_url} 
                alt={selectedCart.company.business_name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-8 h-8 text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Pedido a {selectedCart.company.business_name}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1 mt-1">
                <Info className="w-4 h-4" />
                Pedido gestionado directamente por este productor
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Alert */}
      <div className="container mx-auto px-6 pt-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Store className="h-4 w-4" />
          <AlertDescription>
            Este pedido será gestionado y enviado directamente por <strong>{selectedCart.company.business_name}</strong>. 
            El productor se encargará del empaquetado, envío y atención al cliente.
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos ({selectedCart.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCart.items.map((item) => {
                  const pack = item.pack;
                  const product = item.product;
                  const name = pack?.title || product?.name || 'Producto';
                  const price = Number(pack?.price || product?.price || 0);
                  
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                        <div className="md:col-span-1">
                          <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="md:col-span-3 space-y-2">
                          <Link 
                            to={pack ? `/packs/${pack.slug}` : '#'}
                            className="font-semibold text-primary hover:underline"
                          >
                            {name}
                          </Link>
                          {pack && (
                            <Badge variant="outline" className="text-xs">
                              Pack
                            </Badge>
                          )}
                        </div>
                        
                        <div className="md:col-span-1 flex flex-col items-end justify-between">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          
                          <div className="space-y-2 text-right">
                            <p className="text-xl font-bold text-primary">{price * item.quantity}€</p>
                            <div className="flex items-center gap-2 justify-end">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Gift Option */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Opciones de Regalo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="is-gift" 
                    className="mt-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <label htmlFor="is-gift" className="font-medium cursor-pointer">
                      Este pedido es un regalo
                    </label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Añade una tarjeta personalizada y envía a otra dirección
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Promo Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Tag className="w-5 h-5" />
                  Código Promocional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Introduce tu código" 
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {selectedCart.company.logo_url ? (
                    <img 
                      src={selectedCart.company.logo_url} 
                      alt={selectedCart.company.business_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Store className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{subtotal}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío</span>
                    <span className="font-medium text-green-600">Incluido</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{total}€</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={proceedToCheckout}
                  disabled={selectedCart.items.length === 0}
                >
                  Pagar Pedido
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p>✓ Pago seguro</p>
                  <p>✓ Envío incluido en el precio</p>
                  <p>✓ Garantía ORIGEN</p>
                </div>

                <Separator />

                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Información del productor
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    El pedido se envía directamente desde <strong>{selectedCart.company.business_name}</strong>. 
                    Los tiempos de entrega dependen del productor.
                  </p>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/packs">
                    Seguir Comprando
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Checkout Dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Dirección de Envío
            </DialogTitle>
            <DialogDescription>
              Ingresa la dirección donde deseas recibir tu pedido de {selectedCart.company.business_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="Calle, número, piso..."
                value={checkoutForm.address}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input
                  id="postalCode"
                  placeholder="28001"
                  value={checkoutForm.postalCode}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, postalCode: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Madrid"
                  value={checkoutForm.city}
                  onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Instrucciones especiales para la entrega..."
                value={checkoutForm.notes}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
              />
            </div>
            <Separator />
            
            {/* Producer info in checkout */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              {selectedCart.company.logo_url ? (
                <img 
                  src={selectedCart.company.logo_url} 
                  alt={selectedCart.company.business_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-sm">{selectedCart.company.business_name}</p>
                <p className="text-xs text-muted-foreground">Gestionará este pedido</p>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total a pagar:</span>
              <span className="text-primary">{total}€</span>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleConfirmOrder}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Confirmar Pedido
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md text-center">
          <div className="flex flex-col items-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <DialogTitle className="text-2xl mb-2">¡Pedido Confirmado!</DialogTitle>
            <DialogDescription className="text-base mb-4">
              Tu pedido a <strong>{selectedCart.company.business_name}</strong> ha sido realizado con éxito. 
              Recibirás un email de confirmación en breve.
            </DialogDescription>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-4">
                Número de pedido: <span className="font-mono font-semibold">{orderId.slice(0, 8).toUpperCase()}</span>
              </p>
            )}
            <div className="flex gap-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/mi-cuenta');
                }}
              >
                Ver Mis Pedidos
              </Button>
              <Button 
                className="flex-1"
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/packs');
                }}
              >
                Seguir Comprando
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Cart;
