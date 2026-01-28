import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, ChevronLeft, ChevronRight, Navigation, MapPin, Clock, ArrowRight, ExternalLink, X, Route } from 'lucide-react';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';

interface RouteStop {
  id: string;
  name: string;
  position: number;
  latitude: number | null;
  longitude: number | null;
  address?: string;
  images?: string[];
}

interface DirectionsLeg {
  distance: string;
  duration: string;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
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
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [directionsLegs, setDirectionsLegs] = useState<DirectionsLeg[]>([]);
  const [distanceMatrix, setDistanceMatrix] = useState<Array<{ from: number; to: number; distance: string; duration: string }>>([]);
  const [loadingDirections, setLoadingDirections] = useState(false);
  const [showDirectionsSteps, setShowDirectionsSteps] = useState(false);
  
  const { loaded, error, apiKeyMissing } = useGoogleMapsLoader();

  // Filter stops with valid coordinates and sort by position
  const validStops = stops
    .filter(stop => stop.latitude !== null && stop.longitude !== null)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  const selectedStop = selectedStopIndex !== null ? validStops[selectedStopIndex] : null;

  // Calculate directions between all stops
  const calculateDirections = useCallback(async () => {
    if (!mapRef.current || validStops.length < 2) return;
    
    setLoadingDirections(true);
    
    try {
      const directionsService = new google.maps.DirectionsService();
      
      const origin = { lat: validStops[0].latitude!, lng: validStops[0].longitude! };
      const destination = { lat: validStops[validStops.length - 1].latitude!, lng: validStops[validStops.length - 1].longitude! };
      
      const waypoints = validStops.slice(1, -1).map(stop => ({
        location: { lat: stop.latitude!, lng: stop.longitude! },
        stopover: true
      }));

      const result = await directionsService.route({
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
      });

      if (result.routes[0]?.legs) {
        const legs = result.routes[0].legs.map(leg => ({
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          steps: leg.steps?.map(step => ({
            instruction: step.instructions?.replace(/<[^>]*>/g, '') || '',
            distance: step.distance?.text || '',
            duration: step.duration?.text || ''
          })) || []
        }));
        
        setDirectionsLegs(legs);
        
        // Build distance matrix from legs
        const matrix = legs.map((leg, index) => ({
          from: index + 1,
          to: index + 2,
          distance: leg.distance,
          duration: leg.duration
        }));
        setDistanceMatrix(matrix);

        // Don't render DirectionsRenderer - we keep our custom polyline instead
        // Just store the directions data for distance/duration calculations
      }
    } catch (err) {
      console.error('Error calculating directions:', err);
    } finally {
      setLoadingDirections(false);
    }
  }, [validStops]);

