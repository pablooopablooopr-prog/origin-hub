/**
 * SECCIÓN MAPA — Integración completa
 * Lazy load + filtros + pins + sidebar + performance optimizaciones
 *
 * Pasos:
 * 1. Lazy load del mapa (Intersection Observer)
 * 2. Fetch empresas con caché
 * 3. Filtrar dinámicamente (local, sin network)
 * 4. Renderizar pins con clustering si >150
 * 5. Sidebar al clickear pin
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { MapFilters } from '@/components/MapFilters';
import { MapSidebar } from '@/components/MapSidebar';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useFetchEmpresas } from '@/hooks/useFetchEmpresas';
import { useMapFilters } from '@/hooks/useMapFilters';
import { useMapLazyLoad } from '@/hooks/useMapPerformance';

// Mapa estilo ORIGEN (colores tierra, minimalista)
const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f5f0e8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b5c4c' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#c9b99a' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#ede7d9' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b8cfe0' }],
  },
];

// Centro de Castilla-La Mancha (Ciudad Real)
const REGION_CENTER = { lat: 39.2387, lng: -3.2022 };
const DEFAULT_ZOOM = 8;

export function MapSection() {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  // Hooks
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsLoader();
  const { shouldLoadMap, mapRef: lazyLoadRef } = useMapLazyLoad();
  const { empresas, loading: empresasLoading, error: empresasError } = useFetchEmpresas();
  const {
    filtros,
    empresasOrdenadas,
    setNicho,
    setTipo,
    setMostrarDestacados,
    resetFiltros,
  } = useMapFilters(empresas);

  // Estado local
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Obtener empresa seleccionada
  const empresaActual = useMemo(
    () => empresasOrdenadas.find((e) => e.id === selectedEmpresa) || null,
    [empresasOrdenadas, selectedEmpresa]
  );

  // Inicializar mapa (una sola vez)
  useEffect(() => {
    if (
      !mapsLoaded ||
      !shouldLoadMap ||
      !mapContainer.current ||
      mapRef.current ||
      mapInitialized
    ) {
      return;
    }

    const initMap = async () => {
      try {
        const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

        mapRef.current = new Map(mapContainer.current!, {
          center: REGION_CENTER,
          zoom: DEFAULT_ZOOM,
          mapId: 'origen-map-section',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: MAP_STYLE,
        });

        // Crear InfoWindow para tooltips
        infoWindowRef.current = new google.maps.InfoWindow();

        setMapInitialized(true);
      } catch (err) {
        console.error('Error initializing map:', err);
      }
    };

    initMap();
  }, [mapsLoaded, shouldLoadMap, mapInitialized]);

  // Actualizar marcadores cuando cambian empresas filtradas
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    // Limpiar marcadores antiguos
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    if (empresasOrdenadas.length === 0) return;

    // Crear nuevos marcadores
    const createMarkers = async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      empresasOrdenadas.forEach((empresa) => {
        // Crear elemento custom para marker
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';

        const color =
          empresa.plan === 'destacado'
            ? '#B8860B'
            : empresa.plan === 'standard'
            ? '#A0A0A0'
            : '#CCCCCC';
        const size = empresa.plan === 'destacado' ? 32 : empresa.plan === 'standard' ? 28 : 24;

        markerElement.innerHTML = `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background-color: ${color};
            border: 2px solid white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: all 0.2s ease;
          ">
            ${empresa.plan === 'destacado' ? '★' : ''}
          </div>
        `;

        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.2)';
          markerElement.style.boxShadow = `0 4px 12px rgba(184, 134, 11, 0.4)`;
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        });

        const marker = new AdvancedMarkerElement({
          position: { lat: empresa.lat, lng: empresa.lng },
          map: mapRef.current,
          content: markerElement,
          title: empresa.nombre,
        });

        // Click handler
        marker.addListener('click', () => {
          setSelectedEmpresa(empresa.id);
        });

        markersRef.current.push(marker);
      });
    };

    createMarkers();
  }, [empresasOrdenadas, mapInitialized]);

  // Recentrar mapa al cambiar filtros (suave)
  useEffect(() => {
    if (!mapRef.current || empresasOrdenadas.length === 0) return;

    // Calcular bounds de todas las empresas visibles
    const bounds = new google.maps.LatLngBounds();
    empresasOrdenadas.forEach((empresa) => {
      bounds.extend({ lat: empresa.lat, lng: empresa.lng });
    });

    // Fit bounds con padding
    mapRef.current.fitBounds(bounds, { top: 100, right: 50, bottom: 50, left: 350 });
  }, [empresasOrdenadas]);

  const handleViewComplete = (empresaId: string) => {
    const empresa = empresas.find((e) => e.id === empresaId);
    if (empresa?.slug) {
      navigate(`/negocio/${empresa.slug}`);
    }
  };

  // Render
  return (
    <section className="w-full bg-white">
      {/* FILTROS */}
      <MapFilters
        filtros={filtros}
        onNichoChange={setNicho}
        onTipoChange={setTipo}
        onDestacadosChange={setMostrarDestacados}
        onReset={resetFiltros}
      />

      {/* CONTENEDOR MAPA */}
      <div
        ref={lazyLoadRef}
        className="relative w-full h-[500px] lg:h-[600px] bg-[#F5F0E8]"
      >
        {/* LOADING PLACEHOLDER */}
        {!shouldLoadMap && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F0E8]">
            <div className="text-center">
              <p className="text-sm text-[#999999]">Cargando mapa...</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {shouldLoadMap && mapsError && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F0E8]">
            <div className="text-center">
              <p className="text-sm text-red-600">Error cargando el mapa</p>
            </div>
          </div>
        )}

        {/* MAPA */}
        {shouldLoadMap && (
          <>
            <div
              ref={mapContainer}
              className="w-full h-full"
              style={{ display: mapsLoaded ? 'block' : 'none' }}
            />

            {/* LOADING SPINNER DURANTE INICIALIZACIÓN */}
            {!mapInitialized && mapsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                <Loader2 size={32} className="animate-spin text-[#5C6B2E]" />
              </div>
            )}
          </>
        )}
      </div>

      {/* SIDEBAR */}
      <MapSidebar
        empresa={empresaActual}
        onClose={() => setSelectedEmpresa(null)}
        onViewComplete={handleViewComplete}
      />

      {/* INFO DE EMPRESAS */}
      <div className="px-4 py-3 bg-white text-xs text-[#999999] text-center border-t border-[#DDDDDD]">
        Mostrando {empresasOrdenadas.length} de {empresas.length} empresas
      </div>
    </section>
  );
}
