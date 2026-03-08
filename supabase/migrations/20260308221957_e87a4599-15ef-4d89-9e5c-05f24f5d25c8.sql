
-- 1. Create a security definer function for mock route purchases to grant access
-- This bypasses RLS so the mock payment provider can insert route_access rows
CREATE OR REPLACE FUNCTION public.grant_route_access_after_purchase(
  p_user_id uuid,
  p_route_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.route_access (user_id, route_id, valid_from, valid_until)
  VALUES (p_user_id, p_route_id, now(), null)
  ON CONFLICT DO NOTHING;
END;
$$;

-- 2. Clean up duplicate RLS policies on route_stops
DROP POLICY IF EXISTS "route_stops_delete" ON public.route_stops;
DROP POLICY IF EXISTS "route_stops_insert" ON public.route_stops;
DROP POLICY IF EXISTS "route_stops_update" ON public.route_stops;
-- Keep the _owner variants and the existing "Users can manage stops" policy
