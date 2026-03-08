import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Building, Users, Globe, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SoyEmpresa = () => {
  const benefits = [{
    icon: <Users className="w-6 h-6" />,
    title: "Comunidad real",
    description: "Acceso directo a consumidores conscientes que valoran la autenticidad"
  }, {
    icon: <Globe className="w-6 h-6" />,
    title: "Visibilidad nacional",
    description: "Presencia en toda España manteniendo tu identidad local"
  }, {
    icon: <Building className="w-6 h-6" />,
    title: "Venta directa",
    description: "Sin intermediarios. Relación directa con tus clientes"
  }];

  const criteria = [
    "Eres productor, restaurante o negocio",
    "Productos artesanos o tradicionales", 
    "Sin aditivos químicos innecesarios", 
    "Métodos de producción auténticos", 
    "Compromiso con la calidad sobre la cantidad", 
    "Negocio familiar o local establecido", 
    "Respeto por el entorno y el territorio"
  ];

  const steps = [
    {
      number: "1",
      title: "Crea tu cuenta",
      description: "Regístrate con tu email y contraseña en menos de 1 minuto"
    },
    {
      number: "2", 
      title: "Completa tu perfil",
      description: "Rellena los datos de tu negocio y cuéntanos tu historia"
    },
    {
      number: "3",
      title: "Verificación",
      description: "Revisamos tu solicitud en menos de 24 horas"
    },
    {
      number: "4",
      title: "¡Empieza a vender!",
      description: "Accede a tu panel, crea y muéstrate al mundo entero"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>S</span>
              <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1" />
              <span>y Empresa</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8 font-sans text-lg">
              Únete a la comunidad que está transformando el comercio local y nacional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/company-auth?tab=signup">
                <Button size="lg" variant="default" className="shadow-earth">
                  Unirme a ORIGEN
                </Button>
              </Link>
              <Link to="/company-auth?tab=signin">
                <Button size="lg" variant="outline" className="bg-card shadow-md hover:shadow-lg border-border">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-12">
          {/* Beneficios */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
              ¿Por qué unirse a ORIGEN?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-center mb-4 text-primary">
                      {benefit.icon}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {benefit.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cómo funciona - Proceso simplificado */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
              Proceso de registro
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <div key={step.number} className="relative">
                  <Card className="text-center h-full hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-background to-muted/20">
                    <CardHeader className="pb-2">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                        {step.number}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground text-sm">
                        {step.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            
            {/* CTA Central */}
            <div className="mt-10 text-center">
              <Link to="/company-auth">
                <Button size="lg" className="shadow-earth px-8">
                  Crear mi cuenta de empresa
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Criterios */}
          <div className="mb-12">
            <Card className="bg-gradient-warm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">
                  ¿Tu negocio es ORIGEN?
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Verifica si cumples con nuestros criterios de autenticidad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {criteria.map((criterion) => (
                    <div key={criterion} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{criterion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información adicional */}
          <div className="mt-12 bg-muted/20 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-primary mb-4 text-center">
              ¿Tienes dudas?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">+34 633 804 448</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">info@origen.it.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">Ciudad Real, España</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/company-auth">
                <Button variant="outline" className="shadow-md">
                  Empezar registro
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SoyEmpresa;
