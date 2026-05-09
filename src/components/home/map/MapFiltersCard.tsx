/**
 * Tarjeta premium de filtros — 3 tarjetas internas en UNA línea horizontal:
 *   A) NICHO   (sub-card con segmented buttons + iconos)
 *   B) TIPO    (sub-card con segmented buttons + iconos)
 *   C) PROVINCIA + toggles (sub-card)
 *
 * Cada opción tiene su icono lineal SVG inline (sin dependencias extra).
 */

import React from 'react';
import { ChevronDown, Star, Route, X } from 'lucide-react';
import { ORIGEN_COLORS } from './mapStyles';

type IconKey =
  | 'todos'
  | 'queso'
  | 'carne'
  | 'vino'
  | 'caza'
  | 'miel'
  | 'cooperativas'
  | 'productor'
  | 'restaurante'
  | 'experiencia'
  | 'alojamiento';

const ICONS: Record<IconKey, React.ReactNode> = {
  todos: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  queso: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 13 L13 5 L21 13 L21 18 Q21 19 20 19 L4 19 Q3 19 3 18 Z" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" />
      <circle cx="16" cy="16" r="0.9" fill="currentColor" />
    </svg>
  ),
  carne: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 5.5 Q19 5 19 8 Q21 9 19 11 L13 17 Q11 19 9 18 L7 20 Q5.5 21 5 19.5 L7 17.5 Q6 15.5 8 13.5 L14 7.5 Q15 5.5 15.5 5.5 Z" />
      <circle cx="17" cy="7" r="0.8" fill="currentColor" />
    </svg>
  ),
  vino: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3 L16 3 L15 9 Q15 13 12 13 Q9 13 9 9 Z" />
      <line x1="12" y1="13" x2="12" y2="20" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <path d="M9.5 6 Q12 7 14.5 6" stroke="currentColor" fill="none" />
    </svg>
  ),
  caza: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20 L8 12 L12 16 L17 9 L21 20 Z" />
      <circle cx="17" cy="5" r="1.5" />
    </svg>
  ),
  miel: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L18 6.5 L18 13.5 L12 17 L6 13.5 L6 6.5 Z" />
      <line x1="6" y1="10" x2="18" y2="10" />
      <line x1="12" y1="3" x2="12" y2="17" />
    </svg>
  ),
  cooperativas: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20 Q3 14 9 14 Q15 14 15 20" />
      <path d="M14 20 Q15 16 17 16 Q21 16 21 20" />
    </svg>
  ),
  productor: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 L12 12" />
      <path d="M12 12 Q9 10 7 7 Q10 8 12 12 Q14 8 17 7 Q15 10 12 12" />
      <path d="M12 16 Q10 14 8 13 M12 16 Q14 14 16 13" />
    </svg>
  ),
  restaurante: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3 L7 11 Q7 13 5 13 L5 21" />
      <path d="M9 3 L9 9" />
      <path d="M11 3 L11 11 Q11 13 9 13" />
      <path d="M16 3 Q19 3 19 9 L19 13 L17 13 L17 21" />
    </svg>
  ),
  experiencia: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21 Q5 14 5 9 Q5 4 12 4 Q19 4 19 9 Q19 14 12 21 Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  ),
  alojamiento: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21 L3 11 L12 4 L21 11 L21 21 Z" />
      <path d="M9 21 L9 14 L15 14 L15 21" />
    </svg>
  ),
};

const NICHO_OPTIONS: { id: string; label: string; icon: IconKey }[] = [
  { id: 'todos', label: 'Todos', icon: 'todos' },
  { id: 'quesos', label: 'Queso', icon: 'queso' },
  { id: 'carnes', label: 'Carne', icon: 'carne' },
  { id: 'vinos', label: 'Vino', icon: 'vino' },
  { id: 'caza', label: 'Caza', icon: 'caza' },
  { id: 'miel', label: 'Miel', icon: 'miel' },
  { id: 'cooperativas', label: 'Coop.', icon: 'cooperativas' },
];

const TIPO_OPTIONS: { id: string; label: string; icon: IconKey }[] = [
  { id: 'todos', label: 'Todos', icon: 'todos' },
  { id: 'productor', label: 'Productor', icon: 'productor' },
  { id: 'restaurante', label: 'Rest.', icon: 'restaurante' },
  { id: 'experiencia', label: 'Exper.', icon: 'experiencia' },
  { id: 'alojamiento', label: 'Aloj.', icon: 'alojamiento' },
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
  onReset: () => void;
}

