
CREATE OR REPLACE VIEW public.companies_public AS
SELECT id,
    business_name,
    slug,
    description,
    authenticity_story,
    address,
    website,
    logo_url,
    cover_image_url,
    avg_rating,
    total_reviews,
    social_media,
    latitude,
    longitude,
    region_id,
    category_id,
    business_type
   FROM companies c
  WHERE (upper(COALESCE(status, ''::text)) = 'APPROVED'::text);
