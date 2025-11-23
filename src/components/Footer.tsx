import { MapPin, Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold flex items-center">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō Symbol" className="w-8 h-8 object-contain invert" />
                <span>RIGEN</span>
              </h3>
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Conectando consumidores conscientes con negocios auténticos. 
              Preservamos lo esencial, promovemos lo real.
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
                Mapa Interactivo
              </Link>
              <Link to="/packs" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Packs Regionales
              </Link>
              <Link to="/rutas" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Rutas ORIGEN
              </Link>
              <a href="#empresas" className="text-primary-foreground/80 hover:text-secondary transition-colors">Soy Empresa</a>
            </nav>
          </div>

          {/* Información */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Información</h4>
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Sobre Origen
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Blog
              </a>
              <Link to="/contacto" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Contacto
              </Link>
              <a href="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                Política de Privacidad
              </a>
            </nav>
          </div>

          {/* Contacto */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80">hola@origen.es</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-primary-foreground/80">+34 900 123 456</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-secondary mt-1" />
                <span className="text-primary-foreground/80">
                  


Presente en toda la península





                <br />
                  Presente en toda la península
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 ORIGEN. Todos los derechos reservados.
            </p>
            <p className="text-primary-foreground/60 text-sm">
              Un movimiento para preservar lo auténtico
            </p>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;