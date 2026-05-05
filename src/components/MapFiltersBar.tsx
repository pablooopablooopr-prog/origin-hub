/**
 * Sidebar vertical de filtros — diseño original con cards stacked
 * Desktop: fixed 240px izquierda, sticky al scroll
 * Mobile: no aparece (usa modal en su lugar)
 */

import React from 'react';

interface MapFiltersBarProps {
  nicho: string;
  provincia: string;
  tipo: string;
  enRutas: boolean;
  destacadosPrimero: boolean;
  onNichoChange: (value: string) => void;
  onProvinciaChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  onEnRutasChange: (value: boolean) => void;
  onDestacadosChange: (value: boolean) => void;
  onReset: () => void;
}

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
];

const PROVINCIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'ciudad-real', label: 'Ciudad Real' },
  { id: 'toledo', label: 'Toledo' },
  { id: 'cuenca', label: 'Cuenca' },
  { id: 'guadalajara', label: 'Guadalajara' },
  { id: 'albacete', label: 'Albacete' },
];

const TIPOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'productor', label: 'Productor' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'alojamiento', label: 'Alojamiento' },
  { id: 'mercado', label: 'Mercado/Tienda' },
];

export const MapFiltersBar: React.FC<MapFiltersBarProps> = ({
  nicho,
  provincia,
  tipo,
  enRutas,
  destacadosPrimero,
  onNichoChange,
  onProvinciaChange,
  onTipoChange,
  onEnRutasChange,
  onDestacadosChange,
  onReset,
}) => {
  return (
    <div
      className="hidden lg:flex flex-col sticky top-20 w-60 gap-4 p-4 h-fit"
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* HEADER */}
      <div
        style={{
          paddingBottom: '12px',
          borderBottom: '2px solid #B8860B',
        }}
      >
        <h3
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: '#3D2B1F', fontFamily: "'Cormorant Garamond', serif" }}
        >
          Filtros
        </h3>
      </div>

      {/* CARD — NICHO */}
      <div
        className="rounded-md p-3 transition-all hover:shadow-md"
        style={{
          backgroundColor: '#F5F0E8',
          border: '1px solid #D4C4A8',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: '#3D2B1F' }}
        >
          Nicho
        </label>
        <select
          value={nicho}
          onChange={(e) => onNichoChange(e.target.value)}
          className="w-full px-2.5 py-2 text-sm rounded bg-white border"
          style={{
            borderColor: nicho === 'todos' ? '#CCCCCC' : '#5C6B2E',
            color: '#3D2B1F',
          }}
        >
          {NICHOS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* CARD — PROVINCIA */}
      <div
        className="rounded-md p-3 transition-all hover:shadow-md"
        style={{
          backgroundColor: '#F5F0E8',
          border: '1px solid #D4C4A8',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: '#3D2B1F' }}
        >
          Provincia
        </label>
        <select
          value={provincia}
          onChange={(e) => onProvinciaChange(e.target.value)}
          className="w-full px-2.5 py-2 text-sm rounded bg-white border"
          style={{
            borderColor: provincia === 'todas' ? '#CCCCCC' : '#5C6B2E',
            color: '#3D2B1F',
          }}
        >
          {PROVINCIAS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* CARD — TIPO */}
      <div
        className="rounded-md p-3 transition-all hover:shadow-md"
        style={{
          backgroundColor: '#F5F0E8',
          border: '1px solid #D4C4A8',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: '#3D2B1F' }}
        >
          Tipo
        </label>
        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value)}
          className="w-full px-2.5 py-2 text-sm rounded bg-white border"
          style={{
            borderColor: tipo === 'todos' ? '#CCCCCC' : '#5C6B2E',
            color: '#3D2B1F',
          }}
        >
          {TIPOS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* CARD — EN RUTAS */}
      <div
        className="rounded-md p-3 transition-all"
        style={{
          backgroundColor: '#F5F0E8',
          border: enRutas ? '1px solid #B8860B' : '1px solid #D4C4A8',
          boxShadow: enRutas
            ? '0 2px 8px rgba(184, 134, 11, 0.2)'
            : '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: '#3D2B1F' }}
        >
          En Rutas
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="en-rutas"
            checked={enRutas}
            onChange={(e) => onEnRutasChange(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{
              accentColor: enRutas ? '#B8860B' : '#5C6B2E',
            }}
          />
          <label
            htmlFor="en-rutas"
            className="text-sm cursor-pointer select-none"
            style={{ color: '#3D2B1F' }}
          >
            Mostrar solo en rutas
          </label>
        </div>
      </div>

      {/* CARD — DESTACADOS */}
      <div
        className="rounded-md p-3 transition-all"
        style={{
          backgroundColor: '#F5F0E8',
          border: destacadosPrimero ? '1px solid #B8860B' : '1px solid #D4C4A8',
          boxShadow: destacadosPrimero
            ? '0 2px 8px rgba(184, 134, 11, 0.2)'
            : '0 2px 6px rgba(0,0,0,0.05)',
        }}
      >
        <label
          className="block text-xs font-bold uppercase mb-2"
          style={{ color: '#3D2B1F' }}
        >
          Destacados
        </label>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="destacados"
            checked={destacadosPrimero}
            onChange={(e) => onDestacadosChange(e.target.checked)}
            className="w-4 h-4 rounded cursor-pointer"
            style={{
              accentColor: destacadosPrimero ? '#B8860B' : '#5C6B2E',
            }}
          />
          <label
            htmlFor="destacados"
            className="text-sm cursor-pointer select-none"
            style={{ color: '#3D2B1F' }}
          >
            Primero
          </label>
        </div>
      </div>

      {/* BOTÓN RESET */}
      <button
        onClick={onReset}
        className="px-0 py-2 text-xs text-center font-medium transition-colors hover:text-[#5C6B2E]"
        style={{
          backgroundColor: 'transparent',
          color: '#999999',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Limpiar filtros
      </button>
    </div>
  );
};
