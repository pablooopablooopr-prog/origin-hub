import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, Building, Users, Globe, Phone, Mail, MapPin } from "lucide-react";

const SoyEmpresa = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad real",
      description: "Acceso directo a consumidores conscientes que valoran la autenticidad"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Visibilidad nacional",
      description: "Presencia en toda España manteniendo tu identidad local"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Venta directa",
      description: "Sin intermediarios. Relación directa con tus clientes"
    }
  ];

  const criteria = [
    "Productos artesanos o tradicionales",
    "Sin aditivos químicos innecesarios",
    "Métodos de producción auténticos",
    "Compromiso con la calidad sobre la cantidad",
    "Negocio familiar o local establecido"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-2">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <span>S</span>
              <img 
                src="/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png" 
                alt="Ensō" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
              <span>y Empresa</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Únete a la red de negocios auténticos que están transformando el comercio local
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-12">
          {/* Beneficios */}
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-primary mb-8 text-center">
              ¿Por qué unirse a ORIGEN?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
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
                  {criteria.map((criterion, index) => (
                    <div key={criterion} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span className="text-muted-foreground">{criterion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">
                  Solicita tu espacio
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Proceso de verificación gratuito. Comenzamos contigo en 48h.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del negocio</label>
                    <Input placeholder="Ej: Panadería El Horno" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de negocio</label>
                    <Input placeholder="Ej: Panadería artesana" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Persona de contacto</label>
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Teléfono</label>
                    <Input placeholder="+34 600 000 000" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input type="email" placeholder="contacto@tunegocio.com" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Dirección completa</label>
                  <Input placeholder="Calle, número, ciudad, provincia" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Cuéntanos sobre tu negocio</label>
                  <Textarea 
                    placeholder="Historia, productos, métodos tradicionales, años de experiencia..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">¿Por qué es auténtico tu negocio?</label>
                  <Textarea 
                    placeholder="Qué te hace diferente, tradiciones que mantienes, compromiso con la calidad..."
                    rows={3}
                  />
                </div>

                <div className="text-center">
                  <Button size="lg" className="px-8 shadow-earth">
                    <Building className="w-5 h-5 mr-2" />
                    Enviar solicitud
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Te contactaremos en menos de 48 horas para verificar y activar tu perfil
                  </p>
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
                <span className="text-muted-foreground">+34 900 123 456</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">empresas@origen.es</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">Madrid, España</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SoyEmpresa;