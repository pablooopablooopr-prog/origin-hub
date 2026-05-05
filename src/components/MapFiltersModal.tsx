/**
 * Modal de filtros para mobile
 * Desliza desde la izquierda, overlay oscuro
 * Se cierra al seleccionar o clickear X
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface MapFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const MapFiltersModal: React.FC<MapFiltersModalProps> = ({
  isOpen,
  onClose,
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
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleReset = () => {
    onReset();
    onClose();
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        onClick={handleClose}
        style={{
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* MODAL PANEL */}
      <div
        className="fixed left-0 top-0 bottom-0 w-72 bg-white z-40 shadow-lg overflow-y-auto lg:hidden"
        style={{
          animation: 'slideInLeft 0.3s ease-out',
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{
            borderColor: '#D4C4A8',
          }}
        >
          <h2
            className="text-sm font-bold uppercase"
            style={{ color: '#3D2B1F' }}
          >
            Filtros
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-[#F5F0E8]"
          >
            <X size={20} color="#999999" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-4">
          {/* NICHO */}
          <div>
            <label
              className="block text-xs font-bold uppercase mb-2"
              style={{ color: '#3D2B1F' }}
            >
              Nicho
            </label>
            <select
              value={nicho}
              onChange={(e) => {
                onNichoChange(e.target.value);
                onClose();
              }}
              className="w-full px-2.5 py-2 text-sm rounded bg-white border"
              style={{
                borderColor: '#CCCCCC',
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

          {/* PROVINCIA */}
          <div>
            <label
              className="block text-xs font-bold uppercase mb-2"
              style={{ color: '#3D2B1F' }}
            >
              Provincia
            </label>
            <select
              value={provincia}
              onChange={(e) => {
                onProvinciaChange(e.target.value);
                onClose();
              }}
              className="w-full px-2.5 py-2 text-sm rounded bg-white border"
              style={{
                borderColor: '#CCCCCC',
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

          {/* TIPO */}
          <div>
            <label
              className="block text-xs font-bold uppercase mb-2"
              style={{ color: '#3D2B1F' }}
            >
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => {
                onTipoChange(e.target.value);
                onClose();
              }}
              className="w-full px-2.5 py-2 text-sm rounded bg-white border"
              style={{
                borderColor: '#CCCCCC',
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

          {/* EN RUTAS */}
          <div className="border-t pt-4" style={{ borderColor: '#DDDDDD' }}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="modal-en-rutas"
                checked={enRutas}
                onChange={(e) => onEnRutasChange(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: enRutas ? '#B8860B' : '#5C6B2E',
                }}
              />
              <label
                htmlFor="modal-en-rutas"
                className="text-sm cursor-pointer select-none"
                style={{ color: '#3D2B1F' }}
              >
                Mostrar solo en rutas
              </label>
            </div>
          </div>

          {/* DESTACADOS */}
          <div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="modal-destacados"
                checked={destacadosPrimero}
                onChange={(e) => onDestacadosChange(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{
                  accentColor: destacadosPrimero ? '#B8860B' : '#5C6B2E',
                }}
              />
              <label
                htmlFor="modal-destacados"
                className="text-sm cursor-pointer select-none"
                style={{ color: '#3D2B1F' }}
              >
                Destacados primero
              </label>
            </div>
          </div>

          {/* BOTÓN RESET */}
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 text-xs font-medium rounded transition-colors"
            style={{
              backgroundColor: 'transparent',
              color: '#999999',
              border: '1px solid #DDDDDD',
            }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* ESTILOS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 0.4; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
};
