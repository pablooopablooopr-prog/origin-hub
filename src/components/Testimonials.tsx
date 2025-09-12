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
    <section className="py-20 bg-gradient-moss" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Testimonios
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Historias reales de personas que han encontrado en ORIGEN una forma diferente de alimentarse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-earth transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <Quote className="w-5 h-5 text-secondary mb-3" />
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-primary">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
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