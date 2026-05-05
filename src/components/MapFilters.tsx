/**
 * Barra de filtros para el mapa
 * Desktop: fila única, inline
 * Tablet: 2 filas
 * Mobile: botón "Filtros" que abre modal desplegable
 *
 * Sin emojis, estilos premium rural
 */

import { useState } from 'react';
import { X } from 'lucide-react';
import type { MapFilterState } from '@/hooks/useMapFilters';

const NICHOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'quesos', label: 'Quesos y Lácteos' },
  { id: 'carnes', label: 'Carnes y Embutidos' },
  { id: 'vinos', label: 'Vinos y Bodegas' },
  { id: 'caza', label: 'Caza y Monterías' },
  { id: 'miel', label: 'Miel y Apicultura' },
  { id: 'cooperativas', label: 'Cooperativas y Aceite' },
  { id: 'restaurantes', label: 'Restaurantes' },
  { id: 'alojamiento', label: 'Alojamiento Rural' },
  { id: 'otro', label: 'Otro' },
];

const TIPOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'productor', label: 'Productor' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'alojamiento', label: 'Alojamiento' },
  { id: 'mercado', label: 'Mercado/Tienda' },
];

interface MapFiltersProps {
  filtros: MapFilterState;
  onNichoChange: (nicho: string) => void;
  onTipoChange: (tipo: string) => void;
  onDestacadosChange: (valor: boolean) => void;
  onReset: () => void;
}

export function MapFilters({
  filtros,
  onNichoChange,
  onTipoChange,
  onDestacadosChange,
  onReset,
}: MapFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleReset = () => {
    onReset();
    setMobileOpen(false);
  };

  // ===== DESKTOP / TABLET LAYOUT =====
  const FilterRow = () => (
    <div className="flex flex-col gap-3 lg:gap-4 lg:flex-row lg:items-end">
      {/* FILTRO NICHO */}
      <div className="flex-1 lg:flex-initial">
        <label
          htmlFor="nicho"
          className="block text-xs font-semibold tracking-wide mb-2"
          style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
        >
          NICHO
        </label>
        <select
          id="nicho"
          value={filtros.nicho}
          onChange={(e) => onNichoChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: '#F5F0E8',
            color: '#3D2B1F',
            border: '1px solid #5C6B2E',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%235C6B2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px 16px',
            paddingRight: '2.5rem',
          }}
        >
          {NICHOS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* FILTRO TIPO */}
      <div className="flex-1 lg:flex-initial">
        <label
          htmlFor="tipo"
          className="block text-xs font-semibold tracking-wide mb-2"
          style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
        >
          TIPO
        </label>
        <select
          id="tipo"
          value={filtros.tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          className="w-full px-3 py-2.5 rounded text-sm font-medium transition-all"
          style={{
            backgroundColor: '#F5F0E8',
            color: '#3D2B1F',
            border: '1px solid #5C6B2E',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%235C6B2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '16px 16px',
            paddingRight: '2.5rem',
          }}
        >
          {TIPOS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* CHECKBOX DESTACADOS */}
      <div className="flex items-center gap-2 lg:flex-shrink-0">
        <input
          type="checkbox"
          id="destacados"
          checked={filtros.mostrarDestacadosFirst}
          onChange={(e) => onDestacadosChange(e.target.checked)}
          className="w-4 h-4 rounded cursor-pointer"
          style={{
            accentColor: filtros.mostrarDestacadosFirst ? '#B8860B' : '#5C6B2E',
            borderColor: filtros.mostrarDestacadosFirst ? '#B8860B' : '#CCCCCC',
          }}
        />
        <label
          htmlFor="destacados"
          className="text-sm font-medium cursor-pointer select-none"
          style={{ color: '#3D2B1F' }}
        >
          Mostrar DESTACADOS primero
        </label>
      </div>

      {/* BOTÓN RESET */}
      <button
        onClick={handleReset}
        className="px-3 py-2.5 text-xs font-medium rounded transition-all hover:opacity-75 lg:flex-shrink-0"
        style={{
          backgroundColor: 'transparent',
          color: '#999999',
          border: '1px solid #DDDDDD',
        }}
      >
        Limpiar filtros
      </button>
    </div>
  );

  // ===== MOBILE MODAL LAYOUT =====
  return (
    <div className="w-full">
      {/* BARRA SUPERIOR: SIEMPRE VISIBLE */}
      <div className="flex items-center justify-between gap-2 p-3 lg:p-4 bg-white border-b border-[#DDDDDD]">
        <h3
          className="text-xs font-semibold tracking-wide hidden lg:block"
          style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
        >
          FILTROS
        </h3>

        {/* BOTÓN FILTROS (solo mobile) */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden px-3 py-2 text-sm font-medium rounded flex items-center gap-2 transition-all"
          style={{
            backgroundColor: '#F5F0E8',
            color: '#3D2B1F',
            border: '1px solid #5C6B2E',
          }}
        >
          <span>≡ Filtros</span>
        </button>

        {/* DESKTOP: MOSTRA TODOS LOS FILTROS EN LÍNEA */}
        <div className="hidden lg:block w-full">
          <FilterRow />
        </div>
      </div>

      {/* MOBILE MODAL: DROPDOWN DESPLEGABLE */}
      {mobileOpen && (
        <div
          className="lg:hidden p-4 bg-white border-b border-[#DDDDDD] space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-xs font-semibold tracking-wide"
              style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
            >
              OPCIONES DE FILTRADO
            </h3>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded hover:bg-[#F5F0E8]"
            >
              <X size={18} color="#999999" />
            </button>
          </div>

          {/* FILTRO NICHO */}
          <div>
            <label
              htmlFor="nicho-mobile"
              className="block text-xs font-semibold tracking-wide mb-2"
              style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
            >
              NICHO
            </label>
            <select
              id="nicho-mobile"
              value={filtros.nicho}
              onChange={(e) => {
                onNichoChange(e.target.value);
                setMobileOpen(false);
              }}
              className="w-full px-3 py-2.5 rounded text-sm font-medium"
              style={{
                backgroundColor: '#F5F0E8',
                color: '#3D2B1F',
                border: '1px solid #5C6B2E',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%235C6B2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px 16px',
                paddingRight: '2.5rem',
              }}
            >
              {NICHOS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* FILTRO TIPO */}
          <div>
            <label
              htmlFor="tipo-mobile"
              className="block text-xs font-semibold tracking-wide mb-2"
              style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
            >
              TIPO
            </label>
            <select
              id="tipo-mobile"
              value={filtros.tipo}
              onChange={(e) => {
                onTipoChange(e.target.value);
                setMobileOpen(false);
              }}
              className="w-full px-3 py-2.5 rounded text-sm font-medium"
              style={{
                backgroundColor: '#F5F0E8',
                color: '#3D2B1F',
                border: '1px solid #5C6B2E',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%235C6B2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.75rem center',
                backgroundSize: '16px 16px',
                paddingRight: '2.5rem',
              }}
            >
              {TIPOS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* CHECKBOX DESTACADOS */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#DDDDDD]">
            <input
              type="checkbox"
              id="destacados-mobile"
              checked={filtros.mostrarDestacadosFirst}
              onChange={(e) => onDestacadosChange(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
              style={{
                accentColor: filtros.mostrarDestacadosFirst ? '#B8860B' : '#5C6B2E',
              }}
            />
            <label
              htmlFor="destacados-mobile"
              className="text-sm font-medium cursor-pointer select-none"
              style={{ color: '#3D2B1F' }}
            >
              Mostrar DESTACADOS primero
            </label>
          </div>

          {/* BOTÓN RESET */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-2.5 text-xs font-medium rounded transition-all"
            style={{
              backgroundColor: 'transparent',
              color: '#999999',
              border: '1px solid #DDDDDD',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
