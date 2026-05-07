/**
 * Helpers para construir markers premium personalizados.
 * Cada marker es un HTMLDivElement con SVG inline → tamaño/sombra controlados.
 */

import { ORIGEN_COLORS } from './mapStyles';

interface MarkerProps {
  nicho: string | null;
  featured: boolean;
  inRoute: boolean;
  selected?: boolean;
}

/** SVGs lineales por nicho. */
const NICHO_ICONS: Record<string, string> = {
  quesos: `<path d="M3 12 L12 5 L21 12 L21 18 Q21 19 20 19 L4 19 Q3 19 3 18 Z" />
           <circle cx="9" cy="14" r="0.8" fill="currentColor" />
           <circle cx="14" cy="13" r="0.6" fill="currentColor" />
           <circle cx="16" cy="16" r="0.7" fill="currentColor" />`,
  vinos: `<path d="M8 3 L16 3 L15 9 Q15 12 12 12 Q9 12 9 9 Z" />
          <line x1="12" y1="12" x2="12" y2="19" />
          <line x1="9" y1="20" x2="15" y2="20" />`,
  carnes: `<path d="M6 9 Q4 9 4 11 Q4 13 6 13 L8 13 L9 16 L11 17 L13 16 L14 13 L18 13 Q20 13 20 11 Q20 9 18 9 Z" />`,
  miel: `<ellipse cx="12" cy="13" rx="5" ry="6" />
         <line x1="9" y1="11" x2="15" y2="11" />
         <line x1="9" y1="14" x2="15" y2="14" />
         <path d="M10 7 L14 7 L13 5 L11 5 Z" />`,
  caza: `<path d="M12 4 L10 8 L7 7 L9 11 L7 14 L11 14 L12 18 L13 14 L17 14 L15 11 L17 7 L14 8 Z" />`,
  cooperativas: `<path d="M4 19 L4 11 L12 6 L20 11 L20 19 Z" />
                  <line x1="9" y1="19" x2="9" y2="13" />
                  <line x1="15" y1="19" x2="15" y2="13" />
                  <line x1="4" y1="13" x2="20" y2="13" />`,
  default: `<circle cx="12" cy="12" r="5" />`,
};

/** Color base por nicho. */
function colorForNicho(nicho: string | null): string {
  const map: Record<string, string> = {
    quesos: '#C9B385',
    vinos: '#7A2E2E',
    carnes: '#8B4513',
    miel: '#D4A017',
    caza: '#4A3F2A',
    cooperativas: ORIGEN_COLORS.olive,
  };
  if (!nicho) return ORIGEN_COLORS.olive;
  return map[nicho.toLowerCase()] || ORIGEN_COLORS.olive;
}

/**
 * Construye el HTMLDivElement de un marker custom.
 * Devuelve también un cleanup para listeners propios (hover scale).
 */
export function buildMarkerElement(props: MarkerProps): HTMLDivElement {
  const { nicho, featured, inRoute, selected } = props;
  const baseColor = colorForNicho(nicho);
  const size = featured ? 42 : inRoute ? 38 : 34;
  const ring = ORIGEN_COLORS.cream;

  const wrapper = document.createElement('div');
  wrapper.className = 'origen-marker';
  wrapper.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    transform: translateY(-${size / 2}px);
    cursor: pointer;
    transition: transform 0.18s ease, filter 0.18s ease;
    filter: drop-shadow(0 4px 6px rgba(60, 43, 32, 0.25));
  `;

  // Estrella dorada para destacado
  if (featured) {
    wrapper.innerHTML = `
      <svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad-${Math.random().toString(36).slice(2, 7)}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E8C25A" />
            <stop offset="100%" stop-color="#B8860B" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="22" fill="${ring}" stroke="${ORIGEN_COLORS.gold}" stroke-width="1.5" />
        <path d="M24 9 L28 19 L39 20 L31 27 L33 38 L24 32 L15 38 L17 27 L9 20 L20 19 Z"
              fill="${ORIGEN_COLORS.gold}" stroke="${ORIGEN_COLORS.brown}" stroke-width="0.8" stroke-linejoin="round" />
      </svg>
    `;
  } else if (inRoute) {
    // Círculo verde oscuro con icono ruta
    wrapper.innerHTML = `
      <svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="${ORIGEN_COLORS.olive}" stroke="${ring}" stroke-width="3" />
        <g fill="none" stroke="${ring}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 30 Q20 20 24 24 Q28 28 32 18" />
          <circle cx="16" cy="30" r="2" fill="${ring}" />
          <circle cx="32" cy="18" r="2" fill="${ring}" />
        </g>
      </svg>
    `;
  } else {
    // Pin estándar: círculo verde oliva con icono nicho
    const iconPath = NICHO_ICONS[nicho?.toLowerCase() || 'default'] || NICHO_ICONS.default;
    wrapper.innerHTML = `
      <svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" fill="${baseColor}" stroke="${ring}" stroke-width="3" />
        <g transform="translate(12 12) scale(1)" stroke="${ring}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          ${iconPath}
        </g>
      </svg>
    `;
  }

  if (selected) {
    wrapper.style.transform = `translateY(-${size / 2}px) scale(1.15)`;
    wrapper.style.filter = `drop-shadow(0 6px 12px rgba(184, 134, 11, 0.45))`;
  }

  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.transform = `translateY(-${size / 2}px) scale(1.08)`;
  });
  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.transform = selected
      ? `translateY(-${size / 2}px) scale(1.15)`
      : `translateY(-${size / 2}px) scale(1)`;
  });

  return wrapper;
}

/** Símbolo de polyline discontinua (para rutas). */
export const DASHED_LINE_SYMBOL: google.maps.Symbol = {
  path: 'M 0,-1 0,1',
  strokeOpacity: 1,
  strokeColor: ORIGEN_COLORS.gold,
  scale: 3,
};
