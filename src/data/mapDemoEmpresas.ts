/**
 * Datos demo para visualizar la sección de mapa.
 * NO toca BD: se mezclan con empresas reales de Supabase.
 *
 * Mantiene compatibilidad con la interfaz `Empresa` de useFetchEmpresas.ts
 * + añade campos extra (`featured`, `inRoute`) que usamos en el panel
 * lateral, leyenda y polyline.
 */

import type { Empresa } from '@/hooks/useFetchEmpresas';

export interface DemoEmpresa extends Empresa {
  /** True = pin estrella dorado */
  featured: boolean;
  /** True = forma parte de la ruta visual (polyline) */
  inRoute: boolean;
}

export const MAP_DEMO_EMPRESAS: DemoEmpresa[] = [
  {
    id: 'queseria-los-montes',
    nombre: 'Quesería Los Montes',
    nicho: 'quesos',
    tipo: 'productor',
    plan: 'destacado',
    localidad: 'Porzuna',
    provincia: 'Ciudad Real',
    lat: 39.147,
    lng: -4.154,
    foto: '/seasons/queso/hero.jpg',
    descripcion:
      'Queso manchego artesanal con leche de oveja de ganaderías cercanas.',
    en_ruta: true,
    ruta_name: 'Ruta del Queso',
    slug: 'queseria-los-montes',
    featured: true,
    inRoute: true,
  },
  {
    id: 'bodega-manchega',
    nombre: 'Bodega Manchega',
    nicho: 'vinos',
    tipo: 'productor',
    plan: 'standard',
    localidad: 'Valdepeñas',
    provincia: 'Ciudad Real',
    lat: 38.762,
    lng: -3.384,
    // TODO: reemplazar por foto real de bodega
    foto: null,
    descripcion: 'Vinos con carácter elaborados en tierra manchega.',
    en_ruta: true,
    ruta_name: 'Ruta del Vino',
    slug: 'bodega-manchega',
    featured: false,
    inRoute: true,
  },
  {
    id: 'carniceria-sierra',
    nombre: 'Carnicería Sierra',
    nicho: 'carnes',
    tipo: 'productor',
    plan: 'basico',
    localidad: 'Piedrabuena',
    provincia: 'Ciudad Real',
    lat: 39.035,
    lng: -4.175,
    // TODO: reemplazar por foto real de carnicería
    foto: null,
    descripcion: 'Carne de caza y vacuno manchego con tradición ganadera.',
    en_ruta: false,
    ruta_name: null,
    slug: 'carniceria-sierra',
    featured: false,
    inRoute: false,
  },
  {
    id: 'apiarios-bullaque',
    nombre: 'Apiarios del Bullaque',
    nicho: 'miel',
    tipo: 'productor',
    plan: 'basico',
    localidad: 'Porzuna',
    provincia: 'Ciudad Real',
    lat: 39.16,
    lng: -4.18,
    // TODO: reemplazar por foto real de apicultura
    foto: null,
    descripcion: 'Miel artesanal de tomillo y romero.',
    en_ruta: false,
    ruta_name: null,
    slug: 'apiarios-bullaque',
    featured: false,
    inRoute: false,
  },
  {
    id: 'cooperativa-valle',
    nombre: 'Cooperativa Valle',
    nicho: 'cooperativas',
    tipo: 'productor',
    plan: 'destacado',
    localidad: 'Almagro',
    provincia: 'Ciudad Real',
    lat: 38.889,
    lng: -3.711,
    // TODO: reemplazar por foto real de cooperativa
    foto: null,
    descripcion: 'Aceite de oliva virgen extra de almazaras locales.',
    en_ruta: false,
    ruta_name: null,
    slug: 'cooperativa-valle',
    featured: true,
    inRoute: false,
  },
];

/** Fallback elegante por categoría cuando no hay foto. */
export const NICHO_FALLBACK_GRADIENT: Record<string, string> = {
  quesos: 'linear-gradient(135deg, #E8DCC4 0%, #C9B385 100%)',
  vinos: 'linear-gradient(135deg, #5C2A2A 0%, #8B4A4A 100%)',
  carnes: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
  miel: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)',
  caza: 'linear-gradient(135deg, #4A3F2A 0%, #6B5C3F 100%)',
  cooperativas: 'linear-gradient(135deg, #6B7F3F 0%, #5C6B2E 100%)',
  default: 'linear-gradient(135deg, #C8B89A 0%, #A89878 100%)',
};
