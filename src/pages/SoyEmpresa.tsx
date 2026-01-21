import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Building, Users, Globe, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SoyEmpresa = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    authenticity_story: ""
  });

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

  const criteria = ["Productos artesanos o tradicionales", "Sin aditivos químicos innecesarios", "Métodos de producción auténticos", "Compromiso con la calidad sobre la cantidad", "Negocio familiar o local establecido", "Respeto por el entorno y el territorio"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.business_name || !formData.contact_person || !formData.email) {
      toast.error("Por favor, completa los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      // Create company record without user_id (public form submission)
      const { error } = await supabase
        .from('companies')
        .insert({
          business_name: formData.business_name,
          contact_person: formData.contact_person,
          email: formData.email,
          phone: formData.phone || null,
          address: formData.address || null,
          description: formData.description 
            ? `${formData.business_type ? `[${formData.business_type}] ` : ''}${formData.description}` 
            : formData.business_type || null,
          authenticity_story: formData.authenticity_story || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("¡Solicitud enviada correctamente!", {
        description: "Te contactaremos en menos de 48 horas para verificar tu negocio."
      });

      // Reset form
      setFormData({
        business_name: "",
        business_type: "",
        contact_person: "",
        phone: "",
        email: "",
        address: "",
        description: "",
        authenticity_story: ""
      });

    } catch (error: any) {
      console.error("Error submitting company application:", error);
      toast.error("Error al enviar la solicitud", {
        description: error.message || "Inténtalo de nuevo más tarde"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>S</span>
              <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1" />
              <span>y Empresa</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6 font-sans text-lg">
              Únete a la comunidad que está transformando el comercio local y nacional
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/company-auth">
                <Button size="lg" variant="secondary" className="shadow-moss">
                  <Building className="w-5 h-5 mr-2" />
                  Acceder a mi zona de empresa
                </Button>
              </Link>
              <Button size="lg" variant="default" className="shadow-earth" onClick={() => {
                document.getElementById('solicita-form')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }}>
                <Building className="w-5 h-5 mr-2" />
                Unirme a ORIGEN
              </Button>
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

          {/* Formulario */}
          <div id="solicita-form" className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center text-primary">
                  Solicita tu espacio
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  <p className="text-center mb-4">Proceso de verificación gratuito. Así funciona:</p>
                  <ol className="space-y-3 text-left flex flex-col items-center">
                    <li className="flex gap-2 max-w-[260px]">
                      <span className="font-semibold">1.</span>
                      <span>Rellena este formulario.</span>
                    </li>
                    <li className="flex gap-2 max-w-[400px]">
                      <span className="font-semibold">2.</span>
                      <span>Revisamos tu negocio en menos de 48 horas.</span>
                    </li>
                    <li className="flex gap-2 max-w-[650px]">
                      <span className="font-semibold">3.</span>
                      <span>Te enviamos un email con acceso a tu panel privado para crear tu ficha y empezar a vender en ORIGEN.</span>
                    </li>
                  </ol>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Nombre del negocio *</label>
                      <Input 
                        placeholder="Ej: Panadería El Horno" 
                        value={formData.business_name}
                        onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de negocio</label>
                      <Input 
                        placeholder="Ej: Panadería artesana" 
                        value={formData.business_type}
                        onChange={(e) => setFormData({...formData, business_type: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Persona de contacto *</label>
                      <Input 
                        placeholder="Tu nombre" 
                        value={formData.contact_person}
                        onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Teléfono</label>
                      <Input 
                        placeholder="+34 600 000 000" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input 
                      type="email" 
                      placeholder="contacto@tunegocio.com" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Dirección completa</label>
                    <Input 
                      placeholder="Calle, número, ciudad, provincia" 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cuéntanos sobre tu negocio</label>
                    <Textarea 
                      placeholder="Historia, productos, métodos tradicionales, años de experiencia..." 
                      rows={4} 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">¿Por qué es auténtico tu negocio?</label>
                    <Textarea 
                      placeholder="Qué te hace diferente, tradiciones que mantienes, compromiso con la calidad..." 
                      rows={3} 
                      value={formData.authenticity_story}
                      onChange={(e) => setFormData({...formData, authenticity_story: e.target.value})}
                    />
                  </div>

                  <div className="text-center space-y-4">
                    <Button type="submit" size="lg" className="px-8 shadow-earth" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Building className="w-5 h-5 mr-2" />
                          Enviar solicitud
                        </>
                      )}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      <p>Te contactaremos en menos de 48 horas para verificar y activar tu perfil.</p>
                      <p className="mt-2">¿Ya tienes cuenta? <Link to="/company-auth" className="text-primary hover:underline">Inicia sesión aquí</Link></p>
                    </div>
                  </div>
                </form>
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