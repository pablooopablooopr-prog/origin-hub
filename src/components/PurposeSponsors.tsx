import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";

const PurposeSponsors = () => {
  const sponsors = [
    {
      name: "EcoVida Natural",
      description: "Suplementos naturales sin aditivos",
      icon: Leaf,
      values: ["Orgánico certificado", "Comercio justo"]
    },
    {
      name: "Bosque Sostenible",
      description: "Productos de madera responsable",
      icon: Heart,
      values: ["Reforestación", "Artesanía local"]
    },
    {
      name: "Energía Limpia+",
      description: "Soluciones energéticas renovables",
      icon: Sparkles,
      values: ["100% renovable", "Impacto positivo"]
    },
    {
      name: "Textil Consciente",
      description: "Ropa ética y sostenible",
      icon: Shield,
      values: ["Algodón orgánico", "Trabajo digno"]
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Patrocinadores con Propósito
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Marcas que comparten nuestros valores y apoyan el movimiento hacia una economía más auténtica y sostenible.
          </p>
        </div>

        {/* Grid de patrocinadores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sponsors.map((sponsor, index) => {
            const IconComponent = sponsor.icon;
            return (
              <Card key={index} className="group hover:shadow-soft transition-all duration-300 border-border/50">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 mx-auto bg-gradient-moss/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-secondary" />
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-primary mb-2">{sponsor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{sponsor.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    {sponsor.values.map((value, idx) => (
                      <div key={idx} className="text-xs text-secondary bg-secondary/10 rounded-full px-3 py-1">
                        {value}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Nota sobre patrocinios */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground italic">
            Solo trabajamos con marcas que demuestran un compromiso real con la sostenibilidad y la autenticidad.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PurposeSponsors;