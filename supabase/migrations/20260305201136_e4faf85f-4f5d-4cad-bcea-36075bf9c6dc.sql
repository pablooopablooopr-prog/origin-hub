
-- Update route 1: professional title and data
UPDATE routes SET
  title = 'Bodegas y Viñedos Secretos de La Rioja',
  slug = 'bodegas-vinedos-rioja',
  description = 'Descubre bodegas familiares ocultas en La Rioja donde el tiempo parece haberse detenido',
  difficulty = 'Fácil',
  duration = '1 día',
  narrative = 'Sumérgete en los secretos mejor guardados de La Rioja. Esta ruta te llevará por bodegas familiares centenarias donde conocerás a maestros bodegueros que han heredado técnicas ancestrales.',
  total_stops = 3,
  is_demo = false,
  daily_recommendations = '["Empieza temprano en la primera bodega (10:00) para disfrutar de la cata completa","Almuerzo tradicional en el pueblo de Haro con maridaje local","Tarde en los viñedos cuando la luz es perfecta para fotografías","Reserva con antelación, especialmente durante la época de vendimia"]'::jsonb,
  practical_info = '{"level":"Fácil","duration":"Día completo (8-10 horas)","recommendedPeople":"2-8 personas","localTips":["Coche imprescindible","Ropa cómoda para caminar por el campo","Conductor designado para las catas","Mejor época: primavera y otoño"]}'::jsonb,
  base_price_per_person = 9.90
WHERE id = '934e4072-54c2-4e49-a83a-5753e9e918f9';

-- Update existing stops for route 1
UPDATE route_stops SET
  name = 'Bodega El Rincón Secreto', type = 'Bodega familiar', type_icon = '🍷',
  description = 'Bodega familiar centenaria donde el vino se elabora como hace 100 años',
  address = 'Camino de las Viñas, 15, Haro, La Rioja', schedule = 'Lunes a Domingo: 10:00-18:00',
  latitude = 42.5836, longitude = -2.8449,
  what_to_do = '["Visita guiada por los viñedos centenarios","Cata de 5 vinos de la cosecha actual","Charla con el enólogo","Compra directa de botellas exclusivas"]'::jsonb,
  highlights = '["Barricas de roble francés centenarias","Método de fermentación tradicional","Vista panorámica de La Rioja Alta"]'::jsonb
WHERE id = 'f67fbf40-b16e-4145-bc79-e2f5de184e95';

UPDATE route_stops SET
  name = 'Viñedos del Abuelo', type = 'Viñedo tradicional', type_icon = '🍇',
  description = 'Viñedos de más de 80 años con cepas autóctonas únicas en la región',
  address = 'Carretera del Vino km 3, Briones, La Rioja', schedule = 'Martes a Domingo: 9:00-17:00',
  latitude = 42.5478, longitude = -2.7721,
  what_to_do = '["Paseo entre viñas centenarias","Explicación sobre variedades autóctonas","Degustación de uvas según temporada","Fotografía en los paisajes vinícolas"]'::jsonb,
  highlights = '["Cepas de más de 80 años","Variedades autóctonas recuperadas","Paisajes únicos de La Rioja"]'::jsonb
WHERE id = 'c87aba5b-afca-40b6-8e8c-e4139162d0d3';

UPDATE route_stops SET
  name = 'Finca La Esperanza', type = 'Enoturismo', type_icon = '🍾',
  description = 'Experiencia completa de enoturismo en finca familiar con alojamiento rural',
  address = 'Finca La Esperanza, Km 7, Laguardia, Álava', schedule = 'Todos los días: 10:00-20:00',
  latitude = 42.5521, longitude = -2.6089,
  what_to_do = '["Tour completo por viñedos y bodega","Almuerzo maridaje en viñedos","Taller de enología práctica","Compra de vinos exclusivos"]'::jsonb,
  highlights = '["Experiencia enoturística completa","Viñedos con certificación ecológica","Vinos premiados internacionalmente"]'::jsonb
WHERE id = '776d6664-6c64-4060-94fc-889597230238';

-- Update route 2: Remove DEMO
UPDATE routes SET
  title = 'Panadería y Dulce Tradición de Castilla',
  slug = 'panaderia-dulce-tradicion-castilla',
  description = 'Hornos centenarios y dulces artesanos en el corazón de Castilla',
  difficulty = 'Fácil', duration = 'Medio día',
  narrative = 'Despierta todos tus sentidos en una ruta que te transportará a la esencia más pura de la repostería tradicional castellana.',
  total_stops = 3, is_demo = false,
  daily_recommendations = '["Visita matutina al horno (7:00) para ver el proceso completo","Media mañana en el convento para dulces frescos","Almuerzo tradicional castellano con pan artesano","Lleva una cesta para tus compras"]'::jsonb,
  practical_info = '{"level":"Fácil","duration":"Medio día (4-5 horas)","recommendedPeople":"2-6 personas","localTips":["Madruga para ver el horneado completo","Lleva efectivo para el convento","Horarios limitados de dulces conventuales","Mejor época: cualquier momento del año"]}'::jsonb,
  base_price_per_person = 9.90
WHERE id = 'f784e5bc-fd46-42e8-a82a-7a4bb1e5eb83';

-- Add 3 stops to route 2 (currently has 0)
INSERT INTO route_stops (route_id, created_by, name, type, type_icon, description, address, schedule, latitude, longitude, position, what_to_do, highlights) VALUES
('f784e5bc-fd46-42e8-a82a-7a4bb1e5eb83', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Horno de Leña San Miguel', 'Panadería tradicional', '🍞', 'Horno de leña centenario donde aún se cuece el pan como antaño', 'Plaza del Horno, 7, Medina del Campo, Valladolid', 'Lunes a Sábado: 6:00-14:00', 41.3069, -4.9154, 1,
 '["Demostración de amasado tradicional","Horneado en horno de leña centenario","Degustación de panes artesanos","Taller de elaboración de hogaza"]'::jsonb,
 '["Horno de leña del siglo XVIII","Técnicas de amasado ancestrales","Pan de centeno tradicional"]'::jsonb),
('f784e5bc-fd46-42e8-a82a-7a4bb1e5eb83', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Convento de Santa Clara', 'Repostería conventual', '🍰', 'Dulces elaborados por las monjas siguiendo recetas centenarias', 'Calle Convento, 12, Tordesillas, Valladolid', 'Lunes a Viernes: 9:30-13:00 y 16:00-18:30', 41.5019, -5.0024, 2,
 '["Compra de dulces conventuales","Historia de la repostería monacal","Degustación de especialidades","Visita guiada por las instalaciones históricas"]'::jsonb,
 '["Recetas conventuales del siglo XVI","Yemas de Santa Teresa artesanas","Tradición repostera ininterrumpida"]'::jsonb),
('f784e5bc-fd46-42e8-a82a-7a4bb1e5eb83', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Cecinas Pablo', 'Cecina artesana', '🥓', 'Secadero tradicional familiar donde la cecina se elabora como hace 150 años', 'Calle Mayor, 23, Astorga, León', 'Lunes a Sábado: 9:00-14:00 y 17:00-20:00', 42.4578, -6.0645, 3,
 '["Degustación de cecina recién cortada","Charla con el maestro cecinero","Visita al secadero","Compra de productos artesanos"]'::jsonb,
 '["Proceso artesano tradicional","Cecina de denominación de origen","Secadero natural centenario"]'::jsonb);

-- New route 3: Mercados y Huertos (5 stops)
INSERT INTO routes (id, created_by, creator_id, title, slug, description, difficulty, duration, narrative, total_stops, is_demo, is_active, is_public, moderation_status, base_price_per_person, daily_recommendations, practical_info)
VALUES (
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770',
  'Mercados y Huertos de Proximidad', 'mercados-huertos-proximidad',
  'Productos frescos y de proximidad en mercados tradicionales y huertos ecológicos',
  'Fácil', '1 día',
  'Descubre la autenticidad de los mercados tradicionales donde los productores locales ofrecen lo mejor de cada temporada. Una experiencia sensorial completa que despertará tu amor por los productos de proximidad.',
  5, false, true, true, 'approved', 9.90,
  '["Comienza en el mercado temprano (8:30)","Visita la huerta a media mañana","Lleva una nevera portátil","Pregunta por variedades de temporada"]'::jsonb,
  '{"level":"Fácil","duration":"Día completo (6-8 horas)","recommendedPeople":"2-4 personas","localTips":["Madruga para la mejor selección","Lleva bolsas reutilizables","Mercados solo abren días específicos","Pregunta por el origen de los productos"]}'::jsonb
);

INSERT INTO route_stops (route_id, created_by, name, type, type_icon, description, address, schedule, latitude, longitude, position, what_to_do, highlights) VALUES
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Mercado Central de Salamanca', 'Mercado tradicional', '🥕', 'Mercado centenario con productores locales de toda la comarca', 'Plaza del Mercado, s/n, Salamanca', 'Martes, Jueves y Sábados: 8:00-14:00', 40.9701, -5.6640, 1,
 '["Recorrido por puestos de productores locales","Degustación de productos de temporada","Charlas con agricultores","Compra directa de productos frescos"]'::jsonb,
 '["Productos certificados de proximidad","Variedades autóctonas recuperadas","Trato directo con productores"]'::jsonb),
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Huerta Ecológica El Bancal', 'Huerta ecológica', '🌱', 'Producción ecológica familiar con más de 30 variedades de hortalizas', 'Camino de la Huerta, km 2, Béjar, Salamanca', 'Todos los días: 10:00-18:00', 40.3853, -5.7767, 2,
 '["Visita guiada por cultivos ecológicos","Recolección de verduras de temporada","Taller de compostaje natural","Degustación de productos recién cosechados"]'::jsonb,
 '["Certificación ecológica oficial","30 variedades de hortalizas","Método de cultivo biodinámico"]'::jsonb),
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Quesería Artesana Los Picos', 'Quesería', '🧀', 'Elaboración artesana de quesos con leche de cabras autóctonas', 'Carretera de Candelario, km 4, Béjar', 'Lunes a Domingo: 9:30-18:00', 40.3721, -5.7624, 3,
 '["Visita a las instalaciones queseras","Proceso de elaboración tradicional","Degustación de quesos curados","Encuentro con las cabras"]'::jsonb,
 '["Quesos premiados internacionalmente","Cabras de raza autóctona","Maduración en cuevas naturales"]'::jsonb),
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Cooperativa de Aceite Virgen', 'Almazara', '🫒', 'Almazara cooperativa con más de 200 socios olivicultores locales', 'Calle Olivo, 12, Ciudad Rodrigo, Salamanca', 'Lunes a Viernes: 8:00-15:00', 40.5990, -6.5323, 4,
 '["Visita a la almazara moderna","Proceso de extracción en frío","Cata de aceites de diferentes variedades","Compra directa de aceite virgen extra"]'::jsonb,
 '["Aceite virgen extra de primera extracción","Variedades picual y arbequina","Proceso completamente sostenible"]'::jsonb),
('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Granja Ecológica San Francisco', 'Granja ecológica', '🐄', 'Granja familiar ecológica con producción de lácteos y huevos camperos', 'Finca San Francisco, km 8, Ávila', 'Todos los días: 10:00-17:00', 40.6567, -4.7245, 5,
 '["Visita a los animales en libertad","Ordeño tradicional de vacas","Recolección de huevos camperos","Degustación de lácteos frescos"]'::jsonb,
 '["Certificación ecológica completa","Animales en pastoreo libre","Productos lácteos sin aditivos"]'::jsonb);

-- New route 4: Sabores del Mar Cantábrico (3 stops)
INSERT INTO routes (id, created_by, creator_id, title, slug, description, difficulty, duration, narrative, total_stops, is_demo, is_active, is_public, moderation_status, base_price_per_person, daily_recommendations, practical_info)
VALUES (
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770',
  'Sabores del Mar Cantábrico', 'sabores-mar-cantabrico',
  'Conserveras artesanas, lonjas y marisquerías del litoral cántabro',
  'Fácil', 'Medio día',
  'Sumérgete en la tradición pesquera del Cantábrico. Desde la lonja donde llegan las capturas al amanecer hasta las conserveras donde maestros artesanos elaboran las mejores anchoas y bonito del mundo.',
  3, false, true, true, 'approved', 9.90,
  '["Madruga para visitar la lonja (6:30)","Desayuno de pescadores en el puerto","Visita la conservera a media mañana"]'::jsonb,
  '{"level":"Fácil","duration":"Medio día (4-5 horas)","recommendedPeople":"2-6 personas","localTips":["Lleva ropa abrigada en la lonja","Reserva con antelación en la conservera","Mejores días: martes y viernes","Lleva nevera si compras pescado"]}'::jsonb
);

INSERT INTO route_stops (route_id, created_by, name, type, type_icon, description, address, schedule, latitude, longitude, position, what_to_do, highlights) VALUES
('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Lonja de Santoña', 'Lonja pesquera', '🐟', 'La lonja más importante del Cantábrico oriental donde se subastan las mejores capturas', 'Puerto Pesquero, s/n, Santoña, Cantabria', 'Lunes a Viernes: 6:30-10:00', 43.4440, -3.4580, 1,
 '["Presenciar la subasta de pescado al amanecer","Conocer las especies del Cantábrico","Charla con pescadores sobre artes tradicionales","Compra directa de pescado fresco"]'::jsonb,
 '["Subasta en vivo del pescado","Especies únicas del Cantábrico","Tradición pesquera centenaria"]'::jsonb),
('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Conservera Codesa', 'Conservera artesanal', '🥫', 'Conservera familiar donde las anchoas se elaboran una a una con técnicas centenarias', 'Barrio Mazo, 14, Santoña, Cantabria', 'Lunes a Viernes: 9:00-14:00', 43.4465, -3.4552, 2,
 '["Taller de sobado y fileteado de anchoas","Proceso de salazón tradicional","Degustación de anchoas de diferentes añadas","Compra de conservas artesanas"]'::jsonb,
 '["Anchoas elaboradas a mano","Maduración de 12 meses","Denominación de Origen Protegida"]'::jsonb),
('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'fe6af856-9315-41f8-b5cf-7f9a4f3d4770', 'Marisquería Puerto de Laredo', 'Restaurante marinero', '🦐', 'Restaurante familiar frente al puerto donde el marisco llega del barco a la mesa', 'Paseo Marítimo, 8, Laredo, Cantabria', 'Martes a Domingo: 12:00-16:00 y 20:00-23:00', 43.4117, -3.4297, 3,
 '["Degustación de marisco del día","Maridaje con txakolí y albariño","Explicación de especies y temporadas","Vista panorámica de la bahía"]'::jsonb,
 '["Marisco directo del barco","Cocina tradicional cántabra","Vistas espectaculares a la bahía"]'::jsonb);
