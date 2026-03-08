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
    <section className="pt-8 pb-12 bg-gradient-earth" id="empresas">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">{benefit.title}</h3>
                    <p className="text-foreground/70 text-sm">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Lista de verificación */}
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6 space-y-4 text-left max-w-md mx-auto">
            <h4 className="font-semibold text-primary mb-4 text-center">¿Tu negocio es ORIGEN?</h4>
            <div className="space-y-3">
              {[
                "Eres productor, restaurante o negocio",
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
              Solicita tu espacio
            </Button>
            <p className="text-sm text-muted-foreground">
              Proceso de verificación gratuito • Comenzamos contigo en 48h
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSection;