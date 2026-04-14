/**
 * Payment Configuration
 * 
 * Controls whether payments use mock mode (direct DB writes) or Stripe.
 * Default is "mock" - payments work without any external API keys.
 * 
 * To enable Stripe:
 * 1. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to Supabase secrets
 * 2. Set VITE_PAYMENT_MODE=stripe in .env
 * 3. Deploy edge functions
 */

export type PaymentsMode = "mock" | "stripe";

// Read payment mode from environment variable, default to "mock"
const CURRENT_MODE: PaymentsMode =
  (import.meta.env.VITE_PAYMENT_MODE as PaymentsMode) || "mock";

// Get current payment mode
export const getPaymentsMode = (): PaymentsMode => CURRENT_MODE;

// Export for convenience (cast to allow comparisons)
export const PAYMENTS_MODE: PaymentsMode = CURRENT_MODE;

// Check if Stripe is configured (for future use)
export const isStripeConfigured = (): boolean => {
  // Check if mode is stripe
  const mode = getPaymentsMode();
  if (mode !== "stripe") return false;
  // Additional checks could go here for env vars
  return true;
};

// Payment provider URLs (for Stripe mode)
export const PAYMENT_ENDPOINTS = {
  createRouteCheckout: "/functions/v1/create-route-checkout",
  stripeWebhook: "/functions/v1/stripe-webhook",
} as const;

// Success/Cancel URLs for checkout
export const getCheckoutUrls = (routeSlug: string) => ({
  successUrl: `${window.location.origin}/mis-rutas?purchased=true&route=${routeSlug}`,
  cancelUrl: `${window.location.origin}/rutas/${routeSlug}?cancelled=true`,
});
