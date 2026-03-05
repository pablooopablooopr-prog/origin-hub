
DROP VIEW IF EXISTS public.companies_public CASCADE;

CREATE VIEW public.companies_public
WITH (security_invoker=on) AS
  SELECT 
    c.id,
    c.business_name,
    c.slug,
    c.description,
    c.authenticity_story,
    c.address,
    c.website,
    c.logo_url,
    c.cover_image_url,
    c.avg_rating,
    c.total_reviews,
    c.social_media,
    c.latitude,
    c.longitude,
    c.region_id,
    c.category_id
  FROM public.companies c
  WHERE upper(coalesce(c.status, '')) = 'APPROVED';

-- Grant access
GRANT SELECT ON public.companies_public TO authenticated;
GRANT SELECT ON public.companies_public TO anon;
