import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Business, businessesData } from '@/data/businesses';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MapboxMapProps {
  filteredBusinesses: Business[];
  searchQuery: string;
  selectedCategory: string | null;
  onLocationClick?: () => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ 
  filteredBusinesses, 
  searchQuery, 
  selectedCategory,
  onLocationClick 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-3.7038, 40.4168], // Madrid center
        zoom: 6
      });

      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      setShowTokenInput(false);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when businesses change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    filteredBusinesses.forEach((business) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundImage = 'none';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      // Color based on category
      const categoryColors: Record<string, string> = {
        'Carnes': '#8B5A3C',
        'Lácteos': '#6B7280', 
        'Fermentos': '#84CC16',
        'Herbolarios': '#A3A3A3',
        'EcoModa': '#F59E0B',
        'Vida Natural': '#16A34A'
      };
      
      el.style.backgroundColor = categoryColors[business.category] || '#8B5A3C';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(business.coordinates)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedBusiness(business);
        map.current!.flyTo({
          center: business.coordinates,
          zoom: 12
        });
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are any
    if (filteredBusinesses.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredBusinesses.forEach(business => {
        bounds.extend(business.coordinates);
      });
      
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [filteredBusinesses]);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no está disponible en su navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12
          });

          // Add user location marker
          const userMarker = document.createElement('div');
          userMarker.style.width = '20px';
          userMarker.style.height = '20px';
          userMarker.style.borderRadius = '50%';
          userMarker.style.backgroundColor = '#3B82F6';
          userMarker.style.border = '3px solid white';
          userMarker.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.5)';

          new mapboxgl.Marker(userMarker)
            .setLngLat([longitude, latitude])
            .addTo(map.current!);
        }
        
        onLocationClick?.();
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('No se pudo obtener su ubicación');
      }
    );
  };

  if (showTokenInput) {
    return (
      <Card className="h-96 md:h-[500px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-4">Configurar Mapa</h3>
          <p className="text-muted-foreground mb-4">
            Para usar el mapa, necesita un token de Mapbox. 
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline ml-1"
            >
              Consiga su token aquí
            </a>
          </p>
          <div className="flex flex-col gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Pegue su token de Mapbox aquí"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="px-3 py-2 border border-input rounded-md"
            />
            <Button 
              onClick={() => setShowTokenInput(false)}
              disabled={!mapboxToken}
            >
              Activar Mapa
            </Button>
          </div>
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
          <Card className="absolute bottom-4 left-4 right-4 md:right-auto md:w-80 z-10">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-primary">{selectedBusiness.name}</h4>
                <button
                  onClick={() => setSelectedBusiness(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{selectedBusiness.category}</p>
              <p className="text-sm mb-2">{selectedBusiness.description}</p>
              <p className="text-sm text-muted-foreground mb-3">
                {selectedBusiness.address}, {selectedBusiness.city}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedBusiness.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-medium">{selectedBusiness.rating}</span>
                </div>
                <Button size="sm" variant="outline">
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

export default MapboxMap;