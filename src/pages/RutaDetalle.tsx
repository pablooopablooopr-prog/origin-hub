import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteMap from "@/components/RouteMap";
import RouteDayRecommendations from "@/components/RouteDayRecommendations";
import RoutePracticalInfo from "@/components/RoutePracticalInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRouteById } from "@/data/routes";
import { 
  Clock, 
  Users, 
  MapPin, 
  Route, 
  Star, 
  ExternalLink, 
  Share2, 
  Printer
} from "lucide-react";

const RutaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <Navigate to="/rutas" replace />;
  }

  const route = getRouteById(id);
  
  if (!route) {
    return <Navigate to="/rutas" replace />;
  }

  const handleShare = async () => {
    const shareData = {
      title: route.title,
      text: route.description,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-warm enso-watermark relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden bg-card/80 flex items-center justify-center">
                <img 
                  src={route.image} 
                  alt={route.title}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {route.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {route.description}
              </p>
              
              {/* Quick metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card/80 rounded-lg p-4">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Duración</p>
                  <p className="font-semibold">{route.duration}</p>
                </div>
                <div className="bg-card/80 rounded-lg p-4">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Paradas</p>
                  <p className="font-semibold">{route.businesses} lugares</p>
                </div>
                <div className="bg-card/80 rounded-lg p-4">
                  <Route className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Dificultad</p>
                  <p className="font-semibold">{route.difficulty}</p>
                </div>
                <div className="bg-card/80 rounded-lg p-4">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Han ido</p>
                  <p className="font-semibold">{route.participants} personas</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={handleShare} variant="secondary" size="lg">
                  <Share2 className="w-5 h-5 mr-2" />
                  Compartir ruta
                </Button>
                <Button onClick={handlePrint} variant="outline" size="lg">
                  <Printer className="w-5 h-5 mr-2" />
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            
            {/* Narrative Description */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">La experiencia</h2>
              <div className="bg-card rounded-lg p-8 shadow-soft">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {route.narrative}
                </p>
              </div>
            </section>

            {/* Route Stops */}
            <section>
              <h2 className="text-3xl font-bold text-primary mb-6">Paradas de la ruta</h2>
              <div className="space-y-6">
                {route.stops.map((stop, index) => (
                  <Card key={stop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{stop.typeIcon}</div>
                          <div>
                            <CardTitle className="text-xl text-primary">{stop.name}</CardTitle>
                            <CardDescription className="text-base font-medium text-secondary">
                              {stop.type}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          Parada {index + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Qué puedes hacer</h4>
                            <ul className="space-y-1">
                              {stop.whatToDo.map((activity, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-center">
                                  <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 flex-shrink-0" />
                                  {activity}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Información práctica</h4>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-start space-x-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{stop.address}</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{stop.recommendedHours}</span>
                              </div>
                              {stop.externalLink && (
                                <div className="flex items-start space-x-2">
                                  <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                  <a 
                                    href={stop.externalLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    Sitio web
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-primary mb-2">Destacados</h4>
                            <div className="space-y-2">
                              {stop.highlights.map((highlight, idx) => (
                                <div key={idx} className="flex items-center space-x-2">
                                  <Star className="w-4 h-4 text-secondary fill-current flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Route Map */}
            <RouteMap routeTitle={route.title} />

            {/* Daily Recommendations */}
            <RouteDayRecommendations recommendations={route.dailyRecommendations} />

            {/* Practical Information */}
            <RoutePracticalInfo 
              practicalInfo={route.practicalInfo} 
              difficulty={route.difficulty}
            />

            {/* Rating Section */}
            <section>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Star className="w-6 h-6 text-secondary fill-current" />
                  <h3 className="text-xl font-semibold text-primary">Valoración destacada</h3>
                </div>
                <p className="text-lg italic text-muted-foreground mb-4">
                  "{route.rating}"
                </p>
                <p className="text-sm text-muted-foreground">
                  Valoración de {route.participants} personas que han realizado esta ruta
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RutaDetalle;