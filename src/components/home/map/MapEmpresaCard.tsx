/**
 * Tarjeta lateral de empresa.
 * Vive como panel flotante derecho del mapa en desktop,
 * y como card horizontal/scroll en mobile.
 */

import React from 'react';
import { Star, Route, MapPin, ArrowRight } from 'lucide-react';
import { ORIGEN_COLORS } from './mapStyles';
import { NICHO_FALLBACK_GRADIENT } from '@/data/mapDemoEmpresas';
import type { Empresa } from '@/hooks/useFetchEmpresas';

export interface MapEmpresaCardData extends Empresa {
  featured?: boolean;
  inRoute?: boolean;
}

interface MapEmpresaCardProps {
  empresa: MapEmpresaCardData;
  isSelected?: boolean;
  onClick?: () => void;
  onView?: () => void;
}

const TIPO_LABELS: Record<string, string> = {
  productor: 'PRODUCTOR',
  restaurante: 'RESTAURANTE',
  experiencia: 'EXPERIENCIA',
  alojamiento: 'ALOJAMIENTO',
  mercado: 'MERCADO',
};

export const MapEmpresaCard: React.FC<MapEmpresaCardProps> = ({
  empresa,
  isSelected,
  onClick,
  onView,
}) => {
  const fallbackGradient =
    NICHO_FALLBACK_GRADIENT[empresa.nicho?.toLowerCase() || 'default'] ||
    NICHO_FALLBACK_GRADIENT.default;

  return (
    <article
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: ORIGEN_COLORS.cream,
        border: `1px solid ${
          isSelected ? ORIGEN_COLORS.gold : ORIGEN_COLORS.beigeSoft
        }`,
        boxShadow: isSelected
          ? '0 8px 24px rgba(184, 134, 11, 0.18)'
          : '0 2px 10px rgba(60, 43, 32, 0.06)',
      }}
    >
      <div className="flex gap-3 p-3">
        {/* IMAGEN MINIATURA */}
        <div
          className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden"
          style={{ background: fallbackGradient }}
        >
          {empresa.foto ? (
            <img
              src={empresa.foto}
              alt={empresa.nombre}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            // Placeholder elegante con inicial
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-2xl font-bold"
                style={{
                  color: ORIGEN_COLORS.cream,
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              >
                {empresa.nombre?.[0] || '?'}
              </span>
            </div>
          )}
          {empresa.featured && (
            <div
              className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: ORIGEN_COLORS.gold }}
            >
              <Star size={11} fill={ORIGEN_COLORS.cream} stroke={ORIGEN_COLORS.cream} />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Badge tipo */}
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
              style={{
                backgroundColor: 'rgba(92, 107, 46, 0.12)',
                color: ORIGEN_COLORS.olive,
              }}
            >
              {TIPO_LABELS[empresa.tipo || ''] || empresa.tipo?.toUpperCase() || '—'}
            </span>
            {empresa.inRoute && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
                style={{
                  backgroundColor: 'rgba(184, 134, 11, 0.12)',
                  color: ORIGEN_COLORS.gold,
                }}
                title="En ruta activa"
              >
                <Route size={10} />
                RUTA
              </span>
            )}
          </div>

          {/* Nombre */}
          <h4
            className="font-bold text-sm leading-tight mb-1 truncate"
            style={{
              color: ORIGEN_COLORS.brown,
              fontFamily: "'Playfair Display', 'Georgia', serif",
            }}
          >
            {empresa.nombre}
          </h4>

          {/* Localidad */}
          <p
            className="flex items-center gap-1 text-[11px] truncate"
            style={{ color: ORIGEN_COLORS.brownSoft }}
          >
            <MapPin size={11} />
            <span className="truncate">
              {empresa.localidad}
              {empresa.provincia ? `, ${empresa.provincia}` : ''}
            </span>
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onView?.();
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold border-t transition-colors group-hover:bg-[rgba(184,134,11,0.06)]"
        style={{
          borderColor: ORIGEN_COLORS.beigeSoft,
          color: ORIGEN_COLORS.brown,
        }}
      >
        <span className="uppercase tracking-wider">Ver ficha</span>
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
          style={{ color: ORIGEN_COLORS.gold }}
        />
      </button>
    </article>
  );
};
