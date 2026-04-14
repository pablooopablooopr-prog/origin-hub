-- ============================================================
-- MIGRATION: RLS Consolidation & Security Hardening
-- Date: 2026-04-13 | Source: ORIGEN Hub Audit
-- ============================================================

BEGIN;

-- 1. ROUTES: Consolidate 7+ duplicate policies
DROP POLICY IF EXISTS "Creator delete own routes" ON routes;
DROP POLICY IF EXISTS "Creator insert own routes" ON routes;
DROP POLICY IF EXISTS "Creator read own routes" ON routes;
DROP POLICY IF EXISTS "Creator update own routes" ON routes;
DROP POLICY IF EXISTS "Public read public active routes" ON routes;
DROP POLICY IF EXISTS "routes_anon_read_public" ON routes;
DROP POLICY IF EXISTS "routes_auth_delete" ON routes;
DROP POLICY IF EXISTS "routes_auth_insert" ON routes;
DROP POLICY IF EXISTS "routes_auth_read" ON routes;
DROP POLICY IF EXISTS "routes_auth_update" ON routes;
DROP POLICY IF EXISTS "routes_delete_owner" ON routes;

CREATE POLICY "routes_select_anon" ON routes FOR SELECT TO anon
  USING (is_active = true AND is_public = true AND COALESCE(is_demo, false) = false);

CREATE POLICY "routes_select_auth" ON routes FOR SELECT TO authenticated
  USING (is_active = true AND (is_public = true OR is_admin()
    OR created_by = auth.uid() OR creator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM route_access ra
               WHERE ra.route_id = routes.id AND ra.user_id = auth.uid())));

CREATE POLICY "routes_insert_auth" ON routes FOR INSERT TO authenticated
  WITH CHECK (is_admin() OR created_by = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "routes_update_auth" ON routes FOR UPDATE TO authenticated
  USING (is_admin() OR created_by = auth.uid() OR creator_id = auth.uid())
  WITH CHECK (is_admin() OR created_by = auth.uid() OR creator_id = auth.uid());

CREATE POLICY "routes_delete_auth" ON routes FOR DELETE TO authenticated
  USING (is_admin() OR created_by = auth.uid() OR creator_id = auth.uid());


-- 2. CUSTOMERS: Consolidate 6 duplicates -> 3 clean
DROP POLICY IF EXISTS "Customers can insert own row" ON customers;
DROP POLICY IF EXISTS "Customers can update own row" ON customers;
DROP POLICY IF EXISTS "Customers can view own row" ON customers;
DROP POLICY IF EXISTS "customers_auth_insert_own" ON customers;
DROP POLICY IF EXISTS "customers_auth_select_own" ON customers;
DROP POLICY IF EXISTS "customers_auth_update_own" ON customers;
DROP POLICY IF EXISTS "customers_owner_update_welcome_sent_at" ON customers;

CREATE POLICY "customers_select_own" ON customers FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "customers_insert_own" ON customers FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "customers_update_own" ON customers FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());


-- 3. Fix public->authenticated on write policies
DROP POLICY IF EXISTS "Companies can manage reviews for their packs" ON pack_reviews;
CREATE POLICY "pack_reviews_company_manage" ON pack_reviews FOR ALL TO authenticated
  USING (pack_id IN (SELECT cp.id FROM company_packs cp
    JOIN companies c ON c.id = cp.company_id WHERE c.user_id = auth.uid()))
  WITH CHECK (pack_id IN (SELECT cp.id FROM company_packs cp
    JOIN companies c ON c.id = cp.company_id WHERE c.user_id = auth.uid()));

DROP POLICY IF EXISTS "Customers can create reviews" ON pack_reviews;
CREATE POLICY "pack_reviews_customer_create" ON pack_reviews FOR INSERT TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Customers can delete their reviews" ON pack_reviews;
CREATE POLICY "pack_reviews_customer_delete" ON pack_reviews FOR DELETE TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Customers can manage their reviews" ON pack_reviews;
CREATE POLICY "pack_reviews_customer_update" ON pack_reviews FOR UPDATE TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage stops of their routes" ON route_stops;


-- 4. Add WITH CHECK to ALL policies missing it
DROP POLICY IF EXISTS "Users can manage their cart" ON cart_items;
CREATE POLICY "cart_items_manage" ON cart_items FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their favorite companies" ON favorite_companies;
CREATE POLICY "favorite_companies_manage" ON favorite_companies FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their saved routes" ON saved_routes;
CREATE POLICY "saved_routes_manage" ON saved_routes FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their addresses" ON shipping_addresses;
CREATE POLICY "shipping_addresses_manage" ON shipping_addresses FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can create their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
CREATE POLICY "favorites_manage" ON favorites FOR ALL TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "company_packs_delete_owner" ON company_packs;


-- 5. Rate limiting for contact_messages
CREATE OR REPLACE FUNCTION check_contact_message_rate_limit()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $rate_fn$
DECLARE recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count FROM contact_messages
  WHERE email = NEW.email AND created_at > NOW() - INTERVAL '1 hour';
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Wait before sending another message.';
  END IF;
  RETURN NEW;
END;
$rate_fn$;

DROP TRIGGER IF EXISTS contact_message_rate_limit ON contact_messages;
CREATE TRIGGER contact_message_rate_limit
  BEFORE INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION check_contact_message_rate_limit();


-- 6. Company reviews: fix public write policies
DROP POLICY IF EXISTS "Customers can create reviews" ON company_reviews;
CREATE POLICY "company_reviews_customer_create" ON company_reviews
  FOR INSERT TO authenticated
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Customers can update their own reviews" ON company_reviews;
CREATE POLICY "company_reviews_customer_update" ON company_reviews
  FOR UPDATE TO authenticated
  USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

COMMIT;