  // Generate Google Maps navigation URL
  const getNavigationUrl = useCallback(() => {
    if (validStops.length === 0) return '';
    
    const origin = `${validStops[0].latitude},${validStops[0].longitude}`;
    const destination = `${validStops[validStops.length - 1].latitude},${validStops[validStops.length - 1].longitude}`;
    
    const waypoints = validStops.slice(1, -1)
      .map(stop => `${stop.latitude},${stop.longitude}`)
      .join('|');
    
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    
    if (waypoints) {
      url += `&waypoints=${encodeURIComponent(waypoints)}`;
    }
    
    return url;
  }, [validStops]);

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
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
      }
    };
  }, [loaded, validStops.length]);

  // Update markers when stops change
  useEffect(() => {
    if (!mapRef.current || !loaded || validStops.length === 0) return;

    const updateMapElements = async () => {
      // Remove existing markers
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];


      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

      // Create path coordinates for polyline (fallback)
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
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: ${selectedStopIndex === index ? 'hsl(30, 50%, 20%)' : 'hsl(30, 41%, 28%)'};
          border: 3px solid ${selectedStopIndex === index ? 'hsl(45, 100%, 60%)' : 'white'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s;
          position: relative;
          transform: ${selectedStopIndex === index ? 'scale(1.2)' : 'scale(1)'};
        `;

        // Add outer glow effect
        const glowElement = document.createElement('div');
        glowElement.style.cssText = `
          position: absolute;
          width: 52px;
          height: 52px;
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
          font-size: 16px;
          z-index: 1;
        `;
        markerContent.appendChild(numberSpan);

        // Add hover effect
        markerContent.addEventListener('mouseenter', () => {
          if (selectedStopIndex !== index) {
            markerContent.style.transform = 'scale(1.1)';
          }
        });
        markerContent.addEventListener('mouseleave', () => {
          if (selectedStopIndex !== index) {
            markerContent.style.transform = 'scale(1)';
          }
        });

        const marker = new AdvancedMarkerElement({
          map: mapRef.current!,
          position,
          content: markerContent,
          title: stop.name
        });

        marker.addListener('click', () => {
          setSelectedStopIndex(index);
          setShowPanel(true);
          mapRef.current!.panTo(position);
          mapRef.current!.setZoom(14);
        });

        markersRef.current.push(marker);
      });

      // Always create/update the dashed polyline connecting stops
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
      
      polylineRef.current = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: 'hsl(30, 41%, 28%)',
        strokeOpacity: 0.9,
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
      if (validStops.length > 0 && selectedStopIndex === null) {
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
  }, [validStops, loaded, selectedStopIndex]);

  // Calculate directions when map is ready
  useEffect(() => {
    if (mapRef.current && loaded && validStops.length >= 2 && directionsLegs.length === 0) {
      calculateDirections();
    }
  }, [loaded, calculateDirections, validStops.length, directionsLegs.length]);

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

  const handlePrevStop = () => {
    if (selectedStopIndex !== null && selectedStopIndex > 0) {
      const newIndex = selectedStopIndex - 1;
      setSelectedStopIndex(newIndex);
      const stop = validStops[newIndex];
      mapRef.current?.panTo({ lat: stop.latitude!, lng: stop.longitude! });
    }
  };

  const handleNextStop = () => {
    if (selectedStopIndex !== null && selectedStopIndex < validStops.length - 1) {
      const newIndex = selectedStopIndex + 1;
      setSelectedStopIndex(newIndex);
      const stop = validStops[newIndex];
      mapRef.current?.panTo({ lat: stop.latitude!, lng: stop.longitude! });
    }
  };

  const closePanel = () => {
    setShowPanel(false);
    setSelectedStopIndex(null);
    setShowDirectionsSteps(false);
  };

  // Get directions for the current segment (from selected stop to next)
  const getCurrentLeg = () => {
    if (selectedStopIndex === null || selectedStopIndex >= directionsLegs.length) return null;
    return directionsLegs[selectedStopIndex];
  };

  // Get directions for the previous segment (from previous stop to selected)
  const getPreviousLeg = () => {
    if (selectedStopIndex === null || selectedStopIndex === 0) return null;
    return directionsLegs[selectedStopIndex - 1];
  };

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

  const currentLeg = getCurrentLeg();
  const previousLeg = getPreviousLeg();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Route className="w-5 h-5" />
          Mapa de la Ruta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          {/* Map Container */}
          <div ref={mapContainer} className="w-full h-80" />
          
          {/* Navigation Button */}
          <Button
            onClick={() => window.open(getNavigationUrl(), '_blank')}
            className="absolute top-3 right-3 z-10 shadow-lg"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-1" />
            Iniciar navegación
          </Button>

          {/* Side Panel for selected stop */}
          {showPanel && selectedStop && (
            <div className="absolute inset-0 bg-black/30 z-20" onClick={closePanel}>
              <div 
                className="absolute left-0 top-0 bottom-0 w-80 bg-card shadow-xl overflow-hidden animate-in slide-in-from-left duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="bg-primary text-primary-foreground p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                          <span className="font-bold text-lg">{selectedStopIndex! + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{selectedStop.name}</h3>
                          {selectedStop.address && (
                            <p className="text-sm text-primary-foreground/80 mt-0.5">{selectedStop.address}</p>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={closePanel}
                        className="text-primary-foreground/70 hover:text-primary-foreground p-1"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Image if exists */}
                  {selectedStop.images && selectedStop.images.length > 0 && (
                    <div className="h-32 overflow-hidden">
                      <img 
                        src={selectedStop.images[0]} 
                        alt={selectedStop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      {/* Distance info */}
                      <div className="space-y-2">
                        {previousLeg && (
                          <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <div>
                              <span className="font-medium">Desde parada anterior:</span>
                              <span className="ml-2">{previousLeg.distance}, {previousLeg.duration}</span>
                            </div>
                          </div>
                        )}
                        {currentLeg && (
                          <div className="flex items-center gap-2 text-sm bg-muted/50 rounded-lg p-3">
                            <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                            <div>
                              <span className="font-medium">Hasta siguiente parada:</span>
                              <span className="ml-2">{currentLeg.distance}, {currentLeg.duration}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Directions Steps Toggle */}
                      {currentLeg && currentLeg.steps.length > 0 && (
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowDirectionsSteps(!showDirectionsSteps)}
                          >
                            <Route className="w-4 h-4 mr-2" />
                            {showDirectionsSteps ? 'Ocultar indicaciones' : 'Cómo llegar a la siguiente parada'}
                          </Button>
                          
                          {showDirectionsSteps && (
                            <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                              {currentLeg.steps.map((step, idx) => (
                                <div key={idx} className="flex gap-2 text-xs bg-muted/30 rounded p-2">
                                  <span className="font-bold text-primary flex-shrink-0">{idx + 1}.</span>
                                  <div className="flex-1">
                                    <p>{step.instruction}</p>
                                    <p className="text-muted-foreground mt-0.5">{step.distance} • {step.duration}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Distance Matrix Summary */}
                      {distanceMatrix.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Resumen de tramos
                          </h4>
                          <div className="space-y-1.5">
                            {distanceMatrix.map((segment, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between text-xs p-2 rounded ${
                                  selectedStopIndex === idx ? 'bg-primary/10 border border-primary/30' : 'bg-muted/30'
                                }`}
                              >
                                <span className="font-medium">
                                  Tramo {segment.from} → {segment.to}
                                </span>
                                <span className="text-muted-foreground">
                                  {segment.distance}, {segment.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Open in Google Maps */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          const url = `https://www.google.com/maps/search/?api=1&query=${selectedStop.latitude},${selectedStop.longitude}`;
                          window.open(url, '_blank');
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver en Google Maps
                      </Button>
                    </div>
                  </ScrollArea>

                  {/* Navigation Footer */}
                  <div className="border-t p-3 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handlePrevStop}
                      disabled={selectedStopIndex === 0}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={handleNextStop}
                      disabled={selectedStopIndex === validStops.length - 1}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading indicator for directions */}
        {loadingDirections && (
          <div className="p-3 bg-muted/50 text-center text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Calculando distancias...
            </div>
          </div>
        )}

        {/* Quick distance summary below map */}
        {!showPanel && distanceMatrix.length > 0 && (
          <div className="p-3 border-t">
            <p className="text-xs text-muted-foreground mb-2">Haz clic en un marcador para ver detalles</p>
            <div className="flex flex-wrap gap-1.5">
              {distanceMatrix.map((segment, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedStopIndex(idx);
                    setShowPanel(true);
                    const stop = validStops[idx];
                    mapRef.current?.panTo({ lat: stop.latitude!, lng: stop.longitude! });
                    mapRef.current?.setZoom(14);
                  }}
                  className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                >
                  {segment.from}→{segment.to}: {segment.distance}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteGoogleMap;
