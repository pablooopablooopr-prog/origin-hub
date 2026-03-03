import { supabase } from "@/integrations/supabase/client";

type NavigateFn = (to: string) => void;

export async function postLoginRedirect(
  navigate: NavigateFn,
  fallbackPath: string
): Promise<void> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    navigate(fallbackPath);
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
    navigate(fallbackPath);
    return;
  }

  if (data) {
    navigate("/admin/companies");
    return;
  }

  navigate(fallbackPath);
}
