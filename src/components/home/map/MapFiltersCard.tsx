/**
 * Tarjeta premium de filtros — barra horizontal compacta en UNA línea:
 *   A) NICHO   (chips scrollables en fila)
 *   B) TIPO    (chips scrollables en fila)
 *   C) PROVINCIA + toggles
 *   D) Botón Limpiar filtros (extremo derecho)
 */

import React from 'react';
import { ChevronDown, Star, Route, MoreHorizontal } from 'lucide-react';
import { ORIGEN_COLORS } from './mapStyles';

type IconKey =
  | 'todos' | 'queso' | 'carne' | 'vino' | 'caza'
  | 'miel' | 'cooperativas' | 'productor' | 'restaurante'
  | 'experiencia' | 'alojamiento';

const ICONS: Record<IconKey, React.ReactNode> = {
  todos: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  queso: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13 L13 5 L21 13 L21 18 Q21 19 20 19 L4 19 Q3 19 3 18 Z"/>
      <circle cx="9" cy="15" r="1" fill="currentColor"/><circle cx="15" cy="14" r="0.8" fill="currentColor"/>
    </svg>
  ),
  carne: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 5.5 Q19 5 19 8 Q21 9 19 11 L13 17 Q11 19 9 18 L7 20 Q5.5 21 5 19.5 L7 17.5 Q6 15.5 8 13.5 L14 7.5 Z"/>
    </svg>
  ),
  vino: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3 L16 3 L15 9 Q15 13 12 13 Q9 13 9 9 Z"/>
      <line x1="12" y1="13" x2="12" y2="20"/><line x1="9" y1="20" x2="15" y2="20"/>
    </svg>
  ),
  caza: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20 L8 12 L12 16 L17 9 L21 20 Z"/><circle cx="17" cy="5" r="1.5"/>
    </svg>
  ),
  miel: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L18 6.5 L18 13.5 L12 17 L6 13.5 L6 6.5 Z"/>
      <line x1="6" y1="10" x2="18" y2="10"/><line x1="12" y1="3" x2="12" y2="17"/>
    </svg>
  ),
  cooperativas: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/>
      <path d="M3 20 Q3 14 9 14 Q15 14 15 20"/><path d="M14 20 Q15 16 17 16 Q21 16 21 20"/>
    </svg>
  ),
  productor: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 L12 12"/><path d="M12 12 Q9 10 7 7 Q10 8 12 12 Q14 8 17 7 Q15 10 12 12"/>
    </svg>
  ),
  restaurante: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3 L7 11 Q7 13 5 13 L5 21"/><path d="M9 3 L9 9"/>
      <path d="M11 3 L11 11 Q11 13 9 13"/><path d="M16 3 Q19 3 19 9 L19 13 L17 13 L17 21"/>
    </svg>
  ),
  experiencia: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 Q5 14 5 9 Q5 4 12 4 Q19 4 19 9 Q19 14 12 21 Z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  alojamiento: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21 L3 11 L12 4 L21 11 L21 21 Z"/><path d="M9 21 L9 14 L15 14 L15 21"/>
    </svg>
  ),
};

const NICHO_OPTIONS = [
  { id: 'quesos', label: 'Queso', icon: 'queso' as IconKey },
  { id: 'carnes', label: 'Carne', icon: 'carne' as IconKey },
  { id: 'vinos', label: 'Vino', icon: 'vino' as IconKey },
  { id: 'caza', label: 'Caza', icon: 'caza' as IconKey },
  { id: 'miel', label: 'Miel', icon: 'miel' as IconKey },
  { id: 'cooperativas', label: 'Más', icon: 'cooperativas' as IconKey },
];

const TIPO_OPTIONS = [
  { id: 'productor', label: 'Productor', icon: 'productor' as IconKey },
  { id: 'restaurante', label: 'Restaurante', icon: 'restaurante' as IconKey },
  { id: 'experiencia', label: 'Experiencia', icon: 'experiencia' as IconKey },
  { id: 'alojamiento', label: 'Alojamiento', icon: 'alojamiento' as IconKey },
];

const PROVINCIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'ciudad-real', label: 'Ciudad Real' },
  { id: 'toledo', label: 'Toledo' },
  { id: 'cuenca', label: 'Cuenca' },
  { id: 'albacete', label: 'Albacete' },
  { id: 'guadalajara', label: 'Guadalajara' },
];

interface MapFiltersCardProps {
  nicho: string;
  tipo: string;
  provincia: string;
  enRutas: boolean;
  destacadosPrimero: boolean;
  onNichoChange: (v: string) => void;
  onTipoChange: (v: string) => void;
  onProvinciaChange: (v: string) => void;
  onEnRutasChange: (v: boolean) => void;
  onDestacadosChange: (v: boolean) => void;
  onReset?: () => void;
}

