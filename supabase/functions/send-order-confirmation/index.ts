import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationRequest {
  customerName: string;
  customerEmail: string;
  orderId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  estimatedDelivery?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      customerName, 
      customerEmail, 
      orderId, 
      items, 
      totalAmount, 
      shippingAddress,
      estimatedDelivery 
    }: OrderConfirmationRequest = await req.json();

    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)}€</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Pedido Confirmado!</h1>
        </div>
        <div style="padding: 30px; background: #FAF6F0;">
          <h2 style="color: #8B7355;">Hola ${customerName},</h2>
          <p style="color: #333; line-height: 1.6;">
            Tu pedido <strong>#${orderId.substring(0, 8).toUpperCase()}</strong> ha sido confirmado y está siendo preparado con mucho cariño.
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
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 15px 10px; font-weight: bold;">Total</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #8B7355; font-size: 18px;">${totalAmount.toFixed(2)}€</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #8B7355; margin-top: 0;">Dirección de envío</h3>
            <p style="color: #333; margin: 0;">${shippingAddress}</p>
            ${estimatedDelivery ? `<p style="color: #666; margin-top: 10px;"><strong>Entrega estimada:</strong> ${estimatedDelivery}</p>` : ''}
          </div>

          <p style="color: #666; font-size: 14px;">
            Te enviaremos otro email cuando tu pedido sea enviado con el número de seguimiento.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 ORIGEN - Productos artesanos de España</p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "ORIGEN <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Pedido confirmado #${orderId.substring(0, 8).toUpperCase()}`,
      html,
    });

    console.log("Order confirmation email sent:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
