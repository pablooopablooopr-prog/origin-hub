import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import RouteLoader from "@/components/RouteLoader";

type CompanyGateProps = {
  children: ReactNode;
};

const CompanyGate = ({ children }: CompanyGateProps) => {
  const [state, setState] = useState<"loading" | "ok" | "pending" | "rejected" | "blocked">("loading");

  useEffect(() => {
    let alive = true;

    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

        if (!alive) return;

        if (!user) {
          setState("blocked");
          return;
        }

        if (!user.email_confirmed_at) {
          await supabase.auth.signOut();
          if (!alive) return;
          setState("blocked");
          return;
        }

        const { data: status, error } = await supabase.rpc("get_my_company_status");
        const s = String(status ?? "").trim().toUpperCase();

        if (!alive) return;

        if (error || s === "") {
          setState("blocked");
          return;
        }

        if (s === "APPROVED") {
          setState("ok");
          return;
        }

        if (s === "PENDING") {
          setState("pending");
          return;
        }

        if (s === "REJECTED") {
          setState("rejected");
          return;
        }

      setState("blocked");
    };

    checkAccess();

    return () => {
      alive = false;
    };
  }, []);

  if (state === "loading") return <RouteLoader label="Verificando acceso de empresa..." />;
  if (state === "ok") return <>{children}</>;
  if (state === "pending") return <Navigate to="/company-pending" replace />;
  if (state === "rejected") return <Navigate to="/company-rejected" replace />;
  return <Navigate to="/company-auth" replace />;
};

export default CompanyGate;
