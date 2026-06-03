import { Check, Sparkles, Loader2, FileText } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  PLAN_LABELS,
  PLAN_PRICES,
  PLAN_TAGLINES,
  PLAN_FEATURES,
  type CompanyPlan,
} from "@/hooks/usePlan";

/**
 * Modal de upgrade tipo "claude/cursor/openai": el usuario nunca ve los precios
 * en el dashboard hasta que pulsa "Hacer upgrade". Aquí dentro se muestra la
 * comparativa rápida de los 3 planes con su precio /mes.
 *
 * El plan destacado se renombra a "Premium" en UI (incluye digitalización
 * de facturas conforme a la normativa antifraude). El ID interno sigue siendo
 * `destacado` para no romper queries existentes.
 */

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: CompanyPlan;
  companyId: string;
  onPlanChanged?: (newPlan: CompanyPlan) => void;
}

const PLAN_ORDER: CompanyPlan[] = ["basico", "standard", "destacado"];

const UpgradeModal = ({
  open,
  onOpenChange,
  currentPlan,
  companyId,
  onPlanChanged,
}: UpgradeModalProps) => {
  const [saving, setSaving] = useState<CompanyPlan | null>(null);

  const handleSelectPlan = async (newPlan: CompanyPlan) => {
    if (newPlan === currentPlan) {
      onOpenChange(false);
      return;
    }
    setSaving(newPlan);

    const { error } = await supabase
      .from("companies")
      .update({ plan: newPlan })
      .eq("id", companyId);

    setSaving(null);

    if (error) {
      toast.error("No se pudo cambiar el plan: " + error.message);
      return;
    }

    toast.success(`Plan actualizado a ${PLAN_LABELS[newPlan]}`);
    onOpenChange(false);
    onPlanChanged?.(newPlan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Mejora tu plan
          </DialogTitle>
          <DialogDescription>
            Elige el plan que mejor se adapta a tu negocio. El cambio es
            inmediato y puedes volver al anterior cuando quieras.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 py-2">
          {PLAN_ORDER.map((id) => {
            const isCurrent = id === currentPlan;
            const isPremium = id === "destacado";
            const isStandard = id === "standard";
            return (
              <Card
                key={id}
                className={`relative flex flex-col ${
                  isPremium
                    ? "border-2 border-amber-300/70 bg-gradient-to-b from-amber-50/40 to-background"
                    : isStandard
                    ? "border-2 border-primary"
                    : "border border-border"
                }`}
              >
                {isStandard && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    Recomendado
                  </Badge>
                )}
                <CardContent className="p-5 space-y-4 flex flex-col flex-1">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {PLAN_LABELS[id]}
                    </h3>
                    <p className="text-3xl font-bold mt-1">
                      {PLAN_PRICES[id]}€
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}
                        /mes
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 min-h-[2.5rem]">
                      {PLAN_TAGLINES[id]}
                    </p>
                  </div>
                  <Separator />
                  <ul className="space-y-2 text-sm flex-1">
                    {PLAN_FEATURES[id].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check
                          className={`w-4 h-4 mt-0.5 shrink-0 ${
                            isPremium ? "text-amber-600" : "text-primary"
                          }`}
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      isPremium
                        ? "bg-amber-600 hover:bg-amber-700 text-white"
                        : ""
                    }`}
                    variant={isCurrent ? "outline" : "default"}
                    disabled={isCurrent || saving !== null}
                    onClick={() => handleSelectPlan(id)}
                  >
                    {saving === id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Cambiando...
                      </>
                    ) : isCurrent ? (
                      "Plan actual"
                    ) : (
                      `Elegir ${PLAN_LABELS[id]}`
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
