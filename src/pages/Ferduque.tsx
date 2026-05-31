import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxh_NzlpuSOhe8cEeKRsQjwrQxIgtUZN56kFVKyIXxCrxcnysDtt18yPR7IEuaqM12Ouw/exec";

const C = {
  cream: "#F5F0E8",
  paper: "#F3EADB",
  card: "#FFFAF1",
  brown: "#3D2B1F",
  brownSoft: "#6F4E37",
  olive: "#4F5D2A",
  beige: "#C8B89A",
  inkMuted: "#756650",
};

/* ── Logo FERDUQUE PORZUNA 2026 — SVG inline, sin archivo externo ── */
const FerduqueLogo = () => (
  <svg
    viewBox="0 0 310 86"
    xmlns="http://www.w3.org/2000/svg"
    style={{ height: "78px", width: "auto", display: "block" }}
    aria-label="FERDUQUE Porzuna 2026"
  >
    {/* Sombra sutil para definición */}
    <defs>
      <filter id="fq-shadow" x="-4%" y="-4%" width="108%" height="120%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#00000022" />
      </filter>
    </defs>

    {/* FERDUQUE */}
    <text
      x="155" y="52"
      textAnchor="middle"
      fontFamily="Impact, 'Arial Black', 'Arial Narrow', Arial, sans-serif"
      fontSize="54"
      fontWeight="900"
      letterSpacing="3"
      filter="url(#fq-shadow)"
    >
      <tspan fill="#D4A800">FER</tspan>
      <tspan fill="#1B6612">DUQUE</tspan>
    </text>

    {/* Icono circular con hoja */}
    <g transform="translate(44, 62)" filter="url(#fq-shadow)">
      <circle cx="0" cy="8" r="10" fill="none" stroke="#1B6612" strokeWidth="1.8" />
      {/* hoja central */}
      <path d="M0,15 Q5,8 0,2 Q-5,8 0,15Z" fill="#1B6612" />
      <line x1="0" y1="15" x2="0" y2="18" stroke="#1B6612" strokeWidth="1.2" />
      {/* brotes laterales */}
      <path d="M0,9 Q4,5 6,6" fill="none" stroke="#1B6612" strokeWidth="1" />
      <path d="M0,9 Q-4,5 -6,6" fill="none" stroke="#1B6612" strokeWidth="1" />
    </g>

    {/* PORZUNA 2026 */}
    <text
      x="165" y="76"
      textAnchor="middle"
      fontFamily="'Arial Narrow', Arial, sans-serif"
      fontSize="16"
      fontWeight="700"
      fill="#1B6612"
      letterSpacing="2.5"
      filter="url(#fq-shadow)"
    >
      PORZUNA 2026
    </text>
  </svg>
);

const pageShell = "mx-auto w-full max-w-3xl px-4 sm:px-6";
const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";
const inputStyle = {
  backgroundColor: "rgba(255,250,241,0.62)",
  borderColor: `${C.beige}88`,
  color: C.brown,
};

const ferduqueSchema = z.object({
  name: z.string().trim().min(1, "Nombre obligatorio").max(100),
  company: z.string().trim().min(1, "Empresa obligatoria").max(150),
  phone: z.string().trim().min(6, "Teléfono inválido").max(30),
  email: z.string().trim().email("Email inválido").max(255),
  q1: z.string().min(1, "Selecciona una opción"),
  q2: z.string().min(1, "Selecciona una opción"),
  q3: z.string().min(1, "Selecciona una opción"),
  q4: z.string().min(1, "Selecciona una opción"),
  q5: z.string().min(1, "Selecciona una opción"),
});

type FerduqueForm = z.infer<typeof ferduqueSchema>;

