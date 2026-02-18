-- Add missing categories for the primary sector
INSERT INTO categories (name, slug, sort_order, is_active) VALUES
  ('Carnicería', 'carniceria', 11, true),
  ('Restaurante', 'restaurante', 12, true),
  ('Charcutería', 'charcuteria', 13, true),
  ('Frutería', 'fruteria', 14, true),
  ('Verdulería', 'verduleria', 15, true),
  ('Pescadería', 'pescaderia', 16, true),
  ('Chocolatería', 'chocolateria', 17, true),
  ('Pastelería', 'pasteleria', 18, true),
  ('Cervecería Artesanal', 'cerveceria-artesanal', 19, true),
  ('Granja Ecológica', 'granja-ecologica', 20, true),
  ('Taller Artesanal', 'taller-artesanal', 21, true),
  ('Mercado Local', 'mercado-local', 22, true),
  ('Herboristería', 'herboristeria', 23, true),
  ('Almazara', 'almazara', 24, true),
  ('Vivero', 'vivero', 25, true),
  ('Ahumadero', 'ahumadero', 26, true),
  ('Cafetería Especialidad', 'cafeteria-especialidad', 27, true),
  ('Sidrería', 'sidreria', 28, true),
  ('Destilería', 'destileria', 29, true),
  ('Obrador', 'obrador', 30, true)
ON CONFLICT (slug) DO NOTHING;