/**
 * Paleta de colores por nicho para el mapa
 * Consistente con diseño home (verde oliva, beige, dorado)
 */

export const MAP_BASE_COLORS = {
  greenDark: '#5C6B2E',      // Verde oliva oscuro (principal)
  beige: '#C8B89A',          // Beige/tierra (secundario)
  cream: '#F5F0E8',          // Crema (fondos)
  brownDark: '#3D2B1F',      // Marrón oscuro (textos)
  gold: '#B8860B',           // Dorado (premium/destacado)
  white: '#FFFFFF',          // Blanco (contraste)
} as const;

export const NICHO_COLORS = {
  quesos: '#F4E4A0',           // Amarillo cálido
  carnes: '#D17C6F',           // Rojizo/terracota
  vinos: '#8B4968',            // Morado vino
  caza: '#556B3C',             // Verde oscuro
  miel: '#E8B44A',             // Dorado miel
  cooperativas: '#6B7A4F',     // Verde oliva
  restaurantes: '#7A6B4D',     // Marrón claro
  alojamiento: '#6B8E7F',      // Verde grisáceo
  otro: '#9B8B7E',             // Gris tierra
} as const;

export const PLAN_SIZES = {
  basico: 24,      // px diámetro
  standard: 28,
  destacado: 32,
} as const;

export const PLAN_Z_INDEX = {
  basico: 1,
  standard: 2,
  destacado: 3,
} as const;

/**
 * Obtener color por nicho
 * Maneja múltiples variaciones de nombres de categorías
 */
export function getNichoColor(
  nicho: string | null | undefined
): string {
  if (!nicho) return NICHO_COLORS.otro;

  const normalized = nicho
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u');

  // Mapeo flexible de nombres de categorías a nichos
  if (
    normalized.includes('queso') ||
    normalized.includes('lacteo') ||
    normalized.includes('queseria')
  ) {
    return NICHO_COLORS.quesos;
  }
  if (
    normalized.includes('carne') ||
    normalized.includes('embutido') ||
    normalized.includes('jamon')
  ) {
    return NICHO_COLORS.carnes;
  }
  if (
    normalized.includes('vino') ||
    normalized.includes('bodega') ||
    normalized.includes('vinicola')
  ) {
    return NICHO_COLORS.vinos;
  }
  if (
    normalized.includes('caza') ||
    normalized.includes('monterias') ||
    normalized.includes('cinegética')
  ) {
    return NICHO_COLORS.caza;
  }
  if (
    normalized.includes('miel') ||
    normalized.includes('apicultura') ||
    normalized.includes('apicola')
  ) {
    return NICHO_COLORS.miel;
  }
  if (
    normalized.includes('cooperativa') ||
    normalized.includes('aceite') ||
    normalized.includes('oliva')
  ) {
    return NICHO_COLORS.cooperativas;
  }
  if (
    normalized.includes('restaurante') ||
    normalized.includes('gastronomico') ||
    normalized.includes('comida')
  ) {
    return NICHO_COLORS.restaurantes;
  }
  if (
    normalized.includes('alojamiento') ||
    normalized.includes('hostal') ||
    normalized.includes('rural') ||
    normalized.includes('hotel')
  ) {
    return NICHO_COLORS.alojamiento;
  }

  return NICHO_COLORS.otro;
}

/**
 * Obtener tamaño de pin por plan
 */
export function getPlanSize(plan: string | null | undefined): number {
  if (!plan) return PLAN_SIZES.basico;

  const key = plan.toLowerCase() as keyof typeof PLAN_SIZES;
  return PLAN_SIZES[key] || PLAN_SIZES.basico;
}

/**
 * Obtener z-index por plan
 */
export function getPlanZIndex(plan: string | null | undefined): number {
  if (!plan) return PLAN_Z_INDEX.basico;

  const key = plan.toLowerCase() as keyof typeof PLAN_Z_INDEX;
  return PLAN_Z_INDEX[key] || PLAN_Z_INDEX.basico;
}

/**
 * Obtener color oscuro para hover
 */
export function getDarkerColor(hexColor: string): string {
  const num = parseInt(hexColor.slice(1), 16);
  const r = Math.max(0, (num >> 16) - 30);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - 30);
  const b = Math.max(0, (num & 0x0000ff) - 30);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
