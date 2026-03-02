/**
 * stripe-pack-webhook
 * Stripe webhook for PACK orders (Stripe Connect).
 *
 * Security:
 * - Raw body signature verification via STRIPE_WEBHOOK_SECRET
 * - No CORS wildcard (webhooks don't need it)
 * - Idempotent processing
 *
 * Env (Supabase secrets):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import Stripe from "stripe";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200 });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Supabase env missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!stripeKey || !webhookSecret) {
    return new Response(JSON.stringify({ error: "Stripe webhook not configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing stripe-signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const rawBody = await req.text();

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (e) {
      console.error("Invalid webhook signature:", e);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("[stripe-pack-webhook] event", {
      type: event.type,
      id: event.id,
      account: (event as any).account || "(main account)",
      created: event.created,
    });

    const supabase = createClient(supabaseUrl, serviceKey);
    const now = new Date().toISOString();

    // checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId: string | undefined = session?.metadata?.order_id;

      if (!orderId) {
        console.error("Missing order_id in metadata");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Idempotency: if already paid, skip
      const { data: existing } = await supabase
        .from("pack_payments")
        .select("id, status")
        .eq("order_id", orderId)
        .maybeSingle();

      if (existing?.status === "paid") {
        console.log("[idempotent] already paid", { orderId });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // If pack_payments missing, create fallback
      if (!existing) {
        const { data: order } = await supabase
          .from("orders")
          .select("id, company_id, total_amount")
          .eq("id", orderId)
          .maybeSingle();

        if (order?.id) {
          const { data: company } = await supabase
            .from("companies")
            .select("stripe_account_id")
            .eq("id", order.company_id)
            .maybeSingle();

          const { error: insErr } = await supabase.from("pack_payments").insert({
            order_id: orderId,
            company_id: order.company_id,
            stripe_account_id: company?.stripe_account_id ?? null,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent ?? null,
            amount: Number(order.total_amount) || 0,
            currency: "eur",
            status: "paid",
            updated_at: now,
          });

          if (insErr) console.error("fallback pack_payments insert error:", insErr);
        }
      } else {
        // Update existing pack_payments
        const { error: updErr } = await supabase
          .from("pack_payments")
          .update({
            status: "paid",
            stripe_payment_intent_id: session.payment_intent ?? null,
            updated_at: now,
          })
          .eq("order_id", orderId);

        if (updErr) console.error("pack_payments update error:", updErr);
      }

      // Update orders
      const { error: ordErr } = await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "paid",
          updated_at: now,
        })
        .eq("id", orderId);

      if (ordErr) console.error("orders update error:", ordErr);

      console.log("Pack order marked paid:", orderId);
    }

    // charge.refunded / charge.refund.updated
    if (event.type === "charge.refunded" || event.type === "charge.refund.updated") {
      const charge = event.data.object as any;
      const paymentIntent: string | undefined = charge?.payment_intent;

      if (!paymentIntent) {
        console.log("Refund event without payment_intent");
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { data: packPayment } = await supabase
        .from("pack_payments")
        .select("id, order_id, status")
        .eq("stripe_payment_intent_id", paymentIntent)
        .maybeSingle();

      if (!packPayment?.id) {
        console.log("No pack_payment matched for refund", { paymentIntent });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (packPayment.status === "refunded") {
        console.log("[idempotent] already refunded", { id: packPayment.id });
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const { error: payErr } = await supabase
        .from("pack_payments")
        .update({ status: "refunded", updated_at: now })
        .eq("id", packPayment.id);

      if (payErr) console.error("pack_payments refund update error:", payErr);

      const { error: orderErr } = await supabase
        .from("orders")
        .update({ status: "refunded", payment_status: "refunded", updated_at: now })
        .eq("id", packPayment.order_id);

      if (orderErr) console.error("orders refund update error:", orderErr);

      console.log("Pack payment refunded:", packPayment.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("stripe-pack-webhook error:", err);
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});