import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  MapPin, 
  Users, 
  CreditCard, 
  Shield, 
  Check,
  ArrowLeft,
  Loader2,
  Info,
  Ticket
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice, calculateRoutePricing, RoutePricing } from "@/hooks/useRoutePricing";

import { PAYMENT_MESSAGES } from "@/lib/paymentRules";
import { processRoutePurchase, PAYMENTS_MODE } from "@/lib/payments";

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

  const routeTitle = stateData?.routeTitle || "Ruta";
  const numPeople = stateData?.numPeople || 2;
  const [stopCount, setStopCount] = useState(stateData?.pricing ? Math.round(stateData.pricing.basePrice / 3) : 4);
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

    // Get route from database
    if (slug) {
      const { data: route } = await supabase
        .from("routes")
        .select("id, title, total_stops")
        .eq("slug", slug)
        .single();

      if (route) {
        setRouteDbId(route.id);
        if (route.total_stops) setStopCount(route.total_stops);
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
      const result = await processRoutePurchase({
        routeId: routeDbId,
        routeSlug: slug || "",
        routeTitle,
        customerId,
        numPeople,
        basePrice: pricing.basePrice,
        discountPercent: pricing.discountPercent,
        totalPrice: pricing.totalPrice,
      });

      if (result.success) {
        // If Stripe returned a redirect URL, go there
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
          return;
        }

        // Mock mode - direct success
        toast({
          title: "¡Reserva completada!",
          description: "Ya tienes acceso a tu ruta",
        });

        navigate("/mis-rutas", { 
          state: { justPurchased: true, routeTitle } 
        });
      } else {
        throw new Error(result.error || "Error procesando la reserva");
      }

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Error en la reserva",
        description: error instanceof Error ? error.message : "No se pudo procesar. Inténtalo de nuevo.",
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
                  <Ticket className="w-5 h-5 text-primary" />
                  Resumen de tu entrada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{routeTitle}</h3>
                  <p className="text-sm text-muted-foreground">
                    Entrada para Ruta ORIGEN
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
                    <div className="flex justify-between text-sm text-primary">
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
                <CardTitle className="text-base">Tu entrada incluye</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Entrada válida para esta ruta específica",
                    "Acceso garantizado a los productores participantes",
                    "Visita organizada sin riesgo de encontrar cerrado",
                    "Beneficios asociados a la ruta (según paradas)",
                    "Acceso permanente al comprobante de reserva"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {/* Separation notice */}
            <Alert className="bg-muted/50 border-border">
              <Info className="h-4 w-4 text-muted-foreground" />
              <AlertDescription className="text-muted-foreground text-sm">
                {PAYMENT_MESSAGES.ROUTE_CHECKOUT.separation}
              </AlertDescription>
            </Alert>

            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-primary" />
                  Reservar entrada
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Acceso garantizado a esta ruta con productores participantes
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment mode indicator */}
                {PAYMENTS_MODE === "mock" && (
                  <div className="p-3 bg-muted/50 rounded-lg border border-dashed border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      🧪 Modo de prueba activo - La reserva se completará directamente
                    </p>
                  </div>
                )}

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
                      Reservar entrada · {formatPrice(pricing.totalPrice)}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Pago seguro · Acceso garantizado · Ruta disponible siempre en tu cuenta</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl">🎟️</p>
                <p className="text-xs text-muted-foreground mt-1">Entrada válida</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl">✓</p>
                <p className="text-xs text-muted-foreground mt-1">Acceso garantizado</p>
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
