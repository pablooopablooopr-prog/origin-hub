/**
 * CONFIGURACIÓN DE TEMPORADAS · ORIGEN ○
 *
 * Sistema reutilizable: 1 sola fuente de verdad para los 4 trimestres.
 * El componente <SeasonalHero/> consume este objeto vía:
 *
 *   import { seasons } from "@/config/seasons";
 *   import { getCurrentSeason } from "@/utils/getCurrentSeason";
 *
 *   const seasonData = seasons[getCurrentSeason()];
 *   <SeasonalHero data={seasonData} />
 *
 * Para forzar manualmente una temporada en pruebas:
 *
 *   <SeasonalHero data={seasons.queso} />
 *
 * ASSETS DE IMÁGENES
 *   Las rutas /seasons/<slug>/*.jpg y /textures/*.jpg apuntan al árbol
 *   final cuando subas las fotos a /public/. Mientras tanto, el componente
 *   tiene fallbacks a Unsplash para que la sección no se rompa visualmente
 *   (ver FALLBACK_IMAGES en SeasonalHero.tsx).
 *
 *   Para activar tus fotos definitivas, súbelas a:
 *     /public/seasons/queso/hero.jpg          (foto principal queso)
 *     /public/seasons/queso/ovejas.jpg        (foto secundaria izq)
 *     /public/seasons/queso/quesero.jpg       (foto secundaria der)
 *     /public/seasons/queso/sello-temporada.png   (sello de cera transparente)
 *     /public/seasons/queso/sello-castilla.png    (sello CLM transparente)
 *     /public/textures/dark-wood.jpg          (textura madera fondo)
 *     /public/textures/paper-aged.jpg         (papel envejecido)
 *     /public/textures/green-paper.jpg        (papel verde cinta)
 *
 *   Y repite la estructura para mielAceite, caza y vino.
 */

import type { SeasonKey } from "@/utils/getCurrentSeason";

// ============================================================
// TYPES
// ============================================================

export interface SeasonCTA {
  label: string;
  href: string;
}

export interface SeasonColors {
  /** Verde principal (cintas, botones, badge activo) */
  primary: string;
  /** Dorado / acento */
  accent: string;
  /** Crema del papel */
  cream: string;
  /** Beige medio */
  beige: string;
  /** Marrón texto / fondo */
  dark: string;
}

export interface SeasonImages {
  hero: string;
  sheep: string;
  maker: string;
  wood: string;
  paper: string;
  greenPaper: string;
}

export interface SeasonSeals {
  season: string;
  castilla: string;
}

export type SeasonFeatureIcon = "cheese" | "utensils" | "route" | "tag";

export interface SeasonFeature {
  label: string;
  icon: SeasonFeatureIcon;
}

export type SeasonStatIcon = "producer" | "route" | "seal";

export interface SeasonStat {
  value: string;
  label: string;
  icon: SeasonStatIcon;
}

export interface SeasonSideNote {
  title: string;
  text: string;
}

export interface SeasonData {
  id: SeasonKey;
  slug: string;
  themeClass: string;
  /** Etiqueta meteorológica (PRIMAVERA / VERANO / OTOÑO / INVIERNO) */
  seasonLabel: string;
  activeBadge: string;
  /** Nombre del producto/tema (Queso / Miel y Aceite / Caza / Vino) */
  productName: string;
  title: string;
  description: string;
  months: string[];
  quote: string;
  ctas: { primary: SeasonCTA; secondary: SeasonCTA };
  colors: SeasonColors;
  images: SeasonImages;
  seals: SeasonSeals;
  features: SeasonFeature[];
  stats: SeasonStat[];
  sideNote: SeasonSideNote;
  handwrittenNote: string;
}

// ============================================================
// SEASONS
// ============================================================

