import { supabase } from "@/integrations/supabase/client";

/**
 * Logout consistente:
 * 1. Cierra sesión en Supabase
 * 2. Limpia claves de la app en localStorage/sessionStorage
 *    (preserva claves de Supabase que el SDK gestiona internamente)
 * 3. Devuelve un booleano para que el caller decida la navegación
 *
 * No hace navigate aquí — cada componente decide su destino
 * (home pública, login, etc.) para evitar redirecciones inesperadas.
 */
export async function signOutAndCleanup(): Promise<boolean> {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("signOutAndCleanup: supabase.signOut failed", err);
  }

  // Limpiar claves de la app SIN tocar las de Supabase
  // (Supabase gestiona sus propias claves "sb-*" tras signOut)
  try {
    const appKeysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      // Preservar claves de Supabase y de la propia app que sean cache benigno
      if (key.startsWith("sb-")) continue;
      // Limpiar carritos de invitado, preferencias volátiles, drafts, etc.
      if (
        key.startsWith("origen.") ||
        key.startsWith("cart_") ||
        key.startsWith("draft_") ||
        key.startsWith("pack_builder_") ||
        key.startsWith("user_")
      ) {
        appKeysToRemove.push(key);
      }
    }
    appKeysToRemove.forEach((k) => localStorage.removeItem(k));

    // sessionStorage es más volátil, lo limpiamos entero salvo claves "sb-"
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key || key.startsWith("sb-")) continue;
      sessionKeysToRemove.push(key);
    }
    sessionKeysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (err) {
    console.warn("signOutAndCleanup: storage cleanup failed", err);
  }

  return true;
}
