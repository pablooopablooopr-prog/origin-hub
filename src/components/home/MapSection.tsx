/**
 * SECCIÓN MAPA — Premium editorial.
 *
 * Layout:
 *   - Encabezado único (eyebrow + título + subtítulo + laurel decorativo)
 *   - Tarjeta premium de filtros con 3 grupos (NICHO, TIPO, PROVINCIA+toggles)
 *   - Mapa compacto integrado con leyenda flotante + panel lateral derecho
 *   - Métricas inferiores compactas con iconos + laurel
 *
 * Datos:
 *   - Mezcla empresas reales (Supabase) con DEMO si BD vacía o pocos resultados
 *   - Markers personalizados (nicho/destacado/ruta)
 *   - Polyline discontinua dorada para rutas activas
 */

import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, SlidersHorizontal, X } from 'lucide-react';
import { MapFiltersModal } from '@/components/MapFiltersModal';
import { MapHeader } from './map/MapHeader';
import { MapFiltersCard } from './map/MapFiltersCard';
import { MapEmpresaCard } from './map/MapEmpresaCard';
import { MapLegend } from './map/MapLegend';
import { MapMetrics } from './map/MapMetrics';
import { ORIGEN_MAP_STYLE, ORIGEN_COLORS } from './map/mapStyles';
import { buildMarkerElement, DASHED_LINE_SYMBOL } from './map/markerHelpers';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useFetchEmpresas } from '@/hooks/useFetchEmpresas';
import { useMapFilters } from '@/hooks/useMapFilters';
import { useMapLazyLoad } from '@/hooks/useMapPerformance';
import { MAP_DEMO_EMPRESAS } from '@/data/mapDemoEmpresas';
import type { Empresa } from '@/hooks/useFetchEmpresas';

const REGION_CENTER = { lat: 39.0387, lng: -3.5022 };
const DEFAULT_ZOOM = 8;
const MIN_REAL_EMPRESAS_TO_HIDE_DEMO = 8;

/** Empresa con flags extra usados por el panel lateral. */
type EmpresaPlus = Empresa & { featured?: boolean; inRoute?: boolean };

