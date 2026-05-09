/**
 * Métricas inferiores: barra compacta con iconos + separadores + laurel.
 */

import React from 'react';
import { Building2, Star, Route } from 'lucide-react';
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

      <div className="flex items-center justify-around md:justify-center gap-2 md:gap-12">
        <Metric
          icon={<Building2 size={20} strokeWidth={1.6} />}
          value={empresas}
          label="Empresas"
          tone="brown"
        />
        <Separator />
        <Metric
          icon={<Star size={20} strokeWidth={1.6} fill={ORIGEN_COLORS.gold} />}
          value={destacados}
          label="Destacados"
          tone="gold"
        />
        <Separator />
        <Metric
          icon={<Route size={20} strokeWidth={1.6} />}
          value={enRutas}
          label="En rutas activas"
          tone="olive"
        />
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
    <div className="flex flex-col items-center text-center min-w-[72px]">
      <span style={{ color: iconColor }}>{icon}</span>
      <span
        className="font-bold mt-1.5"
        style={{
          color: ORIGEN_COLORS.brown,
          fontFamily: "'Playfair Display', 'Georgia', serif",
          fontSize: 'clamp(1.5rem, 1rem + 1.5vw, 2rem)',
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] mt-1.5"
        style={{ color: ORIGEN_COLORS.brownSoft }}
      >
        {label}
      </span>
    </div>
  );
};
