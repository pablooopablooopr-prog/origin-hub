-- Update all existing packs: remove DEMO flag, give unique titles, varied prices, add info

-- Pack Raíz tier (35€)
UPDATE company_packs SET
  title = 'Pack Raíz · Sabores de la Sierra',
  slug = 'pack-raiz-sabores-de-la-sierra',
  price = 35.00,
  is_demo = false,
  tags = ARRAY['raíz', 'quesos', 'miel'],
  shipping_policy = 'Envío gratuito en pedidos superiores a 30€. Entrega en 3-5 días laborables.',
  sustainability_info = 'Productos de proximidad, empaquetados con materiales 100% reciclables.'
WHERE id = 'ff51896f-b608-44f5-8e8a-8904a38dcf54';

UPDATE company_packs SET
  title = 'Pack Raíz · Huerta Tradicional',
  slug = 'pack-raiz-huerta-tradicional',
  price = 35.00,
  is_demo = false,
  tags = ARRAY['raíz', 'conservas', 'ecológico'],
  shipping_policy = 'Envío gratuito en península. Entrega en 2-4 días laborables.',
  sustainability_info = 'Cultivo ecológico certificado. Envases reutilizables.'
WHERE id = 'bac9b07a-10ea-40ef-a978-1b2fa8b1bd85';

-- Pack Esencia tier (60€)
UPDATE company_packs SET
  title = 'Pack Esencia · Sierra Mediterránea',
  slug = 'pack-esencia-sierra-mediterranea',
  price = 60.00,
  is_demo = false,
  tags = ARRAY['esencia', 'aceites', 'embutidos', 'premium'],
  shipping_policy = 'Envío gratuito en península. Entrega refrigerada en 48h.',
  sustainability_info = 'Producción artesanal. Embalaje con materiales sostenibles certificados.'
WHERE id = '91000000-0000-0000-0000-000000000001';

UPDATE company_packs SET
  title = 'Pack Esencia · Maridaje del Territorio',
  slug = 'pack-esencia-maridaje-del-territorio',
  price = 60.00,
  is_demo = false,
  tags = ARRAY['esencia', 'vinos', 'quesos', 'km0'],
  shipping_policy = 'Envío incluido. Entrega en 3-5 días laborables.',
  sustainability_info = 'Productos km0. Packaging biodegradable.'
WHERE id = '91000000-0000-0000-0000-000000000002';

-- Pack Gourmet / Premium tier (90€)
UPDATE company_packs SET
  title = 'Pack Gourmet · Edición Limitada Otoño',
  slug = 'pack-gourmet-edicion-limitada-otono',
  price = 90.00,
  is_demo = false,
  tags = ARRAY['gourmet', 'temporada', 'edición-limitada', 'premium'],
  shipping_policy = 'Envío premium refrigerado incluido. Entrega en 24-48h.',
  sustainability_info = 'Ingredientes de temporada. Caja regalo de madera reutilizable.'
WHERE id = '91000000-0000-0000-0000-000000000003';

UPDATE company_packs SET
  title = 'Pack Gourmet · Selección del Chef',
  slug = 'pack-gourmet-seleccion-del-chef',
  price = 90.00,
  is_demo = false,
  tags = ARRAY['gourmet', 'recomendado', 'degustación'],
  shipping_policy = 'Envío premium incluido. Entrega refrigerada en 24-48h.',
  sustainability_info = 'Selección curada por chefs locales. Embalaje premium reutilizable.'
WHERE id = '91000000-0000-0000-0000-000000000004';

-- Ruta packs → convert to varied prices
UPDATE company_packs SET
  title = 'Pack Raíz · Dehesa y Campo',
  slug = 'pack-raiz-dehesa-y-campo',
  price = 35.00,
  is_demo = false,
  tags = ARRAY['raíz', 'carnes', 'aceites'],
  shipping_policy = 'Envío gratuito en península. Entrega en 3-5 días.',
  sustainability_info = 'Ganadería extensiva. Producción sostenible certificada.'
WHERE id = '92000000-0000-0000-0000-000000000001';

UPDATE company_packs SET
  title = 'Pack Esencia · Mar y Obrador',
  slug = 'pack-esencia-mar-y-obrador',
  price = 60.00,
  is_demo = false,
  tags = ARRAY['esencia', 'conservas', 'dulces', 'mar'],
  shipping_policy = 'Envío refrigerado incluido. Entrega en 48-72h.',
  sustainability_info = 'Pesca sostenible. Obradores artesanales con tradición centenaria.'
WHERE id = '92000000-0000-0000-0000-000000000002';

UPDATE company_packs SET
  title = 'Pack Gourmet · Viñedos y Quesos Artesanos',
  slug = 'pack-gourmet-vinedos-y-quesos-artesanos',
  price = 90.00,
  is_demo = false,
  tags = ARRAY['gourmet', 'vinos', 'quesos', 'degustación'],
  shipping_policy = 'Envío premium incluido. Caja isotérmica con control de temperatura.',
  sustainability_info = 'Viñedos ecológicos. Queserías con denominación de origen protegida.'
WHERE id = '92000000-0000-0000-0000-000000000003';

UPDATE company_packs SET
  title = 'Pack Esencia · Dulces de Tradición',
  slug = 'pack-esencia-dulces-de-tradicion',
  price = 60.00,
  is_demo = false,
  tags = ARRAY['esencia', 'dulces', 'panadería', 'tradición'],
  shipping_policy = 'Envío gratuito en península. Entrega en 3-5 días laborables.',
  sustainability_info = 'Recetas centenarias. Ingredientes naturales sin conservantes artificiales.'
WHERE id = '92000000-0000-0000-0000-000000000004';
