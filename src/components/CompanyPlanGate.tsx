import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RouteLoader from "@/components/RouteLoader";
import {
  usePlan,
  PLAN_LABELS,
  PLAN_PRICES,
  type CompanyPlan,
} from "@/hooks/usePlan";

interface CompanyPlanGateProps {
  /** Plan mínimo requerido. */
  required: CompanyPlan;
  /** Contenido protegido. */
  children: ReactNode;
  /**
   * Modo de bloqueo:
   *   - "upgrade" (default): muestra mensaje y botón para mejorar plan
   *   - "hide": no muestra nada (oculta completamente sin avisar)
   */
  mode?: "upgrade" | "hide";
  /** Mensaje custom opcional. */
  upgradeMessage?: string;
}

/**
 * Gate por plan empresarial.
 *
 * Uso:
 *   <CompanyPlanGate required="standard">
 *     <PestañaB2B />
 *   </CompanyPlanGate>
 *
 * Si el usuario tiene un plan inferior al requerido, muestra un mensaje
 * de upgrade con CTA hacia /company-dashboard?tab=plan (donde se cambia
 * el plan via Stripe).
 */
const CompanyPlanGate = ({
  required,
  children,
  mode = "upgrade",
  upgradeMessage,
}: CompanyPlanGateProps) => {
  const { isLoading, hasAtLeast, plan } = usePlan();

  if (isLoading) {
    return <RouteLoader label="Verificando tu plan..." />;
  }

  if (hasAtLeast(required)) {
    return <>{children}</>;
  }

  if (mode === "hide") {
    return null;
  }

  return (
    <Card className="border-dashed border-2">
      <CardContent className="p-8 md:p-10 text-center space-y-5">
        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-primary" />
        </div>

        <div className="space-y-2">
          <Badge variant="outline" className="gap-1.5">
            <Sparkles className="w-3 h-3" />
            Plan {PLAN_LABELS[required]} requerido
          </Badge>
          <h3 className="text-xl font-semibold tracking-tight">
            Esta sección está disponible con el plan {PLAN_LABELS[required]}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {upgradeMessage ??
              `Estás en el plan ${PLAN_LABELS[plan]}. Mejora a ${PLAN_LABELS[required]} (${PLAN_PRICES[required]}€/mes) para desbloquear este contenido.`}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/company-dashboard?tab=plan">
            <Button>Mejorar mi plan</Button>
          </Link>
          <Link to="/soy-empresa">
            <Button variant="outline">Ver planes</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyPlanGate;
