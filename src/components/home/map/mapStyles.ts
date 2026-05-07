/**
 * Estilo Google Maps premium ORIGEN.
 * Paleta tierra/oliva, baja saturación, sensación editorial.
 *
 * Nota: si el mapa usa `mapId` (Cloud-based Map Styles), estos estilos
 * pueden ser ignorados. En ese caso, el overlay CSS suaviza igualmente.
 */

export const ORIGEN_MAP_STYLE: google.maps.MapTypeStyle[] = [
  // Base geometry: papel crema
  { elementType: 'geometry', stylers: [{ color: '#F1EADB' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5C4A36' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F5F0E8' }] },

  // Administrative
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#B8A678' }, { weight: 0.8 }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#C9B99A' }, { weight: 0.6 }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6B5C4C' }],
  },

  // Landscape
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#EDE5D2' }],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{ color: '#E5DCC5' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [{ color: '#EFE8D6' }],
  },

  // POI off (limpieza editorial)
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#D8DCB8' }, { visibility: 'on' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },

  // Roads
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#E8DFC8' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6B5C4C' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#DCCEAA' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#E2D6B8' }],
  },

  // Transit off
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },

  // Water
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [{ color: '#B8C9D6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5C7080' }],
  },
];

/** Color tokens del sistema ORIGEN (espejo de variables CSS). */
export const ORIGEN_COLORS = {
  paper: '#F5F0E8',
  paperWarm: '#F1EADB',
  beige: '#C8B89A',
  beigeSoft: 'rgba(200, 184, 154, 0.4)',
  brown: '#3D2B1F',
  brownSoft: '#6B5C4C',
  olive: '#5C6B2E',
  oliveLight: '#7A8A4A',
  gold: '#B8860B',
  goldSoft: '#D4A739',
  cream: '#FFFAF0',
} as const;
