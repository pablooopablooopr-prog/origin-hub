/**
 * Send Order Confirmation Email
 * 
 * Security:
 * - Zod input validation
 * - CORS allowlist (no wildcard)
 * - Auth: Bearer token required
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

// Zod schema
const OrderItemSchema = z.object({
  name: z.string().min(1).max(500),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

const OrderConfirmationSchema = z.object({
  customerName: z.string().min(1).max(200),
  customerEmail: z.string().email(),
  orderId: z.string().uuid(),
  items: z.array(OrderItemSchema).min(1).max(100),
  totalAmount: z.number().min(0),
  shippingAddress: z.string().min(1).max(1000),
  estimatedDelivery: z.string().max(200).optional(),
});

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]!)
  );
}

const handler = async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing Authorization Bearer token" }), { status: 401, headers });
    }

    // Validate input with Zod
    const rawBody = await req.json().catch(() => ({}));
    const parsed = OrderConfirmationSchema.safeParse(rawBody);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request body", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers }
      );
    }

    const { customerName, customerEmail, orderId, items, totalAmount, shippingAddress, estimatedDelivery } = parsed.data;

    const safeName = escapeHtml(customerName);
    const safeAddress = escapeHtml(shippingAddress);
    const safeDelivery = estimatedDelivery ? escapeHtml(estimatedDelivery) : "";

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(item.name)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}&euro;</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Pedido Confirmado</h1>
        </div>
        <div style="padding: 30px; background: #FAF6F0;">
          <h2 style="color: #8B7355;">Hola ${safeName},</h2>
          <p style="color: #333; line-height: 1.6;">
            Tu pedido <strong>#${orderId.substring(0, 8).toUpperCase()}</strong> ha sido confirmado.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Resumen del pedido</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px; text-align: left;">Producto</th>
                  <th style="padding: 10px; text-align: center;">Cantidad</th>
                  <th style="padding: 10px; text-align: right;">Precio</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px 10px; font-weight: bold;">Total</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #8B7355; font-size: 18px;">${totalAmount.toFixed(2)}&euro;</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Direccion de envio</h3>
            <p style="color: #333; margin: 0;">${safeAddress}</p>
            ${safeDelivery ? `<p style="color: #666; margin-top: 10px;"><strong>Entrega estimada:</strong> ${safeDelivery}</p>` : ''}
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>&copy; 2026 ORIGEN - Productos artesanos de Espana</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "ORIGEN <no-reply@origen.it.com>",
      to: [customerEmail],
      subject: `Pedido confirmado #${orderId.substring(0, 8).toUpperCase()}`,
      html,
    });

    return new Response(JSON.stringify(emailResponse), { status: 200, headers });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), { status: 500, headers });
  }
};

serve(handler);
