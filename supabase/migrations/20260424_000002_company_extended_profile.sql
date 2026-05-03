-- ============================================================================
-- FASE 4: Perfil extendido de empresa (campos del briefing "Mi Ficha")
-- ============================================================================
-- Todos NULL/opcionales con defaults seguros. NO rompe registros existentes.
-- ============================================================================

-- ---------- Información de contacto adicional --------------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS locality VARCHAR(255); -- pueblo, separado de address

-- ---------- Sobre la empresa (extra) -----------------------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS what_makes_us_different TEXT
    CHECK (what_makes_us_different IS NULL OR char_length(what_makes_us_different) <= 300);

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS star_product VARCHAR(100);

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS main_season VARCHAR(20)
    CHECK (main_season IN ('queso', 'caza', 'vino', 'miel') OR main_season IS NULL);

-- ---------- Visitas físicas --------------------------------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS accepts_visits BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS visit_schedule TEXT;

-- ---------- Venta online -----------------------------------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS sells_online BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS online_shop_url TEXT;

-- ---------- Imágenes (URLs por ahora; Storage en fase futura) ----------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT; -- portada 16:9, principal

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS gallery_image_urls TEXT[] DEFAULT ARRAY[]::TEXT[];
  -- array de URLs (máx 5 — se valida en frontend)

-- (logo_url ya existe en companies — no añadir)

-- ---------- Participación en plataforma --------------------------------------

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS participates_in_routes BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS accepts_b2b BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS unavailable_dates DATE[] DEFAULT ARRAY[]::DATE[];
  -- fechas marcadas NO disponibles para visitas

-- ---------- Comentarios documentación ---------------------------------------

COMMENT ON COLUMN public.companies.instagram IS
  'Handle de Instagram (sin @, ej: queseria_los_montes)';
COMMENT ON COLUMN public.companies.locality IS
  'Localidad / pueblo (separado de address completa)';
COMMENT ON COLUMN public.companies.what_makes_us_different IS
  'Texto: qué hace única a la empresa. Máx 300 caracteres.';
COMMENT ON COLUMN public.companies.star_product IS
  'Producto estrella (texto corto, máx 100 caracteres)';
COMMENT ON COLUMN public.companies.main_season IS
  'Temporada principal del negocio: queso/caza/vino/miel';
COMMENT ON COLUMN public.companies.accepts_visits IS
  'Si la empresa acepta visitas de clientes/turistas';
COMMENT ON COLUMN public.companies.visit_schedule IS
  'Horario de visitas si accepts_visits=true';
COMMENT ON COLUMN public.companies.sells_online IS
  'Si la empresa tiene venta online directa al consumidor';
COMMENT ON COLUMN public.companies.online_shop_url IS
  'URL de la tienda online si sells_online=true';
COMMENT ON COLUMN public.companies.hero_image_url IS
  'URL de la foto principal de portada (16:9)';
COMMENT ON COLUMN public.companies.gallery_image_urls IS
  'Array de URLs de fotos adicionales (máximo 5)';
COMMENT ON COLUMN public.companies.participates_in_routes IS
  'Si la empresa quiere aparecer en rutas';
COMMENT ON COLUMN public.companies.accepts_b2b IS
  'Si la empresa quiere recibir contactos B2B de restaurantes';
COMMENT ON COLUMN public.companies.unavailable_dates IS
  'Fechas en las que NO acepta visitas';
