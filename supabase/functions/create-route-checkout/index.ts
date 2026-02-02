/**
 * Create Route Checkout Edge Function
 * 
 * Creates a Stripe checkout session for route purchases.
 * This function is DISABLED until Stripe keys are configured.
 * 
 * To enable:
 * 1. Add STRIPE_SECRET_KEY secret to Supabase
 * 2. Change PAYMENTS_MODE to "stripe" in frontend config
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Stripe is configured
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeKey) {
      console.log("Stripe not configured - returning disabled message");
      return new Response(
        JSON.stringify({ 
          error: "Stripe payments are not configured. Using mock mode.",
          code: "STRIPE_NOT_CONFIGURED"
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Parse request body
    const { 
      routeId,
      routeTitle,
      customerId,
      numPeople,
      totalPrice,
      successUrl,
      cancelUrl,
    } = await req.json();

    // Validate required fields
    if (!routeId || !customerId || !numPeople || !totalPrice) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Dynamic import Stripe (only when key is available)
    const Stripe = (await import("https://esm.sh/stripe@14.21.0?target=deno")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Entrada para Ruta: ${routeTitle}`,
              description: `Acceso para ${numPeople} persona(s)`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe uses cents
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
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
