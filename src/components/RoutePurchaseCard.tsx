import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Gift, Check, Minus, Plus } from "lucide-react";
import { calculateRoutePricing, formatPrice } from "@/hooks/useRoutePricing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoutePurchaseCardProps {
  routeId: string;
  routeSlug: string;
  routeTitle: string;
  stopCount: number;
  benefits?: string[];
}

export const RoutePurchaseCard = ({
  routeId,
  routeSlug,
  routeTitle,
  stopCount,
  benefits = [
    "Acceso digital permanente",
    "Mapa interactivo con todas las paradas",
    "Información exclusiva de cada productor",
    "Recomendaciones personalizadas"
  ]
}: RoutePurchaseCardProps) => {
  const [numPeople, setNumPeople] = useState(2);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const pricing = calculateRoutePricing(stopCount, numPeople);

  useEffect(() => {
    checkAuthAndPurchase();
  }, [routeId]);

  const checkAuthAndPurchase = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);

    if (user) {
      // Check if user already purchased this route
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (customer) {
        const { data: purchase } = await supabase
          .from("route_purchases")
          .select("id, payment_status")
          .eq("customer_id", customer.id)
          .eq("route_id", routeId)
          .eq("payment_status", "completed")
          .single();

        setHasPurchased(!!purchase);
      }
    }
    setIsLoading(false);
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para comprar rutas",
      });
      navigate("/customer-auth", { state: { returnTo: `/rutas/${routeSlug}` } });
      return;
    }

    // Navigate to checkout with route info
    navigate(`/comprar-ruta/${routeSlug}`, {
      state: {
        routeId,
        routeTitle,
        numPeople,
        pricing
      }
    });
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasPurchased) {
    return (
      <Card className="border-2 border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-700">¡Ya tienes esta ruta!</p>
              <p className="text-sm text-muted-foreground">Acceso permanente activado</p>
            </div>
          </div>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => navigate("/mis-rutas")}
          >
            Ver mis rutas
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Ruta Digital Autoguiada
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Experiencia digital vendida por ORIGEN
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Display */}
        <div className="text-center p-4 bg-background rounded-lg border">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(pricing.pricePerPerson)}
            </span>
            <span className="text-muted-foreground">/persona</span>
          </div>
          {pricing.discountPercent > 0 && (
            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
              {pricing.discountPercent}% descuento grupo
            </Badge>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {stopCount} paradas incluidas
          </p>
        </div>

        {/* People Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4" />
            Número de personas
          </label>
          <div className="flex items-center justify-center gap-4 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              disabled={numPeople <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-2xl font-semibold w-12 text-center">{numPeople}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
              disabled={numPeople >= 20}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {numPeople >= 4 && (
            <p className="text-xs text-green-600 text-center">
              ¡Descuento de grupo aplicado!
            </p>
          )}
        </div>

        {/* Total */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total a pagar:</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(pricing.totalPrice)}
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            Incluye:
          </p>
          <ul className="space-y-1">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Purchase Button */}
        <Button 
          className="w-full text-lg py-6" 
          size="lg"
          onClick={handlePurchase}
        >
          Comprar ruta
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Pago seguro · Acceso inmediato · Sin caducidad
        </p>
      </CardContent>
    </Card>
  );
};
