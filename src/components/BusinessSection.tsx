import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Building, Users, TrendingUp, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BusinessSection = () => {
  const navigate = useNavigate();

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
              <Button size="lg" className="shadow-earth" onClick={() => navigate('/soy-empresa')}>
                <Building className="w-5 h-5 mr-2" />
                Solicita tu espacio
              </Button>
              <p className="text-sm text-muted-foreground">
                Proceso de verificación gratuito • Comenzamos contigo en 48h
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BusinessSection;