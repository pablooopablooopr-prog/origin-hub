-- Insert initial regions
INSERT INTO public.regions (name, slug, description, is_active, coordinates) VALUES
('La Rioja', 'la-rioja', 'Tierra de vinos y tradiciones centenarias', true, '{"lat": 42.3, "lng": -2.5}'),
('Castilla y León', 'castilla-leon', 'Hornos centenarios y dulces artesanos', true, '{"lat": 41.6, "lng": -4.7}'),
('Andalucía', 'andalucia', 'Aceites, jamones y productos del mar', true, '{"lat": 37.5, "lng": -4.7}'),
('Galicia', 'galicia', 'Mariscos, vinos y tradición pesquera', true, '{"lat": 42.5, "lng": -7.5}'),
('País Vasco', 'pais-vasco', 'Sidra, quesos y gastronomía de altura', true, '{"lat": 43.0, "lng": -2.6}'),
('Cataluña', 'cataluna', 'Cavas, aceites y productos mediterráneos', true, '{"lat": 41.8, "lng": 1.5}'),
('Asturias', 'asturias', 'Quesos, sidra y productos del mar', true, '{"lat": 43.3, "lng": -5.8}'),
('Valencia', 'valencia', 'Arroz, naranjas y productos de huerta', true, '{"lat": 39.5, "lng": -0.4}');

-- Insert initial categories  
INSERT INTO public.categories (name, slug, description, icon, color, is_active, sort_order) VALUES
('Bodegas y Vinos', 'bodegas-vinos', 'Vinos, cavas y experiencias vinícolas', '🍷', '#722F37', true, 1),
('Quesos Artesanales', 'quesos', 'Quesos de leche cruda y artesanos', '🧀', '#F5DEB3', true, 2),
('Aceites y Olivos', 'aceites', 'Aceite de oliva virgen extra', '🫒', '#808000', true, 3),
('Panadería y Dulces', 'panaderia-dulces', 'Pan artesano y repostería tradicional', '🍞', '#DEB887', true, 4),
('Embutidos y Carnes', 'embutidos', 'Jamones, cecinas y embutidos', '🥓', '#8B0000', true, 5),
('Mariscos y Pescados', 'mariscos', 'Productos del mar y conservas', '🦐', '#4169E1', true, 6),
('Productos Ecológicos', 'ecologicos', 'Cultivo ecológico certificado', '🌱', '#228B22', true, 7),
('Miel y Apicultura', 'miel', 'Miel cruda y productos de la colmena', '🍯', '#FFD700', true, 8),
('Conservas Artesanales', 'conservas', 'Conservas tradicionales caseras', '🫙', '#CD853F', true, 9),
('Frutos Secos', 'frutos-secos', 'Almendras, nueces y frutos del campo', '🥜', '#A0522D', true, 10);