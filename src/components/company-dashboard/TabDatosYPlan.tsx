import { useEffect, useState } from "react";
import { Check, CreditCard, Sparkles, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  usePlan,
  PLAN_LABELS,
  PLAN_PRICES,
  type CompanyPlan,
} from "@/hooks/usePlan";

/**
 * PESTAÑA 2: MIS DATOS Y PLAN
 *
 *  - Plan actual con badge visual
 *  - Próxima facturación
 *  - Cambiar plan (modal con 3 planes y CTA Stripe — placeholder hasta FASE 5)
 *  - Cancelar suscripción
 *  - Historial de facturas (vacío por ahora — Stripe en FASE 5)
 *  - Estado de verificación
 */

interface TabDatosYPlanProps {
  companyId: string;
  /** status de la empresa (pending/approved/rejected) */
  status: string | null;
  /** Plan expiry desde companies.plan_expires_at */
  planExpiresAt?: string | null;
}

const PLANS: {
  id: CompanyPlan;
  description: string;
  features: string[];
  highlighted?: boolean;
}[] = [
  {
    id: "basico",
    description: "Empieza a aparecer en ORIGEN.",
    features: [
      "Dashboard básico",
      "Aparece en spotlight rotatorio",
      "Mapa B2B en modo lectura",
      "Página pública de tu empresa",
    ],
  },
  {
    id: "standard",
    description: "Conecta con restaurantes y rutas.",
    features: [
      "Todo lo del Básico",
      "Aparece en rutas estacionales",
      "Mensajes B2B con restaurantes",
      "Estadísticas detalladas",
    ],
    highlighted: true,
  },
  {
    id: "destacado",
    description: "Máxima visibilidad y prioridad.",
    features: [
      "Todo lo del Standard",
      "Pin dorado en mapa",
      "Borde dorado en spotlight (peso x2)",
      "Top de la newsletter mensual",
    ],
  },
];

const formatDate = (iso: string | null | undefined): string | null => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const TabDatosYPlan = ({ companyId, status, planExpiresAt }: TabDatosYPlanProps) => {
  const { plan, isLoading, refresh } = usePlan();
  const [showChangeDialog, setShowChangeDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);

  const handleChangePlan = async (newPlan: CompanyPlan) => {
    if (newPlan === plan) {
      setShowChangeDialog(false);
      return;
    }
    setSavingPlan(true);

    // FASE 5: aquí abrirá Stripe Checkout. Por ahora actualiza el plan local
    // para que el usuario pueda ver cómo cambia el dashboard según el plan.
    const { error } = await supabase
      .from("companies")
      .update({ plan: newPlan })
      .eq("id", companyId);

    setSavingPlan(false);

    if (error) {
      toast.error("No se pudo cambiar el plan: " + error.message);
      return;
    }

    toast.success(`Plan actualizado a ${PLAN_LABELS[newPlan]}`);
    setShowChangeDialog(false);
    await refresh();
  };

  const handleCancelSubscription = async () => {
    setSavingPlan(true);
    // FASE 5: cancela en Stripe via edge function. Por ahora, vuelve a básico.
    const { error } = await supabase
      .from("companies")
      .update({ plan: "basico" })
      .eq("id", companyId);
    setSavingPlan(false);

    if (error) {
      toast.error("No se pudo cancelar: " + error.message);
      return;
    }

    toast.success("Suscripción cancelada. Has vuelto al plan Básico.");
    setShowCancelDialog(false);
    await refresh();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isVerified = status === "approved";
  const nextBillingLabel = formatDate(planExpiresAt);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Mis datos y plan</h2>
        <p className="text-sm text-muted-foreground">
          Tu suscripción actual, próxima facturación y verificación de cuenta.
        </p>
      </div>

      {/* Estado plan + verificación */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Plan actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                className={
                  plan === "destacado"
                    ? "bg-amber-100 text-amber-900 border-amber-300"
                    : plan === "standard"
                    ? "bg-primary/10 text-primary border-primary/30"
                    : ""
                }
                variant="outline"
              >
                {PLAN_LABELS[plan]}
              </Badge>
              <span className="text-2xl font-bold">{PLAN_PRICES[plan]}€</span>
              <span className="text-sm text-muted-foreground">/mes</span>
            </div>
            {nextBillingLabel && (
              <p className="text-sm text-muted-foreground">
                Próxima facturación:{" "}
                <span className="font-medium text-foreground">{nextBillingLabel}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setShowChangeDialog(true)} className="gap-2">
                <CreditCard className="w-4 h-4" />
                Cambiar de plan
              </Button>
              {plan !== "basico" && (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                >
                  Cancelar suscripción
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Verificación de cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {isVerified ? (
                <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 gap-1">
                  <Check className="w-3 h-3" />
                  Verificado
                </Badge>
              ) : status === "pending" ? (
                <Badge variant="outline">Pendiente de revisión</Badge>
              ) : (
                <Badge variant="destructive">No verificado</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {isVerified
                ? "Tu cuenta ha sido verificada por el equipo de ORIGEN."
                : status === "pending"
                ? "Estamos revisando tu solicitud. Recibirás un email cuando se apruebe."
                : "Tu cuenta requiere revisión adicional."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historial facturas (placeholder Stripe) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de facturas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Las facturas de Stripe aparecerán aquí cuando se active el sistema
            de pagos real (FASE 5). Por ahora la plataforma opera en modo
            demostración.
          </p>
        </CardContent>
      </Card>

      {/* DIALOG CAMBIAR PLAN */}
      <Dialog open={showChangeDialog} onOpenChange={setShowChangeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Cambiar de plan</DialogTitle>
            <DialogDescription>
              Elige el plan que mejor se adapte a tu negocio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-3 gap-4 py-4">
            {PLANS.map((p) => {
              const isCurrent = p.id === plan;
              return (
                <Card
                  key={p.id}
                  className={`relative ${
                    p.highlighted ? "border-2 border-primary" : ""
                  }`}
                >
                  {p.highlighted && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                      Recomendado
                    </Badge>
                  )}
                  <CardContent className="p-5 space-y-4">
                    <div>
                      <h3 className="font-semibold">{PLAN_LABELS[p.id]}</h3>
                      <p className="text-2xl font-bold mt-1">
                        {PLAN_PRICES[p.id]}€
                        <span className="text-sm font-normal text-muted-foreground">
                          /mes
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {p.description}
                      </p>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={isCurrent || savingPlan}
                      onClick={() => handleChangePlan(p.id)}
                    >
                      {isCurrent ? "Plan actual" : `Elegir ${PLAN_LABELS[p.id]}`}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground italic">
            En modo demostración, el plan cambia inmediatamente sin cobro.
            Cuando se active Stripe (FASE 5), se abrirá el checkout real.
          </p>
        </DialogContent>
      </Dialog>

      {/* DIALOG CANCELAR */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
            <DialogDescription>
              Volverás al plan Básico (gratuito) y perderás acceso a las
              funciones de tu plan actual hasta que vuelvas a suscribirte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Mantener mi plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={savingPlan}
            >
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TabDatosYPlan;
