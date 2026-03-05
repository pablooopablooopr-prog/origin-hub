import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = "admin" | "company" | "customer" | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!alive) return;

      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      // Check admin
      try {
        const { data } = await supabase.rpc("is_admin");
        if (data === true) {
          if (alive) { setRole("admin"); setLoading(false); }
          return;
        }
      } catch { /* ignore */ }

      // Check company
      const { data: companyStatus } = await supabase.rpc("get_my_company_status");
      if (!alive) return;
      if (companyStatus && String(companyStatus).trim() !== "") {
        setRole("company");
        setLoading(false);
        return;
      }

      // Default: customer
      setRole("customer");
      setLoading(false);
    };

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      setLoading(true);
      check();
    });

    return () => { alive = false; subscription.unsubscribe(); };
  }, []);

  const canAddToCart = role === "customer";

  return { role, loading, canAddToCart };
};
