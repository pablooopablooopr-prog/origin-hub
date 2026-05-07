/**
 * Encabezado único de la sección mapa.
 * Eyebrow dorado + título serif + subtítulo + laurel decorativo.
 */

import React from 'react';
import { LaurelDecor } from './LaurelDecor';
import { ORIGEN_COLORS } from './mapStyles';

export const MapHeader: React.FC = () => {
  return (
    <header className="relative">
      {/* Laurel decorativo esquina superior derecha */}
      <div
        className="absolute top-0 right-0 pointer-events-none hidden md:block"
        style={{ transform: 'translate(20%, -25%)' }}
        aria-hidden="true"
      >
        <LaurelDecor size={140} color={ORIGEN_COLORS.olive} variant="corner" flip />
      </div>

      <div className="relative">
        {/* Eyebrow dorado */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="block h-px w-8"
            style={{ backgroundColor: ORIGEN_COLORS.gold }}
          />
          <span
            className="text-xs font-bold uppercase tracking-[0.25em]"
            style={{ color: ORIGEN_COLORS.gold }}
          >
            EL MAPA
          </span>
        </div>

        {/* Título serif editorial */}
        <h2
          className="font-bold mb-4 leading-tight tracking-tight"
          style={{
            color: ORIGEN_COLORS.brown,
            fontFamily:
              "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
            fontSize: 'clamp(1.875rem, 1.2rem + 2.5vw, 3rem)',
            maxWidth: '780px',
          }}
        >
          Descubre el tejido de Castilla-La Mancha
        </h2>

        {/* Subtítulo */}
        <p
          className="leading-relaxed"
          style={{
            color: ORIGEN_COLORS.brownSoft,
            fontSize: 'clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)',
            maxWidth: '700px',
            lineHeight: 1.65,
          }}
        >
          Explora productores, restaurantes, experiencias y alojamientos de la
          región con una navegación clara, curada y visualmente elegante.
        </p>
      </div>
    </header>
  );
};
