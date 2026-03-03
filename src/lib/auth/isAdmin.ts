import { supabase } from "@/integrations/supabase/client";

export async function isAdminUser(userId?: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const { data, error } = await supabase.rpc("is_admin");
    if (!error) {
      const value = Array.isArray(data) ? data[0] : data;
      if (value === true) return true;
    }
  } catch {
    // ignore and fallback
  }

  try {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    return !!data;
  } catch {
    return false;
  }
}