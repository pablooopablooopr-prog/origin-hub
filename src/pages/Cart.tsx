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
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, Loader2, LogIn, CheckCircle, MapPin, Store, Info, ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useProducerCarts, type ProducerCart } from "@/hooks/useProducerCarts";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PAYMENT_MESSAGES } from "@/lib/paymentRules";
import { PAYMENTS_MODE } from "@/lib/payments";
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
  const cancelled = searchParams.get("cancelled");
  
  const { carts, loading, isLoggedIn, updateQuantity, removeFromCart, clearCartForCompany, refetch, customerId } = useProducerCarts();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
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
    if (cancelled === "true") {
      toast.info("Pago cancelado. Puedes reintentarlo cuando estés listo.");
    }
  }, [cancelled]);

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
    if (PAYMENTS_MODE === "mock") {
      toast.info("Pago online próximamente. Escríbenos y te informamos sobre este pedido.");
      navigate("/contacto");
      return;
    }
    setShowCheckoutDialog(true);
  };

  const handleConfirmOrder = async () => {
    if (PAYMENTS_MODE === "mock") {
      toast.info("Pago online próximamente. Escríbenos y te informamos sobre este pedido.");
      navigate("/contacto");
      return;
    }

    if (!checkoutForm.address || !checkoutForm.city || !checkoutForm.postalCode) {
      toast.error("Por favor completa la dirección de envío");
      return;
    }

    if (!selectedCart || !customerId) {
      toast.error("Error al procesar el pedido");
      return;
    }

    setIsCheckingOut(true);

    try {
      const shippingAddress = `${checkoutForm.address}, ${checkoutForm.postalCode} ${checkoutForm.city}`;
      console.log("[Checkout] Dirección:", shippingAddress);
      console.log("[Checkout] Customer ID:", customerId);
      console.log("[Checkout] Company ID:", selectedCart.company.id);

      // Validate: no demo items, no null IDs
      for (const item of selectedCart.items) {
        const packId = item.pack?.id || null;
        const productId = item.product?.id || null;
        const isDemoPack = item.pack && (item.pack as any).is_demo === true;

        if (!packId && !productId) {
          console.error("[Checkout] Item sin pack_id ni product_id:", item);
          toast.error("Hay un producto inválido en tu carrito. Elimínalo e inténtalo de nuevo.");
          setIsCheckingOut(false);
          return;
        }

        if (isDemoPack) {
          console.error("[Checkout] Pack demo detectado:", packId);
          toast.error("Este producto demo no puede tramitarse como pedido real. Elimínalo del carrito.");
          setIsCheckingOut(false);
          return;
        }
      }

      // Validate company exists in Supabase
      const { data: companyCheck } = await supabase
        .from("companies_public")
        .select("id")
        .eq("id", selectedCart.company.id)
        .maybeSingle();

      if (!companyCheck) {
        console.error("[Checkout] Company no encontrada:", selectedCart.company.id);
        toast.error("El productor asociado a este carrito no existe o no está disponible.");
        setIsCheckingOut(false);
        return;
      }

      const orderItems = selectedCart.items.map(item => ({
        pack_id: item.pack?.id || null,
        product_id: item.product?.id || null,
        quantity: item.quantity,
        unit_price: Number(item.pack?.price || item.product?.price || 0)
      }));

      console.log("[Checkout] Order items preparados:", orderItems);

      const totalAmount = orderItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity,
        0
      );

      if (totalAmount <= 0) {
        toast.error("El total del pedido debe ser mayor que 0.");
        setIsCheckingOut(false);
        return;
      }

      // Step 1: Create order
      console.log("[Checkout] Creando orden...");
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          company_id: selectedCart.company.id,
          shipping_address: shippingAddress,
          notes: checkoutForm.notes || null,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (orderError || !order) {
        console.error("[Checkout] Error creando orden:", orderError);
        toast.error("Error al crear el pedido. Inténtalo de nuevo.");
        setIsCheckingOut(false);
        return;
      }

      console.log("[Checkout] Orden creada:", order.id);

      // Step 2: Create order items
      const orderItemsData = orderItems.map(item => ({
        order_id: order.id,
        pack_id: item.pack_id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        product_snapshot: { price: item.unit_price }
      }));

      console.log("[Checkout] Insertando order_items:", orderItemsData);
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsData);

      if (itemsError) {
        console.error("[Checkout] Error creando order_items:", itemsError);
        // Rollback order
        await supabase.from('orders').delete().eq('id', order.id);
        toast.error("Error al crear los items del pedido. Revisa la consola para más detalles.");
        setIsCheckingOut(false);
        return;
      }

      console.log("[Checkout] Order items creados. Iniciando Stripe checkout...");

      // Step 3: Stripe checkout
      const successUrl = `${window.location.origin}/mis-carritos?purchased=true&order=${order.id}`;
      const cancelUrl  = `${window.location.origin}/carrito?productor=${selectedCart.company.id}&cancelled=true`;

      const { data: checkoutData, error: checkoutError } =
        await supabase.functions.invoke("create-pack-checkout", {
          body: { orderId: order.id, successUrl, cancelUrl },
        });

      console.log("[Checkout] Stripe response:", checkoutData, checkoutError);

      const errAny = checkoutError as any;
      const isNotOnboarded =
        checkoutData?.code === "PRODUCER_NOT_ONBOARDED" ||
        errAny?.context?.code === "PRODUCER_NOT_ONBOARDED" ||
        errAny?.code === "PRODUCER_NOT_ONBOARDED" ||
        errAny?.message?.includes?.("PRODUCER_NOT_ONBOARDED");

      if (isNotOnboarded) {
        toast.error("El productor no ha completado su configuración de pagos. Contacta con ORIGEN.");
        setIsCheckingOut(false);
        return;
      }

      if (checkoutError || !checkoutData?.url) {
        console.error("[Checkout] Error Stripe:", checkoutError, checkoutData);
        toast.error("Error al iniciar el pago. Inténtalo de nuevo.");
        setIsCheckingOut(false);
        return;
      }

      window.location.href = checkoutData.url;
    } catch (err) {
      console.error("[Checkout] Error inesperado:", err);
      toast.error("Error inesperado al procesar el pedido.");
      setIsCheckingOut(false);
    }
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
              <Link to="/mapa">Explorar Packs</Link>
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

      {/* Info Alerts */}
      <div className="container mx-auto px-6 pt-6 space-y-3">
        <Alert className="bg-primary/5 border-primary/20">
          <Store className="h-4 w-4" />
          <AlertDescription>
            Este pedido será gestionado y enviado directamente por el productor <strong>{selectedCart.company.business_name}</strong>. El productor se encarga del empaquetado, envío y atención al cliente.
          </AlertDescription>
        </Alert>
        
        {/* Stripe Connect info */}
        <Alert className="bg-green-50 border-green-200">
          <CreditCard className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {PAYMENTS_MODE === "mock" ? (
              <>
                <strong>Pago online próximamente:</strong> solicita información para este pedido.
              </>
            ) : (
              <>
                <strong>Pago directo al productor:</strong> {PAYMENT_MESSAGES.PACK_CHECKOUT.paymentInfo} ORIGEN no cobra comisión.
              </>
            )}
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
                            to={pack ? "/mapa" : '#'}
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
                  {PAYMENTS_MODE === "mock" ? "Solicitar información" : "Pagar Pedido"}
                </Button>

                <Separator />

                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Información del productor
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    El pedido se envía directamente desde el productor <strong>{selectedCart.company.business_name}</strong>. 
                    Los tiempos de entrega dependen de cada productor.
                  </p>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/mapa">
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
                  navigate('/mapa');
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
