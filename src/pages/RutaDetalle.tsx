import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RouteMap from "@/components/RouteMap";
import RouteGoogleMap from "@/components/RouteGoogleMap";
import RouteDayRecommendations from "@/components/RouteDayRecommendations";
import RoutePracticalInfo from "@/components/RoutePracticalInfo";
import { RoutePurchaseCard } from "@/components/RoutePurchaseCard";
import { Button } from "@/components/ui/button";
import { getRouteById, getAllRoutes, RouteDetail } from "@/data/routes";
import { supabase } from "@/integrations/supabase/client";
import { useRouteFavorites } from "@/hooks/useRouteFavorites";
import { useToast } from "@/hooks/use-toast";
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
  ChevronRight,
  Loader2,
  Heart,
  Copy
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Helper to safely parse JSON arrays
const parseJsonArray = (value: unknown): string[] => {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseJsonObject = (value: unknown): Record<string, unknown> => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return {};
};

const RutaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [relatedRoutesIndex, setRelatedRoutesIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [personalizing, setPersonalizing] = useState(false);
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [dbRouteId, setDbRouteId] = useState<string | null>(null);
  const [relatedRoutes, setRelatedRoutes] = useState<RouteDetail[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isFavorite, loading: favoriteLoading, toggleFavorite } = useRouteFavorites(id);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const fetchRoute = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Try to fetch from Supabase first - query by slug only (not UUID)
        const { data: supabaseRoute, error } = await supabase
          .from('routes')
          .select('*')
          .eq('slug', id)
          .maybeSingle();

        if (supabaseRoute && !error) {
          // Fetch stops for this route
          const { data: stops } = await supabase
            .from('route_stops')
            .select('*')
            .eq('route_id', supabaseRoute.id)
            .order('position');

          // Parse practical info from JSON
          const practicalInfoData = parseJsonObject(supabaseRoute.practical_info);
          const dailyRecsData = parseJsonArray(supabaseRoute.daily_recommendations);
          
          // Transform to RouteDetail format
          const transformedRoute: RouteDetail = {
            id: supabaseRoute.slug,
            title: supabaseRoute.title,
            description: supabaseRoute.description || '',
            duration: supabaseRoute.duration || 'Medio día',
            businesses: supabaseRoute.total_stops || stops?.length || 0,
            rating: '4.8/5',
            participants: supabaseRoute.total_participants || 0,
            image: supabaseRoute.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
            difficulty: supabaseRoute.difficulty || 'Fácil',
            narrative: supabaseRoute.narrative || supabaseRoute.description || '',
            stops: (stops || []).map((stop) => ({
              id: stop.id,
              name: stop.name,
              type: stop.type || 'Local',
              typeIcon: stop.type_icon || '📍',
              description: stop.description || '',
              whatToDo: parseJsonArray(stop.what_to_do),
              address: stop.address || '',
              schedule: stop.schedule || '',
              coordinates: [stop.longitude || 0, stop.latitude || 0] as [number, number],
              images: parseJsonArray(stop.images),
              highlights: parseJsonArray(stop.highlights),
              featuredReview: {
                author: 'Visitante',
                rating: 5,
                comment: 'Excelente experiencia'
              }
            })),
            dailyRecommendations: dailyRecsData,
            practicalInfo: {
              level: (practicalInfoData.level as string) || supabaseRoute.difficulty || 'Fácil',
              duration: (practicalInfoData.duration as string) || supabaseRoute.duration || 'Medio día',
              recommendedPeople: (practicalInfoData.recommendedPeople as string) || '2-6 personas',
              localTips: parseJsonArray(practicalInfoData.localTips)
            }
          };

          setRoute(transformedRoute);
          setDbRouteId(supabaseRoute.id);
        } else {
          // Fallback to static data
          const staticRoute = getRouteById(id);
          setRoute(staticRoute || null);
        }

        // Fetch related routes
        const { data: otherRoutes } = await supabase
          .from('routes')
          .select('*')
          .neq('slug', id)
          .eq('is_public', true)
          .limit(6);

        if (otherRoutes && otherRoutes.length > 0) {
          const transformed = otherRoutes.map((r) => ({
            id: r.slug,
            title: r.title,
            description: r.description || '',
            duration: r.duration || 'Medio día',
            businesses: r.total_stops || 0,
            rating: '4.5/5',
            participants: r.total_participants || 0,
            image: r.image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
            difficulty: r.difficulty || 'Fácil',
            narrative: '',
            stops: [],
            dailyRecommendations: [],
            practicalInfo: { level: 'Fácil', duration: '', recommendedPeople: '', localTips: [] as string[] }
          }));
          setRelatedRoutes(transformed);
        } else {
          // Fallback to static
          const allStatic = getAllRoutes();
          setRelatedRoutes(allStatic.filter(r => r.id !== id));
        }
      } catch (err) {
        console.error('Error fetching route:', err);
        const staticRoute = getRouteById(id);
        setRoute(staticRoute || null);
        const allStatic = getAllRoutes();
        setRelatedRoutes(allStatic.filter(r => r.id !== id));
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mockGallery = [
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=200&h=150&fit=crop",
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=200&h=150&fit=crop"
  ];

  const handleShare = async (platform?: 'whatsapp' | 'twitter' | 'facebook' | 'email') => {
    if (!route) return;
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${route.title} - ${route.description}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(route.title)}&body=${text}%20${url}`;
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: route.title,
          text: route.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to WhatsApp
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Personalizar ruta: crea una copia de la ruta en la cuenta del usuario
  const handlePersonalize = async () => {
    if (!route) return;
    
    if (!isAuthenticated) {
      navigate('/customer-auth');
      return;
    }
    
    setPersonalizing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/customer-auth');
        return;
      }

      // Generate unique slug for the copy
      const timestamp = Date.now();
      const newSlug = `${route.id}-personalizada-${timestamp}`;

      // Create a copy of the route
      const { data: newRoute, error: routeError } = await supabase
        .from('routes')
        .insert({
          title: `${route.title} (Mi versión)`,
          slug: newSlug,
          description: route.description,
          narrative: route.narrative,
          duration: route.duration,
          difficulty: route.difficulty,
          creator_id: user.id,
          is_public: false, // User's personal copy is private by default
          total_stops: route.stops?.length || 0,
          image_url: route.image,
          daily_recommendations: route.dailyRecommendations || [],
          practical_info: route.practicalInfo || {}
        })
        .select()
        .single();

      if (routeError) throw routeError;

      // Copy all the stops if we have them from DB
      if (dbRouteId) {
        const { data: originalStops } = await supabase
          .from('route_stops')
          .select('*')
          .eq('route_id', dbRouteId)
          .order('position');

        if (originalStops && originalStops.length > 0) {
          const stopsToInsert = originalStops.map((stop) => ({
            route_id: newRoute.id,
            name: stop.name,
            type: stop.type,
            type_icon: stop.type_icon,
            description: stop.description,
            what_to_do: stop.what_to_do,
            address: stop.address,
            schedule: stop.schedule,
            latitude: stop.latitude,
            longitude: stop.longitude,
            position: stop.position,
            images: stop.images,
            highlights: stop.highlights,
            external_link: stop.external_link
          }));

          await supabase.from('route_stops').insert(stopsToInsert);
        }
      } else if (route.stops && route.stops.length > 0) {
        // Create stops from static data
        const stopsToInsert = route.stops.map((stop, index) => ({
          route_id: newRoute.id,
          name: stop.name,
          type: stop.type,
          description: stop.description,
          what_to_do: stop.whatToDo || [],
          address: stop.address,
          schedule: stop.schedule,
          latitude: stop.coordinates?.[1] || null,
          longitude: stop.coordinates?.[0] || null,
          position: index,
          images: stop.images || []
        }));

        await supabase.from('route_stops').insert(stopsToInsert);
      }

      toast({
        title: "Ruta personalizada creada",
        description: "Puedes editar tu versión personalizada",
      });

      // Navigate to the edit page for the new route
      navigate(`/editar-ruta/${newRoute.slug}`);
      
    } catch (error) {
      console.error('Error personalizing route:', error);
      toast({
        title: "Error",
        description: "No se pudo crear tu versión personalizada",
        variant: "destructive",
      });
    } finally {
      setPersonalizing(false);
    }
  };

  if (!id) {
    return <Navigate to="/rutas" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!route) {
    return <Navigate to="/rutas" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-0">
        {/* Hero Section */}
        <section className="py-8 bg-gradient-warm enso-watermark relative">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {route.title}
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                  {route.description}
                </p>
              </div>
              
              {/* Quick metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-card rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Duración</p>
                  <p className="font-semibold text-base">{route.duration}</p>
                </div>
                <div className="bg-card rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Paradas</p>
                  <p className="font-semibold text-base">{route.businesses} lugares</p>
                </div>
                <div className="bg-card rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <Route className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Dificultad</p>
                  <p className="font-semibold text-base">{route.difficulty}</p>
                </div>
                <div className="bg-card rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Han ido</p>
                  <p className="font-semibold text-base">{route.participants} personas</p>
                </div>
              </div>

              {/* Route Experience */}
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary mb-3">La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed text-base">{route.narrative}</p>
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
                  <div key={stop.id} className="bg-card border border-border rounded-lg p-4 relative shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <div>
                              <h3 className="text-lg font-bold text-foreground mb-1">{stop.name}</h3>
                              <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-sm">{stop.type}</p>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                                  <span className="text-xs font-medium">4.8</span>
                                  <span className="text-xs text-muted-foreground">(127)</span>
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
                        {(stop.images?.length ? stop.images : mockGallery).slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${stop.name} ${idx + 1}`}
                            className="h-20 w-28 object-cover rounded-md flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed text-[15px]">{stop.description}</p>

                    {stop.whatToDo && stop.whatToDo.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground mb-2 text-[15px]">Qué puedes hacer:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                          {stop.whatToDo.map((activity, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-1.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground leading-snug">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {stop.address && (
                        <div>
                          <h4 className="font-medium text-primary mb-1.5 flex items-center text-sm">
                            <MapPin className="w-3.5 h-3.5 mr-1.5" />
                            Dirección
                          </h4>
                          <p className="text-sm text-muted-foreground">{stop.address}</p>
                        </div>
                      )}
                      
                      {stop.schedule && (
                        <div>
                          <h4 className="font-medium text-primary mb-1.5 flex items-center text-sm">
                            <Clock className="w-3.5 h-3.5 mr-1.5" />
                            Horarios
                          </h4>
                          <p className="text-sm text-muted-foreground">{stop.schedule}</p>
                        </div>
                      )}
                    </div>

                    {stop.featuredReview && (
                      <div>
                        <h4 className="font-medium text-foreground mb-2 text-[15px]">Reseñas destacadas:</h4>
                        <div className="bg-accent/50 border-l-4 border-primary p-3 rounded-r-lg relative">
                          <Button 
                            size="sm" 
                            className="absolute top-2 right-2 h-6 text-xs px-2"
                            onClick={() => navigate('/valoraciones')}
                          >
                            Ver más
                          </Button>
                          <div className="flex items-center space-x-2 mb-1.5 pr-16">
                            <div className="flex">
                              {[...Array(stop.featuredReview.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <span className="font-medium text-foreground text-sm">{stop.featuredReview.author}</span>
                          </div>
                          <p className="text-sm italic text-muted-foreground leading-snug pr-16">"{stop.featuredReview.comment}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                  ))}
                </div>
              </section>
              
              {/* Rating Section */}
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
                    <Button 
                      size="sm" 
                      className="h-8 text-xs px-4"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate('/escribir-valoracion');
                        } else {
                          navigate('/customer-auth');
                        }
                      }}
                    >
                      Valorar ruta
                    </Button>
                  </div>
                </div>
              </section>
              
              {/* Related Routes Section - Same format as Packs */}
              {relatedRoutes.length > 0 && (
                <section className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">Rutas Relacionadas</CardTitle>
                      <CardDescription>
                        Otras rutas similares que podrían interesarte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative px-16">
                        <div className="overflow-hidden">
                          <div
                            className="flex gap-6 transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${relatedRoutesIndex * (100 / 2)}%)` }}
                          >
                            {relatedRoutes.map((relatedRoute) => (
                              <Link
                                key={relatedRoute.id}
                                to={`/rutas/${relatedRoute.id}`}
                                className="min-w-[calc(50%-0.75rem)] flex-shrink-0"
                              >
                                <Card className="hover:shadow-xl transition-all duration-300 h-full">
                                  <div className="relative">
                                    <img 
                                      src={relatedRoute.image} 
                                      alt={relatedRoute.title}
                                      className="w-full h-32 object-cover rounded-t-lg"
                                    />
                                    <Badge 
                                      variant="secondary" 
                                      className="absolute top-2 left-2 bg-primary/80 text-primary-foreground"
                                    >
                                      {relatedRoute.difficulty}
                                    </Badge>
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold text-sm mb-2 line-clamp-1">{relatedRoute.title}</h3>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{relatedRoute.duration}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>{relatedRoute.businesses} paradas</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </div>
                        </div>
                        
                        {/* Navigation Arrows - Same style as Packs */}
                        <>
                          <Button
                            variant="default"
                            size="icon"
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 shadow-2xl rounded-full w-14 h-14 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-10 border-4 border-background"
                            onClick={() => setRelatedRoutesIndex(Math.max(0, relatedRoutesIndex - 1))}
                            disabled={relatedRoutesIndex === 0}
                          >
                            <ChevronRight className="w-7 h-7 text-primary-foreground rotate-180" />
                          </Button>
                          <Button
                            variant="default"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 shadow-2xl rounded-full w-14 h-14 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-10 border-4 border-background"
                            onClick={() => setRelatedRoutesIndex(Math.min(Math.max(0, relatedRoutes.length - 2), relatedRoutesIndex + 1))}
                            disabled={relatedRoutesIndex >= Math.max(0, relatedRoutes.length - 2)}
                          >
                            <ChevronRight className="w-7 h-7 text-primary-foreground" />
                          </Button>
                        </>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Use Google Maps if stops have coordinates, otherwise use static map */}
              {route.stops?.some(stop => stop.coordinates && stop.coordinates[0] !== 0 && stop.coordinates[1] !== 0) ? (
                <RouteGoogleMap 
                  routeTitle={route.title}
                  stops={route.stops.map((stop, index) => ({
                    id: stop.id,
                    name: stop.name,
                    position: index + 1,
                    latitude: stop.coordinates?.[1] || null,
                    longitude: stop.coordinates?.[0] || null,
                    address: stop.address,
                    images: stop.images
                  }))}
                />
              ) : (
                <RouteMap routeTitle={route.title} stopsCount={route.stops?.length || 0} />
              )}
              <RouteDayRecommendations recommendations={route.dailyRecommendations} />
              <RoutePracticalInfo 
                practicalInfo={route.practicalInfo} 
                difficulty={route.difficulty}
              />

              {/* Route Purchase Card - Digital Product - Fixed below other cards */}
              <RoutePurchaseCard
                routeId={dbRouteId || id || ""}
                routeSlug={id || ""}
                routeTitle={route.title}
                stopCount={route.stops?.length || route.businesses || 4}
              />

              {/* Action Buttons Section */}
              <div className="bg-card rounded-lg p-3 border space-y-2">
                <Button 
                  onClick={() => {
                    if (isAuthenticated) {
                      toggleFavorite();
                    } else {
                      navigate('/customer-auth');
                    }
                  }} 
                  variant={isFavorite ? "default" : "outline"} 
                  size="sm" 
                  className={`w-full text-xs h-8 ${isFavorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : ''}`}
                  disabled={favoriteLoading}
                >
                  <Heart className={`w-3.5 h-3.5 mr-1.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Guardada en favoritos' : 'Guardar en favoritos'}
                </Button>
                <Button onClick={() => handleShare('whatsapp')} variant="outline" size="sm" className="w-full text-xs h-8">
                  <Share2 className="w-3.5 h-3.5 mr-1.5" />
                  Compartir Experiencia
                </Button>
                <Button onClick={handlePrint} variant="outline" size="sm" className="w-full text-xs h-8">
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Imprimir Ruta
                </Button>
                <Button 
                  onClick={handlePersonalize} 
                  variant="default" 
                  size="sm" 
                  className="w-full text-xs h-8"
                  disabled={personalizing}
                >
                  {personalizing ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {personalizing ? 'Creando copia...' : 'Personalizar esta ruta'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>


      <Footer />
    </div>
  );
};

export default RutaDetalle;