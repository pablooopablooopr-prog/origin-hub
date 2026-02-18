
INSERT INTO regions (name, slug, is_active) VALUES
('Aragón', 'aragon', true),
('Cantabria', 'cantabria', true),
('Castilla-La Mancha', 'castilla-la-mancha', true),
('Comunidad de Madrid', 'comunidad-de-madrid', true),
('Extremadura', 'extremadura', true),
('Islas Baleares', 'islas-baleares', true),
('Islas Canarias', 'islas-canarias', true),
('Murcia', 'murcia', true),
('Navarra', 'navarra', true)
ON CONFLICT DO NOTHING;
