import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type NavigateFn = (to: string, opts?: { replace?: boolean }) => void;

/**
 * Decide a dónde redirigir tras un login exitoso.
 *
 * - Si el usuario es admin → /admin/companies
 * - En cualquier otro caso → fallbackPath
 *
 * Usa `replace: true` para que el botón "atrás" del navegador NO
 * vuelva a la pantalla de login (causa principal de "páginas en limbo").
 *
 * Acepta un `user` opcional para evitar un segundo `getUser()` cuando
 * el caller ya lo tiene (elimina race condition de doble fetch).
 */
export async function postLoginRedirect(
  navigate: NavigateFn,
  fallbackPath: string,
  prefetchedUser?: User | null
): Promise<void> {
  let user = prefetchedUser ?? null;

  if (!user) {
    const {
      data: { user: fetched },
    } = await supabase.auth.getUser();
    user = fetched;
  }

  if (!user) {
    navigate(fallbackPath, { replace: true });
    return;
  }

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) {
    console.warn("postLoginRedirect user_roles error:", error.message);
    navigate(fallbackPath, { replace: true });
    return;
  }

  if (data) {
    navigate("/admin/companies", { replace: true });
    return;
  }

  navigate(fallbackPath, { replace: true });
}
