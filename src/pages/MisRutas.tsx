import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight,
  Compass,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/hooks/useRoutePricing";

interface PurchasedRoute {
  id: string;
  route_id: string;
  num_people: number;
  final_price: number;
  purchased_at: string;
  route: {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: string;
    difficulty: string;
    image_url: string;
    total_stops: number;
  };
}

const MisRutas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<PurchasedRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const justPurchased = location.state?.justPurchased;
  const purchasedRouteTitle = location.state?.routeTitle;

  useEffect(() => {
    if (justPurchased && purchasedRouteTitle) {
      toast({
        title: "🎉 ¡Ruta adquirida!",
        description: `Ya tienes acceso permanente a "${purchasedRouteTitle}"`,
      });
      // Limpiar el state via React Router (no usar window.history directamente
      // para evitar inconsistencia con el router al pulsar "atrás")
      navigate(location.pathname, { replace: true, state: null });
    }

    loadPurchases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPurchases = async () => {
    setIsLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/customer-auth", { state: { returnTo: "/mis-rutas" } });
      return;
    }

    // Get customer ID
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!customer) {
      setIsLoading(false);
      return;
    }

    // Get purchases with route info
    const { data, error } = await supabase
      .from("route_purchases")
      .select(`
        id,
        route_id,
        num_people,
        final_price,
        purchased_at,
        route:routes (
          id,
          title,
          slug,
          description,
          duration,
          difficulty,
          image_url,
          total_stops
        )
      `)
      .eq("customer_id", customer.id)
      .eq("payment_status", "completed")
      .order("purchased_at", { ascending: false });

    if (error) {
      console.error("Error loading purchases:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus rutas",
        variant: "destructive"
      });
    } else {
      setPurchases((data as unknown as PurchasedRoute[]) || []);
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Mis Rutas</h1>
            <p className="text-muted-foreground">
              Accede a tus rutas digitales autoguiadas
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : purchases.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Compass className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Aún no tienes rutas
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explora nuestras rutas autoguiadas y descubre productores locales
                </p>
                <Button onClick={() => navigate("/rutas")}>
                  Explorar rutas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-48 h-32 md:h-auto bg-muted">
                      {purchase.route?.image_url ? (
                        <img
                          src={purchase.route.image_url}
                          alt={purchase.route.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {purchase.route?.title || "Ruta"}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {purchase.route?.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Acceso activo
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {purchase.route?.total_stops || 0} paradas
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {purchase.num_people} personas
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Comprada el {formatDate(purchase.purchased_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Pagado: {formatPrice(Number(purchase.final_price))}
                        </span>
                        <Button asChild>
                          <Link to={`/rutas/${purchase.route?.slug}`}>
                            Ver ruta
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* CTA to explore more */}
          {purchases.length > 0 && (
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="py-6 text-center">
                <h3 className="font-semibold mb-2">¿Quieres descubrir más rutas?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tenemos más experiencias esperándote
                </p>
                <Button variant="outline" onClick={() => navigate("/rutas")}>
                  Ver todas las rutas
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MisRutas;
