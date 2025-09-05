import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, Star, Users, Clock, MapPin } from "lucide-react";

const RoutesExplorer = () => {
  const routes = [
    {
      title: "Ruta del Aceite Andaluz",
      description: "3 almazaras tradicionales en Jaén",
      duration: "1 día",
      businesses: 3,
      rating: "Auténtico de verdad",
      participants: 24,
      image: "🫒",
      difficulty: "Fácil"
    },
    {
      title: "Sabores de Castilla",
      description: "Embutidos, quesos y legumbres ancestrales",
      duration: "Weekend",
      businesses: 5,
      rating: "Lo recomendaría a mi abuela",
      participants: 18,
      image: "🧀",
      difficulty: "Moderada"
    },
    {
      title: "Costa Gallega Auténtica",
      description: "Conserveras artesanas y marisquerías locales",
      duration: "2 días",
      businesses: 4,
      rating: "Un lugar para volver",
      participants: 31,
      image: "🦪",
      difficulty: "Fácil"
    }
  ];

  return (
    <section className="py-20 bg-gradient-warm enso-watermark relative" id="rutas">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center justify-center">
            <span>Explorador de Rutas</span>
            <span className="inline-flex items-center ml-2">
              <img 
                src="/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png" 
                alt="Ensō" 
                className="w-10 h-10 md:w-14 md:h-14 object-contain mx-0"
                style={{ backgroundColor: 'transparent' }}
              />
              <span>RIGEN</span>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Marca y comparte rutas visitando negocios locales. Sube valoraciones y reseñas 
            de cada lugar que descubras en tu camino.
          </p>
        </div>

        {/* Rutas destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {routes.map((route, index) => (
            <Card key={route.title} className="group hover:shadow-earth transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
              {/* Imagen de fondo con transparencia */}
              <div className="absolute inset-0 opacity-5">
                <img 
                  src="/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png" 
                  alt="" 
                  className="w-full h-full object-contain"
                />
              </div>
              <CardHeader className="text-center relative z-10">
                <div className="text-5xl mb-4">{route.image}</div>
                <CardTitle className="text-xl text-primary mb-2">{route.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {route.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Métricas de la ruta */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{route.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{route.businesses} lugares</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{route.participants} personas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Route className="w-4 h-4 text-muted-foreground" />
                    <span>{route.difficulty}</span>
                  </div>
                </div>

                {/* Valoración humana */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <Star className="w-4 h-4 text-secondary fill-current" />
                    <span className="text-sm font-medium">Valoración destacada</span>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{route.rating}"
                  </p>
                </div>

                <Button className="w-full group-hover:shadow-soft transition-all">
                  <Route className="w-4 h-4 mr-2" />
                  Explorar ruta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA para crear ruta */}
        <div className="text-center bg-card rounded-lg p-8 shadow-soft">
          <h3 className="text-2xl font-semibold text-primary mb-4">
            ¿Tienes tu propia ruta?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Comparte tus descubrimientos con la comunidad. Marca los lugares que has visitado 
            y ayuda a otros a encontrar negocios auténticos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="shadow-earth">
              <Route className="w-5 h-5 mr-2" />
              Crear mi ruta
            </Button>
            <Button variant="secondary" size="lg" className="shadow-moss">
              <MapPin className="w-5 h-5 mr-2" />
              Ver todas las rutas
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoutesExplorer;