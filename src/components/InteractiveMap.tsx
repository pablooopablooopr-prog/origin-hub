import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Beef, Milk, Wheat, Leaf, Shirt, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import MapboxMap from "./MapboxMap";
import { businessesData, categories as categoriesData } from "@/data/businesses";

const InteractiveMap = ({ showTitle = true }: { showTitle?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { name: "Carnes", icon: Beef, count: 89, color: "bg-primary" },
    { name: "Lácteos", icon: Milk, count: 67, color: "bg-secondary" },
    { name: "Fermentos", icon: Wheat, count: 45, color: "bg-moss-medium" },
    { name: "Herbolarios", icon: Leaf, count: 78, color: "bg-earth-medium" },
    { name: "EcoModa", icon: Shirt, count: 34, color: "bg-accent" },
    { name: "Vida Natural", icon: Heart, count: 56, color: "bg-moss-dark" }
  ];

  // Filter businesses based on search and category
  const filteredBusinesses = useMemo(() => {
    let filtered = businessesData;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.city.toLowerCase().includes(query) ||
        business.province.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  return (
    <section className="py-20 enso-watermark" id="mapa">
      <div className="container mx-auto px-6">
        {/* Título principal - solo mostrar si showTitle es true */}
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Mapa Interactivo de Empresas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Encuentra negocios auténticos cerca de ti. Filtra por categoría, busca por ciudad o tipo de producto.
            </p>
          </div>
        )}

        {/* Search and filters section */}
        <div className="max-w-4xl mx-auto mb-16">

          {/* Barra de búsqueda y filtros */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Buscar por ciudad, producto o negocio..." 
                className="pl-11 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros {selectedCategory && "(1)"}
            </Button>
          </div>

          {/* Categorías */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <Badge 
                  key={category.name}
                  variant={isSelected ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm hover:shadow-soft transition-all cursor-pointer ${
                    isSelected ? "shadow-md" : ""
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name} ({category.count})
                </Badge>
              );
            })}
          </div>

          {/* Results counter */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredBusinesses.length} negocios
              {searchQuery && ` para "${searchQuery}"`}
              {selectedCategory && ` en la categoría "${selectedCategory}"`}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Mapa interactivo */}
        <div className="relative">
          <Card className="overflow-hidden shadow-earth">
            <CardContent className="p-0">
              <MapboxMap 
                filteredBusinesses={filteredBusinesses}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas del mapa */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{businessesData.length}</div>
            <p className="text-sm text-muted-foreground">Empresas verificadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">{new Set(businessesData.map(b => b.city)).size}</div>
            <p className="text-sm text-muted-foreground">Ciudades cubiertas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-moss-medium mb-2">{filteredBusinesses.length}</div>
            <p className="text-sm text-muted-foreground">Resultados actuales</p>
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