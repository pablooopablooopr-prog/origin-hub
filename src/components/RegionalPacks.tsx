import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { packsData } from "@/data/packs";

const RegionalPacks = ({ showTitle = true }: { showTitle?: boolean }) => {
  const navigate = useNavigate();
  
  const regions = ["León", "Granada", "Galicia"];
  
  const packTypes = [
    {
      name: "Pack Raíz",
      price: "35€",
      description: "Lo esencial de la tierra. Un pack sencillo, auténtico y asequible con los sabores más representativos de cada región.",
      expandedDescription: "El Pack Raíz es la puerta de entrada a los sabores locales. Ideal para quienes quieren conocer lo básico y verdadero de cada tierra sin gastar mucho. Productos de proximidad, directos del productor, perfectos para una primera inmersión en el alma gastronómica de cada zona.",
      products: 3,
      color: "bg-amber-50 border-amber-200"
    },
    {
      name: "Pack Esencia", 
      price: "60€",
      description: "Selección equilibrada con carácter. Productos con personalidad que definen la esencia de una región.",
      expandedDescription: "El Pack Esencia recoge una cuidada combinación de alimentos artesanales que representan la tradición, calidad y diversidad de cada comunidad. Para quienes quieren regalarse o regalar un viaje gastronómico más completo, sin llegar al extremo gourmet. Equilibrio entre sabor, origen y valor.",
      products: 4,
      color: "bg-orange-50 border-orange-200"
    },
    {
      name: "Pack Gourmet",
      price: "90€", 
      description: "Para los paladares exigentes. Alta calidad, máxima expresión del producto local.",
      expandedDescription: "El Pack Gourmet es una experiencia sensorial completa. Incluye productos premium seleccionados, algunos de edición limitada o con D.O., pensados para sibaritas, amantes del buen comer y de lo auténtico. Una muestra exclusiva del saber hacer de cada productor. Incluye detalles únicos, sorpresas y en muchos casos, opciones de degustación o visita.",
      products: 5,
      color: "bg-purple-50 border-purple-200"
    }
  ];

  const getRegionalProducts = (region: string, packType: string) => {
    const regionPack = packsData.find(pack => pack.region === region);
    if (!regionPack) return [];
    
    const baseProducts = regionPack.stops.slice(0, 3).map(stop => stop.name);
    if (packType === "Pack Raíz") return baseProducts;
    if (packType === "Pack Esencia") return [...baseProducts, "Producto premium adicional"];
    return [...baseProducts, "Producto premium adicional", "Producto exclusivo D.O."];
  };

  const getRegionalImage = (region: string) => {
    const regionPack = packsData.find(pack => pack.region === region);
    return regionPack?.image || "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png";
  };

  const handlePackClick = (region: string, packType: string) => {
    const regionId = region.toLowerCase().replace(/\s+/g, '-');
    const packId = packType.toLowerCase().replace(/\s+/g, '-');
    const targetPath = `/packs/${regionId}/${packId}`;
    
    try {
      navigate(targetPath);
    } catch (error) {
      console.error('Navigation failed:', error);
      window.location.href = targetPath;
    }
  };

  return (
    <section className="py-20 bg-gradient-warm" id="packs">
      <div className="container mx-auto px-6">
        {/* Título principal */}
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Packs por Región
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubre lo mejor de cada territorio. Productos seleccionados de negocios cercanos que mantienen viva la tradición.
            </p>
          </div>
        )}

        {/* Grid por regiones */}
        {regions.map((region) => (
          <div key={region} className="mb-16">
            <h3 className="text-2xl font-bold text-primary mb-8 text-center">
              {region}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packTypes.map((packType, index) => (
                <Card 
                  key={`${region}-${packType.name}`}
                  className={`group hover:shadow-earth transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${packType.color}`}
                >
                  {/* Background image with transparency */}
                  <div className="absolute inset-0 opacity-10">
                    <img 
                      src={getRegionalImage(region)} 
                      alt={region}
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                  <CardHeader className="text-center relative z-10">
                    <CardTitle className="text-xl text-primary">{packType.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {packType.products} productos • {packType.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center relative z-20">
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                      {packType.description}
                    </p>
                    <div className="mb-6">
                      <p className="text-xs text-muted-foreground mb-2">Incluye:</p>
                      <div className="grid grid-cols-1 gap-1 text-xs">
                        {getRegionalProducts(region, packType.name).map((product, idx) => (
                          <div key={idx} className="text-muted-foreground">• {product}</div>
                        ))}
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      className="w-full group-hover:shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-secondary/80 active:bg-secondary relative z-40"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePackClick(region, packType.name);
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default RegionalPacks;