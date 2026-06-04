// supabase/functions/send-company-registration/index.ts
//
// Envía 3 emails cuando una empresa completa el formulario de alta:
//   1. Al empresario: "Hemos recibido tu solicitud"
//   2. A ritmorigen@gmail.com (admin general): notificación de nueva empresa
//   3. A pablo@contactaevum.com (verificador): link directo al panel admin
//
// Backend de envío: Gmail SMTP con App Password. Si las credenciales no están
// configuradas en los Secrets, la función registra el cuerpo en logs y devuelve
// 200 ok igualmente (modo "dry-run"). Esto permite que el front-end funcione
// desde el día 1 sin bloquear el alta.
//
// Variables de entorno (Supabase Secrets):
//   GMAIL_USER            = "ritmorigen@gmail.com"
//   GMAIL_APP_PASSWORD    = "abcd efgh ijkl mnop"   (App Password de Google)
//   ADMIN_NOTIFY_EMAIL    = "ritmorigen@gmail.com"  (puede coincidir con GMAIL_USER)
//   VERIFIER_EMAIL        = "pablo@contactaevum.com"
//   SITE_URL              = "https://www.ritmorigen.com"
//   SUPABASE_URL          = (auto)
//   SUPABASE_SERVICE_ROLE_KEY = (auto)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const GMAIL_USER = Deno.env.get("GMAIL_USER") ?? "";
const GMAIL_APP_PASSWORD = Deno.env.get("GMAIL_APP_PASSWORD") ?? "";
const ADMIN_NOTIFY_EMAIL = Deno.env.get("ADMIN_NOTIFY_EMAIL") || "ritmorigen@gmail.com";
const VERIFIER_EMAIL = Deno.env.get("VERIFIER_EMAIL") || "pablo@contactaevum.com";
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

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

/**
 * Envía un email vía Gmail SMTP. Si no hay credenciales, hace dry-run (log).
 * Devuelve { sent, mode, error? }.
 */
