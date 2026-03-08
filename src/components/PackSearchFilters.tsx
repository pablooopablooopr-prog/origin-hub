import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Package, Filter } from "lucide-react";

export interface SearchFilters {
  location: string;
  categories: string[];
  packType: string;
  addedValue: string[];
  priceRange: string;
}

interface PackSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters | null;
}

const PackSearchFilters = ({ onFiltersChange, initialFilters }: PackSearchFiltersProps) => {
  const [filters, setFilters] = useState<SearchFilters>(
    initialFilters || {
      location: "",
      categories: [],
      packType: "",
      addedValue: [],
      priceRange: ""
    }
  );

  const [isExpanded, setIsExpanded] = useState(true);

  // Update filters when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  const regions = [
    "Castilla y León", "Andalucía", "Galicia", "Aragón", "Cataluña", 
    "Valencia", "Madrid", "País Vasco", "Asturias", "Cantabria",
    "Navarra", "Extremadura", "Murcia", "La Rioja", "Castilla-La Mancha"
  ];

  const categories = [
    "Quesos", "Carnes", "Embutidos", "Lácteos", "Miel", "Vinos", 
    "Dulces", "Panes", "Conservas", "Aceites", "Frutas y verduras",
    "Productos sin gluten", "Ecológicos / Bio", "Otros artesanales"
  ];

  const addedValueOptions = [
    "Incluye degustación",
    "Pack exclusivo de temporada", 
    "Envío gratuito",
    "Recomendado por ORIGEN"
  ];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const handleAddedValueToggle = (value: string) => {
    const newAddedValue = filters.addedValue.includes(value)
      ? filters.addedValue.filter(v => v !== value)
      : [...filters.addedValue, value];
    updateFilters({ addedValue: newAddedValue });
  };

  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      location: "",
      categories: [],
      packType: "",
      addedValue: [],
      priceRange: ""
    };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = filters.location || filters.categories.length > 0 || filters.packType || filters.addedValue.length > 0 || filters.priceRange;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">Buscador de Packs</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            {isExpanded ? "Ocultar filtros" : "Mostrar filtros"}
          </Button>
        </div>

        {/* Location - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              Comunidad Autónoma *
            </Label>
            <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una región..." />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Package className="w-4 h-4 text-primary" />
              Tipo de Pack
            </Label>
            <Select value={filters.packType} onValueChange={(value) => updateFilters({ packType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Cualquier tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="micro">Microselección (15€)</SelectItem>
                <SelectItem value="raiz">Raíz (hasta 35€)</SelectItem>
                <SelectItem value="esencia">Esencia (hasta 55€)</SelectItem>
                <SelectItem value="gourmet">Gourmet (hasta 100€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="space-y-6 border-t pt-6">
            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categorías de productos</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={filters.categories.includes(category) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80 transition-colors"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Added Value */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Valor añadido</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {addedValueOptions.map((value) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`added-value-${value}`}
                      checked={filters.addedValue.includes(value)}
                      onCheckedChange={() => handleAddedValueToggle(value)}
                    />
                    <Label
                      htmlFor={`added-value-${value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {value}
                    </Label>
                  </div>
                ))}
              </div>
            </div>


            {/* Clear filters */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active filters summary */}
        {hasActiveFilters && !isExpanded && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {filters.location && (
              <Badge variant="secondary">📍 {filters.location}</Badge>
            )}
            {filters.packType && (
              <Badge variant="secondary">📦 {filters.packType}</Badge>
            )}
            {filters.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary">{category}</Badge>
            ))}
            {filters.categories.length > 3 && (
              <Badge variant="secondary">+{filters.categories.length - 3} más</Badge>
            )}
            {filters.priceRange && (
              <Badge variant="secondary">💶 {filters.priceRange}€</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PackSearchFilters;