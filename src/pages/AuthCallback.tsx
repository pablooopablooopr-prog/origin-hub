import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function safeInternalPath(maybeUrlOrPath: string | null, fallback = "/mi-cuenta") {
  if (!maybeUrlOrPath) return fallback;

  try {
    if (maybeUrlOrPath.startsWith("http://") || maybeUrlOrPath.startsWith("https://")) {
      const u = new URL(maybeUrlOrPath);
      if (u.origin !== window.location.origin) return fallback;
      return u.pathname + u.search + u.hash || fallback;
    }

    if (maybeUrlOrPath.startsWith("/")) return maybeUrlOrPath;

    return fallback;
  } catch {
    return fallback;
  }
}

export default function AuthCallback() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState<"working" | "done" | "error">("working");

  const targetAfter = useMemo(() => {
    const url = new URL(window.location.href);
    const redirectTo = url.searchParams.get("redirect_to");
    return safeInternalPath(redirectTo, "/mi-cuenta");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setStatus("working");
        setErrorMsg(null);

        const url = new URL(window.location.href);

        const code = url.searchParams.get("code");
        const searchAccessToken = url.searchParams.get("access_token");
        const searchRefreshToken = url.searchParams.get("refresh_token");

        const hash = url.hash?.replace(/^#/, "") ?? "";
        const hashParams = new URLSearchParams(hash);
        const hashAccessToken = hashParams.get("access_token");
        const hashRefreshToken = hashParams.get("refresh_token");

        const accessToken = searchAccessToken || hashAccessToken;
        const refreshToken = searchRefreshToken || hashRefreshToken;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          throw new Error("Faltan parámetros de autenticación (code o tokens).");
        }

        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          throw new Error("No se pudo crear sesión. Intenta de nuevo desde el email.");
        }

        if (cancelled) return;
        setStatus("done");

        navigate(targetAfter, { replace: true });
      } catch (err: any) {
        console.error("[AuthCallback] error:", err);
        if (cancelled) return;
        setStatus("error");
        setErrorMsg(err?.message ?? "Error de autenticación");
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate, targetAfter]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-3">
          <h1 className="text-xl font-semibold">No se pudo confirmar tu sesión</h1>
          <p className="text-sm text-muted-foreground">
            {errorMsg ?? "Hubo un problema procesando el enlace."}
          </p>
          <div className="rounded border bg-muted/30 p-3 text-left">
            <p className="text-xs font-medium text-muted-foreground">URL actual</p>
            <p className="text-xs break-all">{window.location.href}</p>
          </div>

          <div className="text-sm text-muted-foreground">
            Consejos rápidos:
            <ul className="list-disc text-left pl-5 mt-2 space-y-1">
              <li>Vuelve a abrir el email y pulsa el botón otra vez.</li>
              <li>Si estás en móvil, prueba en el navegador por defecto (Chrome/Safari).</li>
              <li>Si sigue igual, reenvía la verificación desde la web.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6">
      <Loader2 className="w-6 h-6 animate-spin" />
      <p className="text-sm">
        {status === "working" ? "Confirmando tu email..." : "Redirigiendo..."}
      </p>
    </div>
  );
}