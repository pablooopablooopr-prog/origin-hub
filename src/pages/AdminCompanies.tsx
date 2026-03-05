import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CompanyRow = {
  id: string;
  business_name: string;
  contact_person: string;
  email: string;
  status: string | null;
  created_at: string;
};

const isApprovedStatus = (status: string | null) =>
  String(status ?? "").trim().toLowerCase() === "approved";

export default function AdminCompanies() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const checkAdmin = useCallback(async (): Promise<boolean> => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return false;

    try {
      const { data, error } = await supabase.rpc("is_admin");
      if (!error) {
        const value = Array.isArray(data) ? data[0] : data;
        return value === true;
      }
    } catch {
      // ignore and fallback
    }

    const { data: roleRows, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .limit(1);

    if (roleError) return false;
    return !!roleRows && roleRows.length > 0;
  }, []);

  const loadCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("id,business_name,contact_person,email,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas.",
        variant: "destructive",
      });
      setCompanies([]);
      return;
    }

    const rows = (data || []) as CompanyRow[];
    setCompanies(rows.filter((company) => !isApprovedStatus(company.status)));
  }, [toast]);

  useEffect(() => {
    let alive = true;

    const init = async () => {
      setLoading(true);
      const admin = await checkAdmin();
      if (!alive) return;

      setIsAdmin(admin);
      if (admin) {
        await loadCompanies();
      }
      if (alive) setLoading(false);
    };

    init();

    return () => {
      alive = false;
    };
  }, [checkAdmin, loadCompanies]);

  const handleApprove = async (companyId: string) => {
    setApprovingId(companyId);
    const { error } = await supabase.rpc("approve_company", { p_company_id: companyId });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar la empresa.",
        variant: "destructive",
      });
      setApprovingId(null);
      return;
    }

    toast({
      title: "Empresa aprobada",
      description: "La empresa se aprobó correctamente.",
    });

    await loadCompanies();
    setApprovingId(null);
  };

  const REJECTION_REASON = "Estimado/a, lamentamos informarle de que su solicitud de registro ha sido rechazada debido a falta de información. Le invitamos a volver a registrarse proporcionando datos más completos sobre su negocio. Gracias por su interés.";

  const handleReject = async (company: CompanyRow) => {
    const confirmed = window.confirm(`¿Seguro que quieres rechazar a ${company.business_name}?`);
    if (!confirmed) return;

    setRejectingId(company.id);
    const { error } = await supabase.rpc("reject_company", {
      p_company_id: company.id,
      p_reason: REJECTION_REASON,
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar la empresa.",
        variant: "destructive",
      });
      setRejectingId(null);
      return;
    }

    toast({
      title: "Empresa rechazada",
      description: "La empresa se rechazó correctamente.",
    });

    await loadCompanies();
    setRejectingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-10">
          <Card>
            <CardContent className="py-8 text-center">Cargando...</CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-10">
          <Card>
            <CardHeader>
              <CardTitle>Acceso denegado</CardTitle>
            </CardHeader>
            <CardContent>No tienes permisos de administrador.</CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10">
        <Card>
          <CardHeader>
            <CardTitle>Empresas pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {companies.length === 0 ? (
              <p>No hay empresas pendientes.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-3">Negocio</th>
                      <th className="text-left py-2 pr-3">Contacto</th>
                      <th className="text-left py-2 pr-3">Email</th>
                      <th className="text-left py-2 pr-3">Estado</th>
                      <th className="text-left py-2 pr-3">Fecha</th>
                      <th className="text-left py-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id} className="border-b">
                        <td className="py-2 pr-3">{company.business_name}</td>
                        <td className="py-2 pr-3">{company.contact_person}</td>
                        <td className="py-2 pr-3">{company.email}</td>
                        <td className="py-2 pr-3">{company.status || "pending"}</td>
                        <td className="py-2 pr-3">{new Date(company.created_at).toLocaleString()}</td>
                        <td className="py-2">
                          {!isApprovedStatus(company.status) && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(company.id)}
                                disabled={approvingId === company.id || rejectingId === company.id}
                              >
                                {approvingId === company.id ? "Aprobando..." : "Aprobar"}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="ml-2"
                                onClick={() => handleReject(company)}
                                disabled={rejectingId === company.id || approvingId === company.id}
                              >
                                {rejectingId === company.id ? "Rechazando..." : "Rechazar"}
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
