import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { isAdminUser } from "@/lib/auth/isAdmin";
import RouteLoader from "@/components/RouteLoader";

type AdminGateProps = {
  children: ReactNode;
};

export default function AdminGate({ children }: AdminGateProps) {
  const [loading, setLoading] = useState(true);
  const [hasUser, setHasUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setHasUser(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setHasUser(true);

      if (!mounted) return;

      setIsAdmin(await isAdminUser(user.id));

      setLoading(false);
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <RouteLoader label="Verificando acceso de administrador..." />;

  if (!hasUser) {
    return <Navigate to="/customer-auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
