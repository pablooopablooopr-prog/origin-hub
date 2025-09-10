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
      <main className="pt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center justify-center gap-2">
              <span>Contacta con</span>
              <img 
                src="/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png" 
                alt="Ensō" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
              <span>rigen</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              ¿Tienes un negocio auténtico? ¿Quieres formar parte del movimiento? Hablemos.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Información de contacto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">Información de contacto</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">hola@origen.es</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6 text-secondary" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-muted-foreground">+34 900 123 456</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-secondary mt-1" />
                    <div>
                      <p className="font-medium">Ubicación</p>
                      <p className="text-muted-foreground">Madrid, España<br />Presente en toda la península</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-primary mb-4">Síguenos</h3>
                <div className="flex space-x-4">
                  <a href="#" className="p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                    <Instagram className="w-5 h-5 text-secondary" />
                  </a>
                  <a href="#" className="p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                    <Facebook className="w-5 h-5 text-secondary" />
                  </a>
                  <a href="#" className="p-3 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                    <Twitter className="w-5 h-5 text-secondary" />
                  </a>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="bg-card p-8 rounded-lg shadow-soft">
              <h2 className="text-2xl font-semibold text-primary mb-6">Envíanos un mensaje</h2>
              <form className="space-y-6">
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
                    rows={6}
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