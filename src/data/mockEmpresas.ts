/**
 * Empresas mock que aparecen en la home (SpotlightToday y secciones similares)
 * pero NO existen como filas reales en la tabla `companies` de Supabase.
 *
 * Sirven para:
 *   1. Fallback de BusinessDetail: cuando un visitante pulsa la card de la home
 *      y la URL queda como /negocio/finca-los-alamos, el componente cae a este
 *      mock y renderiza la página completa de "ejemplo" en vez de un 404.
 *   2. Mini-mapa B2B del dashboard de empresa: se mezclan con las empresas
 *      reales para que el mapa de España tenga "vida" mientras la plataforma
 *      arranca y solo hay 3-4 cuentas reales.
 *
 * Si en algún momento estas fichas se crean en DB con el mismo slug, las reales
 * tienen prioridad (BusinessDetail consulta primero la DB).
 */

export interface MockEmpresa {
  id: string;
  slug: string;
  business_name: string;
  business_type: string;
  category: string;
  locality: string;
  province: string;
  address: string;
  latitude: number;
  longitude: number;
  cover_image_url: string;
  logo_url: string | null;
  description: string;
  authenticity_story: string;
  star_product: string;
  owner_name: string;
  website: string | null;
  phone: string | null;
  email: string | null;
  social_media: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  avg_rating: number;
  total_reviews: number;
  badge: string;
  badge_color: string;
}

export const MOCK_EMPRESAS: MockEmpresa[] = [
  {
    id: "mock-finca-los-alamos",
    slug: "finca-los-alamos",
    business_name: "Finca Los Álamos",
    business_type: "Productor",
    category: "Hortalizas",
    locality: "Albacete",
    province: "Albacete",
    address: "Camino de la Vega s/n, Albacete",
    latitude: 38.9942,
    longitude: -1.8585,
    cover_image_url:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=85",
    logo_url: null,
    description:
      "Cultivo ecológico con sabor de verdad, directo de nuestra huerta a tu mesa.",
    authenticity_story:
      "La familia García lleva tres generaciones cultivando hortalizas en La Mancha. Sin pesticidas químicos, sin invernaderos: solo tierra, agua, sol y manos que conocen el ciclo. Nuestra finca es pequeña a propósito — preferimos cuidar cada planta antes que escalar.",
    star_product: "Tomate corazón de buey ecológico",
    owner_name: "Familia García",
    website: "https://fincalosalamos.example",
    phone: "+34 967 000 001",
    email: "hola@fincalosalamos.example",
    social_media: { instagram: "fincalosalamos" },
    avg_rating: 4.9,
    total_reviews: 38,
    badge: "PRODUCTOR LOCAL",
    badge_color: "#5C6B2E",
  },
  {
    id: "mock-queseria-el-refugio",
    slug: "queseria-el-refugio",
    business_name: "Quesería El Refugio",
    business_type: "Quesos y Lácteos",
    category: "Quesos",
    locality: "Porzuna",
    province: "Ciudad Real",
    address: "Calle del Queso 12, Porzuna, Ciudad Real",
    latitude: 39.1505,
    longitude: -4.1532,
    cover_image_url:
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1600&q=85",
    logo_url: null,
    description:
      "Quesos artesanos madurados con tiempo, paciencia y pasión por lo auténtico.",
    authenticity_story:
      "Manuel López empezó con tres ovejas y una idea: hacer queso como lo hacía su abuela. Hoy son 120 ovejas manchegas de raza pura, leche cruda sin pasteurizar y un obrador que huele a romero y a madera vieja. Cada pieza tiene su firma y su tiempo de cura.",
    star_product: "Queso manchego curado 18 meses",
    owner_name: "Manuel López",
    website: "https://elrefugio.example",
    phone: "+34 926 000 002",
    email: "manuel@elrefugio.example",
    social_media: { instagram: "queseriaelrefugio" },
    avg_rating: 4.8,
    total_reviews: 64,
    badge: "ARTESANO",
    badge_color: "#6b3a20",
  },
  {
    id: "mock-la-era-don-quijote",
    slug: "la-era-de-don-quijote",
    business_name: "La Era de Don Quijote",
    business_type: "Restaurante",
    category: "Cocina tradicional",
    locality: "Toledo",
    province: "Toledo",
    address: "Plaza Mayor 4, Toledo",
    latitude: 39.8567,
    longitude: -4.0244,
    cover_image_url:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85",
    logo_url: null,
    description:
      "Cocina de siempre con producto local y recetas que cuentan historias.",
    authenticity_story:
      "Elena Martín reabrió la posada familiar después de 20 años trabajando fuera. La carta cambia con la temporada y todo el producto viene de la misma comarca: queso de Porzuna, vino de Valdepeñas, cordero manchego, miel de Las Pedroñeras. No hay carta de bebidas: hay vino y agua.",
    star_product: "Pisto manchego con huevo de corral",
    owner_name: "Elena Martín",
    website: null,
    phone: "+34 925 000 003",
    email: "reservas@laeradonquijote.example",
    social_media: { instagram: "laeradonquijote" },
    avg_rating: 4.7,
    total_reviews: 121,
    badge: "RESTAURANTE",
    badge_color: "#5C6B2E",
  },
  {
    id: "mock-taller-tierra-viva",
    slug: "taller-tierra-viva",
    business_name: "Taller Tierra Viva",
    business_type: "Alojamiento Rural",
    category: "Experiencias",
    locality: "Cuenca",
    province: "Cuenca",
    address: "Camino de la Hoz 8, Cuenca",
    latitude: 40.0704,
    longitude: -2.1374,
    cover_image_url:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=85",
    logo_url: null,
    description:
      "Vive la artesanía en primera persona y conecta con lo esencial.",
    authenticity_story:
      "Julio Romero monta talleres de cerámica, panadería y conservas en una casa rural restaurada con piedra del valle. Grupos pequeños, ritmo lento, materias primas del entorno. La idea es salir con algo hecho con tus manos y con la cabeza más despejada que cuando llegaste.",
    star_product: "Fin de semana 'Pan y cerámica'",
    owner_name: "Julio Romero",
    website: "https://tallertierraviva.example",
    phone: "+34 969 000 004",
    email: "julio@tallertierraviva.example",
    social_media: { instagram: "tallertierraviva", facebook: "tallertierraviva" },
    avg_rating: 4.9,
    total_reviews: 47,
    badge: "EXPERIENCIA",
    badge_color: "#6b3a20",
  },
];

export const findMockEmpresa = (slugOrId: string): MockEmpresa | undefined =>
  MOCK_EMPRESAS.find((e) => e.slug === slugOrId || e.id === slugOrId);
