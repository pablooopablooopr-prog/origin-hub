import type { Season } from "@/lib/season";

/**
 * Rutas demo por temporada — usadas como FALLBACK cuando la tabla
 * `routes` no tiene rutas con season=X. En cuanto crees rutas reales
 * en la BD con la columna `season` poblada, se usarán las reales.
 */

export interface DemoRoute {
  id: string;
  slug: string;
  title: string;
  description: string;
  recorrido: string; // "Porzuna → Piedrabuena → Almagro"
  duration: string;  // "1 día completo"
  capacity: number;  // 25
  rating: number;    // 4.8
  season: Season;
}

export const SEASONAL_ROUTES_DEMO: DemoRoute[] = [
  // ---- TEMPORADA QUESO (Primavera) ----
  {
    id: "demo-ruta-clasica-queso",
    slug: "ruta-clasica-del-queso",
    title: "Ruta Clásica del Queso",
    description:
      "Recorrido por tres queserías artesanas con cata final, comida en bodega y vuelta al atardecer.",
    recorrido: "Porzuna → Piedrabuena → Almagro",
    duration: "1 día completo",
    capacity: 25,
    rating: 4.8,
    season: "queso",
  },
  {
    id: "demo-ruta-queso-naturaleza",
    slug: "ruta-queso-naturaleza",
    title: "Ruta Queso + Naturaleza",
    description:
      "Fin de semana entre quesos de pastor y senderos de Cabañeros. Alojamiento rural incluido.",
    recorrido: "Porzuna → Cabañeros → Malagón",
    duration: "Fin de semana",
    capacity: 15,
    rating: 4.5,
    season: "queso",
  },
  {
    id: "demo-ruta-queso-gourmet",
    slug: "ruta-queso-gourmet",
    title: "Ruta Queso Gourmet",
    description:
      "Tarde + cena maridada en Ciudad Real capital. Cata premium con maestro quesero y sumiller.",
    recorrido: "Ciudad Real capital",
    duration: "Tarde + cena",
    capacity: 12,
    rating: 5.0,
    season: "queso",
  },

  // ---- TEMPORADA CAZA (Otoño) ----
  {
    id: "demo-ruta-monteria-cabaneros",
    slug: "ruta-monteria-cabaneros",
    title: "Ruta Monterías de Cabañeros",
    description:
      "Jornada de montería en finca privada lindera al parque. Almuerzo de campo y reparto tradicional.",
    recorrido: "Retuerta del Bullaque → Cabañeros",
    duration: "1 día completo",
    capacity: 30,
    rating: 4.9,
    season: "caza",
  },
  {
    id: "demo-ruta-caza-menor",
    slug: "ruta-caza-menor-mancha",
    title: "Ruta Caza Menor Manchega",
    description:
      "Perdiz en mano y conejo al salto por las llanuras manchegas. Apta para iniciados y veteranos.",
    recorrido: "Almagro → Aldea del Rey → Calzada",
    duration: "1 día",
    capacity: 12,
    rating: 4.6,
    season: "caza",
  },

  // ---- TEMPORADA VINO (Invierno + vendimia) ----
  {
    id: "demo-ruta-bodegas-valdepenas",
    slug: "ruta-bodegas-valdepenas",
    title: "Ruta Bodegas de Valdepeñas",
    description:
      "Cuatro bodegas centenarias con cata vertical y comida con maridaje en bodega subterránea.",
    recorrido: "Valdepeñas → Manzanares → Tomelloso",
    duration: "1 día completo",
    capacity: 20,
    rating: 4.7,
    season: "vino",
  },
  {
    id: "demo-ruta-vendimia",
    slug: "ruta-vendimia-tradicional",
    title: "Ruta de la Vendimia Tradicional",
    description:
      "Participa en la vendimia, pisa uva al modo antiguo y cena en la bodega del cosechero.",
    recorrido: "Tomelloso → Socuéllamos",
    duration: "Fin de semana",
    capacity: 18,
    rating: 4.8,
    season: "vino",
  },

  // ---- TEMPORADA MIEL Y ACEITE (Verano) ----
  {
    id: "demo-ruta-miel-aceite",
    slug: "ruta-miel-y-aceite",
    title: "Ruta de la Miel y el Aceite",
    description:
      "Visita a colmenares activos, almazara en plena cosecha y cata de mieles y AOVES de la sierra.",
    recorrido: "Porzuna → Anchuras → Daimiel",
    duration: "1 día completo",
    capacity: 20,
    rating: 4.6,
    season: "miel",
  },
  {
    id: "demo-ruta-aove-premium",
    slug: "ruta-aove-premium",
    title: "Ruta AOVE Premium",
    description:
      "Sábado en cooperativa olivarera con cata profesional y cena en olivar centenario.",
    recorrido: "Almagro → Daimiel",
    duration: "Tarde + cena",
    capacity: 14,
    rating: 4.9,
    season: "miel",
  },
];

/**
 * Devuelve las rutas demo de una temporada concreta.
 */
export function getDemoRoutesBySeason(season: Season, limit = 3): DemoRoute[] {
  return SEASONAL_ROUTES_DEMO.filter((r) => r.season === season).slice(0, limit);
}
