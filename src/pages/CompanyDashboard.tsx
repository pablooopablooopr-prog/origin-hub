import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  User,
  CreditCard,
  Sparkles,
  MessageCircle,
  Compass,
  Eye,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { User as AuthUser } from "@supabase/supabase-js";
import { signOutAndCleanup } from "@/lib/auth/signOut";

import TabMiFicha from "@/components/company-dashboard/TabMiFicha";
import TabDatosYPlan from "@/components/company-dashboard/TabDatosYPlan";
import TabMiSpotlight from "@/components/company-dashboard/TabMiSpotlight";
import TabContactosB2B from "@/components/company-dashboard/TabContactosB2B";
import TabMisRutas from "@/components/company-dashboard/TabMisRutas";

/**
 * DASHBOARD EMPRESA — rediseño FASE 4
 *
 * 5 pestañas según briefing:
 *   1. Mi Ficha
 *   2. Mis Datos y Plan
 *   3. Mi Spotlight
 *   4. Contactos B2B (gated standard)
 *   5. Mis Rutas (gated standard)
 *
 * + accesos directos en header:
 *   - Ver mi página pública
 *   - Cerrar sesión
 *
 * URL params: ?tab=ficha|plan|spotlight|b2b|rutas (deep-link)
 *
 * Rotated OUT (no eliminadas, sólo no visibles):
 *   - Mis Packs (sistema deprecado FASE 3)
 *   - Estadísticas (integrada en Mi Spotlight)
 *   - Referidos (no en briefing FASE 4 - se podrá restaurar si se decide)
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

const VALID_TABS = ["ficha", "plan", "spotlight", "b2b", "rutas"] as const;
type TabId = (typeof VALID_TABS)[number];

const isValidTab = (s: string | null): s is TabId =>
  s !== null && (VALID_TABS as readonly string[]).includes(s);

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

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
          ).data?.map((p: any) => p.id) ?? []
        );

      const sum = (analytics ?? []).reduce(
        (acc: number, a: any) => acc + (a.views_count ?? 0),
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
              {company.business_type && <span>{company.business_type}</span>}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
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
              <Sparkles className="w-3.5 h-3.5" />
              Mi spotlight
            </TabsTrigger>
            <TabsTrigger value="b2b" className="gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Contactos B2B
            </TabsTrigger>
            <TabsTrigger value="rutas" className="gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Mis rutas
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

          <TabsContent value="rutas">
            <TabMisRutas userId={authUser.id} companyId={company.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDashboard;
