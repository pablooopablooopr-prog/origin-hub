/**
 * Hook para gestionar filtros del mapa
 * Calcula empresas filtradas en O(n) local (cero network calls)
 */

import { useState, useMemo, useCallback } from 'react';
import type { Empresa } from './useFetchEmpresas';

export interface MapFilterState {
  nicho: string; // 'todos' o nombre del nicho
  provincia: string; // 'todas' o provincia específica
  tipo: string; // 'todos' o tipo específico
  enRutas: boolean; // mostrar solo empresas en rutas activas
  mostrarDestacadosFirst: boolean;
}

export function useMapFilters(empresas: Empresa[]) {
  const [filtros, setFiltros] = useState<MapFilterState>({
    nicho: 'todos',
    provincia: 'todas',
    tipo: 'todos',
    enRutas: false,
    mostrarDestacadosFirst: false,
  });

  /**
   * Empresas filtradas por nicho + provincia + tipo + enRutas
   * Se recalcula solo si empresas o filtros cambian (memoized)
   */
  const empresasFiltradas = useMemo(() => {
    return empresas.filter((empresa) => {
      // Filtro por nicho
      if (filtros.nicho !== 'todos') {
        const nichoMatch = empresa.nicho?.toLowerCase().includes(
          filtros.nicho.toLowerCase()
        );
        if (!nichoMatch) return false;
      }

      // Filtro por provincia
      if (filtros.provincia !== 'todas') {
        const provinciaMatch = empresa.provincia?.toLowerCase().includes(
          filtros.provincia.toLowerCase()
        );
        if (!provinciaMatch) return false;
      }

      // Filtro por tipo
      if (filtros.tipo !== 'todos') {
        const tipoMatch = empresa.tipo?.toLowerCase() === filtros.tipo.toLowerCase();
        if (!tipoMatch) return false;
      }

      // Filtro "En Rutas"
      if (filtros.enRutas && !empresa.en_ruta) {
        return false;
      }

      return true;
    });
  }, [empresas, filtros.nicho, filtros.provincia, filtros.tipo, filtros.enRutas]);

  /**
   * Empresas ordenadas según filtro "mostrar destacados primero"
   * Orden: destacado (0) → standard (1) → básico (2)
   */
  const empresasOrdenadas = useMemo(() => {
    if (!filtros.mostrarDestacadosFirst) {
      return empresasFiltradas;
    }

    const planOrder: Record<string, number> = {
      destacado: 0,
      standard: 1,
      basico: 2,
    };

    return [...empresasFiltradas].sort((a, b) => {
      const planA = planOrder[a.plan || 'basico'] ?? 999;
      const planB = planOrder[b.plan || 'basico'] ?? 999;
      return planA - planB;
    });
  }, [empresasFiltradas, filtros.mostrarDestacadosFirst]);

  /**
   * Actualizar filtro de nicho
   */
  const setNicho = useCallback((nicho: string) => {
    setFiltros((prev) => ({ ...prev, nicho }));
  }, []);

  /**
   * Actualizar filtro de provincia
   */
  const setProvincia = useCallback((provincia: string) => {
    setFiltros((prev) => ({ ...prev, provincia }));
  }, []);

  /**
   * Actualizar filtro de tipo
   */
  const setTipo = useCallback((tipo: string) => {
    setFiltros((prev) => ({ ...prev, tipo }));
  }, []);

  /**
   * Toggle de "mostrar solo en rutas"
   */
  const setEnRutas = useCallback((valor: boolean) => {
    setFiltros((prev) => ({ ...prev, enRutas: valor }));
  }, []);

  /**
   * Toggle de "mostrar destacados primero"
   */
  const setMostrarDestacados = useCallback((valor: boolean) => {
    setFiltros((prev) => ({ ...prev, mostrarDestacadosFirst: valor }));
  }, []);

  /**
   * Resetear todos los filtros a default
   */
  const resetFiltros = useCallback(() => {
    setFiltros({
      nicho: 'todos',
      provincia: 'todas',
      tipo: 'todos',
      enRutas: false,
      mostrarDestacadosFirst: false,
    });
  }, []);

  return {
    filtros,
    empresasFiltradas,
    empresasOrdenadas,
    setNicho,
    setProvincia,
    setTipo,
    setEnRutas,
    setMostrarDestacados,
    resetFiltros,
  };
}
