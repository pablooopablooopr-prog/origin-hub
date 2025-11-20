import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Gift, Package, ArrowRight, Tag } from "lucide-react";

const Cart = () => {
  // Auto scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mock cart items - en producción vendría del estado global/context
  const cartItems = [
    {
      id: "pack-esencia-olivar-sierra",
      name: "Pack Esencia - Olivar de la Sierra",
      type: "esencia",
      price: 60,
      quantity: 1,
      image: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png",
      company: "Olivar de la Sierra",
      region: "Andalucía"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0; // Envío incluido
  const total = subtotal + shipping;

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
          
          {/* Cart Items - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Productos en tu carrito ({cartItems.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                      {/* Image */}
                      <div className="md:col-span-1">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="md:col-span-3 space-y-2">
                        <Link 
                          to={`/packs/${item.id}`}
                          className="font-semibold text-primary hover:underline"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.company} • {item.region}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {item.type === 'esencia' ? 'Pack Esencia' : 
                           item.type === 'raiz' ? 'Pack Raíz' : 'Pack Gourmet'}
                        </Badge>
                      </div>
                      
                      {/* Actions */}
                      <div className="md:col-span-1 flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        
                        <div className="space-y-2 text-right">
                          <p className="text-xl font-bold text-primary">{item.price}€</p>
                          <div className="flex items-center gap-2 justify-end">
                            <Button variant="outline" size="icon" className="h-7 w-7">
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button variant="outline" size="icon" className="h-7 w-7">
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
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
                    className="mt-1"
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

          {/* Order Summary - 1 column */}
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

                <Button className="w-full" size="lg">
                  Proceder al Pago
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="text-xs text-center text-muted-foreground space-y-1">
                  <p>✓ Pago seguro</p>
                  <p>✓ Envío incluido en el precio</p>
                  <p>✓ Garantía Origen</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Información de envío</h4>
                  <p className="text-xs text-muted-foreground">
                    Los pedidos se envían en 24-48h laborables. 
                    Recibirás un email con el número de seguimiento.
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
