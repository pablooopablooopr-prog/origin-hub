/**
 * Leyenda flotante dentro del mapa.
 * Esquina inferior izquierda en desktop, oculta en mobile.
 */

import React from 'react';
import { ORIGEN_COLORS } from './mapStyles';

interface LegendItem {
  shape: 'producer' | 'restaurant' | 'experience' | 'lodging' | 'star' | 'route';
  label: string;
}

const ITEMS: LegendItem[] = [
  { shape: 'producer', label: 'Productor' },
  { shape: 'restaurant', label: 'Restaurante' },
  { shape: 'experience', label: 'Experiencia' },
  { shape: 'lodging', label: 'Alojamiento' },
  { shape: 'star', label: 'Destacado' },
  { shape: 'route', label: 'En ruta activa' },
];

export const MapLegend: React.FC = () => {
  return (
    <div
      className="absolute left-5 top-5 z-10 hidden md:block"
      style={{
        backgroundColor: 'rgba(255, 253, 248, 0.94)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(200, 184, 154, 0.42)',
        borderRadius: '14px',
        boxShadow: '0 10px 26px rgba(60, 43, 32, 0.12), 0 1px 2px rgba(60, 43, 32, 0.04)',
        padding: '16px 18px',
        minWidth: '154px',
      }}
    >
      <div
        className="text-[10px] font-bold uppercase tracking-[0.26em] mb-3"
        style={{ color: ORIGEN_COLORS.brownSoft }}
      >
        Leyenda
      </div>
      <ul className="space-y-2.5">
        {ITEMS.map((item) => (
          <li
            key={item.shape}
            className="flex items-center gap-2.5 text-[13px] font-medium leading-none"
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
  const baseCircle = (children: React.ReactNode, fill = ORIGEN_COLORS.oliveLight) => (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill={fill} />
      {children}
    </svg>
  );

  if (shape === 'producer') {
    return baseCircle(
      <path d="M12 17v-5m0 0c-2.1-1.6-3.7-3.1-4.7-5 2.6.6 4 2.2 4.7 5Zm0 0c1-2.8 2.8-4.4 5.3-5-1 1.9-2.6 3.4-5.3 5Z" stroke={ORIGEN_COLORS.cream} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    );
  }
  if (shape === 'restaurant') {
    return baseCircle(
      <g stroke={ORIGEN_COLORS.cream} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M8 6v6m2-6v6m-4-6v6c0 1.3.9 2.2 2 2.2V18" />
        <path d="M15 6c1.7 0 3 1.8 3 4v4h-2v4" />
      </g>,
      '#8a6a4b'
    );
  }
  if (shape === 'experience') {
    return baseCircle(
      <path d="M12 18s-4.5-4.5-4.5-7.2A4.5 4.5 0 0 1 12 6.3a4.5 4.5 0 0 1 4.5 4.5C16.5 13.5 12 18 12 18Z M12 12.3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke={ORIGEN_COLORS.cream} strokeWidth="1.45" fill="none" strokeLinejoin="round" />
    );
  }
  if (shape === 'lodging') {
    return baseCircle(
      <path d="M6.5 12.2 12 7.8l5.5 4.4V18h-3.2v-3.8H9.7V18H6.5v-5.8Z" stroke={ORIGEN_COLORS.cream} strokeWidth="1.45" fill="none" strokeLinejoin="round" />
    );
  }
  if (shape === 'star') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill={ORIGEN_COLORS.gold} />
        <path
          d="M12 6.2 L13.5 10.1 L17.7 10.4 L14.5 13 L15.5 17.1 L12 14.9 L8.5 17.1 L9.5 13 L6.3 10.4 L10.5 10.1 Z"
          fill={ORIGEN_COLORS.cream}
        />
      </svg>
    );
  }
  if (shape === 'route') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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
  return null;
};
