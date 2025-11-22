import { useParams, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteMap from "@/components/RouteMap";
import RouteDayRecommendations from "@/components/RouteDayRecommendations";
import RoutePracticalInfo from "@/components/RoutePracticalInfo";
import { Button } from "@/components/ui/button";
import { getRouteById, getAllRoutes } from "@/data/routes";
import { 
  Clock, 
  Users, 
  MapPin, 
  Route, 
  Star, 
  ExternalLink, 
  Share2, 
  Printer,
  ArrowUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const RutaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  if (!id) {
    return <Navigate to="/rutas" replace />;
  }

  const route = getRouteById(id);
  
  if (!route) {
    return <Navigate to="/rutas" replace />;
  }

  // Mock gallery images for demo
  const mockGallery = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=150&fit=crop"
  ];

  // Get related routes
  const allRoutes = getAllRoutes();
  const relatedRoutes = allRoutes.filter(r => r.id !== route.id);

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
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Route Experience */}
              <section className="bg-card rounded-lg p-4 border">
                <h2 className="text-xl font-bold text-primary mb-3">La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{route.narrative}</p>
              </section>
              
              {/* Route Stops */}
              <section>
                <div className="space-y-5">
                  {route.stops.map((stop, index) => (
                  <div key={stop.id} className="bg-white border border-gray-200 rounded-lg p-4 relative shadow-sm">
                    {/* Stop number badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <Link to="/mi-zona/negocio/1" className="hover:text-primary transition-colors">
                                <h3 className="text-lg font-bold text-gray-900 mb-1 hover:underline">{stop.name}</h3>
                              </Link>
                              <div className="flex items-center gap-2">
                                <p className="text-gray-500 text-sm">{stop.type}</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                  <span className="text-xs font-medium text-gray-700">4.8</span>
                                  <span className="text-xs text-gray-500">(127)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mini Gallery */}
                    <div className="mb-3 overflow-x-auto">
                      <div className="flex gap-2">
                        {mockGallery.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${stop.name} ${idx + 1}`}
                            className="h-20 w-28 object-cover rounded-md flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 leading-relaxed text-[15px]">{stop.description}</p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 text-[15px]">Qué puedes hacer:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {stop.whatToDo.map((activity, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 leading-snug">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1.5 flex items-center text-sm">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                          Dirección
                        </h4>
                        <p className="text-sm text-amber-700">{stop.address}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1.5 flex items-center text-sm">
                          <Clock className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
                          Horarios
                        </h4>
                        <p className="text-sm text-amber-700">{stop.schedule}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 text-[15px]">Reseñas destacadas:</h4>
                      <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg relative">
                        <div className="flex items-center space-x-2 mb-1.5">
                          <div className="flex">
                            {[...Array(stop.featuredReview.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{stop.featuredReview.author}</span>
                        </div>
                        <p className="text-sm italic text-gray-700 leading-snug">"{stop.featuredReview.comment}"</p>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs px-3 mt-2">
                          Ver más
                        </Button>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </section>
              
              {/* Rating Section */}
              <section>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <h3 className="text-base font-semibold text-primary">Valoración de la ruta</h3>
                  </div>
                  <p className="text-sm italic text-muted-foreground mb-2">
                    "{route.rating}"
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Basado en {route.participants} opiniones
                  </p>
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-8 text-xs">
                    Valorar esta ruta
                  </Button>
                </div>
              </section>
              
              {/* Related Routes Section */}
              <section className="mt-12 pt-8 border-t">
                <h2 className="text-2xl font-bold text-primary mb-6">Otras rutas que te pueden gustar</h2>
                <div className="relative px-16">
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                      {relatedRoutes.map((relatedRoute) => (
                        <CarouselItem key={relatedRoute.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                          <Link to={`/rutas/${relatedRoute.id}`}>
                            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                              <div className="aspect-video relative overflow-hidden bg-muted">
                                <img
                                  src={relatedRoute.image}
                                  alt={relatedRoute.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold text-base mb-2 line-clamp-1">{relatedRoute.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{relatedRoute.description}</p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{relatedRoute.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{relatedRoute.businesses} lugares</span>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-0 -translate-x-0 w-14 h-14 bg-primary text-white hover:bg-primary/90 shadow-2xl border-4 border-background rounded-full" />
                    <CarouselNext className="absolute right-0 translate-x-0 w-14 h-14 bg-primary text-white hover:bg-primary/90 shadow-2xl border-4 border-background rounded-full" />
                  </Carousel>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Route Map */}
              <RouteMap routeTitle={route.title} />

              {/* Daily Recommendations */}
              <RouteDayRecommendations recommendations={route.dailyRecommendations} />

              {/* Practical Information */}
              <RoutePracticalInfo 
                practicalInfo={route.practicalInfo} 
                difficulty={route.difficulty}
              />

              {/* Action Buttons Section */}
              <div className="bg-card rounded-lg p-3 border space-y-2">
                <Button onClick={handleShare} variant="outline" size="sm" className="w-full text-xs h-8">
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Compartir Ruta
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="w-full text-xs h-8">
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Imprimir Ruta
                </Button>
                <Link to="/crear-ruta">
                  <Button variant="default" size="sm" className="w-full text-xs h-8">
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Personalizar
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Back to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-md p-3 shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RutaDetalle;
