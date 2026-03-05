import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const isRejectedStatus = (status: string | null) =>
  String(status ?? "").trim().toLowerCase() === "rejected";

const isPendingStatus = (status: string | null) =>
  !isApprovedStatus(status) && !isRejectedStatus(status);

export default function AdminCompanies() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allCompanies, setAllCompanies] = useState<CompanyRow[]>([]);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const pendingCompanies = allCompanies.filter((c) => isPendingStatus(c.status));
  const processedCompanies = allCompanies.filter(
    (c) => isApprovedStatus(c.status) || isRejectedStatus(c.status)
  );

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
      setAllCompanies([]);
      return;
    }

    setAllCompanies((data || []) as CompanyRow[]);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const statusLabel = (status: string | null) => {
    const s = String(status ?? "").trim().toUpperCase();
    if (s === "APPROVED") return <span className="text-green-600 font-medium">Aprobada</span>;
    if (s === "REJECTED") return <span className="text-red-600 font-medium">Rechazada</span>;
    return <span className="text-yellow-600 font-medium">Pendiente</span>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </Button>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="pending">
              Pendientes {pendingCompanies.length > 0 && `(${pendingCompanies.length})`}
            </TabsTrigger>
            <TabsTrigger value="processed">
              Verificadas / Rechazadas {processedCompanies.length > 0 && `(${processedCompanies.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Empresas pendientes de aprobación</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingCompanies.length === 0 ? (
                  <p>No hay empresas pendientes.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pr-3">Negocio</th>
                          <th className="text-left py-2 pr-3">Contacto</th>
                          <th className="text-left py-2 pr-3">Email</th>
                          <th className="text-left py-2 pr-3">Fecha</th>
                          <th className="text-left py-2">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingCompanies.map((company) => (
                          <tr key={company.id} className="border-b">
                            <td className="py-2 pr-3">{company.business_name}</td>
                            <td className="py-2 pr-3">{company.contact_person}</td>
                            <td className="py-2 pr-3">{company.email}</td>
                            <td className="py-2 pr-3">{new Date(company.created_at).toLocaleString()}</td>
                            <td className="py-2 flex gap-2">
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
                                onClick={() => handleReject(company)}
                                disabled={rejectingId === company.id || approvingId === company.id}
                              >
                                {rejectingId === company.id ? "Rechazando..." : "Rechazar"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processed">
            <Card>
              <CardHeader>
                <CardTitle>Empresas verificadas y rechazadas</CardTitle>
              </CardHeader>
              <CardContent>
                {processedCompanies.length === 0 ? (
                  <p>No hay empresas verificadas o rechazadas todavía.</p>
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
                        </tr>
                      </thead>
                      <tbody>
                        {processedCompanies.map((company) => (
                          <tr key={company.id} className="border-b">
                            <td className="py-2 pr-3">{company.business_name}</td>
                            <td className="py-2 pr-3">{company.contact_person}</td>
                            <td className="py-2 pr-3">{company.email}</td>
                            <td className="py-2 pr-3">{statusLabel(company.status)}</td>
                            <td className="py-2 pr-3">{new Date(company.created_at).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
