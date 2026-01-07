import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Gift, Package, ArrowRight, Tag, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/useSupabaseData";

const Cart = () => {
  const { items, loading, isLoggedIn, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
    if (items.length === 0) {
      toast.error("Tu carrito está vacío");
      return;
    }
    toast.success("Redirigiendo a la pasarela de pago...");
  };

  const subtotal = items.reduce((acc, item) => {
    const price = (item as any).pack?.price || (item as any).product?.price || 0;
    return acc + (Number(price) * item.quantity);
  }, 0);
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

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <ShoppingCart className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Carrito de Compra</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Revisa tu pedido antes de finalizar la compra
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos en tu carrito ({items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground mb-4">Tu carrito está vacío</p>
                    <Button asChild>
                      <Link to="/packs">Explorar Packs</Link>
                    </Button>
                  </div>
                ) : (
                  items.map((item) => {
                    const pack = (item as any).pack;
                    const product = (item as any).product;
                    const name = pack?.title || product?.name || 'Producto';
                    const price = Number(pack?.price || product?.price || 0);
                    
                    return (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                          {/* Image placeholder */}
                          <div className="md:col-span-1">
                            <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          </div>
                          
                          {/* Info */}
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
                          
                          {/* Actions */}
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
                  })
                )}
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
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
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
                  disabled={items.length === 0}
                >
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p>✓ Pago seguro</p>
                  <p>✓ Envío incluido en el precio</p>
                  <p>✓ Garantía ORIGEN</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Información de envío</h4>
                  <p className="text-xs text-muted-foreground">
                    Los pedidos se envían directamente desde el productor. 
                    Los tiempos de entrega dependen de cada productor.
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

      <Footer />
    </div>
  );
};

export default Cart;
