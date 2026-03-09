/**
 * B2B Referral System Types
 * 
 * Completely separate from pack checkout, cart, or promotional codes.
 * This is a company-to-company referral system for ORIGEN subscriptions.
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
  // Joined fields
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

export const REFERRAL_THRESHOLD = 3; // Companies needed for 1 month free

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
