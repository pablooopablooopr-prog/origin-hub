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
        <section className="py-4 bg-gradient-warm enso-watermark relative">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-4">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden bg-card/80 flex items-center justify-center">
                  <img 
                    src={route.image} 
                    alt={route.title}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                  {route.title}
                </h1>
                <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                  {route.description}
                </p>
              </div>
              
              {/* Quick metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                <div className="bg-card/80 rounded-lg p-2.5 border-2 border-primary/30">
                  <Clock className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Duración</p>
                  <p className="font-semibold text-xs">{route.duration}</p>
                </div>
                <div className="bg-card/80 rounded-lg p-2.5 border-2 border-primary/30">
                  <MapPin className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Paradas</p>
                  <p className="font-semibold text-xs">{route.businesses} lugares</p>
                </div>
                <div className="bg-card/80 rounded-lg p-2.5 border-2 border-primary/30">
                  <Route className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Dificultad</p>
                  <p className="font-semibold text-xs">{route.difficulty}</p>
                </div>
                <div className="bg-card/80 rounded-lg p-2.5 border-2 border-primary/30">
                  <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                  <p className="text-[10px] text-muted-foreground">Han ido</p>
                  <p className="font-semibold text-xs">{route.participants} personas</p>
                </div>
              </div>

              {/* Route Experience - Moved here */}
              <div className="bg-card rounded-lg p-3 border-2 border-primary/30">
                <h2 className="text-base font-bold text-primary mb-1.5">La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed text-xs">{route.narrative}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              
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
                        <Button 
                          size="sm" 
                          className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 text-white h-6 text-xs px-2"
                        >
                          Ver más
                        </Button>
                        <div className="flex items-center space-x-2 mb-1.5 pr-16">
                          <div className="flex">
                            {[...Array(stop.featuredReview.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{stop.featuredReview.author}</span>
                        </div>
                        <p className="text-sm italic text-gray-700 leading-snug pr-16">"{stop.featuredReview.comment}"</p>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              </section>
              
              {/* Rating Section - Compact */}
              <section>
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-start space-y-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-secondary fill-current" />
                        ))}
                      </div>
                      <div>
                        <p className="text-lg font-bold text-primary">4.8/5</p>
                        <p className="text-xs text-muted-foreground">{route.participants} valoraciones</p>
                      </div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white h-8 text-xs px-4">
                      Valorar ruta
                    </Button>
                  </div>
                </div>
              </section>
              
              {/* Related Routes Section */}
              <section className="mt-8 pt-6 border-t">
                <h2 className="text-2xl font-bold text-primary mb-6">Otras rutas que te pueden gustar</h2>
                <div className="relative px-20">
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-4">
                      {relatedRoutes.map((relatedRoute) => (
                        <CarouselItem key={relatedRoute.id} className="pl-4 md:basis-1/2 lg:basis-1/2">
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
                    <CarouselPrevious className="absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-primary/80 text-white hover:bg-primary shadow-2xl border-4 border-background rounded-full transition-all" />
                    <CarouselNext className="absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-primary/80 text-white hover:bg-primary shadow-2xl border-4 border-background rounded-full transition-all" />
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
            className="fixed bottom-6 right-6 z-50 bg-primary text-white rounded-md p-2.5 shadow-xl hover:bg-primary/90 transition-all hover:scale-105"
            aria-label="Volver arriba"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default RutaDetalle;