const Chip: React.FC<{
  active: boolean; onClick: () => void;
  icon: React.ReactNode; label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-9 items-center gap-2 rounded-xl border px-3.5 text-[13px] font-semibold transition-all duration-150 flex-shrink-0 whitespace-nowrap hover:-translate-y-px"
    style={{
      backgroundColor: active ? 'rgba(92, 107, 46, 0.1)' : 'rgba(255, 253, 248, 0.92)',
      borderColor: active ? 'rgba(92, 107, 46, 0.45)' : 'rgba(200, 184, 154, 0.48)',
      color: ORIGEN_COLORS.brown,
      boxShadow: active ? 'inset 0 0 0 1px rgba(92, 107, 46, 0.12)' : '0 1px 4px rgba(60, 43, 32, 0.035)',
    }}
  >
    <span style={{ color: ORIGEN_COLORS.olive }}>{label === 'Más' ? <MoreHorizontal size={15} strokeWidth={2.3} /> : icon}</span>
    <span>{label}</span>
  </button>
);

const VSep: React.FC = () => (
  <span
    className="flex-shrink-0 w-px self-stretch"
    style={{ backgroundColor: 'rgba(200, 184, 154, 0.5)' }}
    aria-hidden="true"
  />
);

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className="block text-[10px] font-bold uppercase tracking-[0.26em] mb-3 whitespace-nowrap"
    style={{ color: ORIGEN_COLORS.brownSoft }}
  >
    {children}
  </span>
);

export const MapFiltersCard: React.FC<MapFiltersCardProps> = ({
  nicho, tipo, provincia, enRutas, destacadosPrimero,
  onNichoChange, onTipoChange, onProvinciaChange,
  onEnRutasChange, onDestacadosChange, onReset,
}) => {
  return (
    <div
      className="hidden lg:flex items-stretch rounded-2xl overflow-hidden mt-6"
      style={{
        backgroundColor: 'rgba(255, 253, 248, 0.92)',
        border: '1px solid rgba(200, 184, 154, 0.42)',
        boxShadow: '0 12px 30px rgba(60, 43, 32, 0.08), 0 1px 2px rgba(60, 43, 32, 0.04)',
      }}
    >
      {/* NICHO */}
      <div className="flex min-w-0 flex-[1.12] flex-col px-8 py-5">
        <SectionLabel>Nicho</SectionLabel>
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {NICHO_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              active={nicho === opt.id}
              onClick={() => onNichoChange(opt.id)}
              icon={ICONS[opt.icon]}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <VSep />

      {/* TIPO */}
      <div className="flex min-w-0 flex-[0.9] flex-col px-8 py-5">
        <SectionLabel>Tipo</SectionLabel>
        <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TIPO_OPTIONS.map((opt) => (
            <Chip
              key={opt.id}
              active={tipo === opt.id}
              onClick={() => onTipoChange(opt.id)}
              icon={ICONS[opt.icon]}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <VSep />

      {/* PROVINCIA + TOGGLES */}
      <div className="flex min-w-[385px] flex-col px-8 py-5 flex-shrink-0">
        <SectionLabel>Provincia</SectionLabel>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={provincia}
              onChange={(e) => onProvinciaChange(e.target.value)}
              className="h-9 min-w-[118px] appearance-none rounded-xl border pl-4 pr-8 text-[13px] font-semibold cursor-pointer"
              style={{
                backgroundColor: 'rgba(255, 253, 248, 0.92)',
                borderColor: 'rgba(200, 184, 154, 0.48)',
                color: ORIGEN_COLORS.brown,
              }}
            >
              {PROVINCIAS.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: ORIGEN_COLORS.brownSoft }}
            />
          </div>

          <button
            type="button"
            onClick={() => onDestacadosChange(!destacadosPrimero)}
            className="flex h-9 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-all whitespace-nowrap hover:-translate-y-px"
            style={{
              backgroundColor: destacadosPrimero ? 'rgba(184, 134, 11, 0.12)' : 'rgba(255, 253, 248, 0.92)',
              borderColor: destacadosPrimero ? 'rgba(184, 134, 11, 0.46)' : 'rgba(200, 184, 154, 0.48)',
              color: ORIGEN_COLORS.brown,
            }}
          >
            <Star size={14} fill={destacadosPrimero ? ORIGEN_COLORS.gold : 'none'} stroke={ORIGEN_COLORS.gold} />
            Solo destacados
          </button>

          <button
            type="button"
            onClick={() => onEnRutasChange(!enRutas)}
            className="flex h-9 items-center gap-2 rounded-xl border px-4 text-[13px] font-semibold transition-all whitespace-nowrap hover:-translate-y-px"
            style={{
              backgroundColor: enRutas ? 'rgba(92, 107, 46, 0.1)' : 'rgba(255, 253, 248, 0.92)',
              borderColor: enRutas ? 'rgba(92, 107, 46, 0.45)' : 'rgba(200, 184, 154, 0.48)',
              color: ORIGEN_COLORS.brown,
            }}
          >
            <Route size={14} style={{ color: ORIGEN_COLORS.olive }} />
            En rutas
          </button>
        </div>
      </div>

      {onReset && <button type="button" className="sr-only" onClick={onReset}>Limpiar filtros</button>}
    </div>
  );
};
