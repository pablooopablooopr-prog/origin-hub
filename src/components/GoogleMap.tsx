import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { Business } from '@/data/businesses';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';
import { useNavigate } from "react-router-dom";
import type { MapItem } from './InteractiveMap';

// Custom map style — warm, earthy tones matching ORIGEN brand
const ORIGEN_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#f5f0e8" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b5c4c" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f0e8" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9b99a" }] },
  { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#ae9e85" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#ede7d9" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#dfd8c8" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#7a6b57" }] },
  { featureType: "poi.park", elementType: "geometry.fill", stylers: [{ color: "#c8dbb4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#e8dfd0" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#ddd4c3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#d4c9b5" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#c4b89e" }] },
  { featureType: "transit.line", elementType: "geometry", stylers: [{ color: "#dfd8c8" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#b8cfe0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#6e8fa5" }] },
];

interface GoogleMapProps {
  filteredBusinesses: Business[];
  searchQuery: string;
  selectedCategory: string | null;
  onLocationClick?: () => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  filteredBusinesses, 
  searchQuery, 
  selectedCategory,
  onLocationClick 
}) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();

  // Marker colors by item type
  const getMarkerColor = useCallback((item: Business): string => {
    const mapItem = item as MapItem;
    if (mapItem.itemType === 'route-stop') return '#5B8C5A';
    if (mapItem.itemType === 'company') return '#8B5A3C';
    return '#8B5A3C';
  }, []);

  // Initialize map (once)
  useEffect(() => {
    if (!loaded || !mapContainer.current || mapRef.current) return;

    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      mapRef.current = new Map(mapContainer.current!, {
        center: { lat: 40.4168, lng: -3.7038 },
        zoom: 6,
        mapId: 'origen-map',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: ORIGEN_MAP_STYLE,
      });
    };

    initMap();

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
    };
  }, [loaded]);

  // Update markers when businesses change — with clustering
  useEffect(() => {
    if (!mapRef.current || !loaded) return;

    const updateMarkers = async () => {
      // Clear previous clusterer and markers
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current = null;
      }
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

      filteredBusinesses.forEach((business) => {
        const markerContent = document.createElement('div');
        markerContent.style.cssText = `
          width: 24px; height: 24px; border-radius: 50%; cursor: pointer;
          border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          background-color: ${getMarkerColor(business)}; transition: transform 0.2s;
        `;

        const marker = new AdvancedMarkerElement({
          position: { 
            lat: business.coordinates[1], 
            lng: business.coordinates[0] 
          },
          content: markerContent,
          title: business.name
        });

        marker.addListener('click', () => {
          setSelectedBusiness(business);
          mapRef.current!.panTo({ 
            lat: business.coordinates[1], 
            lng: business.coordinates[0] 
          });
          mapRef.current!.setZoom(14);
        });

        newMarkers.push(marker);
      });

      markersRef.current = newMarkers;

      // Create clusterer with custom renderer
      if (newMarkers.length > 0) {
        clustererRef.current = new MarkerClusterer({
          map: mapRef.current!,
          markers: newMarkers,
          renderer: {
            render: ({ count, position }) => {
              const size = count < 10 ? 36 : count < 50 ? 44 : 52;
              const el = document.createElement('div');
              el.style.cssText = `
                width: ${size}px; height: ${size}px; border-radius: 50%;
                background: hsl(30, 40%, 35%); color: white; display: flex;
                align-items: center; justify-content: center; font-weight: 700;
                font-size: ${size < 40 ? 12 : 14}px; border: 3px solid hsl(30, 30%, 90%);
                box-shadow: 0 3px 10px rgba(0,0,0,0.25); cursor: pointer;
              `;
              el.textContent = String(count);
              return new google.maps.marker.AdvancedMarkerElement({
                position,
                content: el,
              });
            }
          }
        });

        // Fit bounds
        const bounds = new google.maps.LatLngBounds();
        filteredBusinesses.forEach(business => {
          bounds.extend({ lat: business.coordinates[1], lng: business.coordinates[0] });
        });
        mapRef.current.fitBounds(bounds, 50);

        const listener = google.maps.event.addListener(mapRef.current, 'idle', () => {
          if (mapRef.current!.getZoom()! > 14) {
            mapRef.current!.setZoom(14);
          }
          google.maps.event.removeListener(listener);
        });
      }
    };

    updateMarkers();
  }, [filteredBusinesses, loaded, getMarkerColor]);

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation || !mapRef.current || !loaded) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        mapRef.current!.panTo({ lat: latitude, lng: longitude });
        mapRef.current!.setZoom(12);

        if (userMarkerRef.current) {
          userMarkerRef.current.map = null;
        }

        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        const userMarkerContent = document.createElement('div');
        userMarkerContent.style.cssText = `
          width: 20px; height: 20px; border-radius: 50%;
          background-color: hsl(217, 91%, 60%); border: 3px solid white;
          box-shadow: 0 0 10px hsla(217, 91%, 60%, 0.5);
        `;

        userMarkerRef.current = new AdvancedMarkerElement({
          map: mapRef.current!,
          position: { lat: latitude, lng: longitude },
          content: userMarkerContent,
          title: 'Tu ubicación'
        });
        
        onLocationClick?.();
      },
      (err) => {
        console.error('Error getting location:', err);
      }
    );
  }, [loaded, onLocationClick]);

  // Error / loading states
  if (apiKeyMissing) {
    return (
      <Card className="h-96 md:h-[500px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Configuración requerida</h3>
          <p className="text-muted-foreground mb-4">
            El mapa no está disponible porque falta la configuración de Google Maps API.
          </p>
          <p className="text-sm text-muted-foreground">
            Administrador: Configure la variable de entorno <code className="bg-muted px-2 py-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code>
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-96 md:h-[500px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error al cargar el mapa</h3>
          <p className="text-muted-foreground">No se pudo cargar Google Maps.</p>
        </CardContent>
      </Card>
    );
  }

  if (!loaded) {
    return (
      <Card className="h-96 md:h-[500px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando mapa...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div className="relative h-96 md:h-[500px]">
        <div ref={mapContainer} className="w-full h-full rounded-lg" />
        
        <Button
          onClick={handleGeolocation}
          className="absolute top-4 left-4 z-10"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Mi zona
        </Button>

        {selectedBusiness && (
          <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-10 bg-primary border-primary shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-primary-foreground">{selectedBusiness.name}</h4>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-xl leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-primary-foreground/80 mb-1">
                {(selectedBusiness as MapItem)?.itemType === 'route-stop' 
                  ? `Ruta: ${(selectedBusiness as MapItem)?.routeTitle}` 
                  : selectedBusiness.category}
              </p>
              <p className="text-sm text-primary-foreground/90 mb-2">{selectedBusiness.description}</p>
              <p className="text-sm text-primary-foreground/70 mb-3">
                {selectedBusiness.address}, {selectedBusiness.city}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedBusiness.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-medium text-primary-foreground">{selectedBusiness.rating}</span>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const mapItem = selectedBusiness as MapItem;
                    if (mapItem?.itemType === 'route-stop' && mapItem.routeId) {
                      navigate(`/rutas/${mapItem.routeId}`);
                    } else {
                      const dbId = selectedBusiness?.id;
                      const slug = (selectedBusiness as any)?.slug;
                      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                      if (dbId && uuidRegex.test(dbId)) {
                        navigate(`/negocio/${dbId}`);
                      } else if (slug) {
                        navigate(`/negocio/${slug}`);
                      } else {
                        const showcaseSlugs = ['aceites-sierra-del-sur', 'quesos-artesanos-la-mancha'];
                        navigate(`/negocio/${showcaseSlugs[Math.floor(Math.random() * 2)]}`);
                      }
                    }
                  }}
                >
                  Ver detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default memo(GoogleMap);
