/**
 * Leyenda flotante dentro del mapa.
 * Esquina inferior izquierda en desktop, oculta en mobile.
 */

import React from 'react';
import { ORIGEN_COLORS } from './mapStyles';

interface LegendItem {
  shape: 'circle' | 'star' | 'route';
  label: string;
}

const ITEMS: LegendItem[] = [
  { shape: 'circle', label: 'Empresa' },
  { shape: 'star', label: 'Destacado' },
  { shape: 'route', label: 'En ruta activa' },
];

export const MapLegend: React.FC = () => {
  return (
    <div
      className="absolute bottom-4 left-4 z-10 hidden md:block"
      style={{
        backgroundColor: 'rgba(245, 240, 232, 0.96)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(60, 43, 32, 0.12)',
        padding: '12px 14px',
        minWidth: '170px',
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
        style={{ color: ORIGEN_COLORS.brownSoft }}
      >
        Leyenda
      </div>
      <ul className="space-y-1.5">
        {ITEMS.map((item) => (
          <li
            key={item.shape}
            className="flex items-center gap-2.5 text-xs font-medium"
            style={{ color: ORIGEN_COLORS.brown }}
          >
            <LegendIcon shape={item.shape} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LegendIcon: React.FC<{ shape: LegendItem['shape'] }> = ({ shape }) => {
  if (shape === 'star') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill={ORIGEN_COLORS.cream} stroke={ORIGEN_COLORS.gold} strokeWidth="1" />
        <path
          d="M12 5 L14 10 L19.5 10.5 L15.5 14 L17 19.5 L12 16.5 L7 19.5 L8.5 14 L4.5 10.5 L10 10 Z"
          fill={ORIGEN_COLORS.gold}
        />
      </svg>
    );
  }
  if (shape === 'route') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill={ORIGEN_COLORS.olive} stroke={ORIGEN_COLORS.cream} strokeWidth="1.5" />
        <path
          d="M7 15 Q10 8 12 12 Q14 16 17 9"
          stroke={ORIGEN_COLORS.cream}
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="7" cy="15" r="1.4" fill={ORIGEN_COLORS.cream} />
        <circle cx="17" cy="9" r="1.4" fill={ORIGEN_COLORS.cream} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill={ORIGEN_COLORS.olive} stroke={ORIGEN_COLORS.cream} strokeWidth="2" />
    </svg>
  );
};
