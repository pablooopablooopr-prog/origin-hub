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
import { MapPin, Plus, X, Save, Trash2, Image as ImageIcon, Clock, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-6">
            <h1 className="text-4xl font-serif text-primary mb-2">Crear Ruta</h1>
            <p className="text-muted-foreground">Comparte tu ruta favorita con la comunidad ORIGEN</p>
          </div>

          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Datos principales de tu ruta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="photo">Foto Principal</Label>
                  <div className="aspect-video rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Haz clic para subir una imagen</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de la Ruta *</Label>
                  <Input 
                    id="name" 
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                    placeholder="Ej: Ruta del Queso Artesanal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Breve *</Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu ruta en pocas palabras..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duración</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration">
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

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Dificultad</Label>
                    <Select value={difficulty} onValueChange={setDifficulty}>
                      <SelectTrigger id="difficulty">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facil">Fácil</SelectItem>
                        <SelectItem value="moderado">Moderado</SelectItem>
                        <SelectItem value="dificil">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stops-count">Número de Paradas</Label>
                    <Input 
                      id="stops-count" 
                      type="number" 
                      value={stops.length}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paradas */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Paradas de la Ruta
                    </CardTitle>
                    <CardDescription>Añade entre 1 y 6 paradas (máximo 6)</CardDescription>
                  </div>
                  <Button onClick={addStop} size="sm" disabled={stops.length >= 6}>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir Parada
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stops.map((stop, index) => (
                  <Card key={stop.id} className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => removeStop(stop.id)}
                      disabled={stops.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Parada {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label>Nombre del Lugar *</Label>
                        <Input 
                          value={stop.name}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].name = e.target.value;
                            setStops(newStops);
                          }}
                          placeholder="Ej: Quesería Artesanal El Valle"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Categoría</Label>
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
                      </div>

                      <div className="space-y-2">
                        <Label>Descripción Breve</Label>
                        <Textarea 
                          value={stop.description}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].description = e.target.value;
                            setStops(newStops);
                          }}
                          placeholder="¿Qué hace especial este lugar?"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Horario (opcional)</Label>
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
                        <div className="space-y-2">
                          <Label>Dirección (opcional)</Label>
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
                      </div>

                      {stop.category && (
                        <Badge variant="secondary" className="capitalize">{stop.category}</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Recomendaciones del Día
                    </CardTitle>
                    <CardDescription>Consejos opcionales para aprovechar la ruta (máximo 4)</CardDescription>
                  </div>
                  <Button onClick={addRecommendation} size="sm" variant="outline" disabled={recommendations.length >= 4}>
                    <Plus className="w-4 h-4 mr-2" />
                    Añadir
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1" onClick={handlePublish}>
                    <Save className="w-4 h-4 mr-2" />
                    Publicar Ruta
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={handleSaveDraft}>
                    <FileText className="w-4 h-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CrearRuta;