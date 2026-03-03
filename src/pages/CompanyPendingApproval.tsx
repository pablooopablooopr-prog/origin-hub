import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CompanyApprovalStatusRow = {
  company_id: string;
  business_name: string;
  status: "pending" | "approved" | "rejected" | string;
};

export default function CompanyPendingApproval() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CompanyApprovalStatusRow | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        navigate("/company-auth");
        return;
      }

      const { data } = await supabase.rpc("get_my_company_approval_status");
      const row = (Array.isArray(data) ? data[0] : data) as CompanyApprovalStatusRow | null;

      if (!row) {
        navigate("/company-auth");
        return;
      }

      if (row.status === "approved") {
        navigate("/company-dashboard");
        return;
      }

      setStatus(row);
      setLoading(false);
    };

    checkStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Pendiente de aprobación</CardTitle>
            <CardDescription className="mt-2">
              {status?.business_name
                ? `Tu empresa ${status.business_name} está pendiente de validación por el equipo de ORIGEN.`
                : "Tu empresa está pendiente de validación por el equipo de ORIGEN."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/")} className="w-full">
              Volver al inicio
            </Button>
            <Button variant="outline" onClick={() => navigate("/company-auth")} className="w-full">
              Ir a acceso empresa
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
