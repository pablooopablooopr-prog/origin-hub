import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Business } from '@/data/businesses';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';

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
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();

  // Category colors for markers
  const categoryColors: Record<string, string> = {
    'Restaurantes': '#8B5A3C',
    'Carnes': '#8B5A3C',
    'Lácteos': '#6B7280', 
    'Fermentos': '#84CC16',
    'Herbolarios': '#A3A3A3',
    'EcoModa': '#F59E0B',
    'Vida Natural': '#16A34A'
  };

  // Initialize map
  useEffect(() => {
    if (!loaded || !mapContainer.current || mapRef.current) return;

    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      
      mapRef.current = new Map(mapContainer.current!, {
        center: { lat: 40.4168, lng: -3.7038 }, // Madrid center
        zoom: 6,
        mapId: 'origen-map', // Required for AdvancedMarkerElement
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
    };

    initMap();

    return () => {
      // Clean up markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
      }
    };
  }, [loaded]);

  // Update markers when businesses change
  useEffect(() => {
    if (!mapRef.current || !loaded) return;

    const updateMarkers = async () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];

      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Add new markers
      filteredBusinesses.forEach((business) => {
        const markerContent = document.createElement('div');
        markerContent.className = 'google-map-marker';
        markerContent.style.width = '24px';
        markerContent.style.height = '24px';
        markerContent.style.borderRadius = '50%';
        markerContent.style.cursor = 'pointer';
        markerContent.style.border = '3px solid white';
        markerContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        markerContent.style.backgroundColor = categoryColors[business.category] || '#8B5A3C';
        markerContent.style.transition = 'transform 0.2s';

        const marker = new AdvancedMarkerElement({
          map: mapRef.current!,
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

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (filteredBusinesses.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        filteredBusinesses.forEach(business => {
          bounds.extend({ 
            lat: business.coordinates[1], 
            lng: business.coordinates[0] 
          });
        });
        
        mapRef.current.fitBounds(bounds, 50);
        
        // Don't zoom in too much for a single marker
        const listener = google.maps.event.addListener(mapRef.current, 'idle', () => {
          if (mapRef.current!.getZoom()! > 14) {
            mapRef.current!.setZoom(14);
          }
          google.maps.event.removeListener(listener);
        });
      }
    };

    updateMarkers();
  }, [filteredBusinesses, loaded]);

  const handleGeolocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en su navegador');
      return;
    }

    if (!mapRef.current || !loaded) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        mapRef.current!.panTo({ lat: latitude, lng: longitude });
        mapRef.current!.setZoom(12);

        // Remove previous user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.map = null;
        }

        // Add user location marker
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
        
        const userMarkerContent = document.createElement('div');
        userMarkerContent.style.width = '20px';
        userMarkerContent.style.height = '20px';
        userMarkerContent.style.borderRadius = '50%';
        userMarkerContent.style.backgroundColor = '#3B82F6';
        userMarkerContent.style.border = '3px solid white';
        userMarkerContent.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';

        userMarkerRef.current = new AdvancedMarkerElement({
          map: mapRef.current!,
          position: { lat: latitude, lng: longitude },
          content: userMarkerContent,
          title: 'Tu ubicación'
        });
        
        onLocationClick?.();
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener su ubicación');
      }
    );
  }, [loaded, onLocationClick]);

  // Error state - API key missing
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

  // Loading or error state
  if (error) {
    return (
      <Card className="h-96 md:h-[500px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Error al cargar el mapa</h3>
          <p className="text-muted-foreground">
            No se pudo cargar Google Maps. Por favor, intente de nuevo más tarde.
          </p>
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
        
        {/* Geolocation button */}
        <Button
          onClick={handleGeolocation}
          className="absolute top-4 left-4 z-10"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Mi zona
        </Button>

        {/* Selected business info */}
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
              <p className="text-sm text-primary-foreground/80 mb-1">{selectedBusiness.category}</p>
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
                <Button size="sm" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90" onClick={() => navigate(`/negocio/${selectedBusiness.id}`)}>
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

export default GoogleMap;
