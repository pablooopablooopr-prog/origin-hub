/**
 * Hook para fetch de empresas con caché de 5 minutos
 * Fetch UNA SOLA VEZ, devuelve datos cacheados
 * Cero nuevas peticiones en cambios de filtro
 *
 * Mapea estructura Supabase → Empresa para el mapa
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type CompanyRow = Database['public']['Tables']['companies']['Row'];
type CategoryRow = Database['public']['Tables']['categories']['Row'];

export interface Empresa {
  id: string;
  nombre: string;
  nicho: string | null; // Nombre de categoría
  tipo: string | null; // business_type
  plan: 'basico' | 'standard' | 'destacado'; // Por ahora, todos 'basico' hasta determinar lógica de plan
  localidad: string | null; // municipality / address
  provincia: string | null; // region name
  lat: number;
  lng: number;
  foto: string | null; // cover_image_url o logo_url
  descripcion: string | null;
  en_ruta: boolean; // Calculado: si aparece en alguna ruta
  ruta_name: string | null; // Nombre de ruta si aplica
  slug: string | null; // Para links
}

interface CacheState {
  data: Empresa[] | null;
  timestamp: number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en ms
const empresasCache: CacheState = {
  data: null,
  timestamp: null,
};

/**
 * Fetch empresas con JOIN a categorías
 * Nota: El campo "plan" aún no está implementado en BD.
 * Por ahora asignamos 'basico' a todas. Cuando exista tabla de suscripciones,
 * hacer JOIN adicional.
 */
async function fetchEmpresasFromSupabase(): Promise<Empresa[]> {
  // Fetch empresas con sus categorías
  const { data, error } = await supabase
    .from('companies')
    .select(
      `
      id,
      business_name,
      business_type,
      description,
      latitude,
      longitude,
      cover_image_url,
      logo_url,
      status,
      slug,
      address,
      category_id,
      region_id,
      categories!category_id(id, name),
      regions!region_id(id, name)
    `
    )
    .eq('status', 'approved')
    .order('business_name', { ascending: true });

  if (error) {
    console.error('Error fetching empresas:', error);
    throw error;
  }

  // Mapear campos de Supabase a interfaz Empresa
  return (data || []).map((row: any) => {
    const category = row.categories as CategoryRow | null;
    const region = row.regions as any;

    return {
      id: row.id || '',
      nombre: row.business_name || 'Sin nombre',
      nicho: category?.name || null,
      tipo: row.business_type || null,
      plan: 'basico' as const, // TODO: Join con subscription table cuando exista
      localidad: row.address ? row.address.split(',')[0].trim() : null,
      provincia: region?.name || null,
      lat: row.latitude || 0,
      lng: row.longitude || 0,
      foto: row.cover_image_url || row.logo_url || null,
      descripcion: row.description || null,
      en_ruta: false, // TODO: Check si aparece en tabla route_stops
      ruta_name: null, // TODO: Nombre de ruta si aplica
      slug: row.slug || null,
    };
  });
}

export function useFetchEmpresas() {
  const [empresas, setEmpresas] = useState<Empresa[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Evitar double-fetch en StrictMode
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    const loadEmpresas = async () => {
      try {
        const now = Date.now();

        // Revisar si caché es válido
        if (
          empresasCache.data &&
          empresasCache.timestamp &&
          now - empresasCache.timestamp < CACHE_DURATION
        ) {
          setEmpresas(empresasCache.data);
          setLoading(false);
          return;
        }

        // Fetch nuevo desde Supabase
        const data = await fetchEmpresasFromSupabase();
        empresasCache.data = data;
        empresasCache.timestamp = now;

        setEmpresas(data);
        setError(null);
      } catch (err) {
        const errObj =
          err instanceof Error ? err : new Error('Error desconocido al cargar empresas');
        setError(errObj);
        console.error('useFetchEmpresas error:', errObj);

        // En error, intenta usar caché viejo si existe
        if (empresasCache.data) {
          setEmpresas(empresasCache.data);
        }
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    };

    loadEmpresas();
  }, []);

  /**
   * Refrescar caché manualmente (ej: tras agregar nueva empresa)
   */
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchEmpresasFromSupabase();
      empresasCache.data = data;
      empresasCache.timestamp = Date.now();
      setEmpresas(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error al refrescar empresas'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    empresas: empresas || [],
    loading,
    error,
    refetch,
    isCached: empresasCache.timestamp ? true : false,
  };
}
