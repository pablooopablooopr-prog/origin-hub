-- Allow route owners to delete their own routes
CREATE POLICY "routes_delete_owner"
  ON public.routes
  FOR DELETE
  USING (created_by = auth.uid() OR is_admin());

-- Allow company pack owners to delete their own packs
CREATE POLICY "company_packs_delete_owner"
  ON public.company_packs
  FOR DELETE
  USING (is_admin() OR current_user_owns_approved_company(company_id));