import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, MapPin, Gift, Check, Minus, Plus, Info } from "lucide-react";
import { calculateRoutePricing, formatPrice } from "@/hooks/useRoutePricing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PAYMENT_MESSAGES } from "@/lib/paymentRules";

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
    "Entrada válida para esta ruta específica",
    "Acceso garantizado a los productores participantes",
    "Visita organizada sin riesgo de encontrar cerrado",
    "Beneficios asociados a la ruta (según paradas)",
    "Acceso permanente al comprobante de reserva"
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

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para comprar rutas",
      });
      navigate("/customer-auth", { state: { returnTo: `/rutas/${routeSlug}` } });
      return;
    }

    // Block admin and company accounts
    try {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin === true) {
        toast({ title: "No disponible", description: "Los administradores no pueden comprar rutas", variant: "destructive" });
        return;
      }
      const { data: companyStatus } = await supabase.rpc("get_my_company_status");
      if (companyStatus && String(companyStatus).trim() !== "") {
        toast({ title: "No disponible", description: "Las cuentas de empresa no pueden comprar rutas", variant: "destructive" });
        return;
      }
    } catch { /* continue */ }

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
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Entrada para Ruta ORIGEN
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Acceso garantizado a esta ruta con productores participantes
        </p>
      </CardHeader>
      <CardContent className="space-y-3 px-4 pb-4">
        {/* Info about separate purchase */}
        <Alert className="bg-blue-50 border-blue-200 py-2">
          <Info className="h-3 w-3 text-blue-600" />
          <AlertDescription className="text-blue-800 text-[10px]">
            {PAYMENT_MESSAGES.ROUTE_CHECKOUT.separation}
          </AlertDescription>
        </Alert>

        {/* Price Display */}
        <div className="text-center p-3 bg-background rounded-lg border">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(pricing.pricePerPerson)}
            </span>
            <span className="text-xs text-muted-foreground">/persona</span>
          </div>
          {pricing.discountPercent > 0 && (
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 text-[10px]">
              {pricing.discountPercent}% descuento grupo
            </Badge>
          )}
          <p className="text-[10px] text-muted-foreground mt-1">
            {stopCount} paradas incluidas
          </p>
        </div>

        {/* People Selector */}
        <div className="space-y-1">
          <label className="text-xs font-medium flex items-center gap-1">
            <Users className="w-3 h-3" />
            Número de personas
          </label>
          <div className="flex items-center justify-center gap-3 p-2 bg-muted/50 rounded-lg">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              disabled={numPeople <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-xl font-semibold w-8 text-center">{numPeople}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setNumPeople(Math.min(20, numPeople + 1))}
              disabled={numPeople >= 20}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          {numPeople >= 4 && (
            <p className="text-[10px] text-green-600 text-center">
              ¡Descuento de grupo aplicado!
            </p>
          )}
        </div>

        {/* Total */}
        <div className="p-2 bg-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium">Total:</span>
            <span className="text-lg font-bold text-primary">
              {formatPrice(pricing.totalPrice)}
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-1">
          <p className="text-xs font-medium flex items-center gap-1">
            <Gift className="w-3 h-3 text-primary" />
            Incluye:
          </p>
          <ul className="space-y-0.5">
            {benefits.map((benefit, index) => (
              <li key={index} className="text-[10px] text-muted-foreground flex items-start gap-1">
                <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Purchase Button */}
        <Button 
          className="w-full text-sm py-2" 
          size="sm"
          onClick={handlePurchase}
        >
          Comprar entrada
        </Button>

        <p className="text-[10px] text-center text-muted-foreground">
          Pago seguro · Acceso garantizado · Ruta disponible siempre en tu cuenta
        </p>
      </CardContent>
    </Card>
  );
};
