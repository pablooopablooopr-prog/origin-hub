/**
 * Encabezado único de la sección mapa.
 * Eyebrow dorado + título serif + subtítulo + laurel decorativo.
 * Centrado.
 */

import React from 'react';
import { LaurelDecor } from './LaurelDecor';
import { ORIGEN_COLORS } from './mapStyles';

export const MapHeader: React.FC = () => {
  return (
    <header className="relative text-center">
      {/* Eyebrow dorado con laureles a los lados */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <span
          className="block h-px w-10"
          style={{ backgroundColor: ORIGEN_COLORS.gold }}
          aria-hidden="true"
        />
        <span
          className="text-[11px] font-bold uppercase tracking-[0.3em]"
          style={{ color: ORIGEN_COLORS.gold }}
        >
          EL MAPA
        </span>
        <span
          className="block h-px w-10"
          style={{ backgroundColor: ORIGEN_COLORS.gold }}
          aria-hidden="true"
        />
      </div>

      {/* Título serif editorial — auto-fit en una línea */}
      <h2
        className="font-bold mb-4 leading-tight tracking-tight mx-auto"
        style={{
          color: ORIGEN_COLORS.brown,
          fontFamily:
            "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
          fontSize: 'clamp(1.5rem, 1rem + 2.4vw, 2.875rem)',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        Descubre el tejido de Castilla-La Mancha
      </h2>

      {/* Subtítulo centrado */}
      <p
        className="leading-relaxed mx-auto"
        style={{
          color: ORIGEN_COLORS.brownSoft,
          fontSize: 'clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)',
          maxWidth: '720px',
          lineHeight: 1.65,
        }}
      >
        Explora productores, restaurantes, experiencias y alojamientos de la
        región con una navegación clara, curada y visualmente elegante.
      </p>

      {/* Divisor laurel decorativo bajo el subtítulo */}
      <div className="flex justify-center mt-6 opacity-70">
        <LaurelDecor
          size={32}
          color={ORIGEN_COLORS.olive}
          variant="divider"
        />
      </div>
    </header>
  );
};
