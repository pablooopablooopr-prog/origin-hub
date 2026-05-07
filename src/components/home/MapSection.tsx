/**
 * SECCIÓN MAPA V2 — Refactorización con layout sidebar + proporciones correctas
 *
 * Layout:
 * - Sidebar: 25-30% izquierda (desktop), modal (mobile)
 * - Mapa: 70-75% derecha
 * - Altura: 500-600px (sección, no 100vh)
 *
 * Filtros:
 * - NICHO (dropdown)
 * - PROVINCIA (nuevo, para futuro nacional)
 * - TIPO (dropdown)
 * - EN RUTAS (checkbox nuevo)
 * - DESTACADOS (checkbox)
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Menu } from 'lucide-react';
import { MapFiltersModal } from '@/components/MapFiltersModal';
import { MapSidebar } from '@/components/MapSidebar';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useFetchEmpresas } from '@/hooks/useFetchEmpresas';
import { useMapFilters } from '@/hooks/useMapFilters';
import { useMapLazyLoad } from '@/hooks/useMapPerformance';
import { SPOTLIGHT_POOL } from '@/data/spotlightDemo';
import type { Empresa } from '@/hooks/useFetchEmpresas';

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

// Centro de Castilla-La Mancha
const REGION_CENTER = { lat: 39.2387, lng: -3.2022 };
const DEFAULT_ZOOM = 8;

// Convertir datos de spotlightDemo a Empresa[]
function convertSpotlightToEmpresas(): Empresa[] {
  const empresas: Empresa[] = [];

  Object.entries(SPOTLIGHT_POOL).forEach(([nicho, companies]) => {
    companies.forEach((company, index) => {
      empresas.push({
        id: company.id,
        nombre: company.name,
        nicho: company.category,
        tipo: 'productor',
        plan: company.plan,
        localidad: company.locality,
        provincia: 'Ciudad Real', // Datos de ejemplo
        lat: 39.2 + (Math.random() - 0.5) * 0.5,
        lng: -3.2 + (Math.random() - 0.5) * 0.5,
        foto: company.image,
        descripcion: company.description,
        en_ruta: index === 0, // Primer item de cada nicho en rutas
        ruta_name: index === 0 ? `Ruta ${nicho}` : null,
        slug: company.id,
      });
    });
  });

  return empresas;
}

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
    setProvincia,
    setTipo,
    setEnRutas,
    setMostrarDestacados,
    resetFiltros,
  } = useMapFilters(empresas);

  // Estado local
  const [selectedEmpresa, setSelectedEmpresa] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
    <section className="w-full bg-background">
      {/* SECCIÓN TÍTULO + FILTROS INTEGRADOS */}
      <div className="w-full px-4 md:px-6 py-12 md:py-16 bg-gradient-to-b from-bone via-bone to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* LABEL "EL MAPA" EN ORO */}
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-warm-white/60">—</span>
            <span className="text-xs font-bold uppercase tracking-widest text-warm-white" style={{ color: '#B8860B' }}>
              EL MAPA
            </span>
          </div>

          {/* TÍTULO PRINCIPAL */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 tracking-tight">
            Explora Castilla-La Mancha
          </h2>

          {/* SUBTÍTULO */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed mb-8">
            Explora productores, restaurantes, experiencias y alojamientos de la región con una navegación clara, curada y visualmente elegante.
          </p>

          {/* FILTROS DESKTOP - NICHO COMO BOTONES */}
          <div className="hidden lg:block space-y-6">
            {/* NICHO - Visual Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'quesos', label: 'Quesos' },
                  { id: 'carnes', label: 'Carnes' },
                  { id: 'vinos', label: 'Vinos' },
                  { id: 'caza', label: 'Caza' },
                  { id: 'miel', label: 'Miel' },
                  { id: 'cooperativas', label: 'Cooperativas' },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setNicho(option.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                      filtros.nicho === option.id
                        ? 'bg-moss-medium text-white shadow-soft'
                        : 'bg-white border-2 border-border text-foreground hover:border-moss-medium'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PROVINCIA + TIPO + CHECKBOXES EN FILA */}
            <div className="flex flex-wrap gap-6 items-end">
              {/* PROVINCIA - Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Provincia</label>
                <select
                  value={filtros.provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className={`px-4 py-2.5 text-sm rounded-md bg-white border-2 transition-all duration-200 font-body ${
                    filtros.provincia === 'todas'
                      ? 'border-border text-muted-foreground'
                      : 'border-earth-medium text-foreground font-semibold'
                  } hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-earth-medium focus:ring-offset-2`}
                >
                  <option value="todas">Todas</option>
                  <option value="ciudad-real">Ciudad Real</option>
                  <option value="toledo">Toledo</option>
                  <option value="cuenca">Cuenca</option>
                  <option value="guadalajara">Guadalajara</option>
                  <option value="albacete">Albacete</option>
                </select>
              </div>

              {/* TIPO - Visual Buttons */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'productor', label: 'Productor' },
                    { id: 'restaurante', label: 'Restaurante' },
                    { id: 'experiencia', label: 'Experiencia' },
                    { id: 'alojamiento', label: 'Alojamiento' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setTipo(option.id)}
                      className={`px-3 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${
                        filtros.tipo === option.id
                          ? 'bg-earth-medium text-white shadow-soft'
                          : 'bg-white border-2 border-border text-foreground hover:border-earth-medium'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* EN RUTAS */}
              <label className="flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-md border-2 border-border hover:border-moss-medium hover:shadow-soft transition-all duration-200">
                <input
                  type="checkbox"
                  checked={filtros.enRutas}
                  onChange={(e) => setEnRutas(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-moss-medium"
                />
                <span className="text-sm font-semibold text-foreground">En rutas</span>
              </label>

              {/* DESTACADOS */}
              <label className="flex items-center gap-3 cursor-pointer px-4 py-2.5 rounded-md border-2 border-border hover:border-accent hover:shadow-soft transition-all duration-200">
                <input
                  type="checkbox"
                  checked={filtros.mostrarDestacadosFirst}
                  onChange={(e) => setMostrarDestacados(e.target.checked)}
                  className="w-5 h-5 rounded cursor-pointer accent-accent"
                />
                <span className="text-sm font-semibold text-foreground">Destacados</span>
              </label>

              {/* RESET */}
              <button
                onClick={resetFiltros}
                className="px-4 py-2.5 text-xs font-semibold text-muted-foreground border-2 border-border rounded-md hover:border-earth-medium hover:text-earth-medium hover:shadow-soft transition-all duration-200 uppercase tracking-wider"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* MOBILE FILTER TOGGLE BUTTON */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden p-3 rounded-md bg-moss-light/10 hover:bg-moss-light/20 border border-moss-medium/30 transition-all duration-200"
          >
            <Menu size={20} className="text-moss-medium" />
          </button>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
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

      {/* MAPA CONTAINER */}
      <div className="relative w-full bg-background">
        {/* MAP ITSELF */}
        <div
          ref={lazyLoadRef}
          className="relative w-full h-[420px] lg:h-[480px] bg-bone rounded-lg lg:rounded-xl overflow-hidden shadow-soft"
        >
          {/* LOADING PLACEHOLDER */}
          {!shouldLoadMap && (
            <div className="absolute inset-0 flex items-center justify-center bg-bone">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {shouldLoadMap && mapsError && (
            <div className="absolute inset-0 flex items-center justify-center bg-bone">
              <div className="text-center">
                <p className="text-sm text-destructive font-semibold">Error cargando el mapa</p>
              </div>
            </div>
          )}

          {/* GOOGLE MAPS CONTAINER */}
          {shouldLoadMap && (
            <>
              <div
                ref={mapContainer}
                className="w-full h-full"
                style={{ display: mapsLoaded ? 'block' : 'none' }}
              />

              {/* LOADING SPINNER DURANTE INICIALIZACIÓN */}
              {!mapInitialized && mapsLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10">
                  <Loader2 size={40} className="animate-spin text-moss-medium" strokeWidth={1.5} />
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
      </div>

      {/* INFO DE EMPRESAS - ESTADÍSTICAS */}
      <div className="px-4 md:px-6 py-8 md:py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-foreground">214</div>
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-2">Empresas</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-moss-medium">32</div>
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-2">Destacados</p>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-earth-medium">18</div>
            <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-2">En Rutas Activas</p>
          </div>
        </div>
      </div>
    </section>
  );
}