export function MapSection() {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  // Hooks core
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMapsLoader();
  const { shouldLoadMap, mapRef: lazyLoadRef } = useMapLazyLoad();
  const { empresas: empresasReales } = useFetchEmpresas();

  // Mezcla con demo si la BD viene corta
  const empresasFusionadas: EmpresaPlus[] = useMemo(() => {
    const reales = empresasReales || [];
    if (reales.length >= MIN_REAL_EMPRESAS_TO_HIDE_DEMO) {
      return reales as EmpresaPlus[];
    }
    return [...MAP_DEMO_EMPRESAS, ...(reales as EmpresaPlus[])];
  }, [empresasReales]);

  const {
    filtros,
    empresasOrdenadas,
    setNicho,
    setProvincia,
    setTipo,
    setEnRutas,
    setMostrarDestacados,
    resetFiltros,
  } = useMapFilters(empresasFusionadas);

  // Estado UI
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Métricas calculadas
  const metricas = useMemo(() => {
    const total = empresasFusionadas.length;
    const destacados = empresasFusionadas.filter(
      (e) => e.featured || e.plan === 'destacado'
    ).length;
    const enRutas = empresasFusionadas.filter(
      (e) => e.inRoute || e.en_ruta
    ).length;
    return { total, destacados, enRutas };
  }, [empresasFusionadas]);

  const empresaSeleccionada = useMemo(
    () => empresasOrdenadas.find((e) => e.id === selectedId) || null,
    [empresasOrdenadas, selectedId]
  );

  // Inicializar mapa
  useEffect(() => {
    if (
      !mapsLoaded ||
      !shouldLoadMap ||
      !mapContainer.current ||
      mapRef.current
    ) {
      return;
    }

    const initMap = async () => {
      try {
        const { Map } = (await google.maps.importLibrary(
          'maps'
        )) as google.maps.MapsLibrary;

        mapRef.current = new Map(mapContainer.current!, {
          center: REGION_CENTER,
          zoom: DEFAULT_ZOOM,
          mapId: 'origen-map-section',
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'cooperative',
          styles: ORIGEN_MAP_STYLE,
        });

        setMapInitialized(true);
      } catch (err) {
        console.error('[MapSection] init error:', err);
      }
    };

    initMap();
  }, [mapsLoaded, shouldLoadMap]);

  // Markers
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    // limpiar
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    if (empresasOrdenadas.length === 0) return;

    const addMarkers = async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      empresasOrdenadas.forEach((empresa) => {
        const e = empresa as EmpresaPlus;
        const isFeatured = !!(e.featured || e.plan === 'destacado');
        const isInRoute = !!(e.inRoute || e.en_ruta);

        const content = buildMarkerElement({
          nicho: e.nicho,
          featured: isFeatured,
          inRoute: isInRoute,
          selected: selectedId === e.id,
        });

        const marker = new AdvancedMarkerElement({
          position: { lat: e.lat, lng: e.lng },
          map: mapRef.current,
          content,
          title: e.nombre,
        });

        marker.addListener('click', () => setSelectedId(e.id));
        markersRef.current.push(marker);
      });
    };

    addMarkers();
  }, [empresasOrdenadas, mapInitialized, selectedId]);

  // Polyline ruta (empresas inRoute conectadas en orden)
  useEffect(() => {
    if (!mapRef.current || !mapInitialized) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    const enRutaOrden = empresasOrdenadas
      .filter((e) => (e as EmpresaPlus).inRoute || (e as EmpresaPlus).en_ruta)
      .map((e) => ({ lat: e.lat, lng: e.lng }));

    if (enRutaOrden.length < 2) return;

    polylineRef.current = new google.maps.Polyline({
      path: enRutaOrden,
      geodesic: true,
      strokeOpacity: 0,
      icons: [{ icon: DASHED_LINE_SYMBOL, offset: '0', repeat: '14px' }],
      map: mapRef.current,
    });
  }, [empresasOrdenadas, mapInitialized]);

  // Centrar mapa al cambiar selección
  useEffect(() => {
    if (!mapRef.current || !empresaSeleccionada) return;
    mapRef.current.panTo({
      lat: empresaSeleccionada.lat,
      lng: empresaSeleccionada.lng,
    });
  }, [empresaSeleccionada]);

  // Recentrar a bounds al cambiar filtros (sin selección)
  useEffect(() => {
    if (!mapRef.current || empresasOrdenadas.length === 0 || selectedId) return;
    const bounds = new google.maps.LatLngBounds();
    empresasOrdenadas.forEach((e) => bounds.extend({ lat: e.lat, lng: e.lng }));
    mapRef.current.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
  }, [empresasOrdenadas, selectedId]);

  const handleViewComplete = (id: string) => {
    const e = empresasFusionadas.find((x) => x.id === id);
    if (e?.slug) navigate(`/negocio/${e.slug}`);
  };

  // Empresas destacadas para panel lateral (top 3 visibles)
  const empresasParaPanel = useMemo(() => {
    if (empresaSeleccionada) {
      return [empresaSeleccionada as EmpresaPlus];
    }
    return empresasOrdenadas.slice(0, 3) as EmpresaPlus[];
  }, [empresasOrdenadas, empresaSeleccionada]);

  return (
    <section
      className="w-full"
      style={{ backgroundColor: ORIGEN_COLORS.paper }}
    >
      <div
        className="mx-auto px-4 md:px-8 pt-2 md:pt-3 pb-10 md:pb-14"
        style={{ maxWidth: '1500px' }}
      >
        {/* HEADER ÚNICO */}
        <MapHeader />

        {/* FILTROS DESKTOP */}
        <MapFiltersCard
          nicho={filtros.nicho}
          tipo={filtros.tipo}
          provincia={filtros.provincia}
          enRutas={filtros.enRutas}
          destacadosPrimero={filtros.mostrarDestacadosFirst}
          onNichoChange={setNicho}
          onTipoChange={setTipo}
          onProvinciaChange={setProvincia}
          onEnRutasChange={setEnRutas}
          onDestacadosChange={setMostrarDestacados}
        />

        {/* TOGGLE FILTROS MOBILE */}
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden mt-6 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: ORIGEN_COLORS.cream,
            border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
            color: ORIGEN_COLORS.brown,
            boxShadow: '0 2px 8px rgba(60, 43, 32, 0.06)',
          }}
        >
          <SlidersHorizontal size={16} style={{ color: ORIGEN_COLORS.olive }} />
          Filtros
        </button>

        <MapFiltersModal
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
          nicho={filtros.nicho}
          provincia={filtros.provincia}
          tipo={filtros.tipo}
          enRutas={filtros.enRutas}
          destacadosPrimero={filtros.mostrarDestacadosFirst}
          onNichoChange={setNicho}
          onProvinciaChange={setProvincia}
          onTipoChange={setTipo}
          onEnRutasChange={setEnRutas}
          onDestacadosChange={setMostrarDestacados}
          onReset={resetFiltros}
        />

        {/* MAPA + PANEL LATERAL */}
        <div className="mt-3 md:mt-4 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 items-stretch">
          {/* Mapa */}
          <div
            ref={lazyLoadRef}
            className="relative rounded-3xl overflow-hidden"
            style={{
              height: 'clamp(420px, 55vh, 520px)',
              border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
              boxShadow:
                '0 6px 24px rgba(60, 43, 32, 0.08), 0 1px 3px rgba(60, 43, 32, 0.05)',
              backgroundColor: ORIGEN_COLORS.paperWarm,
            }}
          >
            {!shouldLoadMap && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm" style={{ color: ORIGEN_COLORS.brownSoft }}>
                  Cargando mapa…
                </p>
              </div>
            )}

            {shouldLoadMap && mapsError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p
                  className="text-sm font-semibold"
                  style={{ color: '#A04545' }}
                >
                  Error cargando el mapa
                </p>
              </div>
            )}

            {shouldLoadMap && (
              <>
                <div
                  ref={mapContainer}
                  className="w-full h-full"
                  style={{ display: mapsLoaded ? 'block' : 'none' }}
                />

                {/* Overlay sutil crema/verde para suavizar el mapa */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(245, 240, 232, 0) 60%, rgba(245, 240, 232, 0.18) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                  aria-hidden="true"
                />

                {!mapInitialized && mapsLoaded && (
                  <div
                    className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
                    style={{ backgroundColor: 'rgba(245, 240, 232, 0.6)' }}
                  >
                    <Loader2
                      size={36}
                      className="animate-spin"
                      style={{ color: ORIGEN_COLORS.olive }}
                      strokeWidth={1.5}
                    />
                  </div>
                )}

                {/* Leyenda flotante */}
                <MapLegend />

                {/* Botón LIMPIAR flotante (esquina superior derecha) */}
                <button
                  type="button"
                  onClick={resetFiltros}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all hover:scale-105"
                  style={{
                    backgroundColor: ORIGEN_COLORS.cream,
                    border: `1.5px solid ${ORIGEN_COLORS.gold}`,
                    color: ORIGEN_COLORS.brown,
                    boxShadow:
                      '0 4px 12px rgba(184, 134, 11, 0.18), 0 1px 3px rgba(60, 43, 32, 0.12)',
                  }}
                  title="Limpiar todos los filtros"
                >
                  <X size={13} strokeWidth={2.5} style={{ color: ORIGEN_COLORS.gold }} />
                  Limpiar
                </button>
              </>
            )}
          </div>

          {/* Panel lateral derecho (desktop) / debajo (mobile) */}
          <aside className="space-y-3 flex flex-col">
            <div
              className="hidden lg:flex items-center justify-between"
            >
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: ORIGEN_COLORS.brownSoft }}
              >
                {empresaSeleccionada ? 'Seleccionada' : 'Sugerencias'}
              </span>
              <span
                className="text-[11px]"
                style={{ color: ORIGEN_COLORS.brownSoft }}
              >
                {empresasOrdenadas.length} resultados
              </span>
            </div>

            {/* Mobile: scroll horizontal · Desktop: stack */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 lg:flex-1">
              {empresasParaPanel.length === 0 ? (
                <div
                  className="w-full text-center py-8 rounded-2xl"
                  style={{
                    backgroundColor: ORIGEN_COLORS.cream,
                    border: `1px dashed ${ORIGEN_COLORS.beigeSoft}`,
                    color: ORIGEN_COLORS.brownSoft,
                  }}
                >
                  <p className="text-sm">
                    Sin resultados con estos filtros.
                  </p>
                </div>
              ) : (
                empresasParaPanel.map((e) => (
                  <div
                    key={e.id}
                    className="flex-shrink-0 w-[280px] lg:w-auto"
                  >
                    <MapEmpresaCard
                      empresa={e}
                      isSelected={selectedId === e.id}
                      onClick={() => setSelectedId(e.id)}
                      onView={() => handleViewComplete(e.id)}
                    />
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        {/* MÉTRICAS INFERIORES */}
        <MapMetrics
          empresas={metricas.total}
          destacados={metricas.destacados}
          enRutas={metricas.enRutas}
        />
      </div>
    </section>
  );
}
