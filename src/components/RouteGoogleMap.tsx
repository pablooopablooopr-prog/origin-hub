import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';

interface RouteStop {
  id: string;
  name: string;
  position: number;
  latitude: number | null;
  longitude: number | null;
}

interface RouteGoogleMapProps {
  stops: RouteStop[];
  routeTitle: string;
}

const RouteGoogleMap: React.FC<RouteGoogleMapProps> = ({ stops, routeTitle }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [selectedStop, setSelectedStop] = useState<RouteStop | null>(null);
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();

  // Filter stops with valid coordinates and sort by position
  const validStops = stops
    .filter(stop => stop.latitude !== null && stop.longitude !== null)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  // Initialize map
  useEffect(() => {
    if (!loaded || !mapContainer.current || mapRef.current) return;

    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      // Calculate center from stops or default to Spain
      let center = { lat: 40.4168, lng: -3.7038 };
      if (validStops.length > 0) {
        const avgLat = validStops.reduce((sum, s) => sum + (s.latitude || 0), 0) / validStops.length;
        const avgLng = validStops.reduce((sum, s) => sum + (s.longitude || 0), 0) / validStops.length;
        center = { lat: avgLat, lng: avgLng };
      }

      mapRef.current = new Map(mapContainer.current!, {
        center,
        zoom: 10,
        mapId: 'origen-route-map',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    };

    initMap();

    return () => {
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [loaded, validStops.length]);

  // Update markers and polyline when stops change
  useEffect(() => {
    if (!mapRef.current || !loaded || validStops.length === 0) return;

    const updateMapElements = async () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];

      // Remove existing polyline
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create path coordinates for polyline
      const pathCoordinates: google.maps.LatLngLiteral[] = [];

      // Add markers for each stop
      validStops.forEach((stop, index) => {
        const position = { 
          lat: stop.latitude!, 
          lng: stop.longitude! 
        };
        pathCoordinates.push(position);

        // Create custom marker element with brown circle and number
        const markerContent = document.createElement('div');
        markerContent.className = 'route-stop-marker';
        markerContent.style.cssText = `
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: hsl(30, 41%, 28%);
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
          position: relative;
        `;

        // Add outer glow effect
        const glowElement = document.createElement('div');
        glowElement.style.cssText = `
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background-color: rgba(139, 90, 60, 0.3);
          animation: pulse 2s infinite;
          z-index: -1;
        `;
        markerContent.appendChild(glowElement);

        // Add number
        const numberSpan = document.createElement('span');
        numberSpan.textContent = String(index + 1);
        numberSpan.style.cssText = `
          color: white;
          font-weight: bold;
          font-size: 14px;
          z-index: 1;
        `;
        markerContent.appendChild(numberSpan);

        // Add hover effect
        markerContent.addEventListener('mouseenter', () => {
          markerContent.style.transform = 'scale(1.1)';
        });
        markerContent.addEventListener('mouseleave', () => {
          markerContent.style.transform = 'scale(1)';
        });

        const marker = new AdvancedMarkerElement({
          map: mapRef.current!,
          position,
          content: markerContent,
          title: stop.name
        });

        marker.addListener('click', () => {
          setSelectedStop(stop);
          mapRef.current!.panTo(position);
          mapRef.current!.setZoom(14);
        });

        markersRef.current.push(marker);
      });

      // Create dashed polyline connecting stops
      polylineRef.current = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: 'hsl(30, 41%, 28%)',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [{
          icon: {
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 3
          },
          offset: '0',
          repeat: '15px'
        }]
      });
      polylineRef.current.setMap(mapRef.current);

      // Fit bounds to show all markers
      if (validStops.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        validStops.forEach(stop => {
          bounds.extend({ lat: stop.latitude!, lng: stop.longitude! });
        });
        
        mapRef.current.fitBounds(bounds, 60);
        
        // Don't zoom in too much for a single marker
        const listener = google.maps.event.addListener(mapRef.current, 'idle', () => {
          if (mapRef.current!.getZoom()! > 14) {
            mapRef.current!.setZoom(14);
          }
          google.maps.event.removeListener(listener);
        });
      }
    };

    updateMapElements();
  }, [validStops, loaded]);

  // Add CSS animation for pulse effect
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.15); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.6; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Error state - API key missing
  if (apiKeyMissing) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Mapa de la Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 flex items-center justify-center bg-muted/50 rounded-b-lg">
            <div className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Configuración requerida</h3>
              <p className="text-sm text-muted-foreground">
                El mapa interactivo no está disponible. Configure la API de Google Maps.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading or error state
  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Mapa de la Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 flex items-center justify-center bg-muted/50 rounded-b-lg">
            <div className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error al cargar el mapa</h3>
              <p className="text-sm text-muted-foreground">
                No se pudo cargar Google Maps. Intente de nuevo más tarde.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!loaded) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Mapa de la Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 flex items-center justify-center bg-muted/50 rounded-b-lg">
            <div className="text-center p-8">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando mapa...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No valid coordinates fallback
  if (validStops.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Mapa de la Ruta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 flex items-center justify-center bg-muted/50 rounded-b-lg">
            <div className="text-center p-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin ubicaciones</h3>
              <p className="text-sm text-muted-foreground">
                Las paradas de esta ruta no tienen coordenadas definidas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Mapa de la Ruta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-80 overflow-hidden rounded-b-lg">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Selected stop info card */}
          {selectedStop && (
            <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-72 z-10 bg-primary border-primary shadow-lg">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">
                        {selectedStop.position}
                      </span>
                    </div>
                    <h4 className="font-semibold text-primary-foreground">{selectedStop.name}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedStop(null)}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-xl leading-none"
                  >
                    ×
                  </button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteGoogleMap;
