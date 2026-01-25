import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, Star, Users, Clock, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Fallback data when no routes in database
import { routesData as fallbackRoutes, RouteDetail } from "@/data/routes";

interface DbRoute {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  narrative: string | null;
  duration: string | null;
  difficulty: string | null;
  image_url: string | null;
  total_stops: number | null;
  total_participants: number | null;
  avg_rating: number | null;
  is_featured: boolean | null;
}

const Rutas = () => {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<(DbRoute | RouteDetail)[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const { data, error } = await supabase
          .from('routes')
          .select('*')
          .eq('is_public', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // If we have routes in the database, use them. Otherwise, use fallback
        if (data && data.length > 0) {
          setRoutes(data);
        } else {
          setRoutes(fallbackRoutes);
        }
      } catch (err) {
        console.error('Error fetching routes:', err);
        setRoutes(fallbackRoutes);
      } finally {
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    fetchRoutes();
    checkAuth();
  }, []);

  // Helper to normalize route data
  const getRouteData = (route: DbRoute | RouteDetail) => {
    if ('slug' in route) {
      // Database route
      return {
        id: route.slug,
        title: route.title,
        description: route.description || '',
        duration: route.duration || 'Variable',
        businesses: route.total_stops || 0,
        difficulty: route.difficulty || 'Fácil',
        participants: route.total_participants || 0,
        rating: route.avg_rating ? `${route.avg_rating}/5` : 'Sin valoraciones aún',
        isFeatured: route.is_featured
      };
    } else {
      // Fallback route
      return {
        id: route.id,
        title: route.title,
        description: route.description,
        duration: route.duration,
        businesses: route.businesses,
        difficulty: route.difficulty,
        participants: route.participants,
        rating: route.rating,
        isFeatured: false
      };
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center">
              <span>Rutas </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>RIGEN</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Marca y comparte rutas visitando negocios locales. Sube valoraciones y reseñas de cada lugar que descubras en tu camino.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <section className="py-2 bg-gradient-warm enso-watermark relative">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                {routes.map((route) => {
                  const data = getRouteData(route);
                  return (
                    <Card 
                      key={data.id} 
                      className="group hover:shadow-earth transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-[380px]"
                    >
                      {data.isFeatured && (
                        <Badge className="absolute top-2 right-2 z-10 bg-secondary">
                          Destacada
                        </Badge>
                      )}
                      <div className="absolute inset-0 opacity-5">
                        <img src="/lovable-uploads/new-enso-symbol.png" alt="" className="w-full h-full object-contain" />
                      </div>
                      <CardHeader className="text-center relative z-10 pb-3 pt-4 px-4">
                        <CardTitle className="text-xl text-primary mb-2">{data.title}</CardTitle>
                        <CardDescription className="text-muted-foreground min-h-[48px] leading-tight">
                          {data.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2.5 relative z-20 pt-0 pb-4 px-4 flex-1 flex flex-col">
                        <div className="grid grid-cols-2 gap-2.5 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{data.duration}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{data.businesses} lugares</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{data.participants} personas</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Route className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span>{data.difficulty}</span>
                          </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-2.5 h-[68px] flex flex-col justify-center">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="w-4 h-4 text-secondary fill-current flex-shrink-0" />
                            <span className="text-sm font-medium">Valoración destacada</span>
                          </div>
                          <p className="text-sm text-muted-foreground italic line-clamp-1 leading-tight">
                            "{data.rating}"
                          </p>
                        </div>

                        <div className="flex flex-col relative z-30 mt-auto">
                          <Button 
                            className="w-full group-hover:shadow-soft transition-all relative z-40" 
                            onClick={() => navigate(`/rutas/${data.id}`)}
                          >
                            <Route className="w-4 h-4 mr-2" />
                            Explorar ruta
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* CTA to create route */}
              <div className="text-center bg-card rounded-lg p-8 shadow-soft">
                <h3 className="text-2xl font-semibold text-primary mb-4">
                  ¿Tienes tu propia ruta?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Comparte tus descubrimientos con la comunidad. Marca los lugares que has visitado 
                  y ayuda a otros a encontrar negocios auténticos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="shadow-earth" 
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate('/crear-ruta');
                      } else {
                        navigate('/customer-auth');
                      }
                    }}
                  >
                    <Route className="w-5 h-5 mr-2" />
                    Crear mi ruta
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;
