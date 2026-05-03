-- ============================================================================
-- FASE 2: Planes empresa, temporadas en rutas, suscripciones consumidor
-- ============================================================================
-- Cambios:
--   1. companies: añadir plan, plan_expires_at, stripe_subscription_id
--   2. routes:    añadir season (queso/caza/vino/miel)
--   3. nueva:     consumer_subscriptions (suscripciones trimestral/anual)
--
-- Idempotente: usa IF NOT EXISTS donde es posible.
-- ============================================================================

-- ---------- 1. companies: añadir columnas de plan ---------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS plan VARCHAR(20) NOT NULL DEFAULT 'basico'
    CHECK (plan IN ('basico', 'standard', 'destacado'));

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_companies_plan ON public.companies(plan);
CREATE INDEX IF NOT EXISTS idx_companies_stripe_subscription_id
  ON public.companies(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

COMMENT ON COLUMN public.companies.plan IS
  'Plan empresarial: basico (20€), standard (35€), destacado (40€)';
COMMENT ON COLUMN public.companies.plan_expires_at IS
  'Fecha de próxima renovación / expiración del plan';
COMMENT ON COLUMN public.companies.stripe_subscription_id IS
  'ID de la suscripción Stripe (poblado por webhook)';

-- ---------- 2. routes: añadir season ----------------------------------------

ALTER TABLE public.routes
  ADD COLUMN IF NOT EXISTS season VARCHAR(20)
    CHECK (season IN ('queso', 'caza', 'vino', 'miel') OR season IS NULL);

CREATE INDEX IF NOT EXISTS idx_routes_season ON public.routes(season)
  WHERE season IS NOT NULL;

COMMENT ON COLUMN public.routes.season IS
  'Temporada de la ruta: queso (Mar-May), caza (Sep-Nov), vino (Oct-Dic), miel (Jun-Ago)';

-- ---------- 3. consumer_subscriptions ---------------------------------------

CREATE TABLE IF NOT EXISTS public.consumer_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('trimestral', 'anual')),
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consumer_subscriptions_user_id
  ON public.consumer_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_consumer_subscriptions_status
  ON public.consumer_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_consumer_subscriptions_stripe_id
  ON public.consumer_subscriptions(stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

-- Trigger para mantener updated_at
CREATE OR REPLACE FUNCTION public.set_consumer_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_consumer_subscriptions_updated_at
  ON public.consumer_subscriptions;
CREATE TRIGGER trg_consumer_subscriptions_updated_at
  BEFORE UPDATE ON public.consumer_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_consumer_subscriptions_updated_at();

-- RLS: cada usuario ve y gestiona solo su suscripción; admin ve todas
ALTER TABLE public.consumer_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "consumer_subs_select_own"
  ON public.consumer_subscriptions;
CREATE POLICY "consumer_subs_select_own"
  ON public.consumer_subscriptions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "consumer_subs_insert_own"
  ON public.consumer_subscriptions;
CREATE POLICY "consumer_subs_insert_own"
  ON public.consumer_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "consumer_subs_update_own"
  ON public.consumer_subscriptions;
CREATE POLICY "consumer_subs_update_own"
  ON public.consumer_subscriptions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Solo admin (o la edge function con service_role) puede borrar
DROP POLICY IF EXISTS "consumer_subs_delete_admin"
  ON public.consumer_subscriptions;
CREATE POLICY "consumer_subs_delete_admin"
  ON public.consumer_subscriptions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON TABLE public.consumer_subscriptions IS
  'Suscripciones de consumidores: trimestral (29€) o anual (89€)';

-- ---------- 4. RPC: get_my_company_plan ------------------------------------
-- Devuelve el plan del usuario logueado (basico por defecto si no hay empresa)

CREATE OR REPLACE FUNCTION public.get_my_company_plan()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(plan, 'basico')
  FROM public.companies
  WHERE user_id = auth.uid()
  ORDER BY created_at DESC
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION public.get_my_company_plan() TO authenticated;

COMMENT ON FUNCTION public.get_my_company_plan() IS
  'Devuelve el plan empresarial del usuario logueado. Usado por hook usePlan().';