async function sendEmail(payload: EmailPayload): Promise<{
  sent: boolean;
  mode: "smtp" | "dry-run";
  error?: string;
}> {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.log("[dry-run]", payload.to, "|", payload.subject);
    return { sent: false, mode: "dry-run" };
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
      to: payload.to,
      subject: payload.subject,
      content: "Versión HTML adjunta",
      html: payload.html,
    });
    await client.close();
    return { sent: true, mode: "smtp" };
  } catch (err) {
    console.error("[smtp]", payload.to, err);
    return {
      sent: false,
      mode: "smtp",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

const baseStyles = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2a1c10; line-height: 1.6;
`;

function ownerEmailTemplate(opts: {
  businessName: string;
  contactPerson: string;
}): { subject: string; html: string } {
  const name = escapeHtml(opts.contactPerson || "");
  const business = escapeHtml(opts.businessName);
  return {
    subject: `Hemos recibido tu solicitud — RitmOrigen`,
    html: `
<div style="${baseStyles} max-width:600px;margin:0 auto;padding:24px;background:#fdf6ea;">
  <div style="text-align:center;margin-bottom:24px;">
    <h1 style="font-family:'Playfair Display',Georgia,serif;color:#4f6f3f;font-size:28px;margin:0;">
      RITM<span style="color:#b07a2a;">O</span>RIGEN
    </h1>
  </div>
  <div style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 4px 18px rgba(76,51,25,0.08);">
    <h2 style="font-family:'Playfair Display',Georgia,serif;font-size:22px;margin:0 0 16px;">
      Hola ${name},
    </h2>
    <p>Hemos recibido tu solicitud para registrar <strong>${business}</strong> en RitmOrigen.</p>
    <p>Nuestro equipo está revisando tu petición. Este proceso suele tardar entre
       <strong>24 y 48 horas</strong>. Te enviaremos un segundo correo en cuanto
       tu empresa esté verificada y puedas acceder al dashboard empresarial completo.</p>
    <div style="background:#f7ead8;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0;font-size:14px;color:#7b572d;">
        <strong>Mientras tanto:</strong> puedes ir preparando tus fotos, historia y
        producto estrella. Cuando entres al dashboard podrás editar todo en
        cuestión de minutos.
      </p>
    </div>
    <p style="font-size:13px;color:#6b5a47;">Si no fuiste tú quien envió esta solicitud,
       puedes ignorar este correo.</p>
  </div>
  <p style="text-align:center;font-size:12px;color:#8a7a62;margin-top:20px;">
    RitmOrigen · ${SITE_URL}
  </p>
</div>`,
  };
}

function adminNotificationTemplate(opts: {
  businessName: string;
  contactPerson: string;
  contactEmail: string;
  businessType: string;
  address: string;
  companyId: string;
}): { subject: string; html: string } {
  const adminUrl = `${SITE_URL}/admin/companies`;
  return {
    subject: `Nueva empresa registrada: ${opts.businessName}`,
    html: `
<div style="${baseStyles} max-width:600px;margin:0 auto;padding:24px;">
  <div style="background:#fff;border:1px solid #e8dfd0;border-radius:12px;padding:24px;">
    <h2 style="font-family:'Playfair Display',Georgia,serif;color:#4f6f3f;margin:0 0 16px;">
      Nueva solicitud de alta en RitmOrigen
    </h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px;color:#6b5a47;width:35%;">Negocio:</td>
          <td style="padding:8px;"><strong>${escapeHtml(opts.businessName)}</strong></td></tr>
      <tr style="background:#fbf4e8;"><td style="padding:8px;color:#6b5a47;">Tipo:</td>
          <td style="padding:8px;">${escapeHtml(opts.businessType || "—")}</td></tr>
      <tr><td style="padding:8px;color:#6b5a47;">Contacto:</td>
          <td style="padding:8px;">${escapeHtml(opts.contactPerson)}</td></tr>
      <tr style="background:#fbf4e8;"><td style="padding:8px;color:#6b5a47;">Email:</td>
          <td style="padding:8px;"><a href="mailto:${opts.contactEmail}">${escapeHtml(opts.contactEmail)}</a></td></tr>
      <tr><td style="padding:8px;color:#6b5a47;">Dirección:</td>
          <td style="padding:8px;">${escapeHtml(opts.address || "—")}</td></tr>
      <tr style="background:#fbf4e8;"><td style="padding:8px;color:#6b5a47;">ID interno:</td>
          <td style="padding:8px;font-family:monospace;font-size:12px;">${opts.companyId}</td></tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="${adminUrl}"
         style="display:inline-block;background:#4f6f3f;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">
        Revisar en panel de admin
      </a>
    </div>
  </div>
</div>`,
  };
}

function verifierTemplate(opts: {
  businessName: string;
  contactEmail: string;
  businessType: string;
  companyId: string;
}): { subject: string; html: string } {
  const adminUrl = `${SITE_URL}/admin/companies`;
  return {
    subject: `[VERIFICAR] ${opts.businessName} pendiente de aprobación`,
    html: `
<div style="${baseStyles} max-width:560px;margin:0 auto;padding:24px;">
  <div style="background:#fff;border-radius:12px;padding:24px;border:2px solid #d4a548;">
    <p style="margin:0 0 8px;font-size:13px;color:#8a6822;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">
      Acción requerida
    </p>
    <h2 style="font-family:'Playfair Display',Georgia,serif;margin:0 0 16px;color:#2a1c10;">
      Verificar: ${escapeHtml(opts.businessName)}
    </h2>
    <p>Sector: <strong>${escapeHtml(opts.businessType || "Sin especificar")}</strong></p>
    <p>Contacto: ${escapeHtml(opts.contactEmail)}</p>
    <p style="font-family:monospace;font-size:11px;color:#888;">ID: ${opts.companyId}</p>
    <div style="text-align:center;margin-top:20px;">
      <a href="${adminUrl}"
         style="display:inline-block;background:#7b572d;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-weight:700;">
        Ir al panel y verificar
      </a>
    </div>
  </div>
</div>`,
  };
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
    if (!companyId || typeof companyId !== "string") {
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
      .select("id, business_name, contact_person, email, address, business_type")
      .eq("id", companyId)
      .single();

    if (error || !company) {
      console.error("company fetch failed", error);
      return new Response(JSON.stringify({ error: "Empresa no encontrada" }), {
        status: 404,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      });
    }

    // Construye los 3 emails
    const ownerMail = ownerEmailTemplate({
      businessName: company.business_name,
      contactPerson: company.contact_person || "",
    });
    const adminMail = adminNotificationTemplate({
      businessName: company.business_name,
      contactPerson: company.contact_person || "",
      contactEmail: company.email,
      businessType: company.business_type || "",
      address: company.address || "",
      companyId: company.id,
    });
    const verifierMail = verifierTemplate({
      businessName: company.business_name,
      contactEmail: company.email,
      businessType: company.business_type || "",
      companyId: company.id,
    });

    // Envía los 3 en paralelo
    const [owner, adminN, verifier] = await Promise.all([
      sendEmail({ to: company.email, ...ownerMail }),
      sendEmail({ to: ADMIN_NOTIFY_EMAIL, ...adminMail }),
      sendEmail({ to: VERIFIER_EMAIL, ...verifierMail }),
    ]);

    return new Response(
      JSON.stringify({
        ok: true,
        companyId,
        results: { owner, admin: adminN, verifier },
      }),
      {
        status: 200,
        headers: { ...corsHeaders(origin), "content-type": "application/json" },
      },
    );
  } catch (err) {
    console.error("send-company-registration error:", err);
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