interface SubCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SubCard: React.FC<SubCardProps> = ({ title, children, className = '' }) => (
  <div
    className={`rounded-2xl px-3 py-2.5 flex flex-col gap-2 ${className}`}
    style={{
      backgroundColor: 'rgba(255, 250, 240, 0.55)',
      border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
    }}
  >
    <span
      className="block text-[10px] font-bold uppercase tracking-[0.22em]"
      style={{ color: ORIGEN_COLORS.brownSoft }}
    >
      {title}
    </span>
    {children}
  </div>
);

interface ChipProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const Chip: React.FC<ChipProps> = ({ active, onClick, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1 px-2 py-1 rounded-xl border transition-all duration-200 flex-shrink-0"
    style={{
      backgroundColor: active ? ORIGEN_COLORS.olive : ORIGEN_COLORS.cream,
      borderColor: active ? ORIGEN_COLORS.olive : ORIGEN_COLORS.beigeSoft,
      color: active ? ORIGEN_COLORS.cream : ORIGEN_COLORS.brown,
      boxShadow: active
        ? '0 2px 6px rgba(92, 107, 46, 0.18)'
        : '0 1px 2px rgba(60, 43, 32, 0.04)',
    }}
  >
    <span
      className="flex-shrink-0"
      style={{ color: active ? ORIGEN_COLORS.cream : ORIGEN_COLORS.olive }}
    >
      {icon}
    </span>
    <span className="text-[11px] font-semibold whitespace-nowrap">{label}</span>
  </button>
);

export const MapFiltersCard: React.FC<MapFiltersCardProps> = ({
  nicho,
  tipo,
  provincia,
  enRutas,
  destacadosPrimero,
  onNichoChange,
  onTipoChange,
  onProvinciaChange,
  onEnRutasChange,
  onDestacadosChange,
  onReset,
}) => {
  return (
    <div
      className="hidden lg:block rounded-[22px] p-4 mt-8"
      style={{
        backgroundColor: ORIGEN_COLORS.cream,
        border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
        boxShadow:
          '0 4px 20px rgba(60, 43, 32, 0.06), 0 1px 3px rgba(60, 43, 32, 0.04)',
      }}
    >
      <div className="grid grid-cols-[2fr_1.4fr_1.2fr] gap-3 items-stretch">
        {/* SUB-CARD A — NICHO */}
        <SubCard title="Nicho">
          <div className="flex flex-wrap gap-1">
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
        </SubCard>

        {/* SUB-CARD B — TIPO */}
        <SubCard title="Tipo">
          <div className="flex flex-wrap gap-1">
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
        </SubCard>

        {/* SUB-CARD C — PROVINCIA + TOGGLES */}
        <SubCard title="Provincia y opciones">
          <div className="relative">
            <select
              value={provincia}
              onChange={(e) => onProvinciaChange(e.target.value)}
              className="appearance-none w-full pl-3 pr-9 py-1.5 text-[12px] font-semibold rounded-xl border cursor-pointer transition-all"
              style={{
                backgroundColor: ORIGEN_COLORS.cream,
                borderColor: ORIGEN_COLORS.beigeSoft,
                color: ORIGEN_COLORS.brown,
              }}
            >
              {PROVINCIAS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: ORIGEN_COLORS.brownSoft }}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <PillToggle
              active={destacadosPrimero}
              onToggle={() => onDestacadosChange(!destacadosPrimero)}
              icon={
                <Star
                  size={13}
                  fill={destacadosPrimero ? ORIGEN_COLORS.cream : 'none'}
                />
              }
              label="Destacados"
              activeColor={ORIGEN_COLORS.gold}
            />
            <PillToggle
              active={enRutas}
              onToggle={() => onEnRutasChange(!enRutas)}
              icon={<Route size={13} />}
              label="En rutas"
              activeColor={ORIGEN_COLORS.olive}
            />
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold uppercase tracking-wider transition-all hover:opacity-80"
              style={{
                backgroundColor: 'transparent',
                borderColor: ORIGEN_COLORS.beigeSoft,
                color: ORIGEN_COLORS.brownSoft,
              }}
              title="Limpiar filtros"
            >
              <X size={12} />
              Limpiar
            </button>
          </div>
        </SubCard>
      </div>
    </div>
  );
};

interface PillToggleProps {
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  label: string;
  activeColor: string;
}

const PillToggle: React.FC<PillToggleProps> = ({
  active,
  onToggle,
  icon,
  label,
  activeColor,
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold transition-all"
    style={{
      backgroundColor: active ? activeColor : ORIGEN_COLORS.cream,
      borderColor: active ? activeColor : ORIGEN_COLORS.beigeSoft,
      color: active ? ORIGEN_COLORS.cream : ORIGEN_COLORS.brown,
      boxShadow: active ? `0 2px 6px ${activeColor}33` : 'none',
    }}
  >
    {icon}
    <span className="whitespace-nowrap">{label}</span>
  </button>
);
