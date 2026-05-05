/**
 * Componente que renderiza pins como círculos SVG personalizados
 * Cada pin es un círculo del color del nicho
 * Tamaño y z-index varían según el plan
 *
 * Soporta:
 * - Hover con opacidad y sombra
 * - Click para seleccionar
 * - Pulse animation para destacados
 * - Glow dorado para standard/destacado
 */

import React, { useMemo } from 'react';
import { getPlanSize, getPlanZIndex, getNichoColor, getDarkerColor } from '@/utils/mapColors';
import type { Empresa } from '@/hooks/useFetchEmpresas';

interface MapPinsProps {
  empresas: Empresa[];
  selectedId: string | null;
  onPinClick: (empresaId: string) => void;
}

export const MapPins = React.memo(
  ({ empresas, selectedId, onPinClick }: MapPinsProps) => {
    // Crear elementos SVG para cada pin
    const pins = useMemo(() => {
      return empresas.map((empresa) => {
        const color = getNichoColor(empresa.nicho);
        const size = getPlanSize(empresa.plan);
        const zIndex = getPlanZIndex(empresa.plan);
        const isSelected = selectedId === empresa.id;
        const isDestacado = empresa.plan === 'destacado';
        const isStandard = empresa.plan === 'standard';

        // Estilos dinámicos según plan
        const borderColor = isStandard || isDestacado ? '#B8860B' : '#FFFFFF';
        const borderWidth = isDestacado ? 3 : 2;
        const glowColor =
          isDestacado || isStandard
            ? `rgba(184, 134, 11, 0.6)`
            : `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.3)`;

        return (
          <g
            key={empresa.id}
            className="cursor-pointer group"
            onClick={() => onPinClick(empresa.id)}
            style={{ zIndex }}
          >
            {/* GLOW EFFECT (para destacados y standard) */}
            {(isDestacado || isStandard) && (
              <circle
                cx={empresa.lng}
                cy={empresa.lat}
                r={size + 8}
                fill="none"
                stroke={borderColor}
                strokeWidth={1}
                opacity={0.2}
                className={isDestacado ? 'animate-pulse' : ''}
              />
            )}

            {/* PIN CIRCLE */}
            <circle
              cx={empresa.lng}
              cy={empresa.lat}
              r={size / 2}
              fill={color}
              opacity={isSelected ? 1 : empresa.plan === 'basico' ? 0.8 : 0.9}
              stroke={borderColor}
              strokeWidth={borderWidth}
              className="transition-all duration-200 group-hover:opacity-100"
              style={{
                filter: isSelected ? `drop-shadow(0 0 8px ${color})` : 'none',
                cursor: 'pointer',
              }}
            />

            {/* SHADOW EFFECT ON HOVER */}
            <circle
              cx={empresa.lng}
              cy={empresa.lat}
              r={size / 2 + 2}
              fill="none"
              stroke={borderColor}
              strokeWidth={1}
              opacity={0}
              className="group-hover:opacity-40 transition-opacity duration-200"
            />
          </g>
        );
      });
    }, [empresas, selectedId]);

    // SVG container
    // NOTA: Este componente solo renderiza grupos SVG
    // Debe estar dentro de un elemento SVG padre proporcionado por GoogleMap
    return <>{pins}</>;
  }
);

MapPins.displayName = 'MapPins';
