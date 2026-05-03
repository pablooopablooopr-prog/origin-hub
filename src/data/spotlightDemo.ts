/**
 * Datos demo para el SPOTLIGHT ROTATORIO de la home.
 *
 * Estructura: 6 nichos × N empresas. Cada día se elige UNA empresa por nicho
 * (rotación pseudo-aleatoria estable basada en la fecha) para que la sección
 * "HOY EN ORIGEN ○ · [FECHA]" cambie cada 24h pero sea consistente durante
 * el día (no bailan al refrescar).
 *
 * Cuando exista la integración real, este fichero pasará a ser fallback.
 */

export type SpotlightNicho =
  | "quesos"
  | "carnes"
  | "vinos"
  | "caza"
  | "miel"
  | "cooperativas";

export type SpotlightPlan = "basico" | "standard" | "destacado";

export interface SpotlightCompany {
  id: string;
  name: string;
  locality: string; // pueblo, provincia
  description: string; // 2 líneas máx
  plan: SpotlightPlan;
  /** Slug si la empresa existe en BD; si no, link a /soy-empresa */
  slug?: string;
}

export const SPOTLIGHT_NICHOS: { id: SpotlightNicho; label: string }[] = [
  { id: "quesos", label: "Quesos y Lácteos" },
  { id: "carnes", label: "Carnes y Embutidos" },
  { id: "vinos", label: "Vinos y Bodegas" },
  { id: "caza", label: "Caza y Monterías" },
  { id: "miel", label: "Miel y Apicultura" },
  { id: "cooperativas", label: "Cooperativas y Aceite" },
];

/**
 * Pool de empresas demo por nicho.
 * Las empresas con plan "destacado" aparecen primero en su nicho.
 */
export const SPOTLIGHT_POOL: Record<SpotlightNicho, SpotlightCompany[]> = {
  quesos: [
    {
      id: "demo-queseria-los-montes",
      name: "Quesería Los Montes",
      locality: "Porzuna · Ciudad Real",
      description:
        "Quesos artesanos de leche cruda de oveja manchega. Maduración natural en cuevas familiares desde 1978.",
      plan: "destacado",
    },
    {
      id: "demo-queseria-valdepenas",
      name: "Quesería Valdepeñas Tradición",
      locality: "Valdepeñas · Ciudad Real",
      description:
        "Queso manchego DOP con tres meses mínimo de curación. Producción limitada y trazabilidad total.",
      plan: "standard",
    },
    {
      id: "demo-queseria-malagon",
      name: "Lácteos del Bullaque",
      locality: "Malagón · Ciudad Real",
      description:
        "Pequeña explotación familiar. Yogures, requesón y quesos frescos sin aditivos.",
      plan: "basico",
    },
  ],

  carnes: [
    {
      id: "demo-carniceria-sierra",
      name: "Carnicería Sierra",
      locality: "Piedrabuena · Ciudad Real",
      description:
        "Carnicería de pueblo de toda la vida. Embutidos caseros, cordero manchego y caza de temporada.",
      plan: "basico",
    },
    {
      id: "demo-embutidos-cabaneros",
      name: "Embutidos Cabañeros",
      locality: "Retuerta del Bullaque · Ciudad Real",
      description:
        "Chorizo, morcilla y lomo curados al aire de la sierra. Cerdo ibérico de bellota local.",
      plan: "destacado",
    },
    {
      id: "demo-corderos-almagro",
      name: "Corderos del Campo de Calatrava",
      locality: "Almagro · Ciudad Real",
      description:
        "Cordero manchego IGP criado en pasto. Venta directa de la granja a particulares y restaurantes.",
      plan: "standard",
    },
  ],

  vinos: [
    {
      id: "demo-bodega-manchega",
      name: "Bodega Manchega",
      locality: "Valdepeñas · Ciudad Real",
      description:
        "Tempranillos y crianzas de viñedos centenarios en La Mancha. Producción artesanal limitada.",
      plan: "standard",
    },
    {
      id: "demo-bodega-tomelloso",
      name: "Bodega Tomelloso Hermanos",
      locality: "Tomelloso · Ciudad Real",
      description:
        "Bodega familiar con airén autóctono y tintos de altura. Visitas con cata todos los sábados.",
      plan: "destacado",
    },
    {
      id: "demo-bodega-alcazar",
      name: "Viñedos Alcázar",
      locality: "Alcázar de San Juan · Ciudad Real",
      description:
        "Vinos jóvenes y rosados frescos de cencibel. Pequeña tirada, gran carácter.",
      plan: "basico",
    },
  ],

  caza: [
    {
      id: "demo-coto-cabaneros",
      name: "Coto Cabañeros",
      locality: "Retuerta del Bullaque · Ciudad Real",
      description:
        "Monterías y batidas en finca privada lindera al Parque Nacional. Gestión sostenible y controlada.",
      plan: "destacado",
    },
    {
      id: "demo-coto-fuencaliente",
      name: "Coto Sierra Madrona",
      locality: "Fuencaliente · Ciudad Real",
      description:
        "Caza mayor de ciervo y jabalí. Rehalas propias, guía local y tradición cinegética.",
      plan: "standard",
    },
    {
      id: "demo-coto-chillon",
      name: "Coto Las Tiñosas",
      locality: "Chillón · Ciudad Real",
      description:
        "Caza menor de perdiz, conejo y zorzal. Reserva con plazas para grupos pequeños.",
      plan: "basico",
    },
  ],

  miel: [
    {
      id: "demo-apiarios-bullaque",
      name: "Apiarios del Bullaque",
      locality: "Porzuna · Ciudad Real",
      description:
        "Miel de jara y romero recolectada en colmenas tradicionales del valle. Sin filtrado industrial.",
      plan: "basico",
    },
    {
      id: "demo-apiarios-anchuras",
      name: "Apicultores de Anchuras",
      locality: "Anchuras · Ciudad Real",
      description:
        "Miel multifloral de alta montaña, polen y propóleos. Cooperativa de pequeños apicultores.",
      plan: "standard",
    },
    {
      id: "demo-apiarios-piedrabuena",
      name: "Miel Sierra de Piedrabuena",
      locality: "Piedrabuena · Ciudad Real",
      description:
        "Producción limitada de miel cruda de encinar. Catas guiadas y visitas al colmenar.",
      plan: "destacado",
    },
  ],

  cooperativas: [
    {
      id: "demo-coop-valle",
      name: "Cooperativa Valle de Calatrava",
      locality: "Almagro · Ciudad Real",
      description:
        "Aceite de oliva virgen extra de cornicabra y picual. Premio Mejor AOVE de La Mancha 2025.",
      plan: "standard",
    },
    {
      id: "demo-coop-daimiel",
      name: "Cooperativa Olivarera Daimiel",
      locality: "Daimiel · Ciudad Real",
      description:
        "AOVE de cosecha temprana. 800 socios productores. Trazabilidad de campo a botella.",
      plan: "destacado",
    },
    {
      id: "demo-coop-villarrubia",
      name: "Cooperativa San Isidro",
      locality: "Villarrubia de los Ojos · Ciudad Real",
      description:
        "Aceite, vino y queso bajo una misma marca. Tienda cooperativa en el centro del pueblo.",
      plan: "basico",
    },
  ],
};

/**
 * Devuelve UNA empresa por nicho según el día (rotación estable).
 *
 * Algoritmo:
 *   1. Para cada nicho, ordena: destacado primero, luego standard, luego básico
 *   2. Usa el día del año como índice (modulo nº empresas) para elegir una
 *   3. Si hay destacadas, dobla su probabilidad poniéndolas dos veces en la rotación
 */
export function getTodaysSpotlight(date: Date = new Date()): Record<SpotlightNicho, SpotlightCompany> {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const result = {} as Record<SpotlightNicho, SpotlightCompany>;

  for (const { id: nicho } of SPOTLIGHT_NICHOS) {
    const companies = SPOTLIGHT_POOL[nicho];

    // Ordenar por plan (destacado > standard > basico)
    const sorted = [...companies].sort((a, b) => {
      const order = { destacado: 0, standard: 1, basico: 2 } as const;
      return order[a.plan] - order[b.plan];
    });

    // Construir pool ponderado: destacado x2 (aparece más veces al mes)
    const weighted: SpotlightCompany[] = [];
    for (const c of sorted) {
      weighted.push(c);
      if (c.plan === "destacado") weighted.push(c);
    }

    result[nicho] = weighted[dayOfYear % weighted.length];
  }

  return result;
}
