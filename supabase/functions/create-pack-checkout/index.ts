/**
 * create-pack-checkout
 * Stripe Connect checkout for PACK orders (money goes to producer).
 *
 * Security:
 * - CORS allowlist via ALLOWED_CHECKOUT_ORIGINS (no wildcard)
 * - Auth: Bearer token required; user derived from Supabase Auth
 * - Ownership: order.customer_id must match derived customer_id
 * - URLs: successUrl/cancelUrl origins must be allowlisted
 *
 * Env (Supabase secrets):
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 * - STRIPE_SECRET_KEY
 * - ALLOWED_CHECKOUT_ORIGINS (comma-separated origins)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";
import Stripe from "stripe";

type ReqBody = {
  orderId: string;
  successUrl: string;
  cancelUrl: string;
};

function parseAllowedOrigins(envVal: string | undefined): string[] {
  return (envVal ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function safeOriginFromHeader(req: Request): string {
  const header = req.headers.get("origin") || "";
  try {
    return new URL(header).origin;
  } catch {
    return "";
  }
}

function originOfUrl(urlStr: string): string | null {
  try {
    return new URL(urlStr).origin;
  } catch {
    return null;
  }
}

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  if (!origin) return false;

  // If ALLOWED_CHECKOUT_ORIGINS isn't set, allow localhost for dev only
  if (allowedOrigins.length === 0) {
    return [
      "http://localhost",
      "http://127.0.0.1",
      "http://localhost:5173",
      "http://localhost:5174",
    ].some((o) => origin.startsWith(o));
  }

  return allowedOrigins.includes(origin);
}

function corsHeadersFor(originAllowed: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
  if (originAllowed) headers["Access-Control-Allow-Origin"] = originAllowed;
  return headers;
}

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
  const allowedOrigins = parseAllowedOrigins(Deno.env.get("ALLOWED_CHECKOUT_ORIGINS"));

  const reqOrigin = safeOriginFromHeader(req);
  const corsOrigin = isOriginAllowed(reqOrigin, allowedOrigins) ? reqOrigin : "";

  // Preflight
  if (req.method === "OPTIONS") {
    const headers: Record<string, string> = {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, authorization",
      "Vary": "Origin",
    };
    if (corsOrigin) headers["Access-Control-Allow-Origin"] = corsOrigin;
    return new Response(null, { status: 204, headers });
  }

  // Basic env sanity
  if (!supabaseUrl || !serviceKey) {
    return new Response(
      JSON.stringify({ error: "Supabase env missing" }),
      { status: 500, headers: corsHeadersFor(corsOrigin) },
    );
  }

  if (!stripeKey) {
    return new Response(
      JSON.stringify({ error: "Stripe not configured" }),
      { status: 503, headers: corsHeadersFor(corsOrigin) },
    );
  }

  try {
    // AUTH: require Bearer token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization token" }),
        { status: 401, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Resolve user from Supabase Auth using token (no service key)
    const userResp = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    if (!userResp.ok) {
      return new Response(
        JSON.stringify({ error: "Invalid session/token" }),
        { status: 401, headers: corsHeadersFor(corsOrigin) },
      );
    }

    const userJson = await userResp.json();
    const userId = userJson?.id as string | undefined;
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unable to identify user" }),
        { status: 401, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Parse body
    const body = (await req.json().catch(() => ({}))) as Partial<ReqBody>;
    const orderId = String(body.orderId ?? "");
    const successUrl = String(body.successUrl ?? "");
    const cancelUrl = String(body.cancelUrl ?? "");

    if (!orderId || !successUrl || !cancelUrl) {
      return new Response(
        JSON.stringify({ error: "Missing orderId, successUrl, or cancelUrl" }),
        { status: 400, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Validate URL origins
    const successOrigin = originOfUrl(successUrl);
    const cancelOrigin = originOfUrl(cancelUrl);
    if (!successOrigin || !cancelOrigin) {
      return new Response(
        JSON.stringify({ error: "Invalid successUrl/cancelUrl" }),
        { status: 400, headers: corsHeadersFor(corsOrigin) },
      );
    }

    if (
      !isOriginAllowed(successOrigin, allowedOrigins) ||
      !isOriginAllowed(cancelOrigin, allowedOrigins)
    ) {
      return new Response(
        JSON.stringify({ error: "successUrl/cancelUrl not allowed" }),
        { status: 400, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Service role Supabase client
    const supabase = createClient(supabaseUrl, serviceKey);

    // Derive customer_id from user_id
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (custErr || !customer?.id) {
      return new Response(
        JSON.stringify({ error: "Customer profile not found" }),
        { status: 404, headers: corsHeadersFor(corsOrigin) },
      );
    }

    const customerId = customer.id as string;

    // Load order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, customer_id, company_id, total_amount, payment_status, status")
      .eq("id", orderId)
      .maybeSingle();

    if (orderErr || !order?.id) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Ownership check
    if (order.customer_id !== customerId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: order does not belong to user" }),
        { status: 403, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Load producer
    const { data: company, error: compErr } = await supabase
      .from("companies")
      .select("id, business_name, stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled")
      .eq("id", order.company_id)
      .maybeSingle();

    if (compErr || !company?.id) {
      return new Response(
        JSON.stringify({ error: "Producer not found" }),
        { status: 404, headers: corsHeadersFor(corsOrigin) },
      );
    }

    if (!company.stripe_account_id || !company.stripe_charges_enabled || !company.stripe_payouts_enabled) {
      return new Response(
        JSON.stringify({
          error: "Producer not onboarded",
          code: "PRODUCER_NOT_ONBOARDED",
        }),
        { status: 409, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Load order items and compute total from DB (never trust client)
    const { data: items, error: itemsErr } = await supabase
      .from("order_items")
      .select("id, quantity, unit_price, total_price")
      .eq("order_id", orderId);

    if (itemsErr || !items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Order has no items" }),
        { status: 400, headers: corsHeadersFor(corsOrigin) },
      );
    }

    const total = items.reduce((sum: number, it: any) => sum + (Number(it.total_price) || 0), 0);
    if (!Number.isFinite(total) || total <= 0) {
      return new Response(
        JSON.stringify({ error: "Order total must be greater than 0" }),
        { status: 400, headers: corsHeadersFor(corsOrigin) },
      );
    }

    // Stripe Connect: create session on connected account
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const producerName = company.business_name || "Productor";

    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: `Pedido a ${producerName}`,
                description: `Pedido ${orderId.slice(0, 8).toUpperCase()}`,
              },
              unit_amount: Math.round(total * 100),
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          order_id: orderId,
          company_id: order.company_id,
          customer_id: customerId,
        },
      },
      {
        // This sends the payment to the connected account
        stripeAccount: company.stripe_account_id,
      },
    );

    // Upsert pack_payments (idempotent by unique index on order_id)
    const { error: payErr } = await supabase
      .from("pack_payments")
      .upsert(
        {
          order_id: orderId,
          company_id: order.company_id,
          stripe_account_id: company.stripe_account_id,
          stripe_checkout_session_id: session.id,
          amount: total,
          currency: "eur",
          status: "pending",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "order_id" },
      );

    if (payErr) {
      console.error("pack_payments upsert error:", payErr);
      return new Response(
        JSON.stringify({ error: "Failed to create payment record" }),
        { status: 500, headers: corsHeadersFor(corsOrigin) },
      );
    }

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id, orderId }),
      { status: 200, headers: corsHeadersFor(corsOrigin) },
    );
  } catch (err) {
    console.error("create-pack-checkout error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : String(err) }),
      { status: 500, headers: corsHeadersFor(corsOrigin) },
    );
  }
});