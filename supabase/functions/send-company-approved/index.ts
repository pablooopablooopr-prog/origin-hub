// supabase/functions/send-company-approved/index.ts
//
// Envía 1 email cuando el admin verifica una empresa. Llamado desde
// AdminCompanies.tsx tras invocar el RPC `approve_company`.
//
// Mismos secrets que send-company-registration.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const GMAIL_USER = Deno.env.get("GMAIL_USER") ?? "";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") ?? "";
const SITE_URL = Deno.env.get("SITE_URL") || "https://www.ritmorigen.com";

const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://localhost:8080",
  "https://ritmorigen.com",
  "https://www.ritmorigen.com",
  "https://origen.it.com",
  "https://www.origen.it.com",
  "https://origenn.pages.dev",
]);

function corsHeaders(origin: string | null) {
  const o = origin && ALLOWED_ORIGINS.has(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": o,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[c]!));
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log("[dry-run]", to, "|", subject);
    return { sent: false, mode: "dry-run" as const };
  }
  try {
    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: { username: GMAIL_USER, password: GMAIL_APP_PASSWORD },
      },
    });
    await client.send({
      from: `RitmOrigen <${GMAIL_USER}>`,
      to,
      subject,
      content: "Versión HTML adjunta",
      html,
    });
    await client.close();
    return { sent: true, mode: "smtp" as const };
  } catch (err) {
    console.error("[smtp]", to, err);
    return {
      sent: false,
      mode: "smtp" as const,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders(origin),
    });
  }

  try {
    const { companyId } = await req.json();
    if (!companyId) {
      return new Response(JSON.stringify({ error: "companyId requerido" }), {
        status: 400,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: company, error } = await admin
      .from("companies")
      .select("id, business_name, contact_person, email")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      return new Response(JSON.stringify({ error: "Empresa no encontrada" }), {
        status: 404,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      });
    }

    const dashboardUrl = `${SITE_URL}/company-dashboard`;
    const businessName = escapeHtml(company.business_name);
    const contactPerson = escapeHtml(company.contact_person || "");

    const html = `
<div style="font-family:-apple-system,sans-serif;color:#2a1c10;max-width:600px;margin:0 auto;padding:24px;background:#fdf6ea;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;color:#4f6f3f;font-size:28px;margin:0;">
      RITM<span style="color:#b07a2a;">O</span>RIGEN
    </h1>
  </div>
  <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 4px 18px rgba(76,51,25,0.08);text-align:center;">
    <div style="font-size:56px;margin-bottom:12px;">🌿</div>
    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:26px;margin:0 0 12px;color:#4f6f3f;">
      ¡${businessName} está verificada!
    </h2>
    <p style="font-size:16px;">Hola ${contactPerson},</p>
    <p>Hemos completado la verificación de tu empresa.<br>
       <strong>Ya formas parte de la comunidad RitmOrigen.</strong></p>
    <div style="margin:28px 0;">
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#4f6f3f;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:700;font-size:15px;">
        Entrar a mi dashboard
      </a>
    </div>
    <p style="font-size:14px;color:#6b5a47;line-height:1.6;">
      Desde el dashboard podrás completar tu ficha, subir fotos, contactar con
      otros negocios B2B de forma privada y aparecer en la home y en las rutas
      curadas de RitmOrigen.
    </p>
  </div>
  <p style="text-align:center;font-size:12px;color:#8a7a62;margin-top:20px;">
    RitmOrigen · ${SITE_URL}
  </p>
</div>`;

    const result = await sendEmail(
      company.email,
      `${company.business_name} verificada en RitmOrigen 🌿`,
      html,
    );

    return new Response(
      JSON.stringify({ ok: true, companyId, result }),
      {
        status: 200,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      },
    );
  } catch (err) {
    console.error("send-company-approved error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      },
    );
  }
});
