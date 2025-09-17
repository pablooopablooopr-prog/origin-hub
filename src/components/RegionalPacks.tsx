import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { packsData } from "@/data/packs";

const RegionalPacks = ({ showTitle = true }: { showTitle?: boolean }) => {
  const navigate = useNavigate();
  
  const packs = packsData.map(pack => ({
    id: pack.id,
    title: pack.title,
    region: pack.region,
    description: pack.shortDescription,
    products: pack.stops.map(stop => stop.name).slice(0, 4),
    businesses: pack.businesses,
    image: pack.image,
    highlighted: pack.highlighted
  }));

  const handlePackClick = (packId: string) => {
    console.log('Button clicked! Pack ID:', packId);
    console.log('About to navigate to:', `/packs/${packId}`);
    try {
      navigate(`/packs/${packId}`);
      console.log('Navigation called successfully');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <section className="py-20 bg-gradient-warm" id="packs">
      <div className="container mx-auto px-6">
        {/* Título principal - solo mostrar si showTitle es true */}
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

        {/* Grid de packs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packs.map((pack, index) => (
            <Card 
              key={pack.title}
              className={`group hover:shadow-earth transition-all duration-300 hover:-translate-y-2 relative overflow-hidden ${
                pack.highlighted ? 'ring-2 ring-secondary/20 bg-gradient-moss/10' : ''
              }`}
            >
              {/* Background image with transparency */}
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={pack.image} 
                  alt={pack.region}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <CardHeader className="text-center relative z-10">
                <CardTitle className="text-xl text-primary">{pack.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {pack.businesses} negocios locales
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                  {pack.description}
                </p>
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-2">Incluye:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {pack.products.slice(0, 4).map((product, idx) => (
                      <div key={idx} className="text-muted-foreground">• {product}</div>
                    ))}
                  </div>
                </div>
                <Button 
                  variant={pack.highlighted ? "default" : "outline"} 
                  className="w-full group-hover:shadow-soft transition-all hover:scale-[1.02] active:scale-[0.98] hover:bg-secondary/80 active:bg-secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Button clicked! Event:', e);
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

        {/* CTA central */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Próximamente: Packs nacionales Cazador, Tribu y Sabio
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionalPacks;