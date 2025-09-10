import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
const Testimonials = () => {
  const testimonials = [{
    quote: "ORIGEN me ha devuelto la confianza en lo que como. Cada compra es un acto de resistencia contra la comida industrial.",
    author: "Elena Martín",
    role: "Consumidora consciente",
    location: "Madrid",
    avatar: "EM"
  }, {
    quote: "Mi hijo tiene alergias alimentarias y aquí encuentro productos realmente limpios. Los productores conocen cada ingrediente.",
    author: "David González",
    role: "Padre de familia",
    location: "Barcelona",
    avatar: "DG"
  }, {
    quote: "Como nutricionista, recomiendo ORIGEN a todos mis pacientes. La diferencia nutricional es abismal comparado con productos industriales.",
    author: "Dr. Carmen Ruiz",
    role: "Nutricionista",
    location: "Sevilla",
    avatar: "CR"
  }, {
    quote: "Llevo una vida rural en la ciudad gracias a ORIGEN. Mis nietos prueban sabores que creí que habían desaparecido para siempre.",
    author: "Antonio Jiménez",
    role: "Jubilado",
    location: "Valencia",
    avatar: "AJ"
  }, {
    quote: "Hemos reducido nuestro gasto en alimentación un 30% comprando directamente a productores. Además, la calidad es incomparable.",
    author: "Laura y Miguel",
    role: "Pareja joven",
    location: "Bilbao",
    avatar: "LM"
  }, {
    quote: "Soy chef y ORIGEN es mi secreto mejor guardado. Ingredientes que me permiten crear platos con alma y historia.",
    author: "Raúl Méndez",
    role: "Chef ejecutivo",
    location: "Santiago",
    avatar: "RM"
  }];
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Testimonios Reales
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Historias auténticas de personas que han encontrado en ORIGEN una forma diferente de alimentarse y vivir.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-earth transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-secondary mb-4" />
                <p className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;