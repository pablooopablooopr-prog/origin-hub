import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGoogleMapsLoader } from "@/hooks/useGoogleMapsLoader";

/**
 * Mini-mapa interactivo de España para el panel B2B.
 *
 * Recibe una lista de empresas con lat/lng y dispara onSelectCompany al
 * pulsar un pin. Si Google Maps no está configurado o la empresa no tiene
 * coordenadas, hace fallback a una vista grid con tarjetas pulsables.
 *
 * Estilo coherente con el GoogleMap de la home (paleta tierra ORIGEN).
 */

export interface B2BMapCompany {
  id: string;
  business_name: string;
  business_type: string | null;
  locality: string | null;
  logo_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface B2BMiniMapProps {
  companies: B2BMapCompany[];
  selectedId?: string | null;
  onSelectCompany: (company: B2BMapCompany) => void;
  /** Altura CSS, ej "420px" */
  height?: string;
}

const MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f0e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b5c4c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f0e8" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b99a" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#ede7d9" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd8c8" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#c8dbb4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e8dfd0" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b8cfe0" }] },
];

const B2BMiniMap = ({
  companies,
  selectedId,
  onSelectCompany,
  height = "420px",
}: B2BMiniMapProps) => {
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Sólo las empresas con coordenadas para el mapa real
  const geoCompanies = useMemo(
    () =>
      companies.filter(
        (c) =>
          typeof c.latitude === "number" &&
          typeof c.longitude === "number" &&
          isFinite(c.latitude) &&
          isFinite(c.longitude)
      ),
    [companies]
  );

  // Inicializa el mapa
  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;

    let cancelled = false;
    (async () => {
      const { Map } = (await google.maps.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      if (cancelled || !containerRef.current) return;

      mapRef.current = new Map(containerRef.current, {
        center: { lat: 40.0, lng: -3.7 },
        zoom: 5.6,
        mapId: "origen-b2b-map",
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: MAP_STYLE,
      });
      setMapReady(true);
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];
    };
  }, [loaded]);

  // Sincroniza markers cuando cambian las empresas o la selección
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    let cancelled = false;
    (async () => {
      const { AdvancedMarkerElement } = (await google.maps.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
      if (cancelled || !mapRef.current) return;

      // Limpia markers
      markersRef.current.forEach((m) => (m.map = null));
      markersRef.current = [];

      const bounds = new google.maps.LatLngBounds();

      geoCompanies.forEach((c) => {
        const isSel = c.id === selectedId;
        const el = document.createElement("div");
        const initials = c.business_name
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((p) => p[0]?.toUpperCase())
          .join("");
        el.style.cssText = `
          display: flex; align-items: center; justify-content: center;
          width: ${isSel ? 36 : 28}px; height: ${isSel ? 36 : 28}px;
          border-radius: 50%; cursor: pointer;
          background: ${isSel ? "#7b572d" : "#a87a4a"};
          color: white; font-weight: 700; font-size: ${isSel ? 12 : 10}px;
          border: 3px solid #fffaf2;
          box-shadow: 0 4px 12px rgba(76,51,25,0.35);
          transition: transform 0.15s ease;
        `;
        el.textContent = initials || "•";
        el.title = c.business_name;

        const marker = new AdvancedMarkerElement({
          map: mapRef.current!,
          position: { lat: c.latitude!, lng: c.longitude! },
          content: el,
          title: c.business_name,
        });

        marker.addListener("click", () => {
          onSelectCompany(c);
          mapRef.current?.panTo({ lat: c.latitude!, lng: c.longitude! });
        });

        markersRef.current.push(marker);
        bounds.extend({ lat: c.latitude!, lng: c.longitude! });
      });

      if (geoCompanies.length > 1) {
        mapRef.current.fitBounds(bounds, 60);
      } else if (geoCompanies.length === 1) {
        mapRef.current.setCenter({
          lat: geoCompanies[0].latitude!,
          lng: geoCompanies[0].longitude!,
        });
        mapRef.current.setZoom(8);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [geoCompanies, selectedId, mapReady, onSelectCompany]);

  // FALLBACK 1: sin API key, mostrar grid de tarjetas pulsables
  if (apiKeyMissing) {
    return (
      <FallbackGrid
        companies={companies}
        selectedId={selectedId}
        onSelectCompany={onSelectCompany}
        height={height}
        reason="api-key"
      />
    );
  }

  if (error) {
    return (
      <Card className="border-amber-200 bg-amber-50/40" style={{ height }}>
        <CardContent className="h-full flex flex-col items-center justify-center text-center p-6">
          <AlertTriangle className="w-8 h-8 text-amber-600 mb-2" />
          <p className="text-sm font-semibold">No se pudo cargar el mapa</p>
          <p className="text-xs text-muted-foreground mt-1">
            Revisa tu conexión y vuelve a intentarlo.
          </p>
        </CardContent>
      </Card>
    );
  }

  // FALLBACK 2: ninguna empresa con coords y mapa cargado → grid debajo
  return (
    <div className="relative w-full" style={{ height }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/40 rounded-lg">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full rounded-lg overflow-hidden border border-border"
      />
      {loaded && geoCompanies.length === 0 && (
        <div className="absolute inset-x-4 bottom-4 rounded-lg bg-card/95 backdrop-blur-sm border border-border p-3 text-xs text-muted-foreground shadow-md">
          Ninguna de las empresas filtradas tiene coordenadas. Mostrando lista
          debajo.
        </div>
      )}
    </div>
  );
};

const FallbackGrid = ({
  companies,
  selectedId,
  onSelectCompany,
  height,
  reason,
}: {
  companies: B2BMapCompany[];
  selectedId?: string | null;
  onSelectCompany: (c: B2BMapCompany) => void;
  height: string;
  reason: "api-key" | "no-coords";
}) => (
  <Card
    className="overflow-hidden bg-gradient-to-br from-amber-50/40 via-card to-emerald-50/30"
    style={{ height }}
  >
    <CardContent className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <Badge variant="outline" className="gap-1.5 text-[10px]">
          <MapPin className="w-3 h-3" />
          {reason === "api-key" ? "Lista de empresas" : "Sin coordenadas"}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {companies.length} empresa{companies.length === 1 ? "" : "s"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
        {companies.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground italic text-center py-10">
            No hay empresas que coincidan con los filtros.
          </p>
        )}
        {companies.map((c) => {
          const isSel = c.id === selectedId;
          const initials = c.business_name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join("");
          return (
            <button
              key={c.id}
              onClick={() => onSelectCompany(c)}
              className={`flex items-center gap-3 p-2.5 rounded-lg border text-left transition-colors ${
                isSel
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/70 hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                  isSel ? "bg-primary" : "bg-amber-700"
                }`}
              >
                {initials || "•"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {c.business_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {c.business_type ?? "Empresa"} · {c.locality ?? "—"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

export default B2BMiniMap;
