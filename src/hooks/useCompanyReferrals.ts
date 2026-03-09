import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { CompanyReferral, ReferralCode, ReferralStats } from "@/lib/referrals/types";
import { REFERRAL_THRESHOLD } from "@/lib/referrals/types";

/**
 * Hook for the company-side referral dashboard.
 * Loads the company's referral code, referral list, and stats.
 */
export function useCompanyReferrals(companyId: string | null) {
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<CompanyReferral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    total: 0, pending: 0, approved: 0, rejected: 0,
    rewardsEligible: 0, rewardsApplied: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);

    try {
      // Ensure referral code exists (calls security definer function)
      const { data: codeResult } = await supabase.rpc("ensure_referral_code", {
        p_company_id: companyId,
      });

      if (codeResult) {
        // Fetch the full code record
        const { data: codeRow } = await supabase
          .from("company_referral_codes")
          .select("*")
          .eq("company_id", companyId)
          .maybeSingle();
        setReferralCode(codeRow as ReferralCode | null);
      }

      // Fetch referrals
      const { data: referralRows } = await supabase
        .from("company_referrals")
        .select(`
          *,
          referred_company:companies!company_referrals_referred_company_id_fkey(
            business_name, status, email, created_at
          )
        `)
        .eq("referrer_company_id", companyId)
        .order("created_at", { ascending: false });

      const mapped = (referralRows || []).map((r: any) => ({
        ...r,
        referred_company: Array.isArray(r.referred_company)
          ? r.referred_company[0] ?? null
          : r.referred_company,
      })) as CompanyReferral[];

      setReferrals(mapped);

      // Compute stats
      const total = mapped.length;
      const pending = mapped.filter(r => r.status === "pending").length;
      const approved = mapped.filter(r => r.status === "approved").length;
      const rejected = mapped.filter(r => r.status === "rejected").length;
      const rewardsApplied = mapped.filter(r => r.reward_status === "applied").length;
      const rewardsEligible = Math.floor(approved / REFERRAL_THRESHOLD) - rewardsApplied;

      setStats({
        total, pending, approved, rejected,
        rewardsEligible: Math.max(0, rewardsEligible),
        rewardsApplied,
      });
    } catch (err) {
      console.error("[Referrals] Error loading:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const referralLink = referralCode
    ? `${window.location.origin}/company-auth?tab=signup&ref=${referralCode.code}`
    : null;

  return { referralCode, referralLink, referrals, stats, loading, refetch: fetchData };
}
