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
import { User } from "lucide-react";
import { postLoginRedirect } from "@/lib/auth/postLoginRedirect";
import PasswordInput from "@/components/PasswordInput";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_CALLBACK_REDIRECT = `${window.location.origin}/auth/callback?redirect_to=/mi-cuenta`;

const withPhonePrefix = (value: string) => {
  const raw = value.replace(/^\s+/, "");
  if (!raw) return "+34 ";

  if (raw.startsWith("+34")) {
    return raw;
  }

  const withoutPrefix = raw.replace(/^\+?34\s*/, "");
  return `+34 ${withoutPrefix}`;
};

const toE164ES = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("34") ? digits.slice(2) : digits;
  if (!local) return "";
  return `+34${local}`;
};

const CustomerAuth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+34 ");

  const [loading, setLoading] = useState(false);
  const [lastSignupEmail, setLastSignupEmail] = useState<string>("");
  const [showResendOnLogin, setShowResendOnLogin] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await postLoginRedirect(navigate, "/mi-cuenta");
        return;
      }
    };
    checkUser();
  }, [navigate]);

  const handleResendSignupEmail = async () => {
    const targetEmail = (lastSignupEmail || email).trim();
    if (!targetEmail) {
      toast({
        title: "Falta el email",
        description: "Escribe tu email para poder reenviar la verificación.",
        variant: "destructive",
      });
      return;
    }

    if (!EMAIL_REGEX.test(targetEmail)) {
      toast({
        title: "Email inválido",
        description: "Introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: targetEmail,
        options: {
          emailRedirectTo: AUTH_CALLBACK_REDIRECT,
        },
      });
      if (error) throw error;

      toast({
        title: "Email reenviado",
        description: "Revisa tu bandeja de entrada y la carpeta de spam.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const phoneE164 = toE164ES(phone);

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      toast({
        title: "Email inválido",
        description: "Introduce un email válido.",
        variant: "destructive",
      });
      return;
    }

    if (!phoneE164) {
      toast({
        title: "Teléfono requerido",
        description: "Introduce un teléfono de contacto.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: AUTH_CALLBACK_REDIRECT,
          data: {
            full_name: fullName,
            phone: phoneE164,
            user_type: "customer",
          },
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("registered")) {
          toast({
            title: "Cuenta existente",
            description: "Ya existe una cuenta con este email. Inicia sesión en su lugar.",
            variant: "destructive",
          });
          setActiveTab("login");
          return;
        }
        throw error;
      }

      // Supabase returns empty identities when the user already exists (email confirmation enabled)
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast({
          title: "Cuenta existente",
          description: "Ya existe una cuenta con este email. Inicia sesión o recupera tu contraseña.",
          variant: "destructive",
        });
        setActiveTab("login");
        return;
      }

      setLastSignupEmail(trimmedEmail);

      toast({
        title: "Revisa tu correo",
        description: "Te hemos enviado un correo para verificar tu cuenta.",
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
    setShowResendOnLogin(false);

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });

    if (error) throw error;

    await postLoginRedirect(navigate, "/mi-cuenta");
    return;
  } catch (error: any) {
    const msg = (error?.message || "").toLowerCase();

    const notConfirmed =
      msg.includes("email not confirmed") ||
      msg.includes("not confirmed") ||
      msg.includes("confirm");

    if (notConfirmed) {
      setShowResendOnLogin(true);
      toast({
        title: "Verifica tu email",
        description:
          "Tu cuenta existe pero el email no está confirmado. Revisa tu bandeja de entrada o pulsa “Reenviar verificación”.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Error",
      description: error?.message ?? "No se pudo iniciar sesión.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const handlePasswordReset = async () => {
    const targetEmail = (resetEmail || email).trim();

    if (!targetEmail) {
      toast({
        title: "Falta el email",
        description: "Escribe tu email para enviar el enlace de recuperación.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Enlace enviado",
        description: "Revisa tu correo para restablecer la contraseña.",
      });
      setShowResetPassword(false);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message ?? "No se pudo enviar el enlace.",
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
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
              style={{ backgroundColor: "hsl(var(--cliente))" }}
            >
              <User className="w-8 h-8" style={{ color: "hsl(var(--cliente-foreground))" }} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Zona de Cliente</h1>
            <p className="text-muted-foreground">Accede a tu cuenta o regístrate</p>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Iniciar Sesión</CardTitle>
                  <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
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
                      <Label htmlFor="login-password">Contraseña</Label>
                      <PasswordInput
                        id="login-password"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => {
                        setResetEmail(email);
                        setShowResetPassword(true);
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>

                    {showResetPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="tuemail@ejemplo.com"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={loading}
                          onClick={handlePasswordReset}
                        >
                          Enviar enlace
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setShowResetPassword(false)}
                        >
                          Volver
                        </Button>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      style={{ backgroundColor: "hsl(var(--cliente))", color: "hsl(var(--cliente-foreground))" }}
                    >
                      {loading ? "Cargando..." : "Iniciar Sesión"}
                    </Button>

                    {showResendOnLogin && (
  <Button
    type="button"
    variant="outline"
    className="w-full"
    disabled={loading || !email.trim()}
    onClick={handleResendSignupEmail}
  >
    Reenviar verificación
  </Button>
)}

                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Cuenta</CardTitle>
                  <CardDescription>Completa tus datos para registrarte</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nombre Completo</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Tu nombre y apellidos"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
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
                      <Label htmlFor="register-phone">Teléfono</Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="+34 600 000 000"
                        value={phone}
                        onFocus={() => {
                          if (!phone.trim()) setPhone("+34 ");
                        }}
                        onChange={(e) => setPhone(withPhonePrefix(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Contraseña</Label>
                      <PasswordInput
                        id="register-password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                      style={{ backgroundColor: "hsl(var(--cliente))", color: "hsl(var(--cliente-foreground))" }}
                    >
                      {loading ? "Cargando..." : "Crear Cuenta"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={loading || !(lastSignupEmail || email).trim()}
                      onClick={handleResendSignupEmail}
                    >
                      Reenviar verificación
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Si no lo ves, revisa “Promociones” o “Spam”.
                    </p>
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
