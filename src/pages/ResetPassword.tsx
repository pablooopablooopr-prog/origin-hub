import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordInput from "@/components/PasswordInput";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      // 1) If there's already a session, allow password update
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session) {
        setReady(true);
        setRecoveryError(null);
        return;
      }

      // 2) Try to restore session from URL params
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      const hash = window.location.hash?.replace(/^#/, "") ?? "";
      const hashParams = new URLSearchParams(hash);

      const accessToken = params.get("access_token") || hashParams.get("access_token");
      const refreshToken = params.get("refresh_token") || hashParams.get("refresh_token");

      if (code) {
        // PKCE flow — pass only the code string
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!mounted) return;
        if (error) {
          setReady(false);
          setRecoveryError("Enlace inválido o caducado");
          return;
        }
        setReady(true);
        setRecoveryError(null);
        return;
      }

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!mounted) return;
        if (error) {
          setReady(false);
          setRecoveryError("Enlace inválido o caducado");
          return;
        }
        setReady(true);
        setRecoveryError(null);
        return;
      }

      // 3) No session and no tokens — wait for onAuthStateChange recovery event
      setReady(false);
      setRecoveryError("Enlace inválido o caducado");
    };

    run();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setReady(true);
        setRecoveryError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Contraseña actualizada correctamente");
      navigate("/customer-auth");
    } catch (error: any) {
      toast.error(error?.message ?? "No se pudo actualizar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Nueva contraseña</CardTitle>
            <CardDescription>Escribe y confirma tu nueva contraseña</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              {!ready && !recoveryError && (
                <p className="text-sm text-muted-foreground">Validando enlace de recuperación...</p>
              )}

              {recoveryError && (
                <p className="text-sm text-destructive">{recoveryError}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva contraseña</Label>
                <PasswordInput
                  id="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <PasswordInput
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading || !ready}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Actualizando...</> : "Actualizar contraseña"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
