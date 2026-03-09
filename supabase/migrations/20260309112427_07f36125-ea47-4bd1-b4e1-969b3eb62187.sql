
-- B2B Referral system tables

-- 1. Referral codes per company
CREATE TABLE public.company_referral_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id)
);

ALTER TABLE public.company_referral_codes ENABLE ROW LEVEL SECURITY;

-- Company can read own code
CREATE POLICY "company_referral_codes_owner_select"
ON public.company_referral_codes
FOR SELECT TO authenticated
USING (
  public.current_user_owns_company(company_id)
  OR public.is_admin()
);

-- Admin can manage all
CREATE POLICY "company_referral_codes_admin_all"
ON public.company_referral_codes
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role for auto-creation
CREATE POLICY "company_referral_codes_service_all"
ON public.company_referral_codes
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- 2. Referral records
CREATE TABLE public.company_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  referred_company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  referred_email text,
  referral_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reward_status text NOT NULL DEFAULT 'none',
  reward_applied_at timestamptz,
  reward_applied_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.company_referrals ENABLE ROW LEVEL SECURITY;

-- Company can see own referrals (as referrer)
CREATE POLICY "company_referrals_owner_select"
ON public.company_referrals
FOR SELECT TO authenticated
USING (
  public.current_user_owns_company(referrer_company_id)
  OR public.is_admin()
);

-- Admin can manage all
CREATE POLICY "company_referrals_admin_all"
ON public.company_referrals
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Service role
CREATE POLICY "company_referrals_service_all"
ON public.company_referrals
FOR ALL TO service_role
USING (true)
WITH CHECK (true);

-- Index for lookups
CREATE INDEX idx_company_referrals_referrer ON public.company_referrals(referrer_company_id);
CREATE INDEX idx_company_referrals_code ON public.company_referrals(referral_code);
CREATE INDEX idx_company_referral_codes_code ON public.company_referral_codes(code);

-- Function to generate a referral code for a company if it doesn't have one
CREATE OR REPLACE FUNCTION public.ensure_referral_code(p_company_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_existing text;
BEGIN
  -- Check if code already exists
  SELECT code INTO v_existing
  FROM public.company_referral_codes
  WHERE company_id = p_company_id;

  IF v_existing IS NOT NULL THEN
    RETURN v_existing;
  END IF;

  -- Generate a unique 8-char code from company id
  v_code := upper(substr(replace(p_company_id::text, '-', ''), 1, 4))
            || upper(substr(md5(p_company_id::text || now()::text), 1, 4));

  INSERT INTO public.company_referral_codes (company_id, code)
  VALUES (p_company_id, v_code)
  ON CONFLICT (company_id) DO NOTHING;

  -- Return the code (handle race condition)
  SELECT code INTO v_code
  FROM public.company_referral_codes
  WHERE company_id = p_company_id;

  RETURN v_code;
END;
$$;
