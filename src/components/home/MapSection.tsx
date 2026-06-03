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

export function MapSection({ hideHeader = false }: { hideHeader?: boolean }) {
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

  const hasActiveFilters =
    filtros.nicho !== 'todos' ||
    filtros.tipo !== 'todos' ||
    filtros.provincia !== 'todas' ||
    filtros.enRutas ||
    filtros.mostrarDestacadosFirst;

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
          zoomControl: false,
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
    return empresasOrdenadas as EmpresaPlus[];
  }, [empresasOrdenadas, empresaSeleccionada]);

  return (
    <section
      className="w-full"
      style={{ backgroundImage: "url('/textures/map-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div
        className="mx-auto px-4 md:px-8 pt-2 md:pt-3 pb-10 md:pb-14"
        style={{ maxWidth: '1500px' }}
      >
        {/* HEADER ÚNICO */}
        {!hideHeader && <MapHeader />}

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
          onReset={resetFiltros}
        />

        {/* TOGGLE FILTROS MOBILE */}
        <div className="xl:hidden mt-6 flex gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition-all"
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

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFiltros}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-2xl px-4 text-xs font-bold uppercase tracking-[0.12em] transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: ORIGEN_COLORS.brown,
                color: ORIGEN_COLORS.cream,
                boxShadow: '0 8px 18px rgba(61, 43, 31, 0.18)',
              }}
            >
              <X size={14} strokeWidth={2.4} />
              Limpiar
            </button>
          )}
        </div>

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

        {/* MAPA FULL-WIDTH con cards flotantes */}
        <div className="mt-3 md:mt-4">
          <div
            ref={lazyLoadRef}
            className="relative w-full rounded-3xl overflow-hidden"
            style={{
              height: 'clamp(460px, 58vh, 560px)',
              border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
              boxShadow: '0 6px 24px rgba(60, 43, 32, 0.08), 0 1px 3px rgba(60, 43, 32, 0.05)',
              backgroundColor: ORIGEN_COLORS.paperWarm,
            }}
          >
            {!shouldLoadMap && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm" style={{ color: ORIGEN_COLORS.brownSoft }}>Cargando mapa…</p>
              </div>
            )}

            {shouldLoadMap && mapsError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm font-semibold" style={{ color: '#A04545' }}>Error cargando el mapa</p>
              </div>
            )}

            {shouldLoadMap && (
              <>
                <div
                  ref={mapContainer}
                  className="w-full h-full"
                  style={{ display: mapsLoaded ? 'block' : 'none' }}
                />

                {/* Overlay sutil */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 240, 232, 0) 60%, rgba(245, 240, 232, 0.18) 100%)',
                    mixBlendMode: 'multiply',
                  }}
                  aria-hidden="true"
                />

                {!mapInitialized && mapsLoaded && (
                  <div
                    className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10"
                    style={{ backgroundColor: 'rgba(245, 240, 232, 0.6)' }}
                  >
                    <Loader2 size={36} className="animate-spin" style={{ color: ORIGEN_COLORS.olive }} strokeWidth={1.5} />
                  </div>
                )}

                {/* Leyenda flotante (abajo-izquierda) */}
                <MapLegend />

                {/* CONTROLES ZOOM + FULLSCREEN — a la izquierda de las cards */}
                <div
                  className="absolute top-3 z-20 flex flex-col gap-1"
                  style={{ right: '300px' }}
                >
                  {/* Zoom in */}
                  <button
                    type="button"
                    onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? DEFAULT_ZOOM) + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-lg font-bold transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(245,240,232,0.95)',
                      border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
                      color: ORIGEN_COLORS.brown,
                      boxShadow: '0 2px 8px rgba(60,43,32,0.12)',
                      backdropFilter: 'blur(6px)',
                    }}
                    title="Acercar"
                  >+</button>

                  {/* Zoom out */}
                  <button
                    type="button"
                    onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() ?? DEFAULT_ZOOM) - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-lg font-bold transition-all hover:scale-105"
                    style={{
                      backgroundColor: 'rgba(245,240,232,0.95)',
                      border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
                      color: ORIGEN_COLORS.brown,
                      boxShadow: '0 2px 8px rgba(60,43,32,0.12)',
                      backdropFilter: 'blur(6px)',
                    }}
                    title="Alejar"
                  >−</button>

                  {/* Fullscreen */}
                  <button
                    type="button"
                    onClick={() => {
                      const el = mapContainer.current?.parentElement;
                      if (el) {
                        if (!document.fullscreenElement) el.requestFullscreen?.();
                        else document.exitFullscreen?.();
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all hover:scale-105 mt-0.5"
                    style={{
                      backgroundColor: 'rgba(245,240,232,0.95)',
                      border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
                      color: ORIGEN_COLORS.brown,
                      boxShadow: '0 2px 8px rgba(60,43,32,0.12)',
                      backdropFilter: 'blur(6px)',
                    }}
                    title="Pantalla completa"
                  >
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                  </button>
                </div>

                {/* CARDS FLOTANTES — esquina superior derecha */}
                <div className="absolute top-3 right-3 bottom-3 z-20 flex flex-col gap-2 w-[280px] pointer-events-auto">
                  {/* Header resultados */}
                  <div
                    className="flex items-center justify-between px-3 py-1.5 rounded-xl flex-shrink-0"
                    style={{
                      backgroundColor: 'rgba(245, 240, 232, 0.92)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${ORIGEN_COLORS.beigeSoft}`,
                    }}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: ORIGEN_COLORS.brownSoft }}>
                      {empresaSeleccionada ? 'Seleccionada' : 'Sugerencias'}
                    </span>
                    <span className="text-[10px]" style={{ color: ORIGEN_COLORS.brownSoft }}>
                      {empresasOrdenadas.length} resultados
                    </span>
                  </div>

                  {/* Cards — scroll interno */}
                  <div className="flex flex-col gap-2 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'thin' }}>
                    {empresasParaPanel.length === 0 ? (
                      <div
                        className="text-center py-4 rounded-2xl text-sm"
                        style={{
                          backgroundColor: 'rgba(245, 240, 232, 0.92)',
                          backdropFilter: 'blur(8px)',
                          border: `1px dashed ${ORIGEN_COLORS.beigeSoft}`,
                          color: ORIGEN_COLORS.brownSoft,
                        }}
                      >
                        Sin resultados con estos filtros.
                      </div>
                    ) : (
                      empresasParaPanel.map((e) => (
                        <div
                          key={e.id}
                          style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
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
                </div>
              </>
            )}
          </div>

          {/* Mobile: cards debajo del mapa */}
          <div className="lg:hidden flex gap-3 overflow-x-auto mt-3 -mx-4 px-4 pb-2">
            {empresasParaPanel.map((e) => (
              <div key={e.id} className="flex-shrink-0 w-[280px]">
                <MapEmpresaCard
                  empresa={e}
                  isSelected={selectedId === e.id}
                  onClick={() => setSelectedId(e.id)}
                  onView={() => handleViewComplete(e.id)}
                />
              </div>
            ))}
          </div>
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
