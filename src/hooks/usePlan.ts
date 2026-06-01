import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Planes empresariales jerárquicos.
 * El orden importa: cada plan superior incluye todo lo del inferior.
 */
export type CompanyPlan = "basico" | "standard" | "destacado";

export const PLAN_LEVEL: Record<CompanyPlan, number> = {
  basico: 0,
  standard: 1,
  destacado: 2,
};

export const PLAN_LABELS: Record<CompanyPlan, string> = {
  basico: "Básico",
  standard: "Intermedio",
  destacado: "Premium",
};

export const PLAN_PRICES: Record<CompanyPlan, number> = {
  basico: 20,
  standard: 35,
  destacado: 50,
};

/**
 * Resumen corto por plan, usado en popups de upgrade y comparativas.
 * No incluye precios — los precios sólo se muestran dentro del modal.
 */
export const PLAN_TAGLINES: Record<CompanyPlan, string> = {
  basico: "Empieza a aparecer en ORIGEN.",
  standard: "Aparece en rutas estacionales, newsletter top y pin dorado.",
  destacado: "Todo lo del Intermedio + digitalización de facturas (ley antifraude).",
};

/** Features visibles en el modal de upgrade. */
export const PLAN_FEATURES: Record<CompanyPlan, string[]> = {
  basico: [
    "Ficha pública de tu empresa",
    "Spotlight rotatorio en la home (~4 veces/mes)",
    "Mapa B2B en modo lectura",
    "Dashboard básico con estadísticas",
  ],
  standard: [
    "Todo lo del plan Básico",
    "Pin dorado en mapa + borde dorado en spotlight",
    "TOP de la newsletter trimestral",
    "Aparición garantizada en rutas de tu temporada",
    "Mensajes B2B con restaurantes verificados",
  ],
  destacado: [
    "Todo lo del plan Intermedio",
    "Digitalización de facturas conforme a la nueva normativa antifraude",
    "Soporte de implementación durante el periodo de adaptación legal",
    "Acceso prioritario a leads B2B",
  ],
};

export interface UsePlanResult {
  plan: CompanyPlan;
  isLoading: boolean;
  /** ¿El plan actual cubre el plan requerido? (jerárquico) */
  hasAtLeast: (required: CompanyPlan) => boolean;
  /** Atajos */
  isBasic: boolean;
  isStandard: boolean;
  isDestacado: boolean;
  /** Refrescar manualmente (p.ej. tras upgrade) */
  refresh: () => Promise<void>;
}

/**
 * Hook para obtener el plan empresarial del usuario logueado.
 *
 * Si el usuario no tiene empresa o no está logueado, devuelve "basico".
 * (No usar para gates de admin/customer; sólo para lógica de planes empresa.)
 */
export function usePlan(): UsePlanResult {
  const [plan, setPlan] = useState<CompanyPlan>("basico");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setPlan("basico");
        return;
      }

      // Llamamos al RPC creado en la migración 20260424
      const { data, error } = await supabase.rpc("get_my_company_plan");

      if (error) {
        console.warn("usePlan rpc error:", error.message);
        setPlan("basico");
        return;
      }

      const value = String(data ?? "basico").trim().toLowerCase();
      if (value === "standard" || value === "destacado") {
        setPlan(value);
      } else {
        setPlan("basico");
      }
    } catch (err) {
      console.warn("usePlan unexpected error:", err);
      setPlan("basico");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;
    void (async () => {
      await fetchPlan();
      if (!alive) return;
    })();

    // Re-evaluar cuando cambia la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      if (alive) void fetchPlan();
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasAtLeast = (required: CompanyPlan) =>
    PLAN_LEVEL[plan] >= PLAN_LEVEL[required];

  return {
    plan,
    isLoading,
    hasAtLeast,
    isBasic: plan === "basico",
    isStandard: plan === "standard",
    isDestacado: plan === "destacado",
    refresh: fetchPlan,
  };
}
