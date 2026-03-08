import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, Star, Users, Clock, MapPin, Loader2 } from "lucide-react";
import { routesData, RouteDetail } from "@/data/routes";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const RoutesExplorer = ({
  showTitle = true,
  showCTA = true,
  maxRoutes,
  customRoutes
}: {
  showTitle?: boolean;
  showCTA?: boolean;
  maxRoutes?: number;
  customRoutes?: RouteDetail[];
}) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dbRoutes, setDbRoutes] = useState<RouteDetail[] | null>(null);
  const [loading, setLoading] = useState(!customRoutes);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);

      if (!customRoutes) {
        const { data } = await supabase
          .from('routes')
          .select('slug, title, description, duration, difficulty, total_stops, total_participants, avg_rating, image_url, is_featured')
          .eq('is_public', true)
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .limit(6);

        if (data && data.length > 0) {
          setDbRoutes(data.map(r => ({
            id: r.slug,
            title: r.title,
            description: r.description || '',
            duration: r.duration || 'Medio día',
            businesses: r.total_stops || 0,
            rating: `${r.avg_rating || 4.8}/5`,
            participants: r.total_participants || 0,
            image: r.image_url || '',
            difficulty: r.difficulty || 'Fácil',
            narrative: '',
            stops: [],
            dailyRecommendations: [],
            practicalInfo: { level: '', duration: '', recommendedPeople: '', localTips: [] }
          })));
        }
        setLoading(false);
      }
    };
    init();
  }, [customRoutes]);

  const displayRoutes = customRoutes || dbRoutes || routesData;

  const handleCreateRoute = () => {
    if (isAuthenticated) {
      navigate('/crear-ruta');
    } else {
      navigate('/customer-auth');
    }
  };

  return (
    <section className="py-2 bg-gradient-warm enso-watermark relative" id="rutas">
      <div className="container mx-auto px-6">
        {/* Título principal - solo mostrar si showTitle es true */}
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Experiencias ORIGEN
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Recorre caminos que unen productores, restaurantes y lugares con identidad propia. Conoce y descubre cómo los negocios elaboran sus productos en primera persona
            </p>
          </div>
        )}

        {/* Rutas destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {displayRoutes.map((route, index) => (
            <Card key={route.title} className="group hover:shadow-earth transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col h-[380px]">
              {/* Imagen de fondo con transparencia */}
              <div className="absolute inset-0 opacity-5">
                <img src="/lovable-uploads/new-enso-symbol.png" alt="" className="w-full h-full object-contain" />
              </div>
              <CardHeader className="text-center relative z-10 pb-3 pt-4 px-4">
                <CardTitle className="text-xl text-primary mb-2">{route.title}</CardTitle>
                <CardDescription className="text-muted-foreground min-h-[48px] leading-tight">
                  {route.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 relative z-20 pt-0 pb-4 px-4 flex-1 flex flex-col">
                {/* Métricas de la ruta */}
                <div className="grid grid-cols-2 gap-2.5 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{route.businesses} lugares</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{route.participants} personas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Route className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span>{route.difficulty}</span>
                  </div>
                </div>

                {/* Valoración humana */}
                <div className="bg-muted/30 rounded-lg p-2.5 h-[68px] flex flex-col justify-center">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-secondary fill-current flex-shrink-0" />
                    <span className="text-sm font-medium">Valoración destacada</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic line-clamp-1 leading-tight">
                    "{route.rating}"
                  </p>
                </div>

                <div className="flex flex-col relative z-30 mt-auto">
                  <Button 
                    className="w-full group-hover:shadow-soft transition-all relative z-40" 
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/rutas/${route.id}`);
                    }}
                  >
                    <Route className="w-4 h-4 mr-2" />
                    Explorar ruta
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA para crear ruta - solo mostrar si showCTA es true */}
        {showCTA && (
          <div className="text-center bg-card rounded-lg p-8 shadow-soft">
            <h3 className="text-2xl font-semibold text-primary mb-4">
              ¿Quieres crear tu propia experiencia?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Comparte tus descubrimientos con la comunidad. Marca los lugares que has visitado 
              y ayuda a otros a encontrar negocios auténticos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="shadow-earth" onClick={handleCreateRoute}>
                <Route className="w-5 h-5 mr-2" />
                Crear experiencia
              </Button>
              <Button variant="secondary" size="lg" className="shadow-moss" onClick={() => navigate('/rutas')}>
                <MapPin className="w-5 h-5 mr-2" />
                Descubrir experiencias
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoutesExplorer;
