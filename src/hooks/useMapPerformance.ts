/**
 * Hook para optimizaciones de performance del mapa
 * - Lazy load: carga mapa solo cuando entra en viewport
 * - Clustering: agrupa pins si hay >150
 * - Viewport clipping: solo renderiza pins visibles
 * - Debounce: pan/zoom delayed (100ms)
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface MapBounds {
  ne: { lat: number; lng: number };
  sw: { lat: number; lng: number };
}

interface UseMapPerformanceResult {
  shouldLoadMap: boolean;
  mapRef: React.RefObject<HTMLDivElement>;
  bounds: MapBounds | null;
  setBounds: (bounds: MapBounds) => void;
  isDebouncing: boolean;
}

/**
 * Hook para lazy load del mapa con Intersection Observer
 */
export function useMapLazyLoad(): UseMapPerformanceResult {
  const mapRef = useRef<HTMLDivElement>(null);
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [bounds, setBoundsState] = useState<MapBounds | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Intersection Observer para lazy load
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMap(true);
          // Una vez cargado, dejar de observar
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(mapRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Debounce para cambios de bounds (pan/zoom)
  const setBounds = useCallback((newBounds: MapBounds) => {
    setIsDebouncing(true);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setBoundsState(newBounds);
      setIsDebouncing(false);
    }, 100);
  }, []);

  return {
    shouldLoadMap,
    mapRef,
    bounds,
    setBounds,
    isDebouncing,
  };
}

/**
 * Lógica de clustering: agrupa pins cercanos si hay muchos
 */
export interface Cluster {
  id: string;
  lat: number;
  lng: number;
  count: number;
  empresaIds: string[];
  color: string;
}

export function useMapClustering(
  empresas: Array<{ id: string; lat: number; lng: number; plan: string }>,
  zoom: number
) {
  const CLUSTER_THRESHOLD = 150;
  const CLUSTER_RADIUS_KM = zoom > 8 ? 2 : zoom > 6 ? 5 : 10; // Varía con zoom

  const clusters = useCallback((): Cluster[] => {
    // Si hay pocos pins, sin clustering
    if (empresas.length <= CLUSTER_THRESHOLD) {
      return [];
    }

    const clustered: Cluster[] = [];
    const assigned = new Set<string>();

    // Agrupar pins cercanos
    for (let i = 0; i < empresas.length; i++) {
      if (assigned.has(empresas[i].id)) continue;

      const cluster: Cluster = {
        id: `cluster-${i}`,
        lat: empresas[i].lat,
        lng: empresas[i].lng,
        count: 1,
        empresaIds: [empresas[i].id],
        color: '#5C6B2E', // Verde oliva por defecto
      };

      assigned.add(empresas[i].id);

      // Buscar pins cercanos
      for (let j = i + 1; j < empresas.length; j++) {
        if (assigned.has(empresas[j].id)) continue;

        const distance = calculateDistance(
          cluster.lat,
          cluster.lng,
          empresas[j].lat,
          empresas[j].lng
        );

        if (distance <= CLUSTER_RADIUS_KM) {
          cluster.count++;
          cluster.empresaIds.push(empresas[j].id);
          cluster.lat = (cluster.lat + empresas[j].lat) / 2;
          cluster.lng = (cluster.lng + empresas[j].lng) / 2;
          assigned.add(empresas[j].id);
        }
      }

      if (cluster.count > 1) {
        clustered.push(cluster);
      }
    }

    return clustered;
  }, [empresas]);

  return clusters;
}

/**
 * Calcular distancia entre dos puntos (Haversine formula)
 * Devuelve distancia en km
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Viewport clipping: solo renderiza pins dentro del viewport
 */
export function useViewportClipping(
  empresas: Array<{ id: string; lat: number; lng: number }>,
  bounds: MapBounds | null
) {
  return useCallback(() => {
    if (!bounds) return empresas;

    return empresas.filter((empresa) => {
      return (
        empresa.lat >= bounds.sw.lat &&
        empresa.lat <= bounds.ne.lat &&
        empresa.lng >= bounds.sw.lng &&
        empresa.lng <= bounds.ne.lng
      );
    });
  }, [empresas, bounds]);
}
