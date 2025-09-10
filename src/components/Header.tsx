import { Button } from "@/components/ui/button";
import { MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo simplificado */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center">
              <img 
                src="/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png" 
                alt="Ensō" 
                className="w-6 h-6 object-contain mx-0 -ml-4" 
                style={{ backgroundColor: 'transparent' }}
              />
              <span>RIGEN</span>
            </Link>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/mapa" className="text-muted-foreground hover:text-primary transition-colors">
              Mapa
            </Link>
            <Link to="/packs" className="text-muted-foreground hover:text-primary transition-colors">
              Packs
            </Link>
            <Link to="/rutas" className="text-muted-foreground hover:text-primary transition-colors">
              Rutas
            </Link>
            <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Botones de acción */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              Mi zona
            </Button>
            <Button variant="default" size="sm">
              Soy empresa
            </Button>
          </div>

          {/* Menu mobile */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile desplegable */}
        {isMenuOpen && <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link to="/mapa" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Mapa
              </Link>
              <Link to="/packs" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Packs
              </Link>
              <Link to="/rutas" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Rutas
              </Link>
              <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  Mi zona
                </Button>
                <Button variant="default" size="sm">
                  Soy empresa
                </Button>
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;