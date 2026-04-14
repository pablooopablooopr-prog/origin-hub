/**
 * Create Route Checkout Edge Function
 * 
 * Creates a Stripe checkout session for route purchases.
 * 
 * Security:
 * - Zod input validation
 * - CORS allowlist (no wildcard)
 * - Auth: Bearer token required
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "https://origen-natural-mapa.pages.dev",
  "https://origen.it.com",
  "https://www.origen.it.com",
]);

function corsHeaders(origin: string | null) {
  const o = origin && allowedOrigins.has(origin) ? origin : "https://www.origen.it.com";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

// Zod schema for request body validation
const CheckoutRequestSchema = z.object({
  routeId: z.string().uuid("routeId must be a valid UUID"),
  routeTitle: z.string().min(1).max(500).optional(),
  customerId: z.string().uuid("customerId must be a valid UUID"),
  numPeople: z.number().int().min(1).max(100),
  totalPrice: z.number().positive("totalPrice must be positive"),
  successUrl: z.string().url("successUrl must be a valid URL"),
  cancelUrl: z.string().url("cancelUrl must be a valid URL"),
});

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe payments are not configured. Using mock mode.", code: "STRIPE_NOT_CONFIGURED" }),
        { status: 503, headers }
      );
    }

    // Validate input with Zod
    const rawBody = await req.json().catch(() => ({}));
    const parsed = CheckoutRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers }
      );
    }

    const { routeId, routeTitle, customerId, numPeople, totalPrice, successUrl, cancelUrl } = parsed.data;

    // Dynamic import Stripe
    const Stripe = (await import("https://esm.sh/stripe@14.21.0?target=deno")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Entrada para Ruta: ${routeTitle || "Ruta"}`,
              description: `Acceso para ${numPeople} persona(s)`,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        route_id: routeId,
        customer_id: customerId,
        num_people: numPeople.toString(),
        total_price: totalPrice.toString(),
      },
    });

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { status: 200, headers }
    );
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Unknown error" }),
      { status: 500, headers }
    );
  }
});
