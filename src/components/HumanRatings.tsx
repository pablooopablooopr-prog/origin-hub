import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, User, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const HumanRatings = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleWriteReview = () => {
    if (isAuthenticated) {
      navigate('/escribir-valoracion');
    } else {
      navigate('/customer-auth');
    }
  };

  const ratings = [{
    business: "Quesería La Antigua",
    location: "Casar de Cáceres",
    rating: "Auténtico de verdad",
    comment: "Los quesos saben exactamente como los hacía mi abuelo. Cada bocado es una conexión con la tradición.",
    author: "María J.",
    time: "hace 2 días",
    category: "Lácteos"
  }, {
    business: "Panadería El Horno de Leña",
    location: "Puebla de Sanabria",
    rating: "Lo recomendaría a mi abuela",
    comment: "Pan como el de antes, con masa madre de 100 años. El olor cuando entras te transporta a la infancia.",
    author: "Carlos M.",
    time: "hace 5 días",
    category: "Panadería"
  }, {
    business: "Huerta Los Naranjos",
    location: "Valencia",
    rating: "Me hizo reconectar con mi alimentación",
    comment: "Frutas que saben a fruta. Desde que compro aquí, no puedo comer naranjas de supermercado.",
    author: "Ana R.",
    time: "hace 1 semana",
    category: "Frutas"
  }, {
    business: "Conservas Artesanas del Mar",
    location: "Santoña",
    rating: "Un lugar para volver",
    comment: "Anchoas en salazón como en ningún sitio. El proceso tradicional marca toda la diferencia.",
    author: "Pedro L.",
    time: "hace 3 días",
    category: "Conservas"
  }];

  const ratingTypes = [{
    label: "Auténtico de verdad",
    count: 342,
    color: "bg-primary"
  }, {
    label: "Lo recomendaría a mi abuela",
    count: 289,
    color: "bg-secondary"
  }, {
    label: "Me hizo reconectar con mi alimentación",
    count: 156,
    color: "bg-moss-medium"
  }, {
    label: "Un lugar para volver",
    count: 203,
    color: "bg-earth-medium"
  }];

  return (
    <section className="pt-12 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Valoraciones Humanas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            En lugar de estrellas, usamos palabras con significado. Valoraciones reales 
            de personas que buscan autenticidad.
          </p>
        </div>

        {/* Grid de valoraciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {ratings.map((rating, index) => (
            <Card key={index} className="hover:shadow-soft transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-primary mb-1">
                      {rating.business}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{rating.location}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {rating.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Valoración destacada */}
                <div className="bg-gradient-moss/10 rounded-lg p-4 border-l-4 border-secondary">
                  <p className="font-medium text-secondary text-sm mb-2">
                    "{rating.rating}"
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    {rating.comment}
                  </p>
                </div>

                {/* Autor y tiempo */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{rating.author}</span>
                  </div>
                  <span>{rating.time}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA para valorar */}
        <div className="text-center bg-gradient-warm rounded-lg p-8 shadow-soft">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            Comparte tu experiencia
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Ayuda a la comunidad compartiendo valoraciones auténticas sobre los negocios que has visitado. Cada reseña cuenta una historia real y contribuye al crecimiento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-earth" onClick={handleWriteReview}>
              Escribir valoración
            </Button>
            <Button variant="secondary" size="lg" className="shadow-moss" onClick={() => navigate('/valoraciones')}>
              Ver todas las valoraciones
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanRatings;
