import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Plus, X, Save, Trash2, Clock, Route, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";
import { supabase } from "@/integrations/supabase/client";
import { useRegions } from "@/hooks/useSupabaseData";
import { ImageUpload } from "@/components/ImageUpload";

interface Stop {
  id: string;
  name: string;
  category: string;
  whatToDo: string[];
  schedule?: string;
  address?: string;
}

interface Recommendation {
  id: number;
  text: string;
}

interface LocalTip {
  id: number;
  text: string;
}

// Helper to parse JSON arrays
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

const EditarRuta = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { regions } = useRegions();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [routeId, setRouteId] = useState<string | null>(null);
  
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("Fácil");
  const [regionId, setRegionId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  
  const [stops, setStops] = useState<Stop[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [localTips, setLocalTips] = useState<LocalTip[]>([]);

  // Fetch the route data
  useEffect(() => {
    const fetchRoute = async () => {
      if (!slug) return;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Acceso denegado",
            description: "Debes iniciar sesión para editar rutas",
            variant: "destructive",
          });
          navigate('/soy-cliente');
          return;
        }

        // Fetch the route
        const { data: route, error } = await supabase
          .from('routes')
          .select('*')
          .eq('slug', slug)
          .eq('creator_id', user.id) // Only allow editing own routes
          .single();

        if (error || !route) {
          toast({
            title: "Ruta no encontrada",
            description: "No tienes permiso para editar esta ruta",
            variant: "destructive",
          });
          navigate('/rutas');
          return;
        }

        setRouteId(route.id);
        setRouteName(route.title);
        setDescription(route.description || '');
        setExperience(route.narrative || '');
        setDuration(route.duration || '');
        setDifficulty(route.difficulty || 'Fácil');
        setRegionId(route.region_id || '');
        setImageUrl(route.image_url || '');
        setIsPublic(route.is_public || false);

        // Parse practical info
        const practicalInfo = parseJsonObject(route.practical_info);
        const tips = parseJsonArray(practicalInfo.localTips);
        setLocalTips(tips.map((t, i) => ({ id: i, text: t })));

        // Parse daily recommendations
        const dailyRecs = parseJsonArray(route.daily_recommendations);
        setRecommendations(dailyRecs.map((r, i) => ({ id: i, text: r })));

        // Fetch stops
        const { data: stopsData } = await supabase
          .from('route_stops')
          .select('*')
          .eq('route_id', route.id)
          .order('position');

        if (stopsData && stopsData.length > 0) {
          setStops(stopsData.map(stop => ({
            id: stop.id,
            name: stop.name,
            category: stop.type || '',
            whatToDo: parseJsonArray(stop.what_to_do),
            schedule: stop.schedule || '',
            address: stop.address || ''
          })));
        } else {
          setStops([{ id: 'new-1', name: '', category: '', whatToDo: [''], schedule: '', address: '' }]);
        }

      } catch (err) {
        console.error('Error fetching route:', err);
        toast({
          title: "Error",
          description: "No se pudo cargar la ruta",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoute();
  }, [slug, navigate, toast]);

  const addStop = () => {
    if (stops.length >= 6) {
      toast({ title: "Límite alcanzado", description: "Máximo 6 paradas", variant: "destructive" });
      return;
    }
    setStops([...stops, { id: `new-${Date.now()}`, name: '', category: '', whatToDo: [''], schedule: '', address: '' }]);
  };

  const removeStop = (id: string) => {
    if (stops.length === 1) {
      toast({ title: "Mínimo requerido", description: "Debe haber al menos una parada", variant: "destructive" });
      return;
    }
    setStops(stops.filter(s => s.id !== id));
  };

  const addRecommendation = () => {
    if (recommendations.length >= 4) return;
    setRecommendations([...recommendations, { id: Date.now(), text: '' }]);
  };

  const removeRecommendation = (id: number) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  const addLocalTip = () => {
    if (localTips.length >= 4) return;
    setLocalTips([...localTips, { id: Date.now(), text: '' }]);
  };

  const removeLocalTip = (id: number) => {
    setLocalTips(localTips.filter(t => t.id !== id));
  };

  const addWhatToDo = (stopIndex: number) => {
    const newStops = [...stops];
    if (newStops[stopIndex].whatToDo.length < 6) {
      newStops[stopIndex].whatToDo.push('');
      setStops(newStops);
    }
  };

  const removeWhatToDo = (stopIndex: number, todoIndex: number) => {
    const newStops = [...stops];
    if (newStops[stopIndex].whatToDo.length > 1) {
      newStops[stopIndex].whatToDo.splice(todoIndex, 1);
      setStops(newStops);
    }
  };

  const handleSave = async (publish: boolean = false) => {
    if (!routeId) return;
    
    if (!routeName || !description) {
      toast({ title: "Campos incompletos", description: "Completa nombre y descripción", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update route
      const { error: routeError } = await supabase
        .from('routes')
        .update({
          title: routeName,
          description,
          narrative: experience,
          duration,
          difficulty,
          region_id: regionId || null,
          image_url: imageUrl || null,
          is_public: publish ? true : isPublic,
          total_stops: stops.length,
          daily_recommendations: recommendations.filter(r => r.text).map(r => r.text),
          practical_info: {
            level: difficulty,
            duration,
            localTips: localTips.filter(t => t.text).map(t => t.text)
          }
        })
        .eq('id', routeId);

      if (routeError) throw routeError;

      // Delete existing stops and recreate
      await supabase.from('route_stops').delete().eq('route_id', routeId);

      // Insert new stops
      const stopsToInsert = stops.filter(s => s.name).map((stop, index) => ({
        route_id: routeId,
        name: stop.name,
        type: stop.category,
        what_to_do: stop.whatToDo.filter(w => w),
        address: stop.address || null,
        schedule: stop.schedule || null,
        position: index
      }));

      if (stopsToInsert.length > 0) {
        await supabase.from('route_stops').insert(stopsToInsert);
      }

      toast({
        title: publish ? "Ruta publicada" : "Cambios guardados",
        description: publish ? "Tu ruta ya es pública" : "Los cambios se han guardado",
      });

      if (publish) {
        navigate(`/rutas/${slug}`);
      }
    } catch (error) {
      console.error('Error saving route:', error);
      toast({ title: "Error", description: "No se pudo guardar la ruta", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!routeId) return;

    try {
      await supabase.from('route_stops').delete().eq('route_id', routeId);
      await supabase.from('routes').delete().eq('id', routeId);
      
      toast({ title: "Ruta eliminada", description: "La ruta ha sido eliminada" });
      navigate('/mi-cuenta');
    } catch (error) {
      console.error('Error deleting route:', error);
      toast({ title: "Error", description: "No se pudo eliminar la ruta", variant: "destructive" });
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section - Editable */}
      <section className="py-8 bg-gradient-warm enso-watermark relative">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Badge variant={isPublic ? "default" : "secondary"}>
                {isPublic ? "Pública" : "Privada"}
              </Badge>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(false)} variant="outline" size="sm" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
                </Button>
                <Button onClick={() => handleSave(true)} size="sm" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Publicar
                </Button>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="space-y-2 mb-4">
                <Label htmlFor="title" className="text-left block text-sm">Nombre de la Ruta *</Label>
                <Input 
                  id="title"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Ej: Mi Ruta Gastronómica"
                  className="text-3xl md:text-4xl font-bold text-center h-auto py-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-left block text-sm">Descripción breve *</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tu ruta..."
                  className="text-base md:text-lg text-center resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            {/* Quick metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Duración</p>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3h">2-3 horas</SelectItem>
                    <SelectItem value="Medio día">Medio día</SelectItem>
                    <SelectItem value="1 día">Día completo</SelectItem>
                    <SelectItem value="Fin de semana">Fin de semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Paradas</p>
                <p className="font-semibold text-base text-center">{stops.length}</p>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Route className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Dificultad</p>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Moderado">Moderado</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Participantes</p>
                <p className="font-semibold text-base">0</p>
              </div>
            </div>

            {/* Region selector */}
            {regions && regions.length > 0 && (
              <div className="bg-card rounded-lg p-4 shadow-sm mb-6">
                <Label className="text-sm mb-2 block">Región</Label>
                <Select value={regionId} onValueChange={setRegionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una región" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Image */}
            <div className="bg-card rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-xl font-bold text-primary mb-3">Imagen de la Ruta</h2>
              <ImageUpload
                bucket="route-images"
                currentImage={imageUrl}
                onImageUploaded={setImageUrl}
                onImageRemoved={() => setImageUrl("")}
                aspectRatio="video"
              />
            </div>

            {/* Experience */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-3">La Experiencia</h2>
              <Textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe la experiencia completa..."
                className="resize-none min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stops */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">Paradas de la Ruta</h2>
                <Button onClick={addStop} size="sm" disabled={stops.length >= 6}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Parada
                </Button>
              </div>
              <div className="space-y-5">
                {stops.map((stop, index) => (
                  <div key={stop.id} className="bg-card border border-border rounded-lg p-4 relative shadow-sm">
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeStop(stop.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label className="text-sm">Nombre *</Label>
                          <Input 
                            value={stop.name}
                            onChange={(e) => {
                              const newStops = [...stops];
                              newStops[index].name = e.target.value;
                              setStops(newStops);
                            }}
                            placeholder="Nombre del lugar"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Categoría</Label>
                          <Select 
                            value={stop.category}
                            onValueChange={(value) => {
                              const newStops = [...stops];
                              newStops[index].category = value;
                              setStops(newStops);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Panadería artesanal">Panadería</SelectItem>
                              <SelectItem value="Quesería tradicional">Quesería</SelectItem>
                              <SelectItem value="Bodega familiar">Bodega</SelectItem>
                              <SelectItem value="Mercado local">Mercado</SelectItem>
                              <SelectItem value="Restaurante">Restaurante</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-sm">Horario</Label>
                            <Input 
                              value={stop.schedule || ''}
                              onChange={(e) => {
                                const newStops = [...stops];
                                newStops[index].schedule = e.target.value;
                                setStops(newStops);
                              }}
                              placeholder="Ej: 9:00-18:00"
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Dirección</Label>
                            <Input 
                              value={stop.address || ''}
                              onChange={(e) => {
                                const newStops = [...stops];
                                newStops[index].address = e.target.value;
                                setStops(newStops);
                              }}
                              placeholder="Dirección"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm">Qué puedes hacer</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => addWhatToDo(index)}
                              disabled={stop.whatToDo.length >= 6}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Añadir
                            </Button>
                          </div>
                          {stop.whatToDo.map((todo, todoIndex) => (
                            <div key={todoIndex} className="flex gap-2 mb-2">
                              <Input 
                                value={todo}
                                onChange={(e) => {
                                  const newStops = [...stops];
                                  newStops[index].whatToDo[todoIndex] = e.target.value;
                                  setStops(newStops);
                                }}
                                placeholder="Actividad..."
                              />
                              {stop.whatToDo.length > 1 && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeWhatToDo(index, todoIndex)}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Recomendaciones del Día</CardTitle>
                  <Button onClick={addRecommendation} size="sm" variant="outline" disabled={recommendations.length >= 4}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="flex gap-2">
                    <Input 
                      value={rec.text}
                      onChange={(e) => {
                        const newRecs = [...recommendations];
                        newRecs[index].text = e.target.value;
                        setRecommendations(newRecs);
                      }}
                      placeholder="Recomendación..."
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeRecommendation(rec.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Local Tips */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Consejos Locales</CardTitle>
                  <Button onClick={addLocalTip} size="sm" variant="outline" disabled={localTips.length >= 4}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {localTips.map((tip, index) => (
                  <div key={tip.id} className="flex gap-2">
                    <Input 
                      value={tip.text}
                      onChange={(e) => {
                        const newTips = [...localTips];
                        newTips[index].text = e.target.value;
                        setLocalTips(newTips);
                      }}
                      placeholder="Consejo local..."
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeLocalTip(tip.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <RouteMap routeTitle={routeName || "Mi Ruta"} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => handleSave(false)} variant="outline" className="w-full" disabled={isSubmitting}>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar cambios
                </Button>
                <Button onClick={() => handleSave(true)} className="w-full" disabled={isSubmitting}>
                  Publicar ruta
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar ruta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar ruta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EditarRuta;
