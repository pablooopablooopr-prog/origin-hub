import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold flex items-center">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō Symbol" className="w-8 h-8 object-contain invert" />
                <span>RIGEN</span>
              </h3>
            </div>
            <p className="text-primary-foreground/80 leading-snug text-left max-w-[240px]">
              Conectando consumidores conscientes con negocios auténticos. Preservamos lo esencial, promovemos lo real.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-secondary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navegación */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Explora</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/mapa" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Mapa
              </Link>
              <Link to="/rutas" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Experiencias
              </Link>
              <Link to="/experiencias" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Selecciones
              </Link>
            </nav>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Información</h4>
            <nav className="flex flex-col space-y-3">
              <Link to="/sobre-origen" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Sobre Origen
              </Link>
              <Link to="/faq" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Preguntas Frecuentes
              </Link>
              <Link to="/contacto" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Contacto
              </Link>
              <Link to="/valoraciones" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Valoraciones
              </Link>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80">info@origen.it.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80">+34 633 804 448</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary mt-1" />
                <span className="text-primary-foreground/80">
                  Ciudad Real, España
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2025 ORIGEN. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 text-primary-foreground/60 text-sm">
              <Link to="/terminos-condiciones" className="hover:text-secondary transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/politica-privacidad" className="hover:text-secondary transition-colors">
                Privacidad
              </Link>
              <Link to="/politica-cookies" className="hover:text-secondary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
