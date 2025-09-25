import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteMap from "@/components/RouteMap";
import RouteDayRecommendations from "@/components/RouteDayRecommendations";
import RoutePracticalInfo from "@/components/RoutePracticalInfo";
import { Button } from "@/components/ui/button";
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Route Experience */}
              <section className="bg-card rounded-lg p-6 border">
                <h2 className="text-2xl font-bold text-primary mb-4">La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed">{route.narrative}</p>
              </section>
              
              {/* Route Stops */}
              <section>
                <div className="space-y-6">
                  {route.stops.map((stop, index) => (
                  <div key={stop.id} className="bg-white border border-gray-200 rounded-lg p-6 relative shadow-sm">
                    {/* Stop number badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{stop.name}</h3>
                              <p className="text-gray-500 text-sm">{stop.type}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{stop.description}</p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Qué puedes hacer:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {stop.whatToDo.map((activity, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-amber-700" />
                          Dirección
                        </h4>
                        <p className="text-sm text-amber-700">{stop.address}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-amber-700" />
                          Horarios
                        </h4>
                        <p className="text-sm text-amber-700">{stop.schedule}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Reseñas destacadas:</h4>
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex">
                            {[...Array(stop.featuredReview.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900">{stop.featuredReview.author}</span>
                        </div>
                        <p className="text-sm italic text-gray-700">"{stop.featuredReview.comment}"</p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </section>
              
              {/* Rating Section */}
              <section>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Star className="w-6 h-6 text-secondary fill-current" />
                    <h3 className="text-xl font-semibold text-primary">Valoración de la ruta</h3>
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

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Route Map */}
              <RouteMap routeTitle={route.title} />

              {/* Daily Recommendations */}
              <RouteDayRecommendations recommendations={route.dailyRecommendations} />

              {/* Practical Information */}
              <RoutePracticalInfo 
                practicalInfo={route.practicalInfo} 
                difficulty={route.difficulty}
                onShare={handleShare}
                onPrint={handlePrint}
              />
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RutaDetalle;