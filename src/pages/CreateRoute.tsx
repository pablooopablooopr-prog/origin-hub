import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, Plus, X, Clock, Users, Star } from "lucide-react";
import { useState } from "react";

const CreateRoute = () => {
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [selectedBusinesses, setSelectedBusinesses] = useState<any[]>([]);

  const availableBusinesses = [
    {
      id: "1",
      name: "Panadería El Horno",
      category: "🥖 Panadería tradicional",
      distance: "200m",
      rating: 4.8
    },
    {
      id: "2", 
      name: "Carnicería Los Hermanos",
      category: "🥩 Carnicería",
      distance: "350m",
      rating: 4.6
    },
    {
      id: "3",
      name: "Quesería Artesana",
      category: "🧀 Quesería",
      distance: "500m",
      rating: 4.9
    },
    {
      id: "4",
      name: "Bar El Rincón",
      category: "🍺 Bar de tapas",
      distance: "300m",
      rating: 4.7
    }
  ];

  const addBusiness = (business: any) => {
    if (!selectedBusinesses.find(b => b.id === business.id)) {
      setSelectedBusinesses([...selectedBusinesses, business]);
    }
  };

  const removeBusiness = (businessId: string) => {
    setSelectedBusinesses(selectedBusinesses.filter(b => b.id !== businessId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí se enviaría la ruta al backend
    console.log("Ruta creada:", {
      name: routeName,
      description: routeDescription,
      businesses: selectedBusinesses
    });
    alert("¡Ruta creada con éxito! Será revisada antes de publicarse.");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>Crear mi </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>uta</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comparte tu ruta gastronómica favorita con la comunidad ORIGEN
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información básica */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5 text-secondary" />
                    Información básica
                  </CardTitle>
                  <CardDescription>
                    Dale nombre y describe tu ruta para que otros la puedan encontrar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre de la ruta</label>
                    <Input 
                      placeholder="Ej: Ruta del Queso y el Vino en Malasaña"
                      value={routeName}
                      onChange={(e) => setRouteName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Descripción</label>
                    <Textarea 
                      placeholder="Cuenta la historia de tu ruta, qué la hace especial, qué se puede descubrir..."
                      rows={4}
                      value={routeDescription}
                      onChange={(e) => setRouteDescription(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Negocios seleccionados */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Paradas de tu ruta ({selectedBusinesses.length})
                  </CardTitle>
                  <CardDescription>
                    Selecciona los negocios que forman parte de tu ruta en el orden de visita
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedBusinesses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aún no has añadido ningún negocio a tu ruta</p>
                      <p className="text-sm">Selecciona negocios de la lista de abajo</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedBusinesses.map((business, index) => (
                        <div key={business.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">
                              {index + 1}
                            </Badge>
                            <div>
                              <p className="font-medium">{business.name}</p>
                              <p className="text-sm text-muted-foreground">{business.category}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeBusiness(business.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Negocios disponibles */}
              <Card>
                <CardHeader>
                  <CardTitle>Negocios disponibles cerca</CardTitle>
                  <CardDescription>
                    Selecciona los negocios que quieres incluir en tu ruta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableBusinesses.map((business) => (
                      <div key={business.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{business.name}</h3>
                            <p className="text-sm text-muted-foreground">{business.category}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {business.distance}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-secondary fill-current" />
                            <span className="text-sm">{business.rating}</span>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant={selectedBusinesses.find(b => b.id === business.id) ? "secondary" : "outline"}
                            onClick={() => addBusiness(business)}
                            disabled={selectedBusinesses.find(b => b.id === business.id)}
                          >
                            {selectedBusinesses.find(b => b.id === business.id) ? (
                              "Añadido"
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-1" />
                                Añadir
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Información adicional */}
              <Card>
                <CardHeader>
                  <CardTitle>Información adicional</CardTitle>
                  <CardDescription>
                    Ayuda a otros usuarios con datos prácticos sobre tu ruta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duración estimada</label>
                      <Input placeholder="Ej: 3-4 horas" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Personas recomendadas</label>
                      <Input placeholder="Ej: 2-6 personas" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Dificultad</label>
                      <Input placeholder="Ej: Fácil" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Consejos y recomendaciones</label>
                    <Textarea 
                      placeholder="Comparte consejos sobre horarios, reservas, qué no perderse, etc."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Botón de envío */}
              <div className="text-center">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={selectedBusinesses.length === 0 || !routeName || !routeDescription}
                  className="px-8"
                >
                  <Route className="w-5 h-5 mr-2" />
                  Crear ruta
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Tu ruta será revisada por nuestro equipo antes de publicarse
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRoute;