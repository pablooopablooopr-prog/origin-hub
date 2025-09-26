import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, ArrowRight, Star, Award, Truck, Leaf, Gift, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { companyPacks, filterPacks } from "@/data/companyPacks";
import PackSearchFilters, { SearchFilters } from "./PackSearchFilters";

const RegionalPacks = ({ showTitle = true }: { showTitle?: boolean }) => {
  const navigate = useNavigate();
  const [filteredPacks, setFilteredPacks] = useState(companyPacks);
  
  const handlePackClick = (packId: string) => {
    const targetPath = `/packs/${packId}`;
    try {
      navigate(targetPath);
    } catch (error) {
      console.error('Navigation failed:', error);
      window.location.href = targetPath;
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    const filtered = filterPacks(companyPacks, filters);
    setFilteredPacks(filtered);
  };

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200';
      case 'esencia':
        return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200';
      case 'gourmet':
        return 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'bg-card border-border';
    }
  };

  const getFeaturedBadge = (featured: string | undefined) => {
    switch (featured) {
      case 'recommended':
        return <Badge className="absolute top-4 right-4 bg-green-100 text-green-700 border-green-200">⭐ Recomendado</Badge>;
      case 'bestseller':
        return <Badge className="absolute top-4 right-4 bg-blue-100 text-blue-700 border-blue-200">📈 Más vendido</Badge>;
      case 'new':
        return <Badge className="absolute top-4 right-4 bg-purple-100 text-purple-700 border-purple-200">🆕 Novedad</Badge>;
      default:
        return null;
    }
  };

  return (
    <section className="py-12 bg-gradient-warm" id="packs">
      <div className="container mx-auto px-6">
        {/* Search filters - only show on main packs page */}
        {showTitle && <PackSearchFilters onFiltersChange={handleFiltersChange} />}

        {/* Pack type info */}
        {showTitle && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4">¿Cuántos Packs Hay?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🌱</span>
                    <h3 className="font-bold text-amber-800">Pack Raíz</h3>
                  </div>
                  <p className="text-sm text-amber-700 mb-1">35€ (envío incluido)</p>
                  <p className="text-xs text-amber-600">3 productos aprox • Básico / Intro</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">🌿</span>
                    <h3 className="font-bold text-emerald-800">Pack Esencia</h3>
                  </div>
                  <p className="text-sm text-emerald-700 mb-1">60€ (envío incluido)</p>
                  <p className="text-xs text-emerald-600">4 productos aprox • Medio / Equilibrado</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl">👑</span>
                    <h3 className="font-bold text-purple-800">Pack Gourmet</h3>
                  </div>
                  <p className="text-sm text-purple-700 mb-1">90€ (envío incluido)</p>
                  <p className="text-xs text-purple-600">5 productos aprox • Premium / Degustación</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Mostrando {filteredPacks.length} pack{filteredPacks.length !== 1 ? 's' : ''} disponible{filteredPacks.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {filteredPacks.map((pack) => (
            <Card 
              key={pack.id}
              className={`group hover:shadow-earth transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${getPackTypeColor(pack.type)}`}
            >
              {/* Featured badge */}
              {getFeaturedBadge(pack.featured)}
              
              {/* Quality seal */}
              {pack.qualitySeal && (
                <div className="absolute top-4 left-4 flex items-center gap-1">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Sello Origen</span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-primary mb-2">{pack.name}</CardTitle>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{pack.rating}</span>
                  <span className="text-xs text-muted-foreground">({pack.reviews} valoraciones)</span>
                </div>

                {/* Price */}
                <div className="text-lg font-bold text-foreground mb-2">
                  {pack.products.length} productos • {pack.price}€ <span className="text-sm font-normal">(envío incluido)</span>
                </div>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pack.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Added value */}
                {pack.addedValue && pack.addedValue.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-1 mb-2">
                      <Gift className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Valor añadido:</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {pack.addedValue.slice(0, 2).map((value, index) => (
                        <div key={index}>- {value}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping and sustainability icons */}
                <div className="flex justify-center gap-6 mb-6">
                  {pack.fastShipping && (
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Envío rápido</span>
                    </div>
                  )}
                  {pack.sustainablePackaging && (
                    <div className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-600">Empaque sostenible</span>
                    </div>
                  )}
                </div>

                <Button 
                  variant="default"
                  className="w-full group-hover:shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePackClick(pack.id);
                  }}
                >
                  Ver más
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loyalty system */}
        <div className="text-center">
          <Card className="bg-primary/5 border-primary/20 max-w-4xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                🎯 Sistema de Fidelización
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gana puntos con cada compra y canjéalos por envíos gratuitos, productos de regalo o descuentos
              </p>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">1000 pts</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-green-600">🚚 Envío gratis</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">1500 pts</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-primary">🎁 Producto regalo</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-medium">2000 pts</span>
                  <span className="text-muted-foreground">=</span>
                  <span className="text-secondary">💸 10% descuento</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RegionalPacks;