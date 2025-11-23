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
import { MapPin, Plus, X, Save, Trash2, Image as ImageIcon, Clock, FileText, Users, Route, Star, Coffee, Utensils, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import RouteMap from "@/components/RouteMap";

interface Stop {
  id: number;
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

const CrearRuta = () => {
  const { toast } = useToast();
  const [routeName, setRouteName] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState("Fácil");
  const [numStops, setNumStops] = useState("3");
  
  const [stops, setStops] = useState<Stop[]>([
    {
      id: 1,
      name: "",
      category: "",
      whatToDo: [""],
      schedule: "",
      address: ""
    }
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    { id: 1, text: "" }
  ]);

  const [localTips, setLocalTips] = useState<LocalTip[]>([
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
      whatToDo: [""],
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

  const handlePublish = () => {
    if (!routeName || !description || !experience || stops.some(s => !s.name || s.whatToDo.some(w => !w))) {
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
                <p className="text-xs text-muted-foreground mb-1">Paradas</p>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={numStops}
                  onChange={(e) => setNumStops(e.target.value)}
                  className="h-8 text-sm text-center font-semibold"
                />
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

            {/* La Experiencia */}
            <div className="bg-card rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-3">La Experiencia</h2>
              <Textarea 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Describe la experiencia completa de la ruta. ¿Qué van a vivir los visitantes?"
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
                                <SelectItem value="Otro">Otro</SelectItem>
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
                                  newStops[index].whatToDo[actIndex] = e.target.value;
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
                  <CardTitle className="text-lg font-bold text-foreground">Recomendaciones del Día</CardTitle>
                  <Button onClick={addRecommendation} size="sm" variant="ghost" disabled={recommendations.length >= 4}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription className="text-xs">
                  Consejos para aprovechar la ruta (máximo 4)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {recommendations.map((rec, index) => {
                  const icons = [Clock, MapPin, Coffee, Utensils, Camera];
                  const Icon = icons[index % icons.length];
                  return (
                    <div key={rec.id} className="flex items-start gap-2">
                      <Icon className="w-4 h-4 text-primary mt-2.5 flex-shrink-0" />
                      <Input 
                        value={rec.text}
                        onChange={(e) => {
                          const newRecs = [...recommendations];
                          newRecs[index].text = e.target.value;
                          setRecommendations(newRecs);
                        }}
                        placeholder={`Recomendación ${index + 1}`}
                        className="text-sm flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRecommendation(rec.id)}
                        className="flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
                {recommendations.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No hay recomendaciones todavía</p>
                )}
              </CardContent>
            </Card>

            {/* Practical Information Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-foreground">
                  Información Práctica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">Dificultad:</span>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          difficulty === 'Fácil' ? 'bg-green-600 text-white' :
                          difficulty === 'Moderado' ? 'bg-amber-700 text-white' :
                          difficulty === 'Difícil' ? 'bg-red-600 text-white' :
                          'bg-gray-600 text-white'
                        } border-0 rounded-full px-2.5 py-0.5 text-xs`}
                      >
                        {difficulty || "No especificada"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 text-sm">Duración:</span>
                      <span className="text-gray-600 text-sm">{duration || "No especificada"}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">Consejos locales:</h4>
                    <Button onClick={addLocalTip} size="sm" variant="ghost" disabled={localTips.length >= 4}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {localTips.map((tip, index) => (
                      <div key={tip.id} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                        <Input
                          value={tip.text}
                          onChange={(e) => {
                            const newTips = [...localTips];
                            newTips[index].text = e.target.value;
                            setLocalTips(newTips);
                          }}
                          placeholder={`Consejo ${index + 1}`}
                          className="text-sm flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLocalTip(tip.id)}
                          className="flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {localTips.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No hay consejos todavía</p>
                    )}
                  </div>
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