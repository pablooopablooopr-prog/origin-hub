/**
 * Encabezado único de la sección mapa.
 * Eyebrow dorado + título serif + subtítulo + laurel decorativo.
 * Centrado.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { LaurelDecor } from './LaurelDecor';
import { ORIGEN_COLORS } from './mapStyles';

export const MapHeader: React.FC = () => {
  const location = useLocation();
  const showMapButton = location.pathname !== '/mapa';

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

      {/* Título serif editorial con laureles a los lados */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <LaurelDecor size={44} color={ORIGEN_COLORS.olive} variant="sprig" flip />
        <h2
          className="font-bold leading-tight tracking-tight"
          style={{
            color: ORIGEN_COLORS.brown,
            fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
            fontSize: 'clamp(1.5rem, 1rem + 2.4vw, 2.875rem)',
            whiteSpace: 'nowrap',
          }}
        >
          Descubre el tejido de Castilla-La Mancha
        </h2>
        <LaurelDecor size={44} color={ORIGEN_COLORS.olive} variant="sprig" />
      </div>

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

      {showMapButton && (
        <div className="mt-6 flex justify-center">
          <Link to="/mapa">
            <button
              type="button"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl px-6 text-[14px] font-semibold transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: ORIGEN_COLORS.olive,
                color: ORIGEN_COLORS.cream,
                boxShadow: '0 12px 24px rgba(92, 107, 46, 0.2)',
              }}
            >
              <MapPin size={16} strokeWidth={1.8} />
              Ver mapa completo
              <ArrowRight size={15} strokeWidth={1.9} />
            </button>
          </Link>
        </div>
      )}
    </header>
  );
};
