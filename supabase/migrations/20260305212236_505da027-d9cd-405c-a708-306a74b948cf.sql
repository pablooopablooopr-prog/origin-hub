
-- Fix pack_templates: the existing policy is RESTRICTIVE (which requires a permissive policy too)
-- Drop the restrictive one and recreate as permissive
DROP POLICY IF EXISTS "Authenticated users can view templates" ON public.pack_templates;

CREATE POLICY "Authenticated users can view templates"
  ON public.pack_templates
  FOR SELECT
  TO authenticated
  USING (true);
