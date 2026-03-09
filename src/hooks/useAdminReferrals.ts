import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyReferral, ReferralStats } from "@/lib/referrals/types";
import { REFERRAL_THRESHOLD } from "@/lib/referrals/types";

export type AdminReferralFilter = "all" | "pending" | "approved" | "reward_pending" | "reward_applied";

/**
 * Hook for the admin referral management page.
 */
export function useAdminReferrals() {
  const [referrals, setReferrals] = useState<CompanyReferral[]>([]);
  const [filter, setFilter] = useState<AdminReferralFilter>("all");
  const [stats, setStats] = useState<ReferralStats>({
    total: 0, pending: 0, approved: 0, rejected: 0,
    rewardsEligible: 0, rewardsApplied: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: rows } = await supabase
        .from("company_referrals")
        .select(`
          *,
          referrer_company:companies!company_referrals_referrer_company_id_fkey(
            business_name, email
          ),
          referred_company:companies!company_referrals_referred_company_id_fkey(
            business_name, status, email, created_at
          )
        `)
        .order("created_at", { ascending: false });

      const mapped = (rows || []).map((r: any) => ({
        ...r,
        referrer_company: Array.isArray(r.referrer_company)
          ? r.referrer_company[0] ?? null
          : r.referrer_company,
        referred_company: Array.isArray(r.referred_company)
          ? r.referred_company[0] ?? null
          : r.referred_company,
      })) as CompanyReferral[];

      setReferrals(mapped);

      const total = mapped.length;
      const pending = mapped.filter(r => r.status === "pending").length;
      const approved = mapped.filter(r => r.status === "approved").length;
      const rejected = mapped.filter(r => r.status === "rejected").length;
      const rewardsApplied = mapped.filter(r => r.reward_status === "applied").length;
      const rewardsEligible = mapped.filter(r => r.reward_status === "eligible").length;

      setStats({ total, pending, approved, rejected, rewardsEligible, rewardsApplied });
    } catch (err) {
      console.error("[AdminReferrals] Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateReferralStatus = async (referralId: string, status: string) => {
    const { error } = await supabase
      .from("company_referrals")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", referralId);
    if (!error) await fetchData();
    return { error };
  };

  const applyReward = async (referralId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("company_referrals")
      .update({
        reward_status: "applied",
        reward_applied_at: new Date().toISOString(),
        reward_applied_by: user?.id || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", referralId);
    if (!error) await fetchData();
    return { error };
  };

  const markRewardEligible = async (referralId: string) => {
    const { error } = await supabase
      .from("company_referrals")
      .update({
        reward_status: "eligible",
        updated_at: new Date().toISOString(),
      })
      .eq("id", referralId);
    if (!error) await fetchData();
    return { error };
  };

  const filtered = referrals.filter(r => {
    if (filter === "all") return true;
    if (filter === "pending") return r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    if (filter === "reward_pending") return r.reward_status === "eligible";
    if (filter === "reward_applied") return r.reward_status === "applied";
    return true;
  });

  return {
    referrals: filtered,
    allReferrals: referrals,
    stats,
    filter,
    setFilter,
    loading,
    updateReferralStatus,
    applyReward,
    markRewardEligible,
    refetch: fetchData,
  };
}
