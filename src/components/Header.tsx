import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo simplificado */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center">
              <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-6 h-6 object-contain mx-0 -ml-4" />
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
            <Link to="/sobre-origen" className="text-muted-foreground hover:text-primary transition-colors">
              Historia
            </Link>
          </nav>

          {/* Botones de acción */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && <NotificationsDropdown />}
            <Link to="/carrito" className="relative">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link to="/soy-empresa">
              <Button variant="secondary" size="sm">
                Soy Empresa
              </Button>
            </Link>
            {isAuthenticated ? (
              <Link to="/mi-cuenta">
                <Button variant="default" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Mi Cuenta
                </Button>
              </Link>
            ) : (
              <Link to="/customer-auth">
                <Button variant="default" size="sm">Log in</Button>
              </Link>
            )}
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
              <Link to="/sobre-origen" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                Historia
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/carrito" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Carrito {itemCount > 0 && `(${itemCount})`}
                  </Button>
                </Link>
                <Link to="/soy-empresa" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Soy Empresa
                  </Button>
                </Link>
                {isAuthenticated ? (
                  <Link to="/mi-cuenta" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Mi Cuenta
                    </Button>
                  </Link>
                ) : (
                  <Link to="/customer-auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">
                      Log in
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;