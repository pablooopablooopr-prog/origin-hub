import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Users, 
  CreditCard, 
  Shield, 
  Check,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, calculateRoutePricing, RoutePricing } from "@/hooks/useRoutePricing";
import { getRouteById } from "@/data/routes";

const ComprarRuta = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [routeDbId, setRouteDbId] = useState<string | null>(null);

  // Get data from navigation state or calculate fresh
  const stateData = location.state as {
    routeId?: string;
    routeTitle?: string;
    numPeople?: number;
    pricing?: RoutePricing;
  } | null;

  const localRoute = slug ? getRouteById(slug) : null;
  const routeTitle = stateData?.routeTitle || localRoute?.title || "Ruta";
  const numPeople = stateData?.numPeople || 2;
  const stopCount = localRoute?.stops?.length || 4;
  const pricing = stateData?.pricing || calculateRoutePricing(stopCount, numPeople);

  useEffect(() => {
    checkAuthAndGetIds();
  }, [slug]);

  const checkAuthAndGetIds = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Sesión requerida",
        description: "Inicia sesión para continuar con la compra",
        variant: "destructive"
      });
      navigate("/customer-auth", { state: { returnTo: `/rutas/${slug}` } });
      return;
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (customer) {
      setCustomerId(customer.id);
    }

    // Get route ID from database
    if (slug) {
      const { data: route } = await supabase
        .from("routes")
        .select("id")
        .eq("slug", slug)
        .single();

      if (route) {
        setRouteDbId(route.id);
      }
    }
  };

  const handlePayment = async () => {
    if (!customerId) {
      toast({
        title: "Error",
        description: "No se pudo identificar tu cuenta",
        variant: "destructive"
      });
      return;
    }

    if (!routeDbId) {
      toast({
        title: "Error",
        description: "No se encontró la ruta en la base de datos",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Replace with actual Stripe payment integration
      // For now, simulate successful payment
      
      // Check if purchase already exists
      const { data: existingPurchase } = await supabase
        .from("route_purchases")
        .select("id")
        .eq("customer_id", customerId)
        .eq("route_id", routeDbId)
        .single();

      if (existingPurchase) {
        // Update existing purchase
        const { error } = await supabase
          .from("route_purchases")
          .update({
            num_people: numPeople,
            base_price: pricing.basePrice,
            discount_percent: pricing.discountPercent,
            final_price: pricing.totalPrice,
            payment_status: "completed",
            purchased_at: new Date().toISOString(),
            // stripe_payment_intent_id: "pi_xxx" // Add when Stripe is integrated
          })
          .eq("id", existingPurchase.id);

        if (error) throw error;
      } else {
        // Create new purchase
        const { error } = await supabase
          .from("route_purchases")
          .insert({
            customer_id: customerId,
            route_id: routeDbId,
            num_people: numPeople,
            base_price: pricing.basePrice,
            discount_percent: pricing.discountPercent,
            final_price: pricing.totalPrice,
            payment_status: "completed",
            purchased_at: new Date().toISOString(),
            // stripe_payment_intent_id: "pi_xxx" // Add when Stripe is integrated
          });

        if (error) throw error;
      }

      toast({
        title: "¡Compra completada!",
        description: "Ya tienes acceso a tu ruta digital",
      });

      navigate("/mis-rutas", { 
        state: { justPurchased: true, routeTitle } 
      });

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Resumen del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{routeTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Ruta digital autoguiada
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Paradas incluidas
                    </span>
                    <span>{stopCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Personas
                    </span>
                    <span>{numPeople}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Precio base/persona</span>
                    <span>{formatPrice(pricing.basePrice)}</span>
                  </div>
                  {pricing.discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Descuento grupo</span>
                      <span>-{pricing.discountPercent}%</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(pricing.totalPrice)}
                  </span>
                </div>

                <Badge variant="secondary" className="w-full justify-center py-2">
                  Acceso permanente · Sin caducidad
                </Badge>
              </CardContent>
            </Card>

            {/* What's included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Qué incluye tu compra</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Acceso digital permanente a la ruta",
                    "Mapa interactivo con todas las paradas",
                    "Información detallada de cada productor",
                    "Recomendaciones del día",
                    "Información práctica actualizada"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Pago seguro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stripe Elements will go here */}
                <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/30">
                  <p className="text-sm text-muted-foreground text-center">
                    💳 Integración de Stripe pendiente
                  </p>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    El botón simulará un pago exitoso
                  </p>
                </div>

                <Button 
                  className="w-full py-6 text-lg"
                  onClick={handlePayment}
                  disabled={isProcessing || !customerId}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Pagar {formatPrice(pricing.totalPrice)}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Pago 100% seguro con encriptación SSL</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl">🔒</p>
                <p className="text-xs text-muted-foreground mt-1">Pago seguro</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl">⚡</p>
                <p className="text-xs text-muted-foreground mt-1">Acceso inmediato</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl">♾️</p>
                <p className="text-xs text-muted-foreground mt-1">Sin caducidad</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComprarRuta;