const QUESTIONS: { key: keyof FerduqueForm; label: string; options: string[] }[] = [
  { key: "q1", label: "¿Tu empresa tiene página web?", options: ["Sí", "No", "Necesita mejora"] },
  { key: "q2", label: "¿Gestionáis facturas o albaranes digitalmente?", options: ["Sí", "Parcialmente", "No"] },
  { key: "q3", label: "¿Usáis automatizaciones o herramientas digitales para ahorrar tiempo?", options: ["Sí", "No", "No sé qué podría automatizar"] },
  { key: "q4", label: "¿Vendéis online o queréis vender más digitalmente?", options: ["Ya vendemos", "Queremos hacerlo", "No todavía"] },
  { key: "q5", label: "¿Te gustaría formar parte gratuitamente de RitmOrigen como empresa fundadora FERDUQUE?", options: ["Sí, me interesa", "Quiero más información", "No por ahora"] },
];

const initialState: FerduqueForm = { name: "", company: "", phone: "", email: "", q1: "", q2: "", q3: "", q4: "", q5: "" };

/* ── Minimal locked header — sin nav, sin links externos ── */
const LockedHeader = () => (
  <header
    className="w-full py-3 flex justify-center items-center border-b"
    style={{ backgroundColor: C.cream, borderColor: `${C.beige}55` }}
  >
    <Logo size={20} showText={true} />
  </header>
);

/* ── Minimal footer — solo aviso legal ── */
const LockedFooter = () => (
  <footer className="w-full py-5 text-center text-xs" style={{ color: C.inkMuted, backgroundColor: C.paper }}>
    © {new Date().getFullYear()} RitmOrigen · Todos los derechos reservados ·{" "}
    <Link to="/politica-privacidad" className="underline underline-offset-2 hover:opacity-70" target="_blank" rel="noopener noreferrer">
      Política de privacidad
    </Link>
  </footer>
);

