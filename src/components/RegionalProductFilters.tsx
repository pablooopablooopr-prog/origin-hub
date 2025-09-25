import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Plus, Filter, MapPin, AlertCircle } from "lucide-react";
import { Product, getProductsByRegion, getProductsByCategory } from "@/data/products";
import { styles } from "./ConsumptionStyleSelector";

interface RegionalProductFiltersProps {
  region: string;
  currentProducts: Product[];
  onAddProduct: (product: Product) => void;
  consumptionStyle?: 'cazador' | 'tribu' | 'sabio';
  currentTotal?: number;
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

const RegionalProductFilters = ({ region, currentProducts, onAddProduct, consumptionStyle, currentTotal = 0 }: RegionalProductFiltersProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const regionalProducts = getProductsByRegion(region);
  const availableProducts = regionalProducts.filter(
    product => !currentProducts.some(current => current.id === product.id)
  );
  
  const categories = Array.from(new Set(availableProducts.map(p => p.category)));
  
  const filteredProducts = selectedCategory 
    ? availableProducts.filter(p => p.category === selectedCategory)
    : availableProducts;

  // Get budget limit based on consumption style
  const budgetLimit = consumptionStyle ? styles.find(s => s.id === consumptionStyle)?.budgetLimit || 0 : Infinity;
  const remainingBudget = budgetLimit - currentTotal;

  // Filter products that fit within budget
  const affordableProducts = filteredProducts.filter(product => 
    product.price <= remainingBudget
  );

  const canAddProduct = (product: Product) => {
    return currentTotal + product.price <= budgetLimit;
  };

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
        {consumptionStyle && (
          <div className="text-sm text-muted-foreground">
            Presupuesto restante: <span className="font-semibold text-primary">€{remainingBudget.toFixed(2)}</span>
          </div>
        )}
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
        <div className="space-y-4">
          {affordableProducts.slice(0, 6).map(product => {
            const canAdd = canAddProduct(product);
            
            return (
              <Card key={product.id} className={`overflow-hidden ${!canAdd ? 'opacity-60' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                  {/* Product Image */}
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 md:h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {product.badges.slice(0, 2).map((badge) => (
                        <Badge 
                          key={badge} 
                          variant="secondary" 
                          className="text-xs bg-background/90 text-foreground"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="md:col-span-3 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary mb-1">
                          {product.name}
                        </h4>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="font-medium">{product.producer.name}</span>
                          <span className="mx-1">•</span>
                          <span>{product.producer.location}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {product.description}
                        </p>
                        {product.weight && (
                          <div className="text-xs text-muted-foreground">
                            Peso: {product.weight}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-primary">
                          €{product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            €{product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {product.available ? (
                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                            ✓ Disponible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-600 text-xs">
                            ✗ Agotado
                          </Badge>
                        )}
                        {!canAdd && consumptionStyle && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Excede presupuesto
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!canAdd || !product.available}
                        onClick={() => onAddProduct(product)}
                        className="ml-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Añadir
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {affordableProducts.length > 6 && (
          <Button variant="outline" className="w-full" size="sm">
            Ver {affordableProducts.length - 6} productos más
          </Button>
        )}
        
        {filteredProducts.length > affordableProducts.length && consumptionStyle && (
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <AlertCircle className="w-5 h-5 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length - affordableProducts.length} productos no se muestran porque exceden tu presupuesto
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RegionalProductFilters;