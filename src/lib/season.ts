/**
 * Sistema de temporadas estacionales de ORIGEN.
 *
 * Hay 4 temporadas de 3 meses cada una:
 *   - queso  (Marzo, Abril, Mayo)
 *   - miel   (Junio, Julio, Agosto)
 *   - caza   (Septiembre, Octubre, Noviembre)
 *   - vino   (Diciembre, Enero, Febrero)
 *
 * NOTA: vino y caza solapan en Octubre-Noviembre según briefing original
 * ("Caza Sep-Nov" + "Vino Oct-Dic"). Aquí tomamos una segmentación limpia
 * de 3 meses por temporada para evitar ambigüedad. La temporada activa
 * la decide el negocio en `routes.season`; este helper sólo da el default.
 */

export type Season = "queso" | "miel" | "caza" | "vino";

export interface SeasonInfo {
  id: Season;
  label: string;
  months: number[]; // 1=Enero, 12=Diciembre
  range: string;    // texto legible
  emoji: string;
}

export const SEASONS: Record<Season, SeasonInfo> = {
  queso: {
    id: "queso",
    label: "Queso",
    months: [3, 4, 5],
    range: "Marzo · Abril · Mayo",
    emoji: "🧀",
  },
  miel: {
    id: "miel",
    label: "Miel y Aceite",
    months: [6, 7, 8],
    range: "Junio · Julio · Agosto",
    emoji: "🍯",
  },
  caza: {
    id: "caza",
    label: "Caza y Monterías",
    months: [9, 10, 11],
    range: "Septiembre · Octubre · Noviembre",
    emoji: "🦌",
  },
  vino: {
    id: "vino",
    label: "Vino y Vendimia",
    months: [12, 1, 2],
    range: "Diciembre · Enero · Febrero",
    emoji: "🍷",
  },
};

/**
 * Devuelve la temporada activa según la fecha actual (o una fecha dada).
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1; // getMonth() es 0-indexed
  for (const season of Object.values(SEASONS)) {
    if (season.months.includes(month)) return season.id;
  }
  // Fallback teórico — nunca debería llegar aquí porque cubrimos los 12 meses
  return "queso";
}

/**
 * Devuelve metadata completa de la temporada activa.
 */
export function getCurrentSeasonInfo(date: Date = new Date()): SeasonInfo {
  return SEASONS[getCurrentSeason(date)];
}
