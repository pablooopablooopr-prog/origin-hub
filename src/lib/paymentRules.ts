/**
 * REGLAS DE PAGO ESTRICTAS
 * 
 * Este módulo define las reglas de negocio para los pagos en la plataforma ORIGEN.
 * Cualquier modificación a estas reglas debe ser aprobada y documentada.
 */

// ==========================================
// CONSTANTES DE CONFIGURACIÓN
// ==========================================

export const PAYMENT_RULES = {
  /**
   * REGLA 1: PACKS (Productos de Productores)
   * - Cada pack pertenece a un productor específico
   * - Checkout siempre independiente por productor
   * - No mezclar packs de diferentes productores en un checkout
   * - Pago vía Stripe Connect al productor
   * - ORIGEN no aplica comisión
   */
  PACKS: {
    useStripeConnect: true,
    allowMixedProducers: false,
    origenCommission: 0,
    paymentRecipient: 'producer' as const,
  },

  /**
   * REGLA 2: RUTAS (Productos Digitales de ORIGEN)
   * - Las rutas son productos de ORIGEN
   * - Pago directo a la cuenta principal de ORIGEN
   * - NO usar Stripe Connect
   * - No mezclar con packs
   */
  ROUTES: {
    useStripeConnect: false,
    allowMixedWithPacks: false,
    paymentRecipient: 'origen' as const,
  },
} as const;

// ==========================================
// TIPOS
// ==========================================

export type PaymentType = 'pack' | 'route';
export type PaymentRecipient = 'producer' | 'origen';

export interface PaymentValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: PaymentErrorCode;
}

export type PaymentErrorCode = 
  | 'MIXED_PRODUCERS'
  | 'MIXED_PACKS_AND_ROUTES'
  | 'INVALID_PAYMENT_TYPE'
  | 'MISSING_PRODUCER'
  | 'UNAUTHORIZED';

// ==========================================
// VALIDACIONES
// ==========================================

/**
 * Valida que no se mezclen packs de diferentes productores
 */
export function validateSingleProducerCheckout(
  producerIds: string[]
): PaymentValidationResult {
  const uniqueProducers = new Set(producerIds);
  
  if (uniqueProducers.size > 1) {
    return {
      valid: false,
      error: 'No se pueden pagar packs de diferentes productores en un mismo checkout. Cada productor gestiona sus pedidos de forma independiente.',
      errorCode: 'MIXED_PRODUCERS',
    };
  }
  
  return { valid: true };
}

/**
 * Valida que no se mezclen packs y rutas en el mismo pago
 */
export function validateNoMixedTypes(
  hasPackItems: boolean,
  hasRouteItems: boolean
): PaymentValidationResult {
  if (hasPackItems && hasRouteItems) {
    return {
      valid: false,
      error: 'Las rutas se compran por separado de los productos de productores. Son dos tipos de compra diferentes.',
      errorCode: 'MIXED_PACKS_AND_ROUTES',
    };
  }
  
  return { valid: true };
}

/**
 * Determina el tipo de pago según los items
 */
export function determinePaymentType(
  hasPackItems: boolean,
  hasRouteItems: boolean
): PaymentType | null {
  if (hasPackItems && !hasRouteItems) return 'pack';
  if (hasRouteItems && !hasPackItems) return 'route';
  return null; // Invalid or empty
}

/**
 * Obtiene la configuración de Stripe según el tipo de pago
 */
export function getStripeConfig(paymentType: PaymentType) {
  if (paymentType === 'pack') {
    return {
      useConnect: true,
      description: 'Pago al productor vía Stripe Connect',
      // El connected account ID se obtiene del productor
    };
  }
  
  return {
    useConnect: false,
    description: 'Pago directo a ORIGEN',
    // Usa la cuenta principal de ORIGEN
  };
}

// ==========================================
// MENSAJES DE UI
// ==========================================

export const PAYMENT_MESSAGES = {
  PACK_CHECKOUT: {
    title: 'Pedido a productor',
    description: (producerName: string) => 
      `Este pedido será gestionado y enviado directamente por ${producerName}. El productor se encarga del empaquetado, envío y atención al cliente.`,
    paymentInfo: 'El pago se procesa directamente al productor.',
  },
  
  ROUTE_CHECKOUT: {
    title: 'Compra de Ruta Digital',
    description: 'Experiencia digital vendida por ORIGEN',
    paymentInfo: 'El pago se procesa a través de ORIGEN.',
    separation: 'Las rutas se compran por separado de los productos de productores.',
  },
  
  ERRORS: {
    MIXED_PRODUCERS: 'Cada productor gestiona sus pedidos de forma independiente. Completa este pedido antes de comprar a otro productor.',
    MIXED_TYPES: 'Las rutas digitales se compran por separado. Completa tu pedido de productos antes de comprar una ruta, o viceversa.',
  },
} as const;

// ==========================================
// UTILIDADES DE SEGURIDAD
// ==========================================

/**
 * Verifica que un checkout de pack tenga un solo productor
 * @throws Error si hay múltiples productores
 */
export function enforcePackCheckoutSecurity(producerIds: string[]): void {
  const validation = validateSingleProducerCheckout(producerIds);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
}

/**
 * Verifica que no se mezclen tipos de pago
 * @throws Error si hay mezcla de tipos
 */
export function enforceSeparatePaymentTypes(
  hasPackItems: boolean,
  hasRouteItems: boolean
): void {
  const validation = validateNoMixedTypes(hasPackItems, hasRouteItems);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
}
