import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Package, ArrowRight, Store, Loader2, LogIn, Info } from "lucide-react";
import { toast } from "sonner";
import { useProducerCarts } from "@/hooks/useProducerCarts";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MisCarritos = () => {
  const { 
    carts, 
    loading, 
    isLoggedIn, 
    updateQuantity, 
    removeFromCart,
    clearCartForCompany 
  } = useProducerCarts();
  const navigate = useNavigate();

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

  const handleClearCart = async (companyId: string, companyName: string) => {
    const { error } = await clearCartForCompany(companyId);
    if (error) {
      toast.error("Error al vaciar el carrito");
    } else {
      toast.success(`Carrito de ${companyName} vaciado`);
    }
  };

  const goToCheckout = (companyId: string) => {
    navigate(`/carrito?productor=${companyId}`);
  };

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
            <h1 className="text-2xl font-bold text-primary mb-4">Inicia sesión para ver tus carritos</h1>
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
            <h1 className="text-4xl font-bold text-primary">Mis Carritos</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Gestiona tus carritos por productor. Cada pedido es gestionado de forma independiente.
          </p>
        </div>
      </section>

      {/* Info Alert */}
      <div className="container mx-auto px-6 pt-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Cada carrito corresponde a un productor diferente. Los pedidos se realizan y pagan de forma independiente para garantizar la mejor experiencia con cada productor.
          </AlertDescription>
        </Alert>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {carts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-primary mb-2">No tienes carritos activos</h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestros packs y añade productos a tu carrito
            </p>
            <Button asChild>
              <Link to="/packs">Explorar Packs</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {carts.map((cart) => (
              <Card key={cart.company.id} className="overflow-hidden">
                {/* Producer Header */}
                <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {cart.company.logo_url ? (
                        <img 
                          src={cart.company.logo_url} 
                          alt={cart.company.business_name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                          <Store className="w-7 h-7 text-primary" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-xl">{cart.company.business_name}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Info className="w-3 h-3" />
                          Pedido gestionado directamente por este productor
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item) => {
                      const pack = item.pack;
                      const product = item.product;
                      const name = pack?.title || product?.name || 'Producto';
                      const price = Number(pack?.price || product?.price || 0);

                      return (
                        <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={pack ? `/packs/${pack.slug}` : '#'}
                              className="font-medium text-primary hover:underline line-clamp-1"
                            >
                              {name}
                            </Link>
                            {pack && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Pack
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, -1, item.quantity)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleUpdateQuantity(item.id, 1, item.quantity)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>

                          <div className="text-right min-w-[80px]">
                            <p className="font-bold text-primary">{price * item.quantity}€</p>
                            <p className="text-xs text-muted-foreground">{price}€/ud</p>
                          </div>

                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="my-4" />

                  {/* Cart Summary & Actions */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total del carrito</p>
                      <p className="text-2xl font-bold text-primary">{cart.total}€</p>
                      <p className="text-xs text-green-600">Envío incluido</p>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => handleClearCart(cart.company.id, cart.company.business_name)}
                      >
                        Vaciar carrito
                      </Button>
                      <Button onClick={() => goToCheckout(cart.company.id)}>
                        Pagar este pedido
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Continue Shopping */}
        {carts.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/packs">Seguir explorando packs</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MisCarritos;
