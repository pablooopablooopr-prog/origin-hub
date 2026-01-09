import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
  type: "customer" | "company";
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, type }: WelcomeEmailRequest = await req.json();

    const subject = type === "customer" 
      ? "¡Bienvenido a ORIGEN!" 
      : "¡Bienvenido a ORIGEN para empresas!";

    const content = type === "customer"
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B7355 0%, #A0826D 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">¡Bienvenido a ORIGEN!</h1>
          </div>
          <div style="padding: 30px; background: #FAF6F0;">
            <h2 style="color: #8B7355;">Hola ${name},</h2>
            <p style="color: #333; line-height: 1.6;">
              ¡Gracias por unirte a nuestra comunidad! Ahora puedes descubrir los mejores productos artesanos de España.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Con tu cuenta podrás:
            </p>
            <ul style="color: #333; line-height: 1.8;">
              <li>Explorar packs regionales únicos</li>
              <li>Guardar tus productores favoritos</li>
              <li>Descubrir rutas gastronómicas</li>
              <li>Recibir recomendaciones personalizadas</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://origen.es/packs" style="background: #8B7355; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Explorar Packs
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2025 ORIGEN - Productos artesanos de España</p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2E5D4E 0%, #3A7D66 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">¡Bienvenido a ORIGEN para Empresas!</h1>
          </div>
          <div style="padding: 30px; background: #F5FAF8;">
            <h2 style="color: #2E5D4E;">Hola ${name},</h2>
            <p style="color: #333; line-height: 1.6;">
              ¡Gracias por registrar tu empresa en ORIGEN! Estamos emocionados de tenerte como parte de nuestra red de productores artesanos.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Con tu cuenta de empresa podrás:
            </p>
            <ul style="color: #333; line-height: 1.8;">
              <li>Crear y gestionar tus packs de productos</li>
              <li>Conectar con clientes que valoran lo artesano</li>
              <li>Acceder a estadísticas de ventas</li>
              <li>Participar en rutas gastronómicas</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://origen.es/company-dashboard" style="background: #2E5D4E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Ir a mi Panel
              </a>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>© 2025 ORIGEN - Productos artesanos de España</p>
          </div>
        </div>
      `;

    const emailResponse = await resend.emails.send({
      from: "ORIGEN <onboarding@resend.dev>",
      to: [email],
      subject,
      html: content,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
