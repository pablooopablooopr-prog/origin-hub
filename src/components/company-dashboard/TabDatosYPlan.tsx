import { useState } from "react";
import {
  Check,
  Sparkles,
  ShieldCheck,
  Loader2,
  ArrowUpRight,
  FileText,
  MapPin,
  Camera,
  Building2,
  Download,
  History,
} from "lucide-react";
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
import { usePlan, PLAN_LABELS, PLAN_TAGLINES } from "@/hooks/usePlan";
import UpgradeModal from "./UpgradeModal";

/**
 * PESTAÑA 2: MIS DATOS Y PLAN
 *
 * Estilo "AI app": el precio NUNCA es visible en el dashboard. Para verlo el
 * usuario pulsa "Hacer upgrade", se abre el modal y ahí ve la comparativa
 * con precios.
 *
 *  - Estado plan actual (label + tagline, sin €)
 *  - CTA "Hacer upgrade" → UpgradeModal
 *  - Cancelar suscripción
 *  - Historial de planes (timeline)
 *  - Verificación granular: CIF · fotos · ubicación
 *  - Historial de facturas (placeholder Stripe)
 */

interface TabDatosYPlanProps {
  companyId: string;
  status: string | null;
  planExpiresAt?: string | null;
}

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

const PLAN_BADGE_CLASS: Record<string, string> = {
  basico: "bg-muted text-muted-foreground border-border",
  standard: "bg-primary/10 text-primary border-primary/30",
  destacado: "bg-amber-100 text-amber-900 border-amber-300",
};

const TabDatosYPlan = ({ companyId, status, planExpiresAt }: TabDatosYPlanProps) => {
  const { plan, isLoading, refresh } = usePlan();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    const { error } = await supabase
      .from("companies")
      .update({ plan: "basico" })
      .eq("id", companyId);
    setCancelling(false);

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
  const isPremium = plan === "destacado";

  // Timeline de planes (placeholder hasta tener tabla plan_history)
  const planHistory = [
    { period: "Plan actual", label: PLAN_LABELS[plan], current: true },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Mis datos y plan</h2>
        <p className="text-sm text-muted-foreground">
          Tu suscripción actual, verificación y facturas. Para ver precios y
          mejorar tu plan, pulsa <strong>"Hacer upgrade"</strong>.
        </p>
      </div>

      {/* Plan actual + Upgrade CTA + Verificación granular */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Plan actual */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Tu plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className={`text-sm px-3 py-1 ${PLAN_BADGE_CLASS[plan]}`}
              >
                {PLAN_LABELS[plan]}
              </Badge>
              {isPremium && (
                <Badge className="bg-amber-50 text-amber-900 border-amber-300 gap-1 text-[10px] uppercase tracking-wider">
                  <FileText className="w-3 h-3" />
                  Digitalización facturas
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {PLAN_TAGLINES[plan]}
            </p>
            {nextBillingLabel && plan !== "basico" && (
              <p className="text-sm text-muted-foreground">
                Próxima renovación:{" "}
                <span className="font-medium text-foreground">
                  {nextBillingLabel}
                </span>
              </p>
            )}
            <Separator />
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md"
              >
                <ArrowUpRight className="w-4 h-4" />
                Hacer upgrade
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

        {/* Verificación granular */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Verificación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <VerificationRow
              icon={<Building2 className="w-3.5 h-3.5" />}
              label="CIF / NIF"
              state={isVerified ? "ok" : "pending"}
            />
            <VerificationRow
              icon={<Camera className="w-3.5 h-3.5" />}
              label="Fotos"
              state={isVerified ? "ok" : "pending"}
            />
            <VerificationRow
              icon={<MapPin className="w-3.5 h-3.5" />}
              label="Ubicación"
              state={isVerified ? "ok" : "pending"}
            />
            <p className="text-xs text-muted-foreground pt-2 leading-relaxed">
              {isVerified
                ? "Tu cuenta está verificada por el equipo de ORIGEN."
                : "Estamos revisando tu solicitud. Recibirás un email cuando se apruebe."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historial de planes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <History className="w-4 h-4" />
            Historial de planes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {planHistory.map((entry, i) => (
              <li key={i} className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    entry.current ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">
                    <span className="text-muted-foreground">{entry.period}: </span>
                    <span className="font-medium">{entry.label}</span>
                  </span>
                  {entry.current && (
                    <Badge variant="outline" className="text-[10px]">
                      Actual
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground italic mt-4">
            Cuando cambies de plan, verás aquí cada periodo con su fecha y plan
            asociado.
          </p>
        </CardContent>
      </Card>

      {/* Historial de facturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Historial de facturas</CardTitle>
          <Button variant="outline" size="sm" disabled className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Descargar últimas
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Las facturas de Stripe aparecerán aquí cuando se active el sistema
            de pagos real. Por ahora la plataforma opera en modo demostración.
          </p>
        </CardContent>
      </Card>

      {/* Modal de upgrade — precios SOLO aquí dentro */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        currentPlan={plan}
        companyId={companyId}
        onPlanChanged={() => void refresh()}
      />

      {/* Dialog cancelar */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar suscripción?</DialogTitle>
            <DialogDescription>
              Volverás al plan Básico y perderás acceso a las funciones de tu
              plan actual hasta que vuelvas a suscribirte.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Mantener mi plan
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? "Cancelando..." : "Sí, cancelar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface VerificationRowProps {
  icon: React.ReactNode;
  label: string;
  state: "ok" | "pending" | "error";
}

const VerificationRow = ({ icon, label, state }: VerificationRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground">{icon}</span>
      <span>{label}</span>
    </div>
    {state === "ok" ? (
      <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 gap-1 text-[10px]">
        <Check className="w-3 h-3" />
        Completado
      </Badge>
    ) : state === "pending" ? (
      <Badge variant="outline" className="text-[10px]">
        Pendiente
      </Badge>
    ) : (
      <Badge variant="destructive" className="text-[10px]">
        Revisar
      </Badge>
    )}
  </div>
);

export default TabDatosYPlan;
