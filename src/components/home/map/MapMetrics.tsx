/**
 * Métricas inferiores: barra compacta con iconos + separadores + laurel.
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, Star, Route } from 'lucide-react';
import { ORIGEN_COLORS } from './mapStyles';
import { LaurelDecor } from './LaurelDecor';

interface MapMetricsProps {
  empresas: number;
  destacados: number;
  enRutas: number;
}

export const MapMetrics: React.FC<MapMetricsProps> = ({
  empresas,
  destacados,
  enRutas,
}) => {
  const location = useLocation();
  const showMapButton = location.pathname !== '/mapa';

  return (
    <div
      className="relative mt-2 rounded-2xl px-4 md:px-8 py-4"
      style={{
        backgroundColor: ORIGEN_COLORS.cream,
        border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
        boxShadow: '0 2px 12px rgba(60, 43, 32, 0.05)',
      }}
    >
      {/* Laurel izquierda */}
      <div
        className="absolute left-2 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none"
        aria-hidden="true"
      >
        <LaurelDecor size={48} color={ORIGEN_COLORS.olive} variant="sprig" />
      </div>
      {/* Laurel derecha */}
      <div
        className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none"
        aria-hidden="true"
      >
        <LaurelDecor size={48} color={ORIGEN_COLORS.olive} variant="sprig" flip />
      </div>

      <div className="flex flex-wrap items-center justify-around gap-3 md:justify-center md:gap-10">
        <Metric
          icon={<Building2 size={22} strokeWidth={1.6} />}
          value={empresas}
          label="Empresas"
          tone="brown"
        />
        <Separator />
        <Metric
          icon={<Star size={22} strokeWidth={1.6} />}
          value={destacados}
          label="Destacados"
          tone="gold"
        />
        <Separator />
        <Metric
          icon={<Route size={22} strokeWidth={1.6} />}
          value={enRutas}
          label="En rutas activas"
          tone="olive"
        />
        {showMapButton && (
          <Link to="/mapa" className="w-full sm:w-auto">
            <button
              type="button"
              className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 sm:w-auto"
              style={{
                backgroundColor: ORIGEN_COLORS.brown,
                color: ORIGEN_COLORS.cream,
                boxShadow: '0 12px 24px rgba(61, 43, 31, 0.18)',
              }}
            >
              <MapPin size={15} strokeWidth={1.8} />
              Ver mapa completo
              <ArrowRight size={14} strokeWidth={1.9} />
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

const Separator: React.FC = () => (
  <span
    className="block h-10 w-px"
    style={{ backgroundColor: ORIGEN_COLORS.beigeSoft }}
    aria-hidden="true"
  />
);

interface MetricProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  tone: 'brown' | 'gold' | 'olive';
}

const Metric: React.FC<MetricProps> = ({ icon, value, label, tone }) => {
  const iconColor =
    tone === 'gold'
      ? ORIGEN_COLORS.gold
      : tone === 'olive'
      ? ORIGEN_COLORS.olive
      : ORIGEN_COLORS.brown;

  return (
    <div className="flex items-center gap-3 text-center">
      <span style={{ color: iconColor }} className="flex-shrink-0">{icon}</span>
      <div className="flex flex-col items-start">
        <span
          className="font-bold leading-none"
          style={{
            color: ORIGEN_COLORS.brown,
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 2rem)',
          }}
        >
          {value}
        </span>
        <span
          className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] mt-1"
          style={{ color: ORIGEN_COLORS.brownSoft }}
        >
          {label}
        </span>
      </div>
    </div>
  );
};
