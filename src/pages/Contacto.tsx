import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Instagram, Loader2, CheckCircle } from "lucide-react";
import { submitContactMessage } from "@/hooks/useSupabaseData";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().trim().min(1, "El mensaje es obligatorio").max(2000)
});

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    const { error } = await submitContactMessage({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      subject: result.data.subject,
      message: result.data.message
    });
    
    setLoading(false);
    
    if (error) {
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.");
    } else {
      setSubmitted(true);
      toast.success("¡Mensaje enviado correctamente!");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-6">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-xl mx-auto text-center">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-primary mb-4">¡Mensaje Enviado!</h1>
              <p className="text-muted-foreground mb-8">
                Gracias por contactar con ORIGEN. Te responderemos lo antes posible.
              </p>
              <Button onClick={() => setSubmitted(false)}>
                Enviar otro mensaje
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/adobe-wall.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center flex-wrap" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
              <span>Contacta con</span>
              <span className="inline-flex items-center ml-2">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
              </span>
              <span>rigen</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#5a3e20", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
              ¿Tienes un negocio auténtico? ¿Quieres formar parte del movimiento? Hablemos.
            </p>
          </div>

          {/* Tarjetas de información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
            <div className="p-6 rounded-lg shadow-soft text-center" style={{ background: "rgba(245,235,210,0.75)", backdropFilter: "blur(4px)", border: "1px solid rgba(180,140,80,0.25)" }}>
              <Mail className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Email</p>
              <p className="text-sm text-muted-foreground">info@origen.it.com</p>
            </div>
            
            <div className="p-6 rounded-lg shadow-soft text-center" style={{ background: "rgba(245,235,210,0.75)", backdropFilter: "blur(4px)", border: "1px solid rgba(180,140,80,0.25)" }}>
              <Phone className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Teléfono</p>
              <p className="text-sm text-muted-foreground">+34 633804448</p>
            </div>
            
            <div className="p-6 rounded-lg shadow-soft text-center" style={{ background: "rgba(245,235,210,0.75)", backdropFilter: "blur(4px)", border: "1px solid rgba(180,140,80,0.25)" }}>
              <MapPin className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">Ciudad Real, España</p>
            </div>
            
            <div className="p-6 rounded-lg shadow-soft text-center" style={{ background: "rgba(245,235,210,0.75)", backdropFilter: "blur(4px)", border: "1px solid rgba(180,140,80,0.25)" }}>
              <Instagram className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Síguenos</p>
              <a href="https://instagram.com/origen" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                @origen
              </a>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-soft">
              <h2 className="text-xl font-semibold text-primary mb-4">Envíanos un mensaje</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <Input 
                      name="name"
                      placeholder="Tu nombre" 
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input 
                      type="email" 
                      name="email"
                      placeholder="tu@email.com" 
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono</label>
                    <Input 
                      type="tel"
                      name="phone"
                      placeholder="+34 600 000 000" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Asunto</label>
                    <Input 
                      name="subject"
                      placeholder="¿En qué podemos ayudarte?" 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje *</label>
                  <Textarea 
                    name="message"
                    placeholder="Cuéntanos sobre tu negocio, proyecto o consulta..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "border-red-500" : ""}
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                </div>
                <Button size="lg" className="w-full" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar mensaje"
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4 text-center">
                ORIGEN es una plataforma digital que actúa como intermediario tecnológico. 
                Al enviar este formulario aceptas nuestra{" "}
                <a href="/politica-privacidad" className="underline hover:text-primary">
                  política de privacidad
                </a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
