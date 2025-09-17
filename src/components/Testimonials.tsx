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
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-primary mb-16">
          Testimonios Reales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-earth transition-all duration-300">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-secondary mb-4" />
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} • {testimonial.location}</p>
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