/**
 * Datos demo para el SPOTLIGHT ROTATORIO de la home.
 *
 * Estructura: 6 nichos × 5 empresas. La home muestra un nicho a la vez
 * (1 ficha grande destacada + 4 fichas pequeñas) y va rotando:
 *
 *   - cada 7 s, las 5 fichas rotan una posición (la grande pasa a pequeña,
 *     una pequeña sube a grande)
 *   - tras 15 rotaciones (cada ficha ha sido destacada 3 veces), se cambia
 *     de nicho
 *   - orden de nichos: queso → carne → vino → caza → miel → cooperativas
 *
 * Cuando exista la integración real con la BD, este fichero queda como
 * fallback / seed.
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
  locality: string;
  description: string;
  plan: SpotlightPlan;
  /** Slug si la empresa existe en BD; si no, link a /soy-empresa */
  slug?: string;
  /** Foto representativa (Unsplash hasta que existan assets reales) */
  image: string;
  /** Etiqueta visible en la pill de categoría: "QUESOS", "CARNES"… */
  category: string;
  /** Color de fondo de la pill (verde oliva por defecto) */
  categoryColor: string;
  /** Color del texto de la pill */
  categoryTextColor: string;
}

export const SPOTLIGHT_NICHOS: { id: SpotlightNicho; label: string }[] = [
  { id: "quesos", label: "Quesos y Lácteos" },
  { id: "carnes", label: "Carnes y Embutidos" },
  { id: "vinos", label: "Vinos y Bodegas" },
  { id: "caza", label: "Caza y Monterías" },
  { id: "miel", label: "Miel y Apicultura" },
  { id: "cooperativas", label: "Cooperativas y Aceite" },
];

/** Orden de rotación por defecto */
export const SPOTLIGHT_NICHO_ORDER: SpotlightNicho[] = [
  "quesos",
  "carnes",
  "vinos",
  "caza",
  "miel",
  "cooperativas",
];

// Colores de categoría (badge) consistentes con el branding ORIGEN
const CAT = {
  queso: { bg: "#3d4a2a", fg: "#f1e5c8" },
  carne: { bg: "#5a3a20", fg: "#f1e5c8" },
  vino: { bg: "#5a2a2a", fg: "#f1e5c8" },
  caza: { bg: "#2a3a2a", fg: "#f1e5c8" },
  miel: { bg: "#8a6f2e", fg: "#f1e5c8" },
  coop: { bg: "#3a5a3a", fg: "#f1e5c8" },
} as const;

/**
 * Pool de 5 empresas demo por nicho.
 * Las "destacado" suelen ser la primera/más resaltable de cada lista.
 */
