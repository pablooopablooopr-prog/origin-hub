import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Eye, EyeOff } from "lucide-react";
import ForgotPasswordDialog from "@/components/ForgotPasswordDialog";

/** Capitalizes first letter of each word, lowercases the rest */
const capitalizeName = (name: string) =>
  name
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

const CustomerAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/mi-cuenta");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast({ title: "Campos obligatorios", description: "Nombre, teléfono, email y contraseña son obligatorios.", variant: "destructive" });
      return;
    }
    setLoading(true);

    const formattedName = capitalizeName(fullName);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/mi-cuenta`,
          data: {
            full_name: formattedName,
            phone: phone,
          }
        }
      });

      if (error) {
        // Detect duplicate account
        if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already been registered')) {
          toast({ title: "Cuenta existente", description: "Ya existe una cuenta con este email. Por favor, inicia sesión.", variant: "destructive" });
          return;
        }
        throw error;
      }

      // If user already exists (Supabase returns user with identities=[])
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast({ title: "Cuenta existente", description: "Ya existe una cuenta con este email. Por favor, inicia sesión.", variant: "destructive" });
        return;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('customers')
          .insert({
            user_id: data.user.id,
            full_name: formattedName,
            email: email,
            phone: phone
          });

        if (profileError) {
          console.error('Error creating customer profile:', profileError);
        }

        try {
          await supabase.functions.invoke('send-welcome-email', {
            body: { name: formattedName, email, type: 'customer' }
          });
        } catch (emailError) {
          console.error('Error sending welcome email:', emailError);
        }
      }

      toast({
        title: "¡Registro exitoso!",
        description: "Verifica tu correo para activar tu cuenta.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate("/mi-cuenta");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "hsl(var(--cliente))" }}>
              <User className="w-8 h-8" style={{ color: "hsl(var(--cliente-foreground))" }} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Zona de Cliente</h1>
            <p className="text-muted-foreground">Accede a tu cuenta o regístrate</p>
          </div>

          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email *</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tuemail@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      style={{ backgroundColor: "hsl(var(--cliente))", color: "hsl(var(--cliente-foreground))" }}
                    >
                      {loading ? "Cargando..." : "Iniciar Sesión"}
                    </Button>
                    <div className="text-center mt-2">
                      <ForgotPasswordDialog />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>
                    Completa tus datos para registrarte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nombre y Apellidos *</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Ej: María García López"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tuemail@ejemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-phone">Teléfono *</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+34 600 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      style={{ backgroundColor: "hsl(var(--cliente))", color: "hsl(var(--cliente-foreground))" }}
                    >
                      {loading ? "Cargando..." : "Crear Cuenta"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerAuth;
