
-- FIX SECURITY WARNINGS
-- =====================================================

-- 1. Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- 2. Fix overly permissive INSERT policy on contact_messages
-- Drop the permissive policy and create a more restrictive one
DROP POLICY IF EXISTS "Anyone can create contact messages" ON public.contact_messages;

CREATE POLICY "Anyone can create contact messages with valid data"
ON public.contact_messages FOR INSERT
WITH CHECK (
  -- Ensure required fields are provided (basic validation)
  name IS NOT NULL AND 
  email IS NOT NULL AND 
  message IS NOT NULL AND
  length(name) > 0 AND
  length(email) > 0 AND
  length(message) > 0
);
