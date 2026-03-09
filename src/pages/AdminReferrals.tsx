import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Shield, Users, CheckCircle, XCircle, Gift, Clock, Loader2, Award,
} from "lucide-react";
import { useAdminReferrals, type AdminReferralFilter } from "@/hooks/useAdminReferrals";
import { REFERRAL_STATUS_LABELS, REWARD_STATUS_LABELS } from "@/lib/referrals/types";
import type { ReferralStatus, RewardStatus } from "@/lib/referrals/types";

const FILTER_LABELS: Record<AdminReferralFilter, string> = {
  all: "Todos",
  pending: "Pendientes",
  approved: "Aprobados",
  reward_pending: "Recompensa pendiente",
  reward_applied: "Recompensa aplicada",
};

export default function AdminReferrals() {
  const {
    referrals, stats, filter, setFilter, loading,
    updateReferralStatus, applyReward, markRewardEligible,
  } = useAdminReferrals();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<{ error: any }>, id: string, successMsg: string) => {
    setActionLoading(id);
    const { error } = await action();
    if (error) {
      toast.error("Error al realizar la acción");
      console.error(error);
    } else {
      toast.success(successMsg);
    }
    setActionLoading(null);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge variant="outline" className={map[status] || ""}>
        {REFERRAL_STATUS_LABELS[status as ReferralStatus] || status}
      </Badge>
    );
  };

  const rewardBadge = (status: string) => {
    const map: Record<string, string> = {
      none: "bg-muted text-muted-foreground",
      eligible: "bg-amber-100 text-amber-800 border-amber-200",
      applied: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    return (
      <Badge variant="outline" className={map[status] || ""}>
        {REWARD_STATUS_LABELS[status as RewardStatus] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Referidos de Empresas</h1>
              <p className="text-white/70">Gestiona referidos B2B y aplica recompensas</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-8 space-y-6">
        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">Total referidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-xs text-muted-foreground">Aprobados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.rewardsEligible}</p>
                  <p className="text-xs text-muted-foreground">Recompensas pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.rewardsApplied}</p>
                  <p className="text-xs text-muted-foreground">Recompensas aplicadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Listado de Referidos</CardTitle>
                <CardDescription>Gestiona el estado de cada referido y aplica recompensas</CardDescription>
              </div>
              <Select value={filter} onValueChange={(v) => setFilter(v as AdminReferralFilter)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FILTER_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No hay referidos con este filtro.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa invitadora</TableHead>
                      <TableHead>Empresa referida</TableHead>
                      <TableHead>Email referida</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado empresa</TableHead>
                      <TableHead>Estado referido</TableHead>
                      <TableHead>Recompensa</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell className="font-medium">
                          {ref.referrer_company?.business_name || "—"}
                        </TableCell>
                        <TableCell>
                          {ref.referred_company?.business_name || "Sin registrar"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {ref.referred_company?.email || ref.referred_email || "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ref.created_at).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell>
                          {ref.referred_company
                            ? statusBadge(ref.referred_company.status || "pending")
                            : <Badge variant="outline">—</Badge>
                          }
                        </TableCell>
                        <TableCell>{statusBadge(ref.status)}</TableCell>
                        <TableCell>{rewardBadge(ref.reward_status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {ref.status !== "approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-emerald-600 hover:text-emerald-700"
                                disabled={actionLoading === ref.id}
                                onClick={() => handleAction(
                                  () => updateReferralStatus(ref.id, "approved"),
                                  ref.id,
                                  "Referido aprobado"
                                )}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {ref.status !== "rejected" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                disabled={actionLoading === ref.id}
                                onClick={() => handleAction(
                                  () => updateReferralStatus(ref.id, "rejected"),
                                  ref.id,
                                  "Referido rechazado"
                                )}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            )}
                            {ref.reward_status === "none" && ref.status === "approved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-amber-600 hover:text-amber-700"
                                disabled={actionLoading === ref.id}
                                onClick={() => handleAction(
                                  () => markRewardEligible(ref.id),
                                  ref.id,
                                  "Recompensa marcada como elegible"
                                )}
                              >
                                <Gift className="w-4 h-4" />
                              </Button>
                            )}
                            {ref.reward_status === "eligible" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-primary border-primary/30"
                                disabled={actionLoading === ref.id}
                                onClick={() => handleAction(
                                  () => applyReward(ref.id),
                                  ref.id,
                                  "Recompensa aplicada — 1 mes gratis"
                                )}
                              >
                                <Award className="w-4 h-4 mr-1" />
                                Aplicar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
