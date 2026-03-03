-- Enforce backend approval gating for company flows

-- 1) Keep one company profile per user and default to pending on creation
CREATE UNIQUE INDEX IF NOT EXISTS companies_user_id_unique
  ON public.companies(user_id)
  WHERE user_id IS NOT NULL;

ALTER TABLE public.companies
  ALTER COLUMN status SET DEFAULT 'pending';

-- 2) Minimal status lookup for logged-in company users (pending screen)
CREATE OR REPLACE FUNCTION public.get_my_company_approval_status()
RETURNS TABLE (
  company_id uuid,
  business_name text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.business_name, COALESCE(c.status, 'pending')
  FROM public.companies c
  WHERE c.user_id = auth.uid()
  ORDER BY c.created_at DESC
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_my_company_approval_status() TO authenticated;

-- 3) Companies RLS: only approved companies can read/update private company profile
DROP POLICY IF EXISTS "Users can view their own company" ON public.companies;
DROP POLICY IF EXISTS "Users can create their own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company" ON public.companies;

CREATE POLICY "Users can create pending company"
ON public.companies FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND COALESCE(status, 'pending') = 'pending'
);

CREATE POLICY "Approved companies can view own company"
ON public.companies FOR SELECT
USING (
  (user_id = auth.uid() AND status = 'approved')
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Approved companies can update own company"
ON public.companies FOR UPDATE
USING (
  user_id = auth.uid() AND status = 'approved'
)
WITH CHECK (
  user_id = auth.uid() AND status = 'approved'
);

CREATE POLICY "Admins can update companies"
ON public.companies FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (true);

-- 4) Company packs RLS: create/edit/private access only for approved companies
DROP POLICY IF EXISTS "Companies can view their own packs" ON public.company_packs;
DROP POLICY IF EXISTS "Companies can create their own packs" ON public.company_packs;
DROP POLICY IF EXISTS "Companies can update their own packs" ON public.company_packs;

CREATE POLICY "Approved companies can view own packs"
ON public.company_packs FOR SELECT
USING (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Approved companies can create own packs"
ON public.company_packs FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
);

CREATE POLICY "Approved companies can update own packs"
ON public.company_packs FOR UPDATE
USING (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all company packs"
ON public.company_packs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all company packs"
ON public.company_packs FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (true);

-- 5) Dependent company-write tables: approved company only
DROP POLICY IF EXISTS "Companies can manage their pack elements" ON public.pack_elements;
CREATE POLICY "Approved companies can manage their pack elements"
ON public.pack_elements FOR ALL
USING (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Companies can manage their products" ON public.products;
CREATE POLICY "Approved companies can manage their products"
ON public.products FOR ALL
USING (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Companies can manage their pack products" ON public.pack_products;
CREATE POLICY "Approved companies can manage their pack products"
ON public.pack_products FOR ALL
USING (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Companies can view their pack analytics" ON public.pack_analytics;
CREATE POLICY "Approved companies can view their pack analytics"
ON public.pack_analytics FOR SELECT
USING (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);

DROP POLICY IF EXISTS "Companies can manage reviews for their packs" ON public.pack_reviews;
CREATE POLICY "Approved companies can manage reviews for their packs"
ON public.pack_reviews FOR ALL
USING (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  pack_id IN (
    SELECT cp.id
    FROM public.company_packs cp
    JOIN public.companies c ON c.id = cp.company_id
    WHERE c.user_id = auth.uid() AND c.status = 'approved'
  )
  OR public.has_role(auth.uid(), 'admin')
);
