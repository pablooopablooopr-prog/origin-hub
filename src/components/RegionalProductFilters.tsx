import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Plus, Filter } from "lucide-react";
import { Product, getProductsByRegion, getProductsByCategory } from "@/data/products";

interface RegionalProductFiltersProps {
  region: string;
  currentProducts: Product[];
  onAddProduct: (product: Product) => void;
}

const categoryNames = {
  'queso': 'Quesos',
  'carnes': 'Carnes y Embutidos',
  'conservas': 'Conservas',
  'vinos': 'Vinos y Bebidas',
  'dulces': 'Dulces y Miel',
  'aceites': 'Aceites',
  'otros': 'Otros'
};

const RegionalProductFilters = ({ region, currentProducts, onAddProduct }: RegionalProductFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const regionalProducts = getProductsByRegion(region);
  const availableProducts = regionalProducts.filter(
    product => !currentProducts.some(current => current.id === product.id)
  );
  
  const categories = Array.from(new Set(availableProducts.map(p => p.category)));
  
  const filteredProducts = selectedCategory 
    ? availableProducts.filter(p => p.category === selectedCategory)
    : availableProducts;

  if (availableProducts.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Más productos de {region}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            Todos
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {categoryNames[category as keyof typeof categoryNames]}
            </Button>
          ))}
        </div>
        
        <Separator />
        
        {/* Available Products */}
        <div className="space-y-3">
          {filteredProducts.slice(0, 6).map(product => (
            <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <div className="flex gap-1">
                    {product.badges.slice(0, 2).map(badge => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {product.producer.name} - {product.producer.location}
                </p>
                <div className="text-sm font-medium text-primary">
                  €{product.price.toFixed(2)}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-3"
                onClick={() => onAddProduct(product)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {filteredProducts.length > 6 && (
          <Button variant="outline" className="w-full" size="sm">
            Ver {filteredProducts.length - 6} productos más
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalProductFilters;