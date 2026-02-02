/**
 * Stripe Webhook for Route Purchases
 * 
 * Handles Stripe webhook events for route purchases.
 * Marks route_purchases as paid and creates route_access.
 * 
 * This function is DISABLED until Stripe keys are configured.
 * 
 * To enable:
 * 1. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to Supabase secrets
 * 2. Configure webhook endpoint in Stripe Dashboard
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Stripe is configured
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey || !webhookSecret) {
      console.log("Stripe webhook not configured");
      return new Response(
        JSON.stringify({ 
          error: "Stripe webhook not configured",
          code: "STRIPE_NOT_CONFIGURED"
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get the signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Get raw body for signature verification
    const body = await req.text();

    // Dynamic import Stripe
    const Stripe = (await import("https://esm.sh/stripe@14.21.0?target=deno")).default;
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata;

      if (!metadata?.route_id || !metadata?.customer_id) {
        console.error("Missing metadata in checkout session");
        return new Response(
          JSON.stringify({ error: "Missing metadata" }),
          { 
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      const routeId = metadata.route_id;
      const customerId = metadata.customer_id;
      const numPeople = parseInt(metadata.num_people || "1");
      const totalPrice = parseFloat(metadata.total_price || "0");
      const now = new Date().toISOString();

      // Get customer's user_id
      const { data: customer } = await supabase
        .from("customers")
        .select("user_id")
        .eq("id", customerId)
        .single();

      if (!customer?.user_id) {
        console.error("Customer not found:", customerId);
        return new Response(
          JSON.stringify({ error: "Customer not found" }),
          { 
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }

      // Check for existing purchase
      const { data: existingPurchase } = await supabase
        .from("route_purchases")
        .select("id")
        .eq("customer_id", customerId)
        .eq("route_id", routeId)
        .single();

      if (existingPurchase) {
        // Update existing purchase
        await supabase
          .from("route_purchases")
          .update({
            payment_status: "completed",
            purchased_at: now,
            stripe_payment_intent_id: session.payment_intent,
          })
          .eq("id", existingPurchase.id);
      } else {
        // Create new purchase
        await supabase
          .from("route_purchases")
          .insert({
            customer_id: customerId,
            route_id: routeId,
            num_people: numPeople,
            base_price: totalPrice / numPeople,
            discount_percent: 0,
            final_price: totalPrice,
            payment_status: "completed",
            purchased_at: now,
            stripe_payment_intent_id: session.payment_intent,
          });
      }

      // Create route access (permanent)
      const { data: existingAccess } = await supabase
        .from("route_access")
        .select("id")
        .eq("user_id", customer.user_id)
        .eq("route_id", routeId)
        .single();

      if (!existingAccess) {
        await supabase
          .from("route_access")
          .insert({
            user_id: customer.user_id,
            route_id: routeId,
            valid_from: now,
            valid_until: null, // Permanent
          });
      }

      console.log(`Route purchase completed: ${routeId} for customer ${customerId}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
