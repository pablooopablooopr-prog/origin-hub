/**
 * B2B Referral System Types
 * 
 * Reward tiers:
 *   - 2 approved referrals  → 15% discount (one-time)
 *   - 5 approved referrals  → 1 month free
 *   - 10 approved referrals → 2 months free
 *   - 15 approved referrals → 3 months free (max)
 *
 * The 15% discount is awarded once at 2 approved. After that,
 * every block of 5 approved referrals earns 1 month free (max 3).
 */

export type ReferralStatus = 'pending' | 'approved' | 'rejected';
export type RewardStatus = 'none' | 'eligible' | 'applied';

export interface ReferralCode {
  id: string;
  company_id: string;
  code: string;
  created_at: string;
}

export interface CompanyReferral {
  id: string;
  referrer_company_id: string;
  referred_company_id: string | null;
  referred_email: string | null;
  referral_code: string;
  status: ReferralStatus;
  reward_status: RewardStatus;
  reward_applied_at: string | null;
  reward_applied_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  referred_company?: {
    business_name: string;
    status: string | null;
    email: string;
    created_at: string;
  } | null;
  referrer_company?: {
    business_name: string;
    email: string;
  } | null;
}

export interface ReferralStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  rewardsEligible: number;
  rewardsApplied: number;
}

// Thresholds
export const DISCOUNT_THRESHOLD = 2;   // 2 approved → 15% discount (one-time)
export const MONTH_FREE_BLOCK = 5;     // every 5 approved → 1 month free
export const MAX_FREE_MONTHS = 3;      // cap at 3 months free

/** @deprecated kept for backward compat; prefer MONTH_FREE_BLOCK */
export const REFERRAL_THRESHOLD = MONTH_FREE_BLOCK;

export const REFERRAL_STATUS_LABELS: Record<ReferralStatus, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
};

export const REWARD_STATUS_LABELS: Record<RewardStatus, string> = {
  none: 'Sin recompensa',
  eligible: 'Recompensa disponible',
  applied: 'Recompensa aplicada',
};

/**
 * Compute the current reward milestone for a given number of approved referrals.
 */
export function getReferralProgress(approved: number) {
  const hasDiscount = approved >= DISCOUNT_THRESHOLD;
  const freeMonthsEarned = Math.min(Math.floor(approved / MONTH_FREE_BLOCK), MAX_FREE_MONTHS);
  const maxedOut = freeMonthsEarned >= MAX_FREE_MONTHS;

  let nextMilestone: { target: number; reward: string } | null = null;
  let remaining = 0;

  if (!hasDiscount) {
    // Working toward 15% discount
    remaining = DISCOUNT_THRESHOLD - approved;
    nextMilestone = { target: DISCOUNT_THRESHOLD, reward: '15% de descuento' };
  } else if (!maxedOut) {
    // Working toward next month free
    const nextBlock = (freeMonthsEarned + 1) * MONTH_FREE_BLOCK;
    remaining = nextBlock - approved;
    nextMilestone = {
      target: nextBlock,
      reward: `${freeMonthsEarned + 1}º mes gratis`,
    };
  }

  return {
    hasDiscount,
    freeMonthsEarned,
    maxedOut,
    nextMilestone,
    remaining,
  };
}
