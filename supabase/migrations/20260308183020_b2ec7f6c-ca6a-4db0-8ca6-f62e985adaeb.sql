-- Add 'micro' to the type check constraint
ALTER TABLE pack_templates DROP CONSTRAINT pack_templates_type_check;
ALTER TABLE pack_templates ADD CONSTRAINT pack_templates_type_check 
  CHECK (type = ANY (ARRAY['raiz'::text, 'esencia'::text, 'gourmet'::text, 'micro'::text]));

-- Insert the new template
INSERT INTO pack_templates (name, type, color, description, requirements)
VALUES (
  'Microselecciones',
  'micro',
  '#808B96',
  'Pack reducido con 1-2 productos únicos artesanos en formato pequeño',
  '["Producto único artesano", "Formato reducido", "Calidad premium"]'::jsonb
);