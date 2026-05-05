/**
 * Ficha lateral que aparece al hacer click en un pin del mapa
 *
 * Desktop: esquina inferior izquierda, 340px ancho, fijo
 * Mobile: full-width abajo, máx 40vh, desplazable
 * Animación: desliza desde abajo (100ms ease-out)
 *
 * Borde top del color del nicho
 * Sin emojis, todo iconografía SVG o texto
 */

import { X } from 'lucide-react';
import { getNichoColor } from '@/utils/mapColors';
import type { Empresa } from '@/hooks/useFetchEmpresas';

interface MapSidebarProps {
  empresa: Empresa | null;
  onClose: () => void;
  onViewComplete?: (empresaId: string) => void;
}

export function MapSidebar({
  empresa,
  onClose,
  onViewComplete,
}: MapSidebarProps) {
  if (!empresa) return null;

  const nichoColor = getNichoColor(empresa.nicho);

  const handleViewComplete = () => {
    if (onViewComplete) {
      onViewComplete(empresa.id);
    }
  };

  // Determinar si mostrar badge de plan
  const showPlanBadge = empresa.plan && empresa.plan !== 'basico';

  return (
    <>
      {/* OVERLAY OSCURO (mobile) - cierra al clickear */}
      <div
        className="fixed inset-0 bg-black/30 lg:hidden z-30"
        onClick={onClose}
        style={{
          animation: 'fadeIn 0.2s ease-out',
        }}
      />

      {/* FICHA SIDEBAR */}
      <div
        className="fixed bottom-0 left-0 right-0 lg:bottom-6 lg:left-6 lg:right-auto z-40 rounded-t-lg lg:rounded-lg overflow-hidden shadow-lg transition-all duration-300"
        style={{
          width: '100%',
          maxWidth: '340px',
          maxHeight: '40vh',
          backgroundColor: '#F5F0E8',
          borderTop: `3px solid ${nichoColor}`,
          borderLeft: '1px solid #CCCCCC',
          borderRight: '1px solid #CCCCCC',
          borderBottom: '1px solid #CCCCCC',
          boxShadow: '0 -4px 16px rgba(0,0,0,0.12)',
          animation: 'slideUp 0.1s ease-out',
        }}
      >
        {/* HEADER CON BOTÓN CERRAR */}
        <div className="relative p-4 border-b border-[#DDDDDD]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded hover:bg-[#f0ebe3] transition-colors"
          >
            <X size={20} color="#999999" strokeWidth={2.5} />
          </button>
        </div>

        {/* CONTENIDO SCROLLEABLE */}
        <div className="overflow-y-auto max-h-[calc(40vh-60px)] p-4 space-y-3">
          {/* FOTO */}
          <div className="w-20 h-20 rounded">
            <img
              src={empresa.foto || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3Crect fill="%23EEEEEE" width="80" height="80"/%3E%3C/svg%3E'}
              alt={empresa.nombre}
              className="w-full h-full object-cover rounded"
              style={{ borderRadius: '4px', border: '1px solid #DDDDDD' }}
            />
          </div>

          {/* NOMBRE */}
          <div>
            <h3
              className="font-bold text-base leading-tight"
              style={{ color: '#3D2B1F' }}
            >
              {empresa.nombre}
            </h3>
          </div>

          {/* LOCALIDAD */}
          <p
            className="text-xs leading-tight"
            style={{ color: '#6B6B6B' }}
          >
            {empresa.localidad}
            {empresa.provincia && `, ${empresa.provincia}`}
          </p>

          {/* NICHO */}
          <div>
            <span
              className="text-xs font-semibold"
              style={{ color: '#6B6B6B' }}
            >
              Nicho:{' '}
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: '#3D2B1F' }}
            >
              {empresa.nicho || 'Otro'}
            </span>
          </div>

          {/* BADGE PLAN (si no es básico) */}
          {showPlanBadge && (
            <div
              className="inline-block px-2 py-1 rounded text-xs font-semibold text-center"
              style={{
                backgroundColor: '#B8860B',
                color: '#FFFFFF',
                borderRadius: '4px',
              }}
            >
              Plan {empresa.plan?.toUpperCase() || 'BÁSICO'}
            </div>
          )}

          {/* EN RUTA (si aplica) */}
          {empresa.en_ruta && empresa.ruta_name && (
            <div
              className="px-2 py-1 rounded text-xs font-semibold border"
              style={{
                backgroundColor: '#F5F0E8',
                borderColor: '#5C6B2E',
                color: '#3D2B1F',
              }}
            >
              PARADA EN RUTA: {empresa.ruta_name}
            </div>
          )}

          {/* DESCRIPCIÓN */}
          {empresa.descripcion && (
            <p
              className="text-xs leading-relaxed line-clamp-2"
              style={{ color: '#3D2B1F' }}
            >
              {empresa.descripcion}
            </p>
          )}
        </div>

        {/* BOTÓN VER FICHA COMPLETA */}
        <div className="border-t border-[#DDDDDD] p-3 bg-white">
          <button
            onClick={handleViewComplete}
            className="w-full px-3 py-2 rounded text-xs font-bold transition-all hover:opacity-85"
            style={{
              backgroundColor: nichoColor,
              color: '#3D2B1F',
            }}
          >
            VER FICHA COMPLETA →
          </button>
        </div>
      </div>

      {/* ESTILOS GLOBALES */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.3;
          }
        }

        @media (max-width: 1024px) {
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        }
      `}</style>
    </>
  );
}
