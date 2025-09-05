import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Building, Users, TrendingUp, Shield } from "lucide-react";

const BusinessSection = () => {
  const benefits = [
    {
      icon: Users,
      title: "Comunidad real",
      description: "Accede a miles de consumidores conscientes que buscan productos auténticos"
    },
    {
      icon: TrendingUp,
      title: "Visibilidad nacional",
      description: "Tu negocio visible en toda España manteniendo tu esencia local"
    },
    {
      icon: Shield,
      title: "Venta directa",
      description: "Sin intermediarios. Conecta directamente con tus clientes ideales"
    }
  ];

  return (
    <section className="py-20 bg-gradient-earth enso-watermark" id="empresas">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Contenido principal */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                ¿Tienes un negocio con alma?
              </h2>
              <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                Forma parte de la comunidad que está salvando lo esencial. 
                Visibilidad nacional, venta directa y comunidad real.
              </p>
            </div>

            {/* Beneficios */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lista de verificación */}
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-primary mb-4">¿Tu negocio es ORIGEN?</h4>
              <div className="space-y-3">
                {[
                  "Productos auténticos y naturales",
                  "Procesos tradicionales o artesanos",
                  "Sin refinamientos industriales",
                  "Compromiso con la calidad real",
                  "Pasión por lo que haces"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Button size="lg" className="shadow-earth">
                <Building className="w-5 h-5 mr-2" />
                Solicita tu espacio
              </Button>
              <p className="text-sm text-muted-foreground">
                Proceso de verificación gratuito • Comenzamos contigo en 48h
              </p>
            </div>
          </div>

          {/* Testimonios visuales */}
          <div className="space-y-6">
            <Card className="bg-background/90 backdrop-blur-sm shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-moss flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-2">María Rodríguez</h4>
                    <p className="text-sm text-muted-foreground mb-2">Quesería Los Robles, Salamanca</p>
                    <p className="text-muted-foreground italic text-sm leading-relaxed">
                      "Desde que estamos en ORIGEN hemos triplicado nuestras ventas directas. 
                      Los clientes valoran la autenticidad y nosotros no perdemos nuestra esencia."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/90 backdrop-blur-sm shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-earth flex items-center justify-center text-white font-bold">
                    JL
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-2">José Luis García</h4>
                    <p className="text-sm text-muted-foreground mb-2">Conservas del Cantábrico, Santoña</p>
                    <p className="text-muted-foreground italic text-sm leading-relaxed">
                      "La plataforma nos ha conectado con gente que realmente entiende nuestro trabajo. 
                      Las valoraciones humanas son mucho más valiosas que las estrellas."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-moss/10 border-secondary/20 shadow-moss">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-4">🌱</div>
                <h4 className="font-semibold text-primary mb-2">Únete al movimiento</h4>
                <p className="text-sm text-muted-foreground">
                  Más de 500 negocios ya forman parte de la red ORIGEN. 
                  Preservamos lo auténtico juntos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;