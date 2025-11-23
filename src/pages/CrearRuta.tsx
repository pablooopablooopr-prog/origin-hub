import { useState } from "react";
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
import { MapPin, Plus, X, Save, Trash2, Image as ImageIcon, Clock, FileText, Users, Route, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";
import RouteDayRecommendations from "@/components/RouteDayRecommendations";
import RoutePracticalInfo from "@/components/RoutePracticalInfo";

interface Stop {
  id: number;
  name: string;
  category: string;
  description: string;
  schedule?: string;
  address?: string;
}

interface Recommendation {
  id: number;
  text: string;
}

const CrearRuta = () => {
  const { toast } = useToast();
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("facil");
  
  const [stops, setStops] = useState<Stop[]>([
    {
      id: 1,
      name: "",
      category: "",
      description: "",
      schedule: "",
      address: ""
    }
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: 1, text: "" }
  ]);

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
      description: "",
      schedule: "",
      address: ""
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

  const handlePublish = () => {
    if (!routeName || !description || stops.some(s => !s.name)) {
      toast({
        title: "Campos incompletos",
        description: "Completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Ruta publicada",
      description: "Tu ruta ha sido publicada correctamente.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Guardado como borrador",
      description: "La ruta se ha guardado como borrador.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Ruta eliminada",
      description: "La ruta ha sido eliminada correctamente.",
      variant: "destructive",
    });
  };

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
                  onChange={(e) => setRouteName(e.target.value)}
                  placeholder="Ej: Ruta del Queso Artesanal"
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
                <p className="text-xs text-muted-foreground mb-1">Duración</p>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecciona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2-3h">2-3 horas</SelectItem>
                    <SelectItem value="medio-dia">Medio día</SelectItem>
                    <SelectItem value="dia-completo">Día completo</SelectItem>
                    <SelectItem value="fin-semana">Fin de semana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Paradas</p>
                <p className="font-semibold text-base">{stops.length} lugares</p>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Route className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">Dificultad</p>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-sm">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Han ido</p>
                <p className="font-semibold text-base">0 personas</p>
              </div>
            </div>

            {/* Imagen Principal */}
            <div className="bg-card rounded-lg p-6 shadow-sm mb-4">
              <Label htmlFor="photo" className="block mb-2">Foto Principal *</Label>
              <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Haz clic para subir una imagen</p>
                </div>
              </div>
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
                  <div key={stop.id} className="bg-white border border-gray-200 rounded-lg p-4 relative shadow-sm">
                    {/* Stop number badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-sm">Nombre del Lugar *</Label>
                            <Input 
                              value={stop.name}
                              onChange={(e) => {
                                const newStops = [...stops];
                                newStops[index].name = e.target.value;
                                setStops(newStops);
                              }}
                              placeholder="Ej: Quesería Artesanal El Valle"
                              className="font-bold text-lg"
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
                                <SelectValue placeholder="Selecciona una categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="panaderia">Panadería</SelectItem>
                                <SelectItem value="queseria">Quesería</SelectItem>
                                <SelectItem value="artesania">Artesanía</SelectItem>
                                <SelectItem value="mercado">Mercado</SelectItem>
                                <SelectItem value="bodega">Bodega</SelectItem>
                                <SelectItem value="otro">Otro</SelectItem>
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

                    {/* Mini Gallery Placeholder */}
                    <div className="mb-3 p-4 border-2 border-dashed rounded-md bg-muted/20 text-center">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Galería de imágenes (opcional)</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Descripción *</Label>
                        <Textarea 
                          value={stop.description}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].description = e.target.value;
                            setStops(newStops);
                          }}
                          placeholder="¿Qué hace especial este lugar?"
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            Dirección (opcional)
                          </Label>
                          <Input 
                            value={stop.address}
                            onChange={(e) => {
                              const newStops = [...stops];
                              newStops[index].address = e.target.value;
                              setStops(newStops);
                            }}
                            placeholder="Calle, número, ciudad"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Horario (opcional)
                          </Label>
                          <Input 
                            value={stop.schedule}
                            onChange={(e) => {
                              const newStops = [...stops];
                              newStops[index].schedule = e.target.value;
                              setStops(newStops);
                            }}
                            placeholder="Ej: 10:00 - 14:00"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Preview Rating Section */}
            <section>
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-start space-y-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-gray-300" />
                      ))}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">Sin valoraciones</p>
                      <p className="text-xs text-muted-foreground">Sé el primero en valorar</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Route Map Preview */}
            <RouteMap routeTitle={routeName || "Tu ruta"} />

            {/* Daily Recommendations - Editable */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Recomendaciones del Día</CardTitle>
                  <Button onClick={addRecommendation} size="sm" variant="ghost" disabled={recommendations.length >= 4}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Consejos para aprovechar la ruta (máximo 4)
                </CardDescription>
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
                      placeholder={`Recomendación ${index + 1}`}
                      className="text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecommendation(rec.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No hay recomendaciones todavía</p>
                )}
              </CardContent>
            </Card>

            {/* Practical Information Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Información Práctica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-primary">Dificultad</p>
                  <p className="text-muted-foreground capitalize">{difficulty || "No especificada"}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Duración</p>
                  <p className="text-muted-foreground">{duration || "No especificada"}</p>
                </div>
                <div>
                  <p className="font-medium text-primary">Paradas</p>
                  <p className="text-muted-foreground">{stops.length} lugares</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6 space-y-2">
                <Button className="w-full" onClick={handlePublish}>
                  <Save className="w-4 h-4 mr-2" />
                  Publicar Ruta
                </Button>
                <Button className="w-full" variant="outline" onClick={handleSaveDraft}>
                  <FileText className="w-4 h-4 mr-2" />
                  Guardar Borrador
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar ruta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La ruta será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                      </AlertDialogAction>
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

export default CrearRuta;