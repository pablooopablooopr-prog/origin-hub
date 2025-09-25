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
        return 'border-amber-200 bg-amber-50';
      case 'esencia':
        return 'border-orange-200 bg-orange-50';
      case 'gourmet':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
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

              {/* Background image with transparency */}
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={pack.image} 
                  alt={pack.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              
              <CardHeader className="text-center relative z-10 pb-2">
                <CardTitle className="text-2xl text-primary font-bold">{pack.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {pack.products.length} productos • {pack.price}€ (envío incluido)
                </CardDescription>
                
                {/* Company info */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <img 
                    src={pack.company.logo} 
                    alt={pack.company.name}
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-xs text-muted-foreground">{pack.company.name} - {pack.company.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{pack.rating}</span>
                  <span className="text-xs text-muted-foreground">({pack.reviews} valoraciones)</span>
                </div>
              </CardHeader>
              
              <CardContent className="text-center relative z-20 pt-0">
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {pack.description}
                </p>
                
                {/* Products list */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2 font-semibold">Incluye:</p>
                  <div className="space-y-1">
                    {pack.products.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <img 
                          src={product.companyLogo} 
                          alt={product.company}
                          className="w-4 h-4 object-contain"
                        />
                        <span className="text-muted-foreground text-left">
                          <strong>{product.name}</strong> - {product.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Added value */}
                {pack.addedValue && pack.addedValue.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1 font-semibold">🎁 Valor añadido:</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {pack.addedValue.map((value, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shipping and sustainability icons */}
                <div className="flex justify-center gap-4 mb-4">
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
                  className="w-full group-hover:shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] relative z-40"
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