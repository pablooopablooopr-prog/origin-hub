import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  CreditCard,
  BarChart3,
  MessageCircle,
  Eye,
  LogOut,
  Loader2,
  ArrowUpRight,
  Settings,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { signOutAndCleanup } from "@/lib/auth/signOut";
import { usePlan, PLAN_LABELS } from "@/hooks/usePlan";

import TabMiFicha from "@/components/company-dashboard/TabMiFicha";
import TabDatosYPlan from "@/components/company-dashboard/TabDatosYPlan";
import TabMiSpotlight from "@/components/company-dashboard/TabMiSpotlight";
import TabContactosB2B from "@/components/company-dashboard/TabContactosB2B";
import TabConfiguracion from "@/components/company-dashboard/TabConfiguracion";
import UpgradeModal from "@/components/company-dashboard/UpgradeModal";

/**
 * Dashboard empresarial.
 *
 * URL params: ?tab=ficha|plan|spotlight|b2b|config
 * `spotlight` se conserva internamente para no romper deep-links antiguos,
 * pero se muestra como "Mis estadísticas".
 */

interface Company {
  id: string;
  business_name: string;
  slug: string | null;
  status: string | null;
  email: string | null;
  business_type: string | null;
  description: string | null;
  locality: string | null;
  plan_expires_at: string | null;
}

const VALID_TABS = ["ficha", "plan", "spotlight", "b2b", "config"] as const;
type TabId = (typeof VALID_TABS)[number];

const isValidTab = (s: string | null): s is TabId =>
  s !== null && (VALID_TABS as readonly string[]).includes(s);

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { plan: currentPlan, refresh: refreshPlan } = usePlan();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const tabFromUrl = searchParams.get("tab");
  const activeTab: TabId = isValidTab(tabFromUrl) ? tabFromUrl : "ficha";

  const setActiveTab = (tab: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { replace: true });
  };

  const loadAll = async (userId: string) => {
    // Empresa
    const { data: comp } = await supabase
      .from("companies")
      .select(
        "id, business_name, slug, status, email, business_type, description, locality, plan_expires_at"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (comp) {
      setCompany(comp as Company);

      // Total views (acumulado en pack_analytics — proxy de visibilidad)
      const { data: analytics } = await supabase
        .from("pack_analytics")
        .select("views_count")
        .in(
          "pack_id",
          (
            await supabase
              .from("company_packs")
              .select("id")
              .eq("company_id", comp.id)
          ).data?.map((p: { id: string }) => p.id) ?? []
        );

      const sum = (analytics ?? []).reduce(
        (acc: number, a: { views_count: number | null }) =>
          acc + (a.views_count ?? 0),
        0
      );
      setTotalViews(sum);
    }
  };

  useEffect(() => {
    let alive = true;

    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!alive) return;

      if (!user) {
        navigate("/company-auth", { replace: true });
        return;
      }

      setAuthUser(user);
      await loadAll(user.id);
      if (alive) setLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!alive) return;
      if (!session?.user) {
        navigate("/company-auth", { replace: true });
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await signOutAndCleanup();
    navigate("/", { replace: true });
  };

  const handleViewPublicPage = () => {
    if (!company) return;
    navigate(`/negocio/${company.slug ?? company.id}`);
  };

  const refreshCompany = async () => {
    if (!authUser) return;
    await loadAll(authUser.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  if (!company || !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-3">
            <h2 className="text-lg font-semibold">No tienes empresa asociada</h2>
            <p className="text-sm text-muted-foreground">
              Tu cuenta no tiene una empresa registrada. Contacta con soporte.
            </p>
            <Button onClick={handleSignOut} variant="outline">
              Cerrar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f0e5] text-[#2a1c10]">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        {/* Header */}
        <header className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Dashboard empresarial
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {company.business_name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {company.status === "approved" && (
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px]">
                  Verificada
                </Badge>
              )}
              {company.status === "pending" && (
                <Badge variant="outline" className="text-[10px]">
                  Pendiente
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`text-[10px] ${
                  currentPlan === "destacado"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : currentPlan === "standard"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : ""
                }`}
              >
                Plan {PLAN_LABELS[currentPlan]}
                {currentPlan === "destacado" && (
                  <FileText className="w-2.5 h-2.5 ml-1" />
                )}
              </Badge>
              {company.business_type && <span>{company.business_type}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentPlan !== "destacado" && (
              <Button
                size="sm"
                onClick={() => setShowUpgrade(true)}
                className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              >
                <ArrowUpRight className="w-4 h-4" />
                Hacer upgrade
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewPublicPage}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              Ver mi página pública
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="ficha" className="gap-1.5">
              <User className="w-3.5 h-3.5" />
              Mi ficha
            </TabsTrigger>
            <TabsTrigger value="plan" className="gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Datos y plan
            </TabsTrigger>
            <TabsTrigger value="spotlight" className="gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Mis estadísticas
            </TabsTrigger>
            <TabsTrigger value="b2b" className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Contactos B2B
            </TabsTrigger>
            <TabsTrigger value="config" className="gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ficha">
            <TabMiFicha companyId={company.id} onSaved={refreshCompany} />
          </TabsContent>

          <TabsContent value="plan">
            <TabDatosYPlan
              companyId={company.id}
              status={company.status}
              planExpiresAt={company.plan_expires_at}
            />
          </TabsContent>

          <TabsContent value="spotlight">
            <TabMiSpotlight
              companyId={company.id}
              companyName={company.business_name}
              companyLocality={company.locality}
              companyDescription={company.description}
              companyBusinessType={company.business_type}
              totalViews={totalViews}
            />
          </TabsContent>

          <TabsContent value="b2b">
            <TabContactosB2B />
          </TabsContent>

          <TabsContent value="config">
            <TabConfiguracion email={authUser.email ?? company.email ?? ""} />
          </TabsContent>
        </Tabs>

        {/* Modal de upgrade accesible desde el header */}
        <UpgradeModal
          open={showUpgrade}
          onOpenChange={setShowUpgrade}
          currentPlan={currentPlan}
          companyId={company.id}
          onPlanChanged={() => void refreshPlan()}
        />
      </div>
    </div>
  );
};

export default CompanyDashboard;