const Ferduque = () => {
  const [formData, setFormData] = useState<FerduqueForm>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleField = (key: keyof FerduqueForm, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;

    const result = ferduqueSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { if (err.path[0]) newErrors[err.path[0] as string] = err.message; });
      setErrors(newErrors);
      toast.error("Revisa los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      if (APPS_SCRIPT_URL) {
        const body = new URLSearchParams();
        Object.entries(result.data).forEach(([k, v]) => body.append(k, String(v)));
        body.append("source", "ferduque-landing");
        body.append("submittedAt", new Date().toISOString());
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
      }
      setSubmitted(true);
    } catch {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.paper }}>
        <LockedHeader />
        <main className="flex-1 flex items-center justify-center py-16 px-4">
          <div
            className="max-w-md w-full rounded-xl border p-10 text-center"
            style={{ backgroundColor: C.card, borderColor: `${C.beige}66`, boxShadow: "0 16px 40px rgba(61,43,31,0.08)" }}
          >
            <CheckCircle className="mx-auto mb-5 h-14 w-14" style={{ color: C.olive }} />
            <h1 className="mb-3 font-bold text-2xl" style={{ color: C.brown, fontFamily: editorialFont }}>
              ¡Enviado correctamente!
            </h1>
            <p className="leading-relaxed text-sm" style={{ color: C.brownSoft }}>
              Gracias por sumarte como empresa fundadora <strong>FERDUQUE</strong>.<br />
              Nos pondremos en contacto contigo muy pronto.
            </p>
          </div>
        </main>
        <LockedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.paper }}>
      <LockedHeader />

      <main className="flex-1">
        {/* HERO compacto */}
        <section
          className="py-8 md:py-10"
          style={{ background: `linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 100%)` }}
        >
          <div className={`${pageShell} flex flex-col items-center text-center gap-4`}>
            {/* Logo RITMORIGEN — tamaño moderado */}
            <div style={{ transform: "scale(1.9)", transformOrigin: "center", marginBottom: "1rem", marginTop: "0.5rem" }}>
              <Logo size={22} showText={true} />
            </div>

            {/* Separador "en alianza con" */}
            <div className="flex items-center gap-4 mt-2">
              <span className="h-px w-10" style={{ backgroundColor: C.beige }} aria-hidden="true" />
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: C.brownSoft }}>
                en alianza con
              </span>
              <span className="h-px w-10" style={{ backgroundColor: C.beige }} aria-hidden="true" />
            </div>

            {/* Logo FERDUQUE — SVG inline, sin archivo externo */}
            <FerduqueLogo />

            {/* Texto principal */}
            <p
              className="max-w-xl text-[15px] md:text-[17px] leading-[1.65] font-medium mt-1"
              style={{ color: C.brown, fontFamily: editorialFont }}
            >
              Forma parte gratuitamente como empresa fundadora{" "}
              <span style={{ color: C.olive, fontWeight: 700 }}>FERDUQUE</span>{" "}
              y descubre nuevas oportunidades para tu negocio.
            </p>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className={`${pageShell} pb-14 pt-2`}>
          <div
            className="rounded-xl border p-6 md:p-9"
            style={{
              backgroundColor: "rgba(255,250,241,0.95)",
              borderColor: `${C.beige}66`,
              boxShadow: "0 18px 44px rgba(61,43,31,0.08)",
            }}
          >
            <h2 className="mb-1 font-bold text-xl md:text-2xl" style={{ color: C.brown, fontFamily: editorialFont }}>
              Cuéntanos sobre tu empresa
            </h2>
            <p className="mb-6 text-xs" style={{ color: C.inkMuted }}>
              Solo un minuto. Toda la información es confidencial.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Datos básicos */}
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { key: "name" as const, label: "Nombre", placeholder: "Tu nombre", type: "text" },
                  { key: "company" as const, label: "Empresa", placeholder: "Nombre de tu empresa", type: "text" },
                  { key: "phone" as const, label: "Teléfono", placeholder: "+34 600 000 000", type: "tel" },
                  { key: "email" as const, label: "Email", placeholder: "tu@empresa.com", type: "email" },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="mb-1.5 block text-sm font-semibold" style={{ color: C.brown }}>{label}</label>
                    <Input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) => handleField(key, e.target.value)}
                      className={`h-11 ${errors[key] ? "border-red-500" : ""}`}
                      style={inputStyle}
                    />
                    {errors[key] && <p className="mt-1 text-xs text-red-600">{errors[key]}</p>}
                  </div>
                ))}
              </div>

              <div className="h-px" style={{ backgroundColor: `${C.beige}55` }} aria-hidden="true" />

              {/* Preguntas */}
              <div className="space-y-5">
                {QUESTIONS.map((q, i) => (
                  <fieldset key={q.key}>
                    <legend className="mb-2.5 text-sm font-semibold" style={{ color: C.brown }}>
                      {i + 1}. {q.label}
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const active = formData[q.key] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => handleField(q.key, opt)}
                            className="rounded-full border px-4 py-1.5 text-sm font-medium transition-all"
                            style={{
                              backgroundColor: active ? C.olive : "rgba(255,250,241,0.62)",
                              color: active ? C.card : C.brown,
                              borderColor: active ? C.olive : `${C.beige}88`,
                              boxShadow: active ? "0 4px 12px rgba(79,93,42,0.22)" : "none",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {errors[q.key] && <p className="mt-1.5 text-xs text-red-600">{errors[q.key]}</p>}
                  </fieldset>
                ))}
              </div>

              <Button
                type="submit"
                disabled={loading || submitted}
                className="h-12 gap-3 px-8 text-base w-full md:w-auto"
                style={{ backgroundColor: C.olive, color: C.card }}
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</>
                ) : (
                  <>Quiero ser empresa fundadora<Send className="h-4 w-4" /></>
                )}
              </Button>

              <p className="text-center text-xs leading-relaxed" style={{ color: C.inkMuted }}>
                Al enviar aceptas nuestra{" "}
                <Link to="/politica-privacidad" className="underline underline-offset-2 hover:opacity-70" target="_blank" rel="noopener noreferrer">
                  política de privacidad
                </Link>
                . Datos usados únicamente para la iniciativa FERDUQUE.
              </p>
            </form>
          </div>
        </section>
      </main>

      <LockedFooter />
    </div>
  );
};

export default Ferduque;
