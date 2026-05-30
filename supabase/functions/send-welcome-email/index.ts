import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

type WelcomeType = "customer" | "company";
type WelcomeEmailRequest = { type: WelcomeType };

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const SITE_URL = Deno.env.get("SITE_URL") || "https://www.origen.it.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "ORIGEN <no-reply@origen.it.com>";

const resend = new Resend(RESEND_API_KEY);

// Allowlist de orígenes (mejor que "*")
const allowedOrigins = new Set([
  "http://localhost:5173",
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
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[c]!)
  );
}

function customerTemplate(name: string) {
  const safe = escapeHtml(name);
  return {
    subject: "¡Bienvenido a ORIGEN! 🌿",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background:#FAF6F0;">
  <div style="background:#8B7355; padding:28px 24px; text-align:center;">
    <h1 style="color:#fff; margin:0; font-size:26px;">Bienvenido a ORIGEN</h1>
    <p style="color:#f2e9df; margin:10px 0 0;">Productos auténticos, sin postureo</p>
  </div>
  <div style="padding:26px 24px; color:#222;">
    <h2 style="margin:0 0 10px; color:#8B7355;">Hola ${safe},</h2>
    <p style="line-height:1.6; margin:0 0 14px;">
      Tu cuenta ya está activa. Desde aquí puedes descubrir packs, productores y rutas.
    </p>

    <ul style="line-height:1.9; margin:0 0 18px; padding-left:18px;">
      <li>Explorar packs regionales</li>
      <li>Guardar favoritos</li>
      <li>Descubrir rutas gastronómicas</li>
      <li>Recomendaciones según tu zona</li>
    </ul>

    <div style="text-align:center; margin:22px 0;">
      <a href="${SITE_URL}/mapa"
        style="display:inline-block; background:#8B7355; color:#fff; padding:12px 18px; text-decoration:none; border-radius:10px; font-weight:bold;">
        Explorar packs
      </a>
    </div>

    <p style="color:#666; font-size:13px; margin:18px 0 0;">
      Si no has sido tú, ignora este correo.
    </p>
  </div>

  <div style="background:#1f1f1f; color:#fff; padding:16px 20px; text-align:center; font-size:12px;">
    © ${new Date().getFullYear()} ORIGEN
  </div>
</div>`,
  };
}

function companyTemplate(name: string) {
  const safe = escapeHtml(name);
  return {
    subject: "Tu empresa ya está en ORIGEN ✅",
    html: `
<div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background:#F5FAF8;">
  <div style="background:#2E5D4E; padding:28px 24px; text-align:center;">
    <h1 style="color:#fff; margin:0; font-size:26px;">ORIGEN para Empresas</h1>
    <p style="color:#d9efe6; margin:10px 0 0;">Conecta con clientes que valoran lo auténtico</p>
  </div>

  <div style="padding:26px 24px; color:#222;">
    <h2 style="margin:0 0 10px; color:#2E5D4E;">Hola ${safe},</h2>
    <p style="line-height:1.6; margin:0 0 14px;">
      Tu cuenta de empresa está lista. Completa tu perfil y gestiona tus packs y rutas.
    </p>

    <ul style="line-height:1.9; margin:0 0 18px; padding-left:18px;">
      <li>Crear y gestionar packs</li>
      <li>Recibir pedidos y seguimiento</li>
      <li>Participar en rutas</li>
      <li>Ver rendimiento</li>
    </ul>

    <div style="text-align:center; margin:22px 0;">
      <a href="${SITE_URL}/company-dashboard"
        style="display:inline-block; background:#2E5D4E; color:#fff; padding:12px 18px; text-decoration:none; border-radius:10px; font-weight:bold;">
        Ir a mi panel
      </a>
    </div>

    <p style="color:#666; font-size:13px; margin:18px 0 0;">
      Si no has sido tú, ignora este correo.
    </p>
  </div>

  <div style="background:#1f1f1f; color:#fff; padding:16px 20px; text-align:center; font-size:12px;">
    © ${new Date().getFullYear()} ORIGEN
  </div>
</div>`,
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response(null, { headers });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers });

  try {
    // Env checks
    if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
    if (!SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
    if (!SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_ANON_KEY");
    if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

    // === PRO AUTH: exige JWT ===
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing Authorization Bearer token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...headers },
      });
    }

    // Cliente "user" para validar JWT y extraer user_id
    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData?.user?.id) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...headers },
      });
    }
    const userId = userData.user.id;

    // Body
    const body = (await req.json()) as WelcomeEmailRequest;
    if (!body?.type || (body.type !== "customer" && body.type !== "company")) {
      return new Response(JSON.stringify({ error: "Invalid type" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers },
      });
    }

    // Admin client para leer BD + RPC
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let email = "";
    let name = "";

    if (body.type === "customer") {
      // Deduplicación: marca y decide si enviar
      const { data: canSend, error: rpcErr } = await supabaseAdmin.rpc("mark_customer_welcome_sent", {
        p_user_id: userId,
      });
      if (rpcErr) throw rpcErr;
      if (!canSend) {
        return new Response(JSON.stringify({ ok: true, skipped: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...headers },
        });
      }

      const { data, error } = await supabaseAdmin
        .from("customers")
        .select("email, full_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      email = (data?.email || "").trim();
      name = (data?.full_name || "").trim() || "Usuario";
    } else {
      const { data: canSend, error: rpcErr } = await supabaseAdmin.rpc("mark_company_welcome_sent", {
        p_user_id: userId,
      });
      if (rpcErr) throw rpcErr;
      if (!canSend) {
        return new Response(JSON.stringify({ ok: true, skipped: true }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...headers },
        });
      }

      const { data, error } = await supabaseAdmin
        .from("companies")
        .select("email, business_name")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;

      email = (data?.email || "").trim();
      name = (data?.business_name || "").trim() || "Tu empresa";
    }

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email in DB for this user" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...headers },
      });
    }

    const tpl = body.type === "customer" ? customerTemplate(name) : companyTemplate(name);

    const emailResponse = await resend.emails.send({
      from: FROM_EMAIL,
      to: [email],
      subject: tpl.subject,
      html: tpl.html,
    });

    return new Response(JSON.stringify({ ok: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...headers },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...headers },
    });
  }
});
