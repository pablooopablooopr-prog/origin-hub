import { useState } from "react";
import { Link } from "react-router-dom";
/* Logo inline centrado — sin scale(), sin desvío */
const ModalLogo = () => (
  <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
    <span style={{ fontSize: "22px", fontWeight: "bold", color: "#3D2B1F", letterSpacing: "-0.5px", lineHeight: 1, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
      <span>RITM</span>
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: "22px", height: "22px", marginLeft: "1px", marginRight: "1px" }}>
        <span style={{ visibility: "hidden" }}>O</span>
        <img src="/lovable-uploads/enso-transparent.png" alt="" aria-hidden="true"
          style={{ position: "absolute", width: "18.7px", height: "18.7px", objectFit: "contain", opacity: 0.9 }} />
      </span>
      <span>RIGEN</span>
    </span>
  </div>
);
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzB-GJfb7AIqhTZIN8r5QKCm7HevcCwRUsqAG-qXCadm-r3dWYOCfXvF_POyASCQRHtiQ/exec";

const SESSION_KEY = "ferduque_modal_dismissed";

const C = {
  paper: "#F3EADB",
  card: "#FFFAF1",
  brown: "#3D2B1F",
  brownSoft: "#6F4E37",
  olive: "#4F5D2A",
  beige: "#C8B89A",
  inkMuted: "#756650",
  cream: "#F5F0E8",
};
const ef = "'Playfair Display','Cormorant Garamond','Georgia',serif";
const inputStyle = {
  backgroundColor: "rgba(255,250,241,0.7)",
  borderColor: `${C.beige}99`,
  color: C.brown,
};

const schema = z.object({
  name: z.string().trim().min(1, "Obligatorio").max(100),
  company: z.string().trim().min(1, "Obligatorio").max(150),
  phone: z.string().trim().min(6, "Teléfono inválido").max(30),
  email: z.string().trim().email("Email inválido").max(255),
  q1: z.string().min(1, "Selecciona"),
  q2: z.string().min(1, "Selecciona"),
  q3: z.string().min(1, "Selecciona"),
  q4: z.string().min(1, "Selecciona"),
  q5: z.string().min(1, "Selecciona"),
});
type Form = z.infer<typeof schema>;

const QUESTIONS: { key: keyof Form; label: string; options: string[] }[] = [
  { key: "q1", label: "¿Tu empresa tiene página web?", options: ["Sí", "No", "Necesita mejora"] },
  { key: "q2", label: "¿Gestionáis facturas o albaranes digitalmente?", options: ["Sí", "Parcialmente", "No"] },
  { key: "q3", label: "¿Usáis automatizaciones o herramientas digitales para ahorrar tiempo y dinero?", options: ["Sí", "No", "No sé qué podría automatizar"] },
  { key: "q4", label: "¿Vendéis online o queréis vender más?", options: ["Ya vendemos", "Queremos hacerlo", "No todavía"] },
  { key: "q5", label: "¿Te gustaría formar parte gratuitamente de RitmOrigen como empresa fundadora FERDUQUE?", options: ["Sí, me interesa", "Quiero más información", "No por ahora"] },
];

const init: Form = { name: "", company: "", phone: "", email: "", q1: "", q2: "", q3: "", q4: "", q5: "" };

