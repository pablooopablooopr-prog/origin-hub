import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Package, ArrowRight } from "lucide-react";

const RegionalPacks = () => {
  const packs = [
    {
      title: "Pack Tierra de León",
      region: "León",
      description: "Cecina artesana, botillo del Bierzo, queso de Valdeón",
      products: ["Cecina artesana", "Botillo del Bierzo", "Queso de Valdeón", "Morcilla de León"],
      businesses: 45,
      image: "🥩",
      highlighted: true
    },
    {
      title: "Pack Granada Natural",
      region: "Granada",
      description: "Aceite Picual, jamón de Trevélez, miel de la Alpujarra",
      products: ["Aceite Picual", "Jamón de Trevélez", "Miel de la Alpujarra", "Habas secas"],
      businesses: 32,
      image: "🫒",
      highlighted: false
    },
    {
      title: "Pack Galicia Auténtica",
      region: "Galicia",
      description: "Conservas artesanas, queso San Simón, licor de hierbas",
      products: ["Conservas artesanas", "Queso San Simón", "Licor de hierbas", "Pan de centeno"],
      businesses: 28,
      image: "🦪",
      highlighted: false
    }
  ];

  return (
    <section className="py-20 bg-gradient-warm" id="packs">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Packs por Región
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubre lo mejor de cada territorio. Productos seleccionados de negocios 
            cercanos que mantienen viva la tradición.
          </p>
        </div>

        {/* Grid de packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {packs.map((pack, index) => (
            <Card 
              key={pack.title}
              className={`group hover:shadow-earth transition-all duration-300 hover:-translate-y-2 ${
                pack.highlighted ? 'ring-2 ring-secondary/20 bg-gradient-moss/10' : ''
              }`}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{pack.image}</div>
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
                  className="w-full group-hover:shadow-soft transition-all"
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
          <Button size="lg" variant="secondary" className="shadow-moss">
            <MapPin className="w-5 h-5 mr-3" />
            Ver packs de mi zona
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Próximamente: Packs nacionales Cazador, Tribu y Sabio
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegionalPacks;