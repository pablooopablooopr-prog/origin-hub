import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Beef, Milk, Wheat, Leaf, Shirt, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

const InteractiveMap = () => {
  const categories = [
    { name: "Carnes", icon: Beef, count: 89, color: "bg-primary" },
    { name: "Lácteos", icon: Milk, count: 67, color: "bg-secondary" },
    { name: "Fermentos", icon: Wheat, count: 45, color: "bg-moss-medium" },
    { name: "Herbolarios", icon: Leaf, count: 78, color: "bg-earth-medium" },
    { name: "EcoModa", icon: Shirt, count: 34, color: "bg-accent" },
    { name: "Vida Natural", icon: Heart, count: 56, color: "bg-moss-dark" }
  ];

  return (
    <section className="py-20 enso-watermark" id="mapa">
      <div className="container mx-auto px-6">
        {/* Search and filters section */}
        <div className="max-w-4xl mx-auto mb-16">

          {/* Barra de búsqueda y filtros */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Buscar por ciudad o producto..." 
                className="pl-11 py-3"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Badge 
                  key={category.name}
                  variant="secondary" 
                  className="px-4 py-2 text-sm hover:shadow-soft transition-all cursor-pointer"
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name} ({category.count})
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Mapa placeholder */}
        <div className="relative">
          <Card className="overflow-hidden shadow-earth">
            <CardContent className="p-0">
              {/* Placeholder del mapa */}
              <div className="h-96 md:h-[500px] bg-gradient-to-br from-moss-light/20 to-earth-light/20 relative flex items-center justify-center">
                {/* Puntos de ejemplo en el mapa */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-secondary rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-moss-medium rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-earth-medium rounded-full animate-pulse shadow-lg"></div>
                
                {/* Mensaje central */}
                <div className="text-center bg-background/90 backdrop-blur-sm rounded-lg p-8 shadow-soft">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-primary mb-2">
                    Mapa Interactivo
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Explora más de 500 negocios auténticos en toda España
                  </p>
                  <Button className="shadow-earth">
                    Activar mapa completo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info flotante de ejemplo */}
          <Card className="absolute top-8 right-8 w-64 hidden lg:block shadow-moss">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-sm text-primary">Granja Los Robles</h4>
                  <p className="text-xs text-muted-foreground mb-2">Lácteos artesanos - Salamanca</p>
                  <Badge variant="outline" className="text-xs">
                    "Auténtico de verdad"
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas del mapa */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-sm text-muted-foreground">Empresas verificadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">50</div>
            <p className="text-sm text-muted-foreground">Ciudades cubiertas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-moss-medium mb-2">25k+</div>
            <p className="text-sm text-muted-foreground">Productos disponibles</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-earth-medium mb-2">98%</div>
            <p className="text-sm text-muted-foreground">Satisfacción usuarios</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;