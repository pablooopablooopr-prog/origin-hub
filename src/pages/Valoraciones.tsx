import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageCircle, Heart, User, Calendar } from "lucide-react";

const Valoraciones = () => {
  // Mock data for human ratings
  const ratings = [
    {
      id: 1,
      userName: "María González",
      businessName: "Quesos El Robledal",
      rating: 5,
      date: "15 de Septiembre, 2024",
      comment: "Increíble experiencia. El queso artesano es excepcional, se nota la tradición familiar y el cuidado en cada detalle. El trato cercano y auténtico nos hizo sentir como en casa.",
      location: "Asturias"
    },
    {
      id: 2,
      userName: "Carlos Martín",
      businessName: "Jamones Sierra Morena",
      rating: 5,
      date: "12 de Septiembre, 2024",
      comment: "Producto de calidad suprema. La curación es perfecta y el sabor incomparable. Se nota que es un negocio familiar con décadas de experiencia.",
      location: "Córdoba"
    },
    {
      id: 3,
      userName: "Ana López",
      businessName: "Aceites Don Rafael",
      rating: 4,
      date: "8 de Septiembre, 2024",
      comment: "Aceite de oliva virgen extra de primera calidad. El proceso artesanal se refleja en cada gota. Recomendable para quienes buscan autenticidad.",
      location: "Jaén"
    },
    {
      id: 4,
      userName: "Pedro Sánchez",
      businessName: "Panadería Tradicional San Miguel",
      rating: 5,
      date: "5 de Septiembre, 2024",
      comment: "Pan como el de antes. Masa madre natural, horneado en horno de leña. Una experiencia que conecta con nuestras raíces gastronómicas.",
      location: "Castilla y León"
    },
    {
      id: 5,
      userName: "Isabel Ruiz",
      businessName: "Conservas Artesanas del Mar",
      rating: 5,
      date: "2 de Septiembre, 2024",
      comment: "Conservas elaboradas con técnicas tradicionales. El pescado fresco y la elaboración cuidadosa hacen de cada lata una delicia auténtica.",
      location: "Galicia"
    },
    {
      id: 6,
      userName: "Miguel Torres",
      businessName: "Bodega Familiar Los Olivos",
      rating: 4,
      date: "28 de Agosto, 2024",
      comment: "Vinos con personalidad propia. La tradición familiar se siente en cada copa. Un descubrimiento para los amantes del vino auténtico.",
      location: "La Rioja"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 md:w-10 md:h-10 mr-3 text-secondary" />
              <span>Valoraci</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>nes Humanas</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Experiencias reales de personas como tú. Cada valoración cuenta una historia auténtica 
              sobre negocios que mantienen viva nuestra tradición gastronómica.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Button size="lg" className="shadow-earth" onClick={() => window.location.href = '/escribir-valoracion'}>
                <MessageCircle className="w-5 h-5 mr-2" />
                Escribir valoración
              </Button>
            </div>
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratings.map((rating) => (
              <Card key={rating.id} className="shadow-soft hover:shadow-earth transition-shadow duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{rating.userName}</h3>
                        <p className="text-sm text-muted-foreground">{rating.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">{rating.businessName}</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        "{rating.comment}"
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      {rating.date}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action Section */}
          <div className="text-center mt-16 p-8 bg-gradient-earth rounded-lg enso-watermark">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Comparte tu experiencia
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ¿Has visitado algún negocio auténtico? Tu valoración puede ayudar a otros 
              a descubrir lugares especiales y apoyar a empresas con alma.
            </p>
            <Button size="lg" className="shadow-earth" onClick={() => window.location.href = '/escribir-valoracion'}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Escribir tu valoración
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Valoraciones;