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
            
            {/* Route Map */}
            <RouteMap routeTitle={route.title} />

            {/* Route Stops */}
            <section>
              <div className="space-y-6">
                {route.stops.map((stop, index) => (
                  <Card key={stop.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">{stop.typeIcon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-primary">{stop.name}</h3>
                              <p className="text-secondary font-medium">{stop.type}</p>
                            </div>
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-6">{stop.description}</p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-primary mb-3">Qué puedes hacer:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {stop.whatToDo.map((activity, idx) => (
                                  <div key={idx} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">{activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-primary mb-3">Destacados:</h4>
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
                          
                          <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h4 className="font-semibold text-primary mb-2 flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                Dirección
                              </h4>
                              <p className="text-sm text-muted-foreground">{stop.address}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-primary mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                Horarios
                              </h4>
                              <p className="text-sm text-muted-foreground">{stop.schedule}</p>
                            </div>
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="font-semibold text-primary mb-3">Reseñas destacadas:</h4>
                            <div className="bg-muted/30 border-l-4 border-secondary p-4 rounded-r-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex">
                                  {[...Array(stop.featuredReview.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-secondary fill-current" />
                                  ))}
                                </div>
                                <span className="font-medium text-primary">{stop.featuredReview.author}</span>
                              </div>
                              <p className="text-sm italic text-muted-foreground">"{stop.featuredReview.comment}"</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

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