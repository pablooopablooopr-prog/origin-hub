import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, Link2, Users, Clock, CheckCircle, Gift, Loader2 } from "lucide-react";
import { useCompanyReferrals } from "@/hooks/useCompanyReferrals";
import { REFERRAL_THRESHOLD, REFERRAL_STATUS_LABELS } from "@/lib/referrals/types";
import type { ReferralStatus } from "@/lib/referrals/types";

interface Props {
  companyId: string;
}

export default function CompanyReferralsTab({ companyId }: Props) {
  const { referralCode, referralLink, referrals, stats, loading } = useCompanyReferrals(companyId);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado al portapapeles`);
  };

  const remaining = Math.max(0, REFERRAL_THRESHOLD - (stats.approved % REFERRAL_THRESHOLD));
  const hasReward = stats.rewardsEligible > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusBadge = (status: ReferralStatus) => {
    const variants: Record<ReferralStatus, string> = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge variant="outline" className={variants[status]}>
        {REFERRAL_STATUS_LABELS[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Program explanation */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="w-5 h-5 text-primary" />
            Programa de Referidos B2B
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Invita a otras empresas y productores a unirse a ORIGEN.
            Por cada {REFERRAL_THRESHOLD} empresas aprobadas que lleguen con tu código,
            recibirás <strong>1 mes gratis</strong> de suscripción. Las recompensas son
            revisadas y aplicadas por el equipo de ORIGEN.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Code & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tu código de referido</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <code className="flex-1 text-2xl font-mono font-bold tracking-widest text-primary bg-primary/5 rounded-lg px-4 py-3 text-center select-all">
              {referralCode?.code || "—"}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={() => referralCode && copyToClipboard(referralCode.code, "Código")}
              disabled={!referralCode}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Enlace de invitación</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <div className="flex-1 text-sm font-mono bg-muted/50 rounded-lg px-4 py-3 truncate select-all">
              {referralLink || "—"}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => referralLink && copyToClipboard(referralLink, "Enlace")}
              disabled={!referralLink}
            >
              <Link2 className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Invitadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-xs text-muted-foreground">Aprobadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Gift className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-2xl font-bold">{stats.rewardsApplied}</p>
            <p className="text-xs text-muted-foreground">Recompensas</p>
          </CardContent>
        </Card>
      </div>

      {/* Reward progress */}
      <Card className={hasReward ? "border-emerald-300 bg-emerald-50/50" : ""}>
        <CardContent className="py-5">
          {hasReward ? (
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-800">
                  ¡Tienes {stats.rewardsEligible} recompensa{stats.rewardsEligible > 1 ? "s" : ""} disponible{stats.rewardsEligible > 1 ? "s" : ""}!
                </p>
                <p className="text-sm text-emerald-700">
                  El equipo de ORIGEN aplicará tu mes gratis próximamente.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  Te {remaining === 1 ? "falta" : "faltan"}{" "}
                  <span className="text-primary font-bold">{remaining}</span>{" "}
                  empresa{remaining !== 1 ? "s" : ""} aprobada{remaining !== 1 ? "s" : ""} para conseguir 1 mes gratis
                </p>
                <p className="text-sm text-muted-foreground">
                  Comparte tu código con otros productores y negocios.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Referrals list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Empresas referidas</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>Aún no has referido a ninguna empresa.</p>
              <p className="text-sm mt-1">Comparte tu código para empezar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref) => (
                <div
                  key={ref.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">
                      {ref.referred_company?.business_name || ref.referred_email || "Empresa sin registrar"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString("es-ES", {
                        day: "numeric", month: "short", year: "numeric"
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {statusBadge(ref.status as ReferralStatus)}
                    {ref.reward_status === "applied" && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        🎁 Aplicada
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
