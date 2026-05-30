import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/auth/isAdmin";
import { signOutAndCleanup } from "@/lib/auth/signOut";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { useProducerCarts } from "@/hooks/useProducerCarts";
import { Logo } from "@/components/Logo";

type UserType = "customer" | "company" | null;

const ACCOUNT_ROUTES = ["/mi-cuenta", "/company-dashboard"];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userType, setUserType] = useState<UserType>(null);
  const { totalItemCount: itemCount } = useProducerCarts();
  const location = useLocation();
  const navigate = useNavigate();

  const isOnAccountPage = ACCOUNT_ROUTES.some((r) => location.pathname.startsWith(r));
  const hideLoginButtons = userType === "company" || isOnAccountPage;

  const detectUserType = async (userId: string) => {
    // Check if user has a company profile
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    setUserType(company ? "company" : "customer");
  };

  const refreshAdmin = async (sessionUserId?: string) => {
    const admin = await isAdminUser(sessionUserId);
    setIsAdmin(admin);
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      if (user?.id) {
        await Promise.all([refreshAdmin(user.id), detectUserType(user.id)]);
      } else {
        setUserType(null);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      if (session?.user?.id) {
        await Promise.all([refreshAdmin(session.user.id), detectUserType(session.user.id)]);
      } else {
        setUserType(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const accountLink = userType === "company" ? "/company-dashboard" : "/mi-cuenta";
  const accountColor = userType === "company"
    ? "hsl(var(--secondary))"   // green for companies
    : "hsl(var(--primary))";     // brown for customers
  const accountFgColor = userType === "company"
    ? "hsl(var(--secondary-foreground))"
    : "hsl(var(--primary-foreground))";

  // Admin header - with logout button
  if (isAdmin) {
    const handleLogout = async () => {
      await signOutAndCleanup();
      navigate("/", { replace: true });
    };

    return (
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo size={24} showText={true} />
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated && <NotificationsDropdown />}
              <Button size="sm" onClick={handleLogout} variant="outline" className="gap-2">
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </Button>
              <span className="px-2 py-1 rounded border border-primary text-primary text-xs font-semibold tracking-wide">
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Minimal header for logged-in company users: logo + Mi Cuenta only
  if (userType === "company") {
    return (
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <Logo size={24} showText={true} />
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated && <NotificationsDropdown />}
              <Link to="/company-dashboard">
                <Button size="sm" style={{ backgroundColor: accountColor, color: accountFgColor }}>
                  <User className="w-4 h-4 mr-2" />
                  Mi Cuenta
                  {isAdmin && <span className="ml-2 rounded border border-white/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide">ADMIN</span>}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-2 py-3">
        <div className="flex items-center justify-between">
          {/* Logo RITMORIGEN - Izquierda */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <Logo size={24} showText={true} />
          </Link>

          {/* Navegación desktop - Centrada */}
            <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
              <Link to="/mapa" className="text-muted-foreground hover:text-primary transition-colors">
                Mapa
              </Link>
              <Link to="/rutas" className="text-muted-foreground hover:text-primary transition-colors">
                Experiencias
              </Link>
              <Link to="/empresas" className="text-muted-foreground hover:text-primary transition-colors">
                Empresas
              </Link>
              <Link to="/actualidad" className="text-muted-foreground hover:text-primary transition-colors">
                Actualidad
              </Link>
              <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors">
                Contacto
              </Link>
              <Link to="/sobre-origen" className="text-muted-foreground hover:text-primary transition-colors">
                Historia
              </Link>
              {isAdmin && (
                <Link to="/admin/companies" className="text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </Link>
              )}
            </nav>

          {/* Botones de acción */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && <NotificationsDropdown />}
            <Link to="/mis-carritos" className="relative">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="w-4 h-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {isAuthenticated && hideLoginButtons ? (
              <Link to={accountLink}>
                <Button size="sm" style={{ backgroundColor: accountColor, color: accountFgColor }}>
                  <User className="w-4 h-4 mr-2" />
                  Mi Cuenta
                  {isAdmin && <span className="ml-2 rounded border border-white/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide">ADMIN</span>}
                </Button>
              </Link>
            ) : isAuthenticated ? (
              <>
                <Link to="/soy-empresa">
                  <Button variant="secondary" size="sm">
                    Soy Empresa
                  </Button>
                </Link>
                <Link to={accountLink}>
                  <Button variant="default" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Mi Cuenta
                    {isAdmin && <span className="ml-2 rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wide">ADMIN</span>}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/soy-empresa">
                  <Button variant="secondary" size="sm">
                    Soy Empresa
                  </Button>
                </Link>
                <Link to="/customer-auth">
                  <Button variant="default" size="sm">Log in</Button>
                </Link>
              </>
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
                  <Link to="/rutas" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Experiencias
                  </Link>
                  <Link to="/empresas" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Empresas
                  </Link>
                  <Link to="/actualidad" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Actualidad
                  </Link>
                  <Link to="/contacto" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Contacto
                  </Link>
                  <Link to="/sobre-origen" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Historia
                  </Link>
              {isAdmin && (
                <Link to="/admin/companies" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/mis-carritos" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Mis Carritos {itemCount > 0 && `(${itemCount})`}
                  </Button>
                </Link>
                {isAuthenticated && hideLoginButtons ? (
                  <Link to={accountLink} onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full" style={{ backgroundColor: accountColor, color: accountFgColor }}>
                      <User className="w-4 h-4 mr-2" />
                      Mi Cuenta
                      {isAdmin && <span className="ml-2 rounded border border-white/30 px-2 py-0.5 text-[10px] font-semibold tracking-wide">ADMIN</span>}
                    </Button>
                  </Link>
                ) : isAuthenticated ? (
                  <>
                    <Link to="/soy-empresa" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Soy Empresa
                      </Button>
                    </Link>
                    <Link to={accountLink} onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" size="sm" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        Mi Cuenta
                        {isAdmin && <span className="ml-2 rounded border px-2 py-0.5 text-[10px] font-semibold tracking-wide">ADMIN</span>}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/soy-empresa" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="secondary" size="sm" className="w-full">
                        Soy Empresa
                      </Button>
                    </Link>
                    <Link to="/customer-auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" size="sm" className="w-full">
                        Log in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;