const FerduqueModal = () => {
  const [open, setOpen] = useState(() => sessionStorage.getItem(SESSION_KEY) !== "1");
  const [form, setForm] = useState<Form>(init);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  };

  const set = (k: keyof Form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || submitted) return;
    const res = schema.safeParse(form);
    if (!res.success) {
      const e: Partial<Record<keyof Form, string>> = {};
      res.error.errors.forEach((err) => { if (err.path[0]) e[err.path[0] as keyof Form] = err.message; });
      setErrors(e);
      toast.error("Revisa los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const body = new URLSearchParams();
      Object.entries(res.data).forEach(([k, v]) => body.append(k, String(v)));
      body.append("source", "ferduque-modal-home");
      body.append("submittedAt", new Date().toISOString());
      await fetch(APPS_SCRIPT_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      setSubmitted(true);
    } catch {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5"
      style={{ backgroundColor: "rgba(30,20,10,0.72)", backdropFilter: "blur(3px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ backgroundColor: C.card, border: `1px solid ${C.beige}88` }}
      >
        {/* Cerrar */}
        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors hover:bg-black/10"
          style={{ color: C.brownSoft }}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-5 pt-7 pb-6 sm:px-8 sm:pt-8">
          {submitted ? (
            /* ── Estado enviado ── */
            <div className="flex flex-col items-center text-center py-8 gap-4">
              <CheckCircle className="h-14 w-14" style={{ color: C.olive }} />
              <h2 className="text-2xl font-bold" style={{ color: C.brown, fontFamily: ef }}>
                ¡Enviado correctamente!
              </h2>
              <p style={{ color: C.brownSoft }} className="text-sm leading-relaxed">
                Gracias por sumarte como empresa fundadora <strong>FERDUQUE</strong>.<br />
                Nos pondremos en contacto contigo muy pronto.
              </p>
              <Button onClick={dismiss} style={{ backgroundColor: C.olive, color: C.card }} className="mt-2">
                Explorar RitmOrigen
              </Button>
            </div>
          ) : (
            <>
              {/* ── Cabecera logos ── */}
              <div className="flex flex-col items-center text-center gap-3 mb-6">
                <ModalLogo />

                <div className="flex items-center gap-3">
                  <span className="h-px w-8" style={{ backgroundColor: C.beige }} />
                  <span className="text-[9px] font-semibold tracking-[0.2em] uppercase" style={{ color: C.brownSoft }}>
                    en alianza con
                  </span>
                  <span className="h-px w-8" style={{ backgroundColor: C.beige }} />
                </div>

                <img
                  src="/lovable-uploads/ferduque-logo.jpg"
                  alt="FERDUQUE Porzuna 2026"
                  style={{ height: "52px", width: "auto", objectFit: "contain", mixBlendMode: "multiply" }}
                />

                <p className="text-sm md:text-[15px] leading-snug font-medium max-w-md" style={{ color: C.brown, fontFamily: ef }}>
                  Forma parte <strong style={{ color: C.olive }}>GRATUITAMENTE</strong> como empresa fundadora{" "}
                  <strong style={{ color: C.olive }}>FERDUQUE</strong> y descubre nuevas oportunidades para tu negocio.
                </p>
              </div>

              {/* ── Formulario ── */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Datos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { k: "name", label: "Nombre", ph: "Tu nombre", type: "text" },
                    { k: "company", label: "Empresa", ph: "Nombre de tu empresa", type: "text" },
                    { k: "phone", label: "Teléfono", ph: "+34 600 000 000", type: "tel" },
                    { k: "email", label: "Email", ph: "tu@empresa.com", type: "email" },
                  ] as const).map(({ k, label, ph, type }) => (
                    <div key={k}>
                      <label className="mb-1 block text-xs font-semibold" style={{ color: C.brown }}>{label}</label>
                      <Input
                        type={type} placeholder={ph}
                        value={form[k]}
                        onChange={(e) => set(k, e.target.value)}
                        className={`h-10 text-sm ${errors[k] ? "border-red-500" : ""}`}
                        style={inputStyle}
                      />
                      {errors[k] && <p className="mt-0.5 text-xs text-red-600">{errors[k]}</p>}
                    </div>
                  ))}
                </div>

                <div className="h-px" style={{ backgroundColor: `${C.beige}55` }} />

                {/* Preguntas */}
                <div className="space-y-4">
                  {QUESTIONS.map((q, i) => (
                    <fieldset key={q.key}>
                      <legend className="mb-2 text-xs font-semibold" style={{ color: C.brown }}>
                        {i + 1}. {q.label}
                      </legend>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map((opt) => {
                          const active = form[q.key] === opt;
                          return (
                            <button
                              type="button" key={opt}
                              onClick={() => set(q.key, opt)}
                              className="rounded-full border px-3 py-1 text-xs font-medium transition-all"
                              style={{
                                backgroundColor: active ? C.olive : "rgba(255,250,241,0.7)",
                                color: active ? C.card : C.brown,
                                borderColor: active ? C.olive : `${C.beige}88`,
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {errors[q.key] && <p className="mt-1 text-xs text-red-600">{errors[q.key]}</p>}
                    </fieldset>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <Button
                    type="submit" disabled={loading}
                    className="h-11 gap-2 px-6 text-sm font-bold w-full sm:w-auto"
                    style={{ backgroundColor: C.olive, color: C.card }}
                  >
                    {loading
                      ? <><Loader2 className="h-4 w-4 animate-spin" />Enviando...</>
                      : <><Send className="h-4 w-4" />Quiero ser empresa fundadora</>}
                  </Button>
                  <button type="button" onClick={dismiss} className="text-xs underline underline-offset-2" style={{ color: C.inkMuted }}>
                    Ahora no, explorar la web
                  </button>
                </div>

                <p className="text-center text-[10px] leading-relaxed" style={{ color: C.inkMuted }}>
                  Al enviar aceptas nuestra{" "}
                  <Link to="/politica-privacidad" target="_blank" className="underline">política de privacidad</Link>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FerduqueModal;