export const SPOTLIGHT_POOL: Record<SpotlightNicho, SpotlightCompany[]> = {
  // ============================================================
  // QUESOS — 5 empresas
  // ============================================================
  quesos: [
    {
      id: "demo-queseria-los-montes",
      name: "Quesería Los Montes",
      locality: "Porzuna, Ciudad Real",
      description:
        "Elaboración artesanal de quesos manchegos con leche de oveja de nuestros propios ganaderos.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80",
      category: "QUESOS",
      categoryColor: CAT.queso.bg,
      categoryTextColor: CAT.queso.fg,
    },
    {
      id: "demo-queseria-valdepenas",
      name: "Quesería Valdepeñas Tradición",
      locality: "Valdepeñas, Ciudad Real",
      description:
        "Queso manchego DOP con tres meses mínimo de curación. Producción limitada y trazabilidad total.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80",
      category: "QUESOS",
      categoryColor: CAT.queso.bg,
      categoryTextColor: CAT.queso.fg,
    },
    {
      id: "demo-queseria-malagon",
      name: "Lácteos del Bullaque",
      locality: "Malagón, Ciudad Real",
      description:
        "Pequeña explotación familiar. Yogures, requesón y quesos frescos sin aditivos.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=900&q=80",
      category: "QUESOS",
      categoryColor: CAT.queso.bg,
      categoryTextColor: CAT.queso.fg,
    },
    {
      id: "demo-queseria-tomelloso",
      name: "Quesos del Páramo",
      locality: "Tomelloso, Ciudad Real",
      description:
        "Quesos de oveja curados en cueva natural. Receta familiar transmitida durante cuatro generaciones.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1631379578550-7038263db699?auto=format&fit=crop&w=900&q=80",
      category: "QUESOS",
      categoryColor: CAT.queso.bg,
      categoryTextColor: CAT.queso.fg,
    },
    {
      id: "demo-queseria-cabra",
      name: "La Cabra Manchega",
      locality: "Daimiel, Ciudad Real",
      description:
        "Queso de cabra fresco, semicurado y curado. Rebaño autóctono de raza Florida.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1626957341926-98752fc2bbf2?auto=format&fit=crop&w=900&q=80",
      category: "QUESOS",
      categoryColor: CAT.queso.bg,
      categoryTextColor: CAT.queso.fg,
    },
  ],

  // ============================================================
  // CARNES — 5 empresas
  // ============================================================
  carnes: [
    {
      id: "demo-carniceria-sierra",
      name: "Carnicería Sierra",
      locality: "Piedrabuena, Ciudad Real",
      description:
        "Carne de caza mayor y vacuno manchego. Tradición ganadera y respeto por el producto.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80",
      category: "CARNES",
      categoryColor: CAT.carne.bg,
      categoryTextColor: CAT.carne.fg,
    },
    {
      id: "demo-embutidos-cabaneros",
      name: "Embutidos Cabañeros",
      locality: "Retuerta del Bullaque, Ciudad Real",
      description:
        "Chorizo, morcilla y lomo curados al aire de la sierra. Cerdo ibérico de bellota local.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1542901031-ec5eeb518e88?auto=format&fit=crop&w=900&q=80",
      category: "CARNES",
      categoryColor: CAT.carne.bg,
      categoryTextColor: CAT.carne.fg,
    },
    {
      id: "demo-corderos-almagro",
      name: "Corderos del Campo de Calatrava",
      locality: "Almagro, Ciudad Real",
      description:
        "Cordero manchego IGP criado en pasto. Venta directa de la granja a particulares y restaurantes.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1607623815897-22ce1efe71c3?auto=format&fit=crop&w=900&q=80",
      category: "CARNES",
      categoryColor: CAT.carne.bg,
      categoryTextColor: CAT.carne.fg,
    },
    {
      id: "demo-jamoneria-anchuras",
      name: "Jamonería del Monte",
      locality: "Anchuras, Ciudad Real",
      description:
        "Jamón ibérico curado en bodega natural. Ciclo cerrado: cría, cebo y curación propios.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1623595119708-26b1f7500ddc?auto=format&fit=crop&w=900&q=80",
      category: "CARNES",
      categoryColor: CAT.carne.bg,
      categoryTextColor: CAT.carne.fg,
    },
    {
      id: "demo-carnes-monte",
      name: "Carnes del Monte Manchego",
      locality: "Fuencaliente, Ciudad Real",
      description:
        "Venado, ciervo y jabalí de monterías propias. Despiece artesanal y entrega refrigerada.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1551446591-142875a901a1?auto=format&fit=crop&w=900&q=80",
      category: "CARNES",
      categoryColor: CAT.carne.bg,
      categoryTextColor: CAT.carne.fg,
    },
  ],

  // ============================================================
  // VINOS — 5 empresas
  // ============================================================
  vinos: [
    {
      id: "demo-bodega-manchega",
      name: "Bodega Manchega",
      locality: "Valdepeñas, Ciudad Real",
      description:
        "Vinos con carácter, elaborados en nuestra tierra con uvas seleccionadas.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
      category: "VINO",
      categoryColor: CAT.vino.bg,
      categoryTextColor: CAT.vino.fg,
    },
    {
      id: "demo-bodega-tomelloso",
      name: "Bodega Tomelloso Hermanos",
      locality: "Tomelloso, Ciudad Real",
      description:
        "Bodega familiar con airén autóctono y tintos de altura. Visitas con cata todos los sábados.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
      category: "VINO",
      categoryColor: CAT.vino.bg,
      categoryTextColor: CAT.vino.fg,
    },
    {
      id: "demo-bodega-alcazar",
      name: "Viñedos Alcázar",
      locality: "Alcázar de San Juan, Ciudad Real",
      description:
        "Vinos jóvenes y rosados frescos de cencibel. Pequeña tirada, gran carácter.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=900&q=80",
      category: "VINO",
      categoryColor: CAT.vino.bg,
      categoryTextColor: CAT.vino.fg,
    },
    {
      id: "demo-bodega-cerro",
      name: "Bodegas El Cerro",
      locality: "Manzanares, Ciudad Real",
      description:
        "Crianzas y reservas en barrica de roble francés. Tres D.O. en el mismo viñedo.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80",
      category: "VINO",
      categoryColor: CAT.vino.bg,
      categoryTextColor: CAT.vino.fg,
    },
    {
      id: "demo-bodega-pago",
      name: "Crianzas de Pago",
      locality: "Socuéllamos, Ciudad Real",
      description:
        "Vino de pago con D.O. propia. Vendimia manual y nocturna para preservar aromas.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=900&q=80",
      category: "VINO",
      categoryColor: CAT.vino.bg,
      categoryTextColor: CAT.vino.fg,
    },
  ],

  // ============================================================
  // CAZA — 5 empresas
  // ============================================================
  caza: [
    {
      id: "demo-coto-cabaneros",
      name: "Coto Cabañeros",
      locality: "Retuerta del Bullaque, Ciudad Real",
      description:
        "Gestión cinegética sostenible en el corazón del Parque Nacional de Cabañeros.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
      category: "CAZA",
      categoryColor: CAT.caza.bg,
      categoryTextColor: CAT.caza.fg,
    },
    {
      id: "demo-coto-fuencaliente",
      name: "Coto Sierra Madrona",
      locality: "Fuencaliente, Ciudad Real",
      description:
        "Caza mayor de ciervo y jabalí. Rehalas propias, guía local y tradición cinegética.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80",
      category: "CAZA",
      categoryColor: CAT.caza.bg,
      categoryTextColor: CAT.caza.fg,
    },
    {
      id: "demo-coto-chillon",
      name: "Coto Las Tiñosas",
      locality: "Chillón, Ciudad Real",
      description:
        "Caza menor de perdiz, conejo y zorzal. Reserva con plazas para grupos pequeños.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?auto=format&fit=crop&w=900&q=80",
      category: "CAZA",
      categoryColor: CAT.caza.bg,
      categoryTextColor: CAT.caza.fg,
    },
    {
      id: "demo-coto-encinar",
      name: "Coto del Encinar",
      locality: "Horcajo de los Montes, Ciudad Real",
      description:
        "Monterías controladas con báscula propia y trofeo medido. Cordón sanitario veterinario.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1506535995048-638aa1b62b77?auto=format&fit=crop&w=900&q=80",
      category: "CAZA",
      categoryColor: CAT.caza.bg,
      categoryTextColor: CAT.caza.fg,
    },
    {
      id: "demo-coto-norte",
      name: "Reserva Sierra Norte",
      locality: "Hellín, Albacete",
      description:
        "Reserva privada con cabra montés y arruí. Recechos guiados con biólogo de campo.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
      category: "CAZA",
      categoryColor: CAT.caza.bg,
      categoryTextColor: CAT.caza.fg,
    },
  ],

  // ============================================================
  // MIEL — 5 empresas
  // ============================================================
  miel: [
    {
      id: "demo-apiarios-bullaque",
      name: "Apiarios del Bullaque",
      locality: "Porzuna, Ciudad Real",
      description:
        "Miel artesanal de tomillo y romero. Cuidado de las abejas, respeto por la naturaleza.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=80",
      category: "APÍCOLA",
      categoryColor: CAT.miel.bg,
      categoryTextColor: CAT.miel.fg,
    },
    {
      id: "demo-apiarios-anchuras",
      name: "Apicultores de Anchuras",
      locality: "Anchuras, Ciudad Real",
      description:
        "Miel multifloral de alta montaña, polen y propóleos. Cooperativa de pequeños apicultores.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=900&q=80",
      category: "APÍCOLA",
      categoryColor: CAT.miel.bg,
      categoryTextColor: CAT.miel.fg,
    },
    {
      id: "demo-apiarios-piedrabuena",
      name: "Miel Sierra de Piedrabuena",
      locality: "Piedrabuena, Ciudad Real",
      description:
        "Producción limitada de miel cruda de encinar. Catas guiadas y visitas al colmenar.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=80",
      category: "APÍCOLA",
      categoryColor: CAT.miel.bg,
      categoryTextColor: CAT.miel.fg,
    },
    {
      id: "demo-apiarios-monte",
      name: "Apicultor del Monte",
      locality: "Almadén, Ciudad Real",
      description:
        "Miel de jara y brezo recolectada a mano. Envasado en frío para conservar enzimas.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1593411884728-b39bdcb1f1f6?auto=format&fit=crop&w=900&q=80",
      category: "APÍCOLA",
      categoryColor: CAT.miel.bg,
      categoryTextColor: CAT.miel.fg,
    },
    {
      id: "demo-miel-cera",
      name: "Miel y Cera Bullaque",
      locality: "Alcoba, Ciudad Real",
      description:
        "Miel monofloral de eucalipto y velas de cera virgen. Tienda en la propia colmena.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?auto=format&fit=crop&w=900&q=80",
      category: "APÍCOLA",
      categoryColor: CAT.miel.bg,
      categoryTextColor: CAT.miel.fg,
    },
  ],

  // ============================================================
  // COOPERATIVAS / ACEITE — 5 empresas
  // ============================================================
  cooperativas: [
    {
      id: "demo-coop-valle",
      name: "Cooperativa Valle de Calatrava",
      locality: "Almagro, Ciudad Real",
      description:
        "Aceite de oliva virgen extra de cornicabra y picual. Premio Mejor AOVE de La Mancha 2025.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1474440692490-2e83ae13ba29?auto=format&fit=crop&w=900&q=80",
      category: "COOPERATIVA",
      categoryColor: CAT.coop.bg,
      categoryTextColor: CAT.coop.fg,
    },
    {
      id: "demo-coop-daimiel",
      name: "Cooperativa Olivarera Daimiel",
      locality: "Daimiel, Ciudad Real",
      description:
        "AOVE de cosecha temprana. 800 socios productores. Trazabilidad de campo a botella.",
      plan: "destacado",
      image: "https://images.unsplash.com/photo-1601379329542-31c59cf64af2?auto=format&fit=crop&w=900&q=80",
      category: "COOPERATIVA",
      categoryColor: CAT.coop.bg,
      categoryTextColor: CAT.coop.fg,
    },
    {
      id: "demo-coop-villarrubia",
      name: "Cooperativa San Isidro",
      locality: "Villarrubia de los Ojos, Ciudad Real",
      description:
        "Aceite, vino y queso bajo una misma marca. Tienda cooperativa en el centro del pueblo.",
      plan: "basico",
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80",
      category: "COOPERATIVA",
      categoryColor: CAT.coop.bg,
      categoryTextColor: CAT.coop.fg,
    },
    {
      id: "demo-coop-vega",
      name: "Almazara La Vega",
      locality: "Manzanares, Ciudad Real",
      description:
        "Almazara de molienda en frío. AOVE ecológico certificado y catas con maestro almazarero.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1597306083148-bc4eb1d2cd99?auto=format&fit=crop&w=900&q=80",
      category: "COOPERATIVA",
      categoryColor: CAT.coop.bg,
      categoryTextColor: CAT.coop.fg,
    },
    {
      id: "demo-coop-pedro",
      name: "Cooperativa San Pedro",
      locality: "Tomelloso, Ciudad Real",
      description:
        "AOVE de picual y arbequina. Producción limitada por hectárea para máxima calidad.",
      plan: "standard",
      image: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=900&q=80",
      category: "COOPERATIVA",
      categoryColor: CAT.coop.bg,
      categoryTextColor: CAT.coop.fg,
    },
  ],
};

/**
 * COMPATIBILIDAD HACIA ATRÁS — usado por el SpotlightToday original
 * (1 empresa por nicho). Se mantiene para no romper imports.
 *
 * El nuevo SpotlightToday usa SPOTLIGHT_POOL directamente con su lógica
 * de rotación.
 */
export function getTodaysSpotlight(date: Date = new Date()): Record<SpotlightNicho, SpotlightCompany> {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const result = {} as Record<SpotlightNicho, SpotlightCompany>;

  for (const { id: nicho } of SPOTLIGHT_NICHOS) {
    const companies = SPOTLIGHT_POOL[nicho];

    const sorted = [...companies].sort((a, b) => {
      const order = { destacado: 0, standard: 1, basico: 2 } as const;
      return order[a.plan] - order[b.plan];
    });

    const weighted: SpotlightCompany[] = [];
    for (const c of sorted) {
      weighted.push(c);
      if (c.plan === "destacado") weighted.push(c);
    }

    result[nicho] = weighted[dayOfYear % weighted.length];
  }

  return result;
}
