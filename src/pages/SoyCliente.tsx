import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Star, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const SoyCliente = () => {
  const nearbyBusinesses = [
    {
      name: "Panadería El Horno",
      category: "Panadería tradicional",
      distance: "200m",
      rating: "Excelente",
      description: "Pan artesano con masa madre desde 1952",
      tags: ["Sin aditivos", "Horno de leña", "Local"]
    },
    {
      name: "Carnicería Los Hermanos",
      category: "Carnicería",
      distance: "350m", 
      rating: "Muy buena",
      description: "Carne de ganadería extensiva local",
      tags: ["Ecológico", "Km 0", "Familia"]
    },
    {
      name: "Verduras de la Huerta",
      category: "Frutería",
      distance: "450m",
      rating: "Fantástica",
      description: "Productos de temporada y cercanía",
      tags: ["Temporada", "Sin químicos", "Fresco"]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>Mi Z</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>na</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre negocios auténticos cerca de tu ubicación
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-12">
          {/* Búsqueda y filtros */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, producto o categoría..."
                  className="pl-10"
                />
              </div>
              <Button 
                className="flex items-center gap-2"
                style={{ backgroundColor: "hsl(var(--cliente))", color: "hsl(var(--cliente-foreground))" }}
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Cambiar ubicación
              </Button>
            </div>
          </div>

          {/* Negocios cercanos */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Negocios cerca de ti
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyBusinesses.map((business, index) => (
                <Card key={business.name} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{business.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {business.distance}
                      </Badge>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {business.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {business.description}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-secondary fill-current" />
                      <span className="text-sm font-medium">{business.rating}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {business.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Link to={`/negocio/${index + 1}`}>
                      <Button className="w-full">
                        Ver detalles
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Packs sugeridos */}
          <div className="bg-card rounded-lg p-8 shadow-soft">
            <h3 className="text-2xl font-semibold text-primary mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              Packs recomendados para tu zona
            </h3>
            <p className="text-muted-foreground mb-6">
              Selecciones especiales basadas en los mejores negocios de tu área
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/packs">
                <Button size="lg" className="shadow-earth">
                  Pack Madrid Centro
                </Button>
              </Link>
              <Link to="/packs">
                <Button variant="secondary" size="lg" className="shadow-moss">
                  Pack Mercados Locales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SoyCliente;