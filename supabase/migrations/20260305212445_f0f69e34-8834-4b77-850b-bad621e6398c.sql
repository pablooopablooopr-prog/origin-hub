
-- Grant necessary permissions on pack_templates to authenticated and anon roles
GRANT SELECT ON public.pack_templates TO authenticated;
GRANT SELECT ON public.pack_templates TO anon;
