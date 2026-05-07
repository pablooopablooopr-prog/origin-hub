/**
 * Modal de filtros para mobile
 * Desliza desde la izquierda con overlay oscuro
 * Se cierra al seleccionar o clickear X
 * Usa design tokens para colores y estilos
 */

import React from 'react';
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
  { id: 'quesos', label: 'Queso' },
  { id: 'carnes', label: 'Carne' },
  { id: 'vinos', label: 'Vino' },
  { id: 'caza', label: 'Caza' },
  { id: 'miel', label: 'Miel' },
  { id: 'cooperativas', label: 'Cooperativas' },
];

const PROVINCIAS = [
  { id: 'todas', label: 'Todas' },
  { id: 'ciudad-real', label: 'Ciudad Real' },
  { id: 'toledo', label: 'Toledo' },
  { id: 'cuenca', label: 'Cuenca' },
  { id: 'albacete', label: 'Albacete' },
  { id: 'guadalajara', label: 'Guadalajara' },
];

const TIPOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'productor', label: 'Productor' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'alojamiento', label: 'Alojamiento' },
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
        className="fixed inset-0 bg-black/40 z-30 lg:hidden animate-in fade-in"
        onClick={handleClose}
      />

      {/* MODAL PANEL */}
      <div className="fixed left-0 top-0 bottom-0 w-72 bg-background z-40 shadow-lg overflow-y-auto lg:hidden animate-in slide-in-from-left duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-sm font-semibold uppercase text-foreground tracking-wider">
            Filtros
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-5">
          {/* NICHO */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Categoría
            </label>
            <select
              value={nicho}
              onChange={(e) => {
                onNichoChange(e.target.value);
                onClose();
              }}
              className="w-full px-3 py-2.5 text-sm rounded-md bg-white border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-moss-medium focus:ring-offset-2 transition-all duration-200"
            >
              {NICHOS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* PROVINCIA */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Provincia
            </label>
            <select
              value={provincia}
              onChange={(e) => {
                onProvinciaChange(e.target.value);
                onClose();
              }}
              className="w-full px-3 py-2.5 text-sm rounded-md bg-white border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-earth-medium focus:ring-offset-2 transition-all duration-200"
            >
              {PROVINCIAS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* TIPO */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Tipo
            </label>
            <select
              value={tipo}
              onChange={(e) => {
                onTipoChange(e.target.value);
                onClose();
              }}
              className="w-full px-3 py-2.5 text-sm rounded-md bg-white border-2 border-border text-foreground focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2 transition-all duration-200"
            >
              {TIPOS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* EN RUTAS */}
          <div className="border-t border-border pt-5 space-y-3">
            <label className="block text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Opciones
            </label>
            <div className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="modal-en-rutas"
                checked={enRutas}
                onChange={(e) => onEnRutasChange(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer accent-moss-medium"
              />
              <label
                htmlFor="modal-en-rutas"
                className="text-sm font-medium text-foreground cursor-pointer select-none"
              >
                Mostrar solo en rutas
              </label>
            </div>
          </div>

          {/* DESTACADOS */}
          <div className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="modal-destacados"
              checked={destacadosPrimero}
              onChange={(e) => onDestacadosChange(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer accent-accent"
            />
            <label
              htmlFor="modal-destacados"
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              Destacados primero
            </label>
          </div>

          {/* BOTÓN RESET */}
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 text-xs font-semibold uppercase text-muted-foreground border-2 border-border rounded-md hover:border-earth-medium hover:text-earth-medium hover:shadow-soft transition-all duration-200 tracking-wider mt-2"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* ANIMATIONS - CSS classes handled by Tailwind animate-in utilities */}
    </>
  );
};
