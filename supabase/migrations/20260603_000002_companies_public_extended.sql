-- ============================================================================
-- Extiende companies_public con todos los campos editoriales que la ficha
-- pública /negocio/:id necesita mostrar a visitantes anónimos.
--
-- Sin esto, el visitante anónimo solo ve los pocos campos del view original
-- y la página renderiza "Empresa no encontrada" o sin contenido.
--
-- security_invoker='on' se mantiene: RLS de la tabla companies sigue
-- aplicándose para la WHERE de status=approved, pero las columnas extra no
-- añaden riesgo porque solo se devuelven para filas ya aprobadas.
-- ============================================================================

create or replace view public.companies_public with (security_invoker='on') as
select
  c.id,
  c.business_name,
  c.business_type,
  c.slug,
  c.description,
  c.authenticity_story,
  c.what_makes_us_different,
  c.star_product,
  c.main_season,
  c.address,
  c.locality,
  c.website,
  c.instagram,
  c.logo_url,
  c.cover_image_url,
  c.hero_image_url,
  c.gallery_image_urls,
  c.avg_rating,
  c.total_reviews,
  c.social_media,
  c.latitude,
  c.longitude,
  c.email,
  c.phone,
  c.region_id,
  c.category_id,
  c.status,
  c.accepts_visits,
  c.visit_schedule,
  c.sells_online,
  c.online_shop_url,
  c.participates_in_routes,
  c.accepts_b2b
from public.companies c
where upper(coalesce(c.status, '')) = any (array['APPROVED','APROVVED']);