export const seasons: Record<SeasonKey, SeasonData> = {
  // -----------------------------------------------------------
  // QUESO · Primavera (Marzo · Abril · Mayo)
  // -----------------------------------------------------------
  queso: {
    id: "queso",
    slug: "queso",
    themeClass: "theme-queso",
    seasonLabel: "PRIMAVERA",
    activeBadge: "TEMPORADA ACTIVA",
    productName: "Queso",
    title: "La Temporada del Queso",
    description:
      "Queserías que honran la tradición, restaurantes que lo interpretan con creatividad y rutas que te llevan al origen de todo. Descubre el queso manchego y el sabor auténtico de Castilla–La Mancha en su mejor momento.",
    months: ["MARZO", "ABRIL", "MAYO"],
    quote: "Una plataforma que cambia con el ritmo de la tierra.",
    ctas: {
      primary: { label: "VER RUTAS DE ESTA ESTACIÓN", href: "/rutas?temporada=queso" },
      secondary: { label: "UNIRME AL CLUB TRIMESTRAL · 29€", href: "/customer-auth?intent=suscribirme" },
    },
    colors: {
      primary: "#3d4a2a",
      accent: "#b8923f",
      cream: "#f1e5c8",
      beige: "#c9b89a",
      dark: "#2a2418",
    },
    images: {
      hero: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1200&q=90",
      sheep: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=85",
      maker: "https://images.unsplash.com/photo-1605707447752-4cf680f18ead?auto=format&fit=crop&w=700&q=85",
      wood: "/textures/light-wood.jpg",
      paper: "/textures/paper-aged.jpg",
      greenPaper: "/textures/green-paper.jpg",
    },
    seals: {
      season: "/seasons/queso/sello-temporada.png",
      castilla: "/seasons/queso/sello-castilla.png",
    },
    features: [
      { label: "Queserías destacadas", icon: "cheese" },
      { label: "Restaurantes seleccionados", icon: "utensils" },
      { label: "Rutas verificadas", icon: "route" },
      { label: "Descuentos exclusivos", icon: "tag" },
    ],
    stats: [
      { value: "12", label: "productores en foco", icon: "producer" },
      { value: "3", label: "rutas activas", icon: "route" },
      { value: "Beneficios", label: "para miembros", icon: "seal" },
    ],
    sideNote: {
      title: "CASTILLA–LA MANCHA",
      text: "Tierra de pastos infinitos, quesos con historia y personas que cuidan cada detalle.",
    },
    handwrittenNote: "Sabor que nace de la tierra y se comparte.",
  },

  // -----------------------------------------------------------
  // MIEL Y ACEITE · Verano (Junio · Julio · Agosto)
  // -----------------------------------------------------------
  mielAceite: {
    id: "mielAceite",
    slug: "miel-aceite",
    themeClass: "theme-miel-aceite",
    seasonLabel: "VERANO",
    activeBadge: "TEMPORADA ACTIVA",
    productName: "Miel y Aceite",
    title: "La Temporada de la Miel y el Aceite",
    description:
      "Apicultores que cuidan colmenas centenarias, almazaras de cosecha temprana y rutas por sierras donde el AOVE y la miel marcan el calendario gastronómico del verano manchego.",
    months: ["JUNIO", "JULIO", "AGOSTO"],
    quote: "Dulzura que nace del sol y de la paciencia.",
    ctas: {
      primary: { label: "VER RUTAS DE ESTA ESTACIÓN", href: "/rutas?temporada=miel" },
      secondary: { label: "UNIRME AL CLUB TRIMESTRAL · 29€", href: "/customer-auth?intent=suscribirme" },
    },
    colors: {
      primary: "#6b5a2a",
      accent: "#d4a83a",
      cream: "#f5ecc8",
      beige: "#d8c89a",
      dark: "#2e2410",
    },
    images: {
      hero: "/seasons/miel-aceite/hero.jpg",
      sheep: "/seasons/miel-aceite/colmenas.jpg",
      maker: "/seasons/miel-aceite/almazara.jpg",
      wood: "/textures/light-wood.jpg",
      paper: "/textures/paper-aged.jpg",
      greenPaper: "/textures/green-paper.jpg",
    },
    seals: {
      season: "/seasons/miel-aceite/sello-temporada.png",
      castilla: "/seasons/miel-aceite/sello-castilla.png",
    },
    features: [
      { label: "Apicultores destacados", icon: "cheese" },
      { label: "Almazaras seleccionadas", icon: "utensils" },
      { label: "Rutas del olivar", icon: "route" },
      { label: "Descuentos de cosecha", icon: "tag" },
    ],
    stats: [
      { value: "9", label: "productores en foco", icon: "producer" },
      { value: "2", label: "rutas activas", icon: "route" },
      { value: "Beneficios", label: "para miembros", icon: "seal" },
    ],
    sideNote: {
      title: "CASTILLA–LA MANCHA",
      text: "Sierras de jara y romero, panales escondidos y olivares que esperan junio para celebrar la cosecha.",
    },
    handwrittenNote: "Dulzura que nace del sol y de la paciencia.",
  },

  // -----------------------------------------------------------
  // CAZA · Otoño (Septiembre · Octubre · Noviembre)
  // -----------------------------------------------------------
  caza: {
    id: "caza",
    slug: "caza",
    themeClass: "theme-caza",
    seasonLabel: "OTOÑO",
    activeBadge: "TEMPORADA ACTIVA",
    productName: "Caza",
    title: "La Temporada de la Caza",
    description:
      "Monterías gestionadas con rigor, rehalas familiares y restaurantes que devuelven a la mesa el venado, el corzo y la perdiz roja en su mejor momento del año.",
    months: ["SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE"],
    quote: "Tradición que vive en el monte y en la mesa.",
    ctas: {
      primary: { label: "VER RUTAS DE ESTA ESTACIÓN", href: "/rutas?temporada=caza" },
      secondary: { label: "UNIRME AL CLUB TRIMESTRAL · 29€", href: "/customer-auth?intent=suscribirme" },
    },
    colors: {
      primary: "#5a3a20",
      accent: "#a87838",
      cream: "#ecdfc8",
      beige: "#c9b09a",
      dark: "#2a1c10",
    },
    images: {
      hero: "/seasons/caza/hero.jpg",
      sheep: "/seasons/caza/dehesa.jpg",
      maker: "/seasons/caza/rehala.jpg",
      wood: "/textures/light-wood.jpg",
      paper: "/textures/paper-aged.jpg",
      greenPaper: "/textures/green-paper.jpg",
    },
    seals: {
      season: "/seasons/caza/sello-temporada.png",
      castilla: "/seasons/caza/sello-castilla.png",
    },
    features: [
      { label: "Cotos verificados", icon: "cheese" },
      { label: "Restaurantes de caza", icon: "utensils" },
      { label: "Rutas de monte", icon: "route" },
      { label: "Descuentos de temporada", icon: "tag" },
    ],
    stats: [
      { value: "7", label: "productores en foco", icon: "producer" },
      { value: "2", label: "rutas activas", icon: "route" },
      { value: "Beneficios", label: "para miembros", icon: "seal" },
    ],
    sideNote: {
      title: "CASTILLA–LA MANCHA",
      text: "Sierras y dehesas inmensas donde la caza mayor y menor sigue siendo oficio, cultura y respeto.",
    },
    handwrittenNote: "Tradición que vive en el monte y en la mesa.",
  },

  // -----------------------------------------------------------
  // VINO · Invierno (Diciembre · Enero · Febrero)
  // -----------------------------------------------------------
  vino: {
    id: "vino",
    slug: "vino",
    themeClass: "theme-vino",
    seasonLabel: "INVIERNO",
    activeBadge: "TEMPORADA ACTIVA",
    productName: "Vino",
    title: "La Temporada del Vino",
    description:
      "Bodegas centenarias en plena guarda, catas verticales en cuevas familiares y rutas que recorren las cepas de Tempranillo, Airén y Bobal del viñedo más grande del mundo.",
    months: ["DICIEMBRE", "ENERO", "FEBRERO"],
    quote: "El tiempo embotellado se comparte despacio.",
    ctas: {
      primary: { label: "VER RUTAS DE ESTA ESTACIÓN", href: "/rutas?temporada=vino" },
      secondary: { label: "UNIRME AL CLUB TRIMESTRAL · 29€", href: "/customer-auth?intent=suscribirme" },
    },
    colors: {
      primary: "#6b2a2a",
      accent: "#b8923f",
      cream: "#f0e0d0",
      beige: "#c9a89a",
      dark: "#2a1010",
    },
    images: {
      hero: "/seasons/vino/hero.jpg",
      sheep: "/seasons/vino/vinedo.jpg",
      maker: "/seasons/vino/bodega.jpg",
      wood: "/textures/light-wood.jpg",
      paper: "/textures/paper-aged.jpg",
      greenPaper: "/textures/green-paper.jpg",
    },
    seals: {
      season: "/seasons/vino/sello-temporada.png",
      castilla: "/seasons/vino/sello-castilla.png",
    },
    features: [
      { label: "Bodegas centenarias", icon: "cheese" },
      { label: "Restaurantes con D.O.", icon: "utensils" },
      { label: "Rutas del vino", icon: "route" },
      { label: "Descuentos en cata", icon: "tag" },
    ],
    stats: [
      { value: "14", label: "productores en foco", icon: "producer" },
      { value: "4", label: "rutas activas", icon: "route" },
      { value: "Beneficios", label: "para miembros", icon: "seal" },
    ],
    sideNote: {
      title: "CASTILLA–LA MANCHA",
      text: "El viñedo más grande del mundo, con bodegas que cuentan siglos y enólogos que escriben los próximos.",
    },
    handwrittenNote: "El tiempo embotellado se comparte despacio.",
  },
};
