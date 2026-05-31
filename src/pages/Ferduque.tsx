import { useState } from "react";
import { Link } from "react-router-dom";
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

/* Logo grande inline — sin scale(), sin desvío */
const BigLogo = () => {
  const fs = 64;
  const enso = fs * 0.85;
  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <span style={{ fontSize: `${fs}px`, fontWeight: "bold", color: "#3D2B1F", letterSpacing: "-1px", lineHeight: 1, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
        <span>RITM</span>
        <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: `${fs}px`, height: `${fs}px`, marginLeft: "2px", marginRight: "2px" }}>
          <span style={{ visibility: "hidden" }}>O</span>
          <img src="/lovable-uploads/enso-transparent.png" alt="" aria-hidden="true"
            style={{ position: "absolute", width: `${enso}px`, height: `${enso}px`, objectFit: "contain", opacity: 0.9 }} />
        </span>
        <span>RIGEN</span>
      </span>
    </div>
  );
};

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
  { key: "q3", label: "¿Usáis automatizaciones o herramientas digitales para ahorrar tiempo y dinero?", options: ["Sí", "No", "No sé qué podría automatizar"] },
  { key: "q4", label: "¿Vendéis online o queréis vender más?", options: ["Ya vendemos", "Queremos hacerlo", "No todavía"] },
  { key: "q5", label: "¿Te gustaría formar parte gratuitamente de RitmOrigen como empresa fundadora FERDUQUE?", options: ["Sí, me interesa", "Quiero más información", "No por ahora"] },
];

const initialState: FerduqueForm = { name: "", company: "", phone: "", email: "", q1: "", q2: "", q3: "", q4: "", q5: "" };

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
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: C.paper }}>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.paper }}>
      <main className="flex-1">
        {/* Cabecera limpia: logos centrados + tagline */}
        <div
          className="w-full flex flex-col items-center text-center px-4 pt-10 pb-6"
          style={{ background: `linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 100%)` }}
        >
          {/* Logo RITMORIGEN grande y centrado */}
          <div style={{ marginBottom: "2.2rem" }}>
            <BigLogo />
          </div>

          {/* Separador */}
          <div className="flex items-center gap-4 mb-4">
            <span className="h-px w-12" style={{ backgroundColor: C.beige }} aria-hidden="true" />
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: C.brownSoft }}>
              en alianza con
            </span>
            <span className="h-px w-12" style={{ backgroundColor: C.beige }} aria-hidden="true" />
          </div>

          {/* Logo FERDUQUE — imagen real con fondo eliminado por mix-blend-mode */}
          <img
            src="/lovable-uploads/ferduque-logo.jpg"
            alt="FERDUQUE Porzuna 2026"
            style={{
              height: "90px",
              width: "auto",
              objectFit: "contain",
              mixBlendMode: "multiply",
              marginBottom: "1.2rem",
            }}
          />

          {/* Tagline */}
          <p
            className="max-w-xl text-[15px] md:text-[17px] leading-[1.65] font-medium"
            style={{ color: C.brown, fontFamily: editorialFont }}
          >
            Forma parte gratuitamente como empresa fundadora{" "}
            <span style={{ color: C.olive, fontWeight: 700 }}>FERDUQUE</span>{" "}
            y descubre nuevas oportunidades para tu negocio.
          </p>
        </div>

        {/* FORMULARIO */}
        <section className={`${pageShell} pb-14 pt-4`}>
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
