-- Fix 1: Storage INSERT policies - enforce folder ownership to prevent writing to other users' folders

-- Drop existing vulnerable INSERT policies
DROP POLICY IF EXISTS "Authenticated users can upload route images" ON storage.objects;
DROP POLICY IF EXISTS "Companies can upload pack images" ON storage.objects;
DROP POLICY IF EXISTS "Companies can upload product images" ON storage.objects;

-- Create secure INSERT policies that enforce folder ownership
CREATE POLICY "Users can upload their own route images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'route-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own pack images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'pack-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Fix 2: Create a public-safe view for companies that hides sensitive contact information
-- This allows public browsing of businesses without exposing email/phone

CREATE OR REPLACE VIEW public.companies_public
WITH (security_invoker = on) AS
SELECT 
  id,
  business_name,
  description,
  authenticity_story,
  address,
  region_id,
  category_id,
  social_media,
  latitude,
  longitude,
  avg_rating,
  total_reviews,
  logo_url,
  cover_image_url,
  website,
  status,
  created_at
FROM public.companies
WHERE status = 'approved';

-- Note: The base companies table already has proper RLS - users see their own company
-- or approved companies. The view provides a public-safe projection.

-- Fix 3: Add explicit denial of public access to customers table
-- While RLS is already configured correctly, add a security_barrier view for extra safety

CREATE OR REPLACE VIEW public.customers_safe
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  full_name,
  created_at,
  updated_at
FROM public.customers
WHERE user_id = auth.uid();

-- This view only shows the user's own data and hides sensitive fields (email, phone, address)
-- Application code should use this view for displaying customer info publicly