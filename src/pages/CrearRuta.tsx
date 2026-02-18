import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { MapPin, Plus, X, Save, Trash2, Image as ImageIcon, Clock, FileText, Users, Route, Star, Coffee, Utensils, Camera, Loader2, LogIn, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";
import { supabase } from "@/integrations/supabase/client";
import { useRegions, useCategories } from "@/hooks/useSupabaseData";
import { ImageUpload } from "@/components/ImageUpload";
import PlaceAutocompleteInput, { PlaceResult } from "@/components/PlaceAutocompleteInput";

interface Stop {
  id: number;
  name: string;
  category: string;
  whatToDo: string[];
  schedule?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  placeId?: string;
  images?: string[];
}

interface Recommendation {
  id: number;
  text: string;
}

interface LocalTip {
  id: number;
  text: string;
}

// Title Case helper: first letter of each word uppercase, rest lowercase
const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
};

// Time slot options for schedule picker
const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30",
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
];

const CrearRuta = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { regions } = useRegions();
  const { categories } = useCategories();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);
  
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("Fácil");
  const [regionId, setRegionId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [stops, setStops] = useState<Stop[]>([
    {
      id: 1,
      name: "",
      category: "",
      whatToDo: [""],
      schedule: "",
      address: "",
      latitude: null,
      longitude: null,
      placeId: "",
      images: []
    }
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: 1, text: "" }
  ]);

  const [localTips, setLocalTips] = useState<LocalTip[]>([
    { id: 1, text: "" }
  ]);

  // Schedule state for each stop: openHour and closeHour
  const [stopSchedules, setStopSchedules] = useState<{ [key: number]: { open: string; close: string } }>({});

  const updateStopSchedule = (stopId: number, field: 'open' | 'close', value: string) => {
    const current = stopSchedules[stopId] || { open: '', close: '' };
    const updated = { ...current, [field]: value };

    // Validate: close must be after open
    if (updated.open && updated.close && updated.close <= updated.open) {
      toast({
        title: "Horario inconsistente",
        description: "La hora de cierre debe ser posterior a la de apertura",
        variant: "destructive",
      });
      return;
    }

    setStopSchedules({ ...stopSchedules, [stopId]: updated });
    
    const scheduleStr = updated.open && updated.close ? `${updated.open} - ${updated.close}` : updated.open || updated.close || '';
    const newStops = [...stops];
    const idx = newStops.findIndex(s => s.id === stopId);
    if (idx >= 0) {
      newStops[idx].schedule = scheduleStr;
      setStops(newStops);
    }
  };

  const addStop = () => {
    if (stops.length >= 6) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 6 paradas por ruta",
        variant: "destructive",
      });
      return;
    }
    setStops([...stops, {
      id: Date.now(),
      name: "",
      category: "",
      whatToDo: [""],
      schedule: "",
      address: "",
      latitude: null,
      longitude: null,
      placeId: "",
      images: []
    }]);
  };

  const removeStop = (id: number) => {
    if (stops.length === 1) {
      toast({
        title: "Mínimo requerido",
        description: "Debe haber al menos una parada",
        variant: "destructive",
      });
      return;
    }
    setStops(stops.filter(s => s.id !== id));
  };

  const addRecommendation = () => {
    if (recommendations.length >= 4) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 4 recomendaciones",
        variant: "destructive",
      });
      return;
    }
    setRecommendations([...recommendations, { id: Date.now(), text: "" }]);
  };

  const removeRecommendation = (id: number) => {
    setRecommendations(recommendations.filter(r => r.id !== id));
  };

  const addLocalTip = () => {
    if (localTips.length >= 4) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 4 consejos locales",
        variant: "destructive",
      });
      return;
    }
    setLocalTips([...localTips, { id: Date.now(), text: "" }]);
  };

  const removeLocalTip = (id: number) => {
    setLocalTips(localTips.filter(t => t.id !== id));
  };

  const addWhatToDo = (stopIndex: number) => {
    const newStops = [...stops];
    if (newStops[stopIndex].whatToDo.length < 6) {
      newStops[stopIndex].whatToDo.push("");
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    if (!routeName) errors.push("Nombre de la ruta");
    if (!description) errors.push("Descripción breve");
    if (!experience) errors.push("La experiencia");
    if (!duration) errors.push("Duración");
    
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      if (!stop.name) errors.push(`Parada ${i + 1}: Nombre del lugar`);
      if (!stop.category) errors.push(`Parada ${i + 1}: Categoría`);
      if (!stop.schedule) errors.push(`Parada ${i + 1}: Horario`);
      if (stop.whatToDo.some(w => !w)) errors.push(`Parada ${i + 1}: Qué puedes hacer`);
    }

    if (errors.length > 0) {
      toast({
        title: "Campos obligatorios incompletos",
        description: `Completa: ${errors.slice(0, 3).join(", ")}${errors.length > 3 ? ` y ${errors.length - 3} más` : ""}`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .insert({
          title: routeName,
          slug: generateSlug(routeName),
          description,
          narrative: experience,
          duration,
          difficulty,
          region_id: regionId || null,
          creator_id: user?.id || null,
          is_public: true,
          moderation_status: 'pending_review',
          total_stops: stops.length,
          image_url: imageUrl || null,
          daily_recommendations: recommendations.filter(r => r.text).map(r => r.text),
          practical_info: {
            level: difficulty,
            duration,
            localTips: localTips.filter(t => t.text).map(t => t.text)
          }
        })
        .select()
        .single();

      if (routeError) throw routeError;

      const stopsToInsert = stops.map((stop, index) => ({
        route_id: routeData.id,
        name: stop.name,
        type: stop.category,
        description: '',
        what_to_do: stop.whatToDo.filter(w => w),
        address: stop.address || null,
        schedule: stop.schedule || null,
        latitude: stop.latitude || null,
        longitude: stop.longitude || null,
        position: index,
        images: stop.images || []
      }));

      const { error: stopsError } = await supabase
        .from('route_stops')
        .insert(stopsToInsert);

      if (stopsError) throw stopsError;

      toast({
        title: "Ruta publicada",
        description: "Tu ruta ha sido publicada correctamente.",
      });

      navigate(`/rutas/${routeData.slug}`);
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la ruta. Inicia sesión para continuar.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!routeName) {
      toast({
        title: "Nombre requerido",
        description: "Añade un nombre para guardar el borrador",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('routes')
        .insert({
          title: routeName,
          slug: generateSlug(routeName) + '-draft-' + Date.now(),
          description: description || 'Borrador',
          narrative: experience,
          duration,
          difficulty,
          region_id: regionId || null,
          creator_id: user?.id || null,
          is_public: false,
          moderation_status: 'pending_review',
          total_stops: stops.length
        });

      if (error) throw error;

      toast({
        title: "Guardado como borrador",
        description: "La ruta se ha guardado como borrador.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el borrador",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setRouteName("");
    setDescription("");
    setExperience("");
    setDuration("");
    setDifficulty("Fácil");
    setStops([{ id: 1, name: "", category: "", whatToDo: [""], schedule: "", address: "", latitude: null, longitude: null, placeId: "", images: [] }]);
    setRecommendations([{ id: 1, text: "" }]);
    setLocalTips([{ id: 1, text: "" }]);
    setStopSchedules({});
    
    toast({
      title: "Formulario limpiado",
      description: "Se han eliminado todos los datos del formulario.",
      variant: "destructive",
    });
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-6 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <section className="py-6 bg-gradient-warm">
            <div className="container mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-bold text-primary text-center">
                Crear Nueva Ruta
              </h1>
            </div>
          </section>
          <div className="container mx-auto px-6 py-8 max-w-2xl">
            <Card className="border-0 shadow-lg bg-card">
              <CardContent className="p-8 space-y-6 text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-primary">
                    Inicia sesión para crear una ruta
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Para crear rutas gastronómicas personalizadas, necesitas tener una cuenta activa.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Button onClick={() => navigate('/customer-auth')} size="lg">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar sesión
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/rutas')} size="lg">
                    Ver rutas disponibles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
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
            <div className="text-center mb-6">
              <div className="space-y-2 mb-4">
                <Label htmlFor="title" className="text-left block text-sm">Nombre de la Ruta *</Label>
                <Input 
                  id="title"
                  value={routeName}
                  onChange={(e) => setRouteName(toTitleCase(e.target.value))}
                  placeholder="Ej: Ruta Del Queso Artesanal"
                  className="text-3xl md:text-4xl font-bold text-center h-auto py-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-left block text-sm">Descripción breve *</Label>
                <Textarea 
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe tu ruta en pocas palabras..."
                  className="text-base md:text-lg text-center resize-none"
                  rows={2}
                />
              </div>
            </div>
            
            {/* Quick metrics - Editable */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Duración *</p>
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
                <p className="text-xs text-muted-foreground">Han ido</p>
                <p className="font-semibold text-base">0 personas</p>
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

            {/* Imagen de la Ruta - REDUCED SIZE */}
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold text-primary mb-2">Imagen de la Ruta</h2>
              <div className="max-w-md mx-auto">
                <ImageUpload
                  bucket="route-images"
                  currentImage={imageUrl}
                  onImageUploaded={setImageUrl}
                  onImageRemoved={() => setImageUrl("")}
                  aspectRatio="video"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Sube una imagen representativa de la ruta (opcional)</p>
            </div>

            {/* La Experiencia */}
            <div className="bg-card rounded-lg p-6 shadow-sm mt-4">
              <h2 className="text-xl font-bold text-primary mb-3">La Experiencia *</h2>
              <Textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe la experiencia completa de la ruta..."
                className="resize-none min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">Proporciona una descripción detallada y emotiva de la experiencia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Route Stops - Editable */}
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
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-sm flex items-center gap-2">
                              Nombre del Lugar *
                              {stop.latitude && stop.longitude && (
                                <span className="text-xs text-green-600 flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Ubicación guardada
                                </span>
                              )}
                            </Label>
                            <PlaceAutocompleteInput
                              value={stop.name}
                              onChange={(value) => {
                                const newStops = [...stops];
                                newStops[index].name = value;
                                setStops(newStops);
                              }}
                              onPlaceSelect={(place: PlaceResult) => {
                                const newStops = [...stops];
                                newStops[index].name = place.name || place.formatted_address;
                                newStops[index].address = place.address;
                                newStops[index].latitude = place.latitude;
                                newStops[index].longitude = place.longitude;
                                newStops[index].placeId = place.place_id;
                                setStops(newStops);
                              }}
                              placeholder="Buscar empresa, restaurante o lugar..."
                              className="font-bold text-lg"
                              searchTypes={['establishment']}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Escribe el nombre y selecciona de la lista para guardar la ubicación y dirección automáticamente
                            </p>
                          </div>
                          <div>
                            <Label className="text-sm">Categoría *</Label>
                            <Select 
                              value={stop.category}
                              onValueChange={(value) => {
                                const newStops = [...stops];
                                newStops[index].category = value;
                                setStops(newStops);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories && categories.length > 0 ? (
                                  <>
                                    {categories.map((cat: any) => (
                                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                    <SelectItem value="Otro">Otro</SelectItem>
                                  </>
                                ) : (
                                  <>
                                    <SelectItem value="Panadería artesanal">Panadería artesanal</SelectItem>
                                    <SelectItem value="Quesería tradicional">Quesería tradicional</SelectItem>
                                    <SelectItem value="Bodega familiar">Bodega familiar</SelectItem>
                                    <SelectItem value="Mercado local">Mercado local</SelectItem>
                                    <SelectItem value="Taller artesanal">Taller artesanal</SelectItem>
                                    <SelectItem value="Chocolatería">Chocolatería</SelectItem>
                                    <SelectItem value="Conservas artesanales">Conservas artesanales</SelectItem>
                                    <SelectItem value="Productor de aceite">Productor de aceite</SelectItem>
                                    <SelectItem value="Pastelería tradicional">Pastelería tradicional</SelectItem>
                                    <SelectItem value="Granja ecológica">Granja ecológica</SelectItem>
                                    <SelectItem value="Carnicería">Carnicería</SelectItem>
                                    <SelectItem value="Restaurante">Restaurante</SelectItem>
                                    <SelectItem value="Charcutería">Charcutería</SelectItem>
                                    <SelectItem value="Frutería">Frutería</SelectItem>
                                    <SelectItem value="Pescadería">Pescadería</SelectItem>
                                    <SelectItem value="Cervecería artesanal">Cervecería artesanal</SelectItem>
                                    <SelectItem value="Herboristería">Herboristería</SelectItem>
                                    <SelectItem value="Almazara">Almazara</SelectItem>
                                    <SelectItem value="Sidrería">Sidrería</SelectItem>
                                    <SelectItem value="Destilería">Destilería</SelectItem>
                                    <SelectItem value="Obrador">Obrador</SelectItem>
                                    <SelectItem value="Cafetería especialidad">Cafetería especialidad</SelectItem>
                                    <SelectItem value="Otro">Otro</SelectItem>
                                  </>
                                )}
                              </SelectContent>
                            </Select>
                            {stop.category && (
                              <Badge variant="secondary" className="mt-2 capitalize">{stop.category}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length === 1}
                        className="ml-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Stop Image Upload */}
                    <div className="mb-3">
                      <ImageUpload
                        bucket="route-images"
                        folder={`stops/${stop.id}`}
                        currentImage={stop.images?.[0]}
                        onImageUploaded={(url) => {
                          const newStops = [...stops];
                          newStops[index].images = [url];
                          setStops(newStops);
                        }}
                        onImageRemoved={() => {
                          const newStops = [...stops];
                          newStops[index].images = [];
                          setStops(newStops);
                        }}
                        aspectRatio="video"
                        className="max-w-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Galería de imágenes (opcional)</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Qué puedes hacer *</Label>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => addWhatToDo(index)}
                            disabled={stop.whatToDo.length >= 6}
                            className="h-7 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Añadir
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {stop.whatToDo.map((activity, actIndex) => (
                            <div key={actIndex} className="flex gap-2">
                              <Input
                                value={activity}
                                onChange={(e) => {
                                  const newStops = [...stops];
                                  newStops[index].whatToDo[actIndex] = toTitleCase(e.target.value);
                                  setStops(newStops);
                                }}
                                placeholder={`Actividad ${actIndex + 1}`}
                                className="text-sm"
                              />
                              {stop.whatToDo.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeWhatToDo(index, actIndex)}
                                  className="flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            Dirección
                          </Label>
                          <Input 
                            value={stop.address}
                            readOnly
                            placeholder="Se rellena automáticamente al seleccionar el lugar"
                            className="bg-muted/50 text-muted-foreground"
                          />
                          <p className="text-xs text-muted-foreground mt-1">Se completa al elegir el nombre del lugar</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Horario *
                          </Label>
                          <div className="flex items-center gap-2">
                            <Select 
                              value={stopSchedules[stop.id]?.open || ""}
                              onValueChange={(v) => updateStopSchedule(stop.id, 'open', v)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Apertura" />
                              </SelectTrigger>
                              <SelectContent className="max-h-48">
                                {timeSlots.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-muted-foreground text-sm">-</span>
                            <Select 
                              value={stopSchedules[stop.id]?.close || ""}
                              onValueChange={(v) => updateStopSchedule(stop.id, 'close', v)}
                            >
                              <SelectTrigger className="h-9 text-sm">
                                <SelectValue placeholder="Cierre" />
                              </SelectTrigger>
                              <SelectContent className="max-h-48">
                                {timeSlots.map(t => (
                                  <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">Recomendaciones del Día</h2>
                <Button onClick={addRecommendation} size="sm" variant="outline" disabled={recommendations.length >= 4}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir
                </Button>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="flex gap-2">
                    <Input
                      value={rec.text}
                      onChange={(e) => {
                        const newRecs = [...recommendations];
                        newRecs[index].text = toTitleCase(e.target.value);
                        setRecommendations(newRecs);
                      }}
                      placeholder={`Recomendación ${index + 1}`}
                    />
                    {recommendations.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeRecommendation(rec.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Local Tips */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">Consejos Locales</h2>
                <Button onClick={addLocalTip} size="sm" variant="outline" disabled={localTips.length >= 4}>
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir
                </Button>
              </div>
              <div className="space-y-3">
                {localTips.map((tip, index) => (
                  <div key={tip.id} className="flex gap-2">
                    <Input
                      value={tip.text}
                      onChange={(e) => {
                        const newTips = [...localTips];
                        newTips[index].text = toTitleCase(e.target.value);
                        setLocalTips(newTips);
                      }}
                      placeholder={`Consejo ${index + 1}`}
                    />
                    {localTips.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeLocalTip(tip.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <RouteMap routeTitle={routeName || "Nueva Ruta"} stopsCount={stops.length} />
            
            {/* Action Buttons */}
            <div className="bg-card rounded-lg p-4 border space-y-3">
              <Button 
                onClick={handlePublish} 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Publicar Ruta
              </Button>
              <Button 
                onClick={handleSaveDraft} 
                variant="outline" 
                className="w-full"
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Limpiar Formulario
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará todos los datos del formulario. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CrearRuta;
