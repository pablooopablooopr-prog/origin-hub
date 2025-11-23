import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Contacto = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center justify-center">
              <span>Contacta con </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>rigen</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ¿Tienes un negocio auténtico? ¿Quieres formar parte del movimiento? Hablemos.
            </p>
          </div>

          {/* Tarjetas de información de contacto */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
            <div className="bg-card p-6 rounded-lg shadow-soft text-center">
              <Mail className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Email</p>
              <p className="text-sm text-muted-foreground">hola@origen.es</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-soft text-center">
              <Phone className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Teléfono</p>
              <p className="text-sm text-muted-foreground">+34 900 123 456</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-soft text-center">
              <MapPin className="w-8 h-8 text-secondary mx-auto mb-3" />
              <p className="font-semibold text-primary mb-1">Ubicación</p>
              <p className="text-sm text-muted-foreground">Madrid, España</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-soft text-center">
              <a href="#" className="inline-block hover:opacity-80 transition-opacity">
                <Instagram className="w-8 h-8 text-secondary mx-auto mb-3" />
              </a>
              <p className="font-semibold text-primary mb-1">Síguenos</p>
              <p className="text-sm text-muted-foreground">@origen</p>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-soft">
              <h2 className="text-xl font-semibold text-primary mb-4">Envíanos un mensaje</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre</label>
                    <Input placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="tu@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Asunto</label>
                  <Input placeholder="¿En qué podemos ayudarte?" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mensaje</label>
                  <Textarea 
                    placeholder="Cuéntanos sobre tu negocio, proyecto o consulta..."
                    rows={5}
                  />
                </div>
                <Button size="lg" className="w-full">
                  Enviar mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;