import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, ArrowRight, Star, Award, Truck, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { companyPacks, getFeaturedPacks } from "@/data/companyPacks";

const RegionalPacks = ({ showTitle = true }: { showTitle?: boolean }) => {
  const navigate = useNavigate();
  
  const handlePackClick = (packId: string) => {
    const targetPath = `/packs/${packId}`;
    try {
      navigate(targetPath);
    } catch (error) {
      console.error('Navigation failed:', error);
      window.location.href = targetPath;
    }
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
    <section className="py-20 bg-gradient-warm" id="packs">
      <div className="container mx-auto px-6">
        {/* Título principal */}
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Packs Regionales
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Productos auténticos seleccionados por maestros artesanos. Cada pack incluye envío y experiencias únicas.
            </p>
            
            {/* Filtros */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              <Badge variant="outline" className="text-sm">🗺️ Por región</Badge>
              <Badge variant="outline" className="text-sm">🧀 Por categoría</Badge>
              <Badge variant="outline" className="text-sm">⭐ Destacados</Badge>
            </div>
          </div>
        )}

        {/* Grid de packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {companyPacks.map((pack) => (
            <Card 
              key={pack.id}
              className={`group hover:shadow-earth transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${getPackTypeColor(pack.type)}`}
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
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl text-primary font-bold">{pack.name}</CardTitle>
                <CardDescription className="text-lg font-semibold text-foreground">
                  {pack.products.length} productos • {pack.price}€ (envío incluido)
                </CardDescription>
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{pack.rating}</span>
                  <span className="text-xs text-muted-foreground">({pack.reviews} valoraciones)</span>
                </div>
              </CardHeader>
              
              <CardContent className="text-center pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {pack.description}
                </p>

                {/* Shipping and sustainability icons */}
                <div className="flex justify-center gap-4 mb-6">
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
                  <Package className="w-4 h-4 mr-2" />
                  Ver más
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA section */}
        <div className="text-center">
          <div className="bg-primary/5 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-primary mb-2">🎯 Sistema de Fidelización</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gana puntos con cada compra y canjéalos por envíos gratuitos, productos de regalo o descuentos
            </p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>🚚 Envío gratuito</span>
              <span>🧴 Producto regalo</span>
              <span>💸 Descuentos exclusivos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegionalPacks;