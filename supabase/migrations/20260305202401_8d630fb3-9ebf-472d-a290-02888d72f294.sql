
-- Insert 2 showcase companies with rich data
INSERT INTO public.companies (
  id, business_name, contact_person, email, phone, address, description, 
  authenticity_story, status, website, logo_url, cover_image_url,
  latitude, longitude, avg_rating, total_reviews, slug,
  social_media
) VALUES
(
  'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  'Aceites Sierra del Sur',
  'María García López',
  'info@aceitessierradelsur.es',
  '+34 953 22 45 67',
  'Carretera de Jaén km 12, Baeza, Jaén',
  'Almazara familiar especializada en aceite de oliva virgen extra de la variedad Picual. Nuestros olivares centenarios producen uno de los aceites más premiados de Andalucía, con un perfil aromático intenso y un amargor equilibrado que lo hace perfecto tanto para cocinar como para degustar en crudo.',
  'Desde 1923, cuatro generaciones de la familia García han cuidado los mismos olivos que plantó el bisabuelo Antonio en las laderas de la Sierra del Sur. Cada cosecha es un homenaje a su legado: recolección temprana a mano, molturación en frío el mismo día y almacenamiento en depósitos de acero inoxidable bajo temperatura controlada. No buscamos cantidad, buscamos excelencia.',
  'APPROVED',
  'https://aceitessierradelsur.es',
  NULL,
  NULL,
  37.9937,
  -3.4710,
  4.8,
  47,
  'aceites-sierra-del-sur',
  '{"instagram": "https://instagram.com/aceitessierradelsur", "facebook": "https://facebook.com/aceitessierradelsur"}'::jsonb
),
(
  'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  'Quesos Artesanos La Mancha',
  'Carlos Ruiz Fernández',
  'contacto@quesoslamancha.com',
  '+34 926 31 78 90',
  'Camino de los Pastores 5, Herencia, Ciudad Real',
  'Quesería artesanal que elabora quesos de oveja manchega con leche cruda de pastoreo. Nuestro queso curado, semicurado y en aceite de oliva han sido reconocidos en los World Cheese Awards y en el Salón de Gourmets de Madrid. Cada rueda es única, con los matices del terroir manchego.',
  'La historia de nuestra quesería comienza en 1968, cuando Doña Carmen empezó a hacer queso en su cocina para el consumo familiar. Lo que empezó como tradición doméstica se convirtió en pasión cuando sus hijos Carlos y Elena decidieron profesionalizar el oficio sin perder la esencia artesana. Hoy seguimos usando cuajo natural, moldes de esparto y cuevas de maduración excavadas en la roca.',
  'APPROVED',
  'https://quesoslamancha.com',
  NULL,
  NULL,
  39.3667,
  -3.3569,
  4.9,
  62,
  'quesos-artesanos-la-mancha',
  '{"instagram": "https://instagram.com/quesoslamancha", "twitter": "https://twitter.com/quesoslamancha"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
