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
    <section className="py-20 bg-gradient-cool" id="testimonials">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Voces Auténticas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Historias reales de personas que han redescubierto el sabor auténtico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-earth transition-shadow">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-secondary mb-4 opacity-50" />
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  {testimonial.quote}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
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