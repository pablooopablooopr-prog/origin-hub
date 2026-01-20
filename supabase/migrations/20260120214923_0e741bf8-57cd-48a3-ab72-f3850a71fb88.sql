-- Fix 1: Add constraint to prevent promotional code race condition
ALTER TABLE promotional_codes
ADD CONSTRAINT check_max_uses 
CHECK (max_uses IS NULL OR current_uses <= max_uses);

-- Fix 2: Create RPC function for safe promo code validation (prevents enumeration)
CREATE OR REPLACE FUNCTION validate_promo_code(code_value text, order_total numeric)
RETURNS TABLE(
  valid boolean, 
  code_id uuid,
  discount_type text, 
  discount_value numeric,
  error_message text
)
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code promotional_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_code
  FROM promotional_codes
  WHERE code = upper(trim(code_value))
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
    AND (max_uses IS NULL OR current_uses < max_uses)
    AND (min_order_amount <= order_total)
  LIMIT 1;
  
  IF FOUND THEN
    RETURN QUERY SELECT true, v_code.id, v_code.discount_type::text, v_code.discount_value, NULL::text;
  ELSE
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::numeric, 'Código no válido o expirado'::text;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Fix 3: Create atomic increment function to prevent race conditions
CREATE OR REPLACE FUNCTION increment_promo_code_safe(code_id uuid)
RETURNS boolean
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_success boolean := false;
BEGIN
  UPDATE promotional_codes
  SET current_uses = current_uses + 1
  WHERE id = code_id
    AND is_active = true
    AND (max_uses IS NULL OR current_uses < max_uses)
  RETURNING true INTO v_success;
  
  RETURN COALESCE(v_success, false);
END;
$$ LANGUAGE plpgsql;

-- Fix 4: Remove public access to promotional codes (use RPC instead)
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON promotional_codes;

-- Grant execute on new functions
GRANT EXECUTE ON FUNCTION validate_promo_code(text, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION validate_promo_code(text, numeric) TO anon;
GRANT EXECUTE ON FUNCTION increment_promo_code_safe(uuid) TO authenticated;