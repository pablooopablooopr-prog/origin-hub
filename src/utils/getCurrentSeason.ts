/**
 * Devuelve la clave de temporada activa según el mes actual.
 *
 * Sistema de 4 temporadas (3 meses cada una):
 *   - queso        → Marzo, Abril, Mayo
 *   - mielAceite   → Junio, Julio, Agosto
 *   - caza         → Septiembre, Octubre, Noviembre
 *   - vino         → Diciembre, Enero, Febrero
 *
 * Se usa en la home para resolver `seasons[currentSeasonKey]` desde
 * `src/config/seasons.ts` y pasarle el data al `<SeasonalHero/>`.
 *
 * Función pura → testeable y sin side-effects.
 */

export type SeasonKey = "queso" | "mielAceite" | "caza" | "vino";

export function getCurrentSeason(date: Date = new Date()): SeasonKey {
  const month = date.getMonth() + 1; // 1..12

  if ([3, 4, 5].includes(month)) return "queso";
  if ([6, 7, 8].includes(month)) return "mielAceite";
  if ([9, 10, 11].includes(month)) return "caza";
  return "vino"; // Dic, Ene, Feb
}
