import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Pega aquí la URL "/exec" de tu Google Apps Script Web App.
 * Mientras esté vacía, el formulario mostrará el estado de éxito
 * pero NO enviará nada a Sheets.
 */
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

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";

const inputStyle = {
  backgroundColor: "rgba(255,250,241,0.62)",
  borderColor: `${C.beige}88`,
  color: C.brown,
};

const ferduqueSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  company: z.string().trim().min(1, "La empresa es obligatoria").max(150),
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
  {
    key: "q1",
    label: "¿Tu empresa tiene página web?",
    options: ["Sí", "No", "Necesita mejora"],
  },
  {
    key: "q2",
    label: "¿Gestionáis facturas o albaranes digitalmente?",
    options: ["Sí", "Parcialmente", "No"],
  },
  {
    key: "q3",
    label: "¿Usáis automatizaciones o herramientas digitales para ahorrar tiempo?",
    options: ["Sí", "No", "No sé qué podría automatizar"],
  },
  {
    key: "q4",
    label: "¿Vendéis online o queréis vender más digitalmente?",
    options: ["Ya vendemos", "Queremos hacerlo", "No todavía"],
  },
  {
    key: "q5",
    label: "¿Te gustaría formar parte gratuitamente de RitmOrigen como empresa fundadora FERDUQUE?",
    options: ["Sí, me interesa", "Quiero más información", "No por ahora"],
  },
];

const initialState: FerduqueForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  q1: "",
  q2: "",
  q3: "",
  q4: "",
  q5: "",
};

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
      result.error.errors.forEach((err) => {
        if (err.path[0]) newErrors[err.path[0] as string] = err.message;
      });
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

        // Apps Script Web Apps no devuelven CORS por defecto:
        // usamos no-cors + form-urlencoded para evitar preflight.
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
      }
      setSubmitted(true);
      toast.success("¡Enviado correctamente!");
    } catch (err) {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.paper }}>
        <Header />
        <main className="flex-1">
          <div className={`${pageShell} py-20`}>
            <div
              className="mx-auto max-w-xl rounded-lg border p-10 text-center"
              style={{
                backgroundColor: C.card,
                borderColor: `${C.beige}66`,
                boxShadow: "0 16px 40px rgba(61,43,31,0.08)",
              }}
            >
              <CheckCircle className="mx-auto mb-6 h-16 w-16" style={{ color: C.olive }} />
              <h1
                className="mb-4 font-bold"
                style={{
                  color: C.brown,
                  fontFamily: editorialFont,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                Enviado correctamente
              </h1>
              <p className="mb-2 leading-relaxed" style={{ color: C.brownSoft }}>
                Gracias por sumarte como empresa fundadora <strong>FERDUQUE</strong>.
              </p>
              <p className="leading-relaxed" style={{ color: C.brownSoft }}>
                Nos pondremos en contacto contigo muy pronto.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.paper }}>
      <Header />

      <main className="flex-1">
        {/* HERO con logos */}
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 100%)`,
          }}
        >
          <div className={`${pageShell} relative z-10 py-14 md:py-20`}>
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              {/* Logo RITMORIGEN como título principal — grande */}
              <div className="scale-[2] md:scale-[2.6] lg:scale-[3] mb-10 md:mb-16">
                <Logo size={24} showText={true} />
              </div>

              {/* Separador + alianza con FERDUQUE */}
              <div className="flex items-center gap-5 mb-7">
                <span
                  className="h-px w-12 md:w-16"
                  style={{ backgroundColor: `${C.beige}` }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs md:text-sm font-semibold tracking-[0.25em] uppercase"
                  style={{ color: C.brownSoft }}
                >
                  En alianza con
                </span>
                <span
                  className="h-px w-12 md:w-16"
                  style={{ backgroundColor: `${C.beige}` }}
                  aria-hidden="true"
                />
              </div>

              {/* Logo FERDUQUE */}
              <img
                src="/lovable-uploads/ferduque-logo.png"
                alt="FERDUQUE"
                className="h-24 md:h-32 w-auto object-contain mb-10"
                style={{ filter: "drop-shadow(0 6px 18px rgba(61,43,31,0.10))" }}
              />

              {/* Texto principal exacto */}
              <p
                className="max-w-2xl text-[17px] md:text-[20px] leading-[1.6] font-medium"
                style={{ color: C.brown, fontFamily: editorialFont }}
              >
                Forma parte gratuitamente como empresa fundadora{" "}
                <span style={{ color: C.olive, fontWeight: 700 }}>FERDUQUE</span> y descubre
                nuevas oportunidades para tu negocio.
              </p>
            </div>
          </div>
        </section>

        {/* FORMULARIO */}
        <section className={`${pageShell} pb-20 pt-4`}>
          <div
            className="mx-auto max-w-3xl rounded-lg border p-6 md:p-10"
            style={{
              backgroundColor: "rgba(255,250,241,0.92)",
              borderColor: `${C.beige}66`,
              boxShadow: "0 18px 44px rgba(61,43,31,0.08)",
            }}
          >
            <h2
              className="mb-2 font-bold"
              style={{
                color: C.brown,
                fontFamily: editorialFont,
                fontSize: "clamp(1.45rem, 2.4vw, 1.9rem)",
              }}
            >
              Cuéntanos sobre tu empresa
            </h2>
            <p className="mb-7 text-sm" style={{ color: C.inkMuted }}>
              Solo te tomará un minuto. Toda la información es confidencial.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* Datos básicos */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Nombre
                  </label>
                  <Input
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => handleField("name", e.target.value)}
                    className={`h-11 ${errors.name ? "border-red-500" : ""}`}
                    style={inputStyle}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Empresa
                  </label>
                  <Input
                    name="company"
                    placeholder="Nombre de tu empresa"
                    value={formData.company}
                    onChange={(e) => handleField("company", e.target.value)}
                    className={`h-11 ${errors.company ? "border-red-500" : ""}`}
                    style={inputStyle}
                  />
                  {errors.company && <p className="mt-1 text-xs text-red-600">{errors.company}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Teléfono
                  </label>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="+34 600 000 000"
                    value={formData.phone}
                    onChange={(e) => handleField("phone", e.target.value)}
                    className={`h-11 ${errors.phone ? "border-red-500" : ""}`}
                    style={inputStyle}
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="tu@empresa.com"
                    value={formData.email}
                    onChange={(e) => handleField("email", e.target.value)}
                    className={`h-11 ${errors.email ? "border-red-500" : ""}`}
                    style={inputStyle}
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>
              </div>

              <div
                className="h-px w-full my-2"
                style={{ backgroundColor: `${C.beige}66` }}
                aria-hidden="true"
              />

              {/* Preguntas de digitalización */}
              <div className="space-y-6">
                {QUESTIONS.map((q, i) => (
                  <fieldset key={q.key}>
                    <legend
                      className="mb-3 block text-sm md:text-[15px] font-semibold"
                      style={{ color: C.brown }}
                    >
                      {i + 1}. {q.label}
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {q.options.map((opt) => {
                        const active = formData[q.key] === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => handleField(q.key, opt)}
                            className="rounded-full border px-4 py-2 text-sm font-medium transition-all"
                            style={{
                              backgroundColor: active ? C.olive : "rgba(255,250,241,0.62)",
                              color: active ? C.card : C.brown,
                              borderColor: active ? C.olive : `${C.beige}88`,
                              boxShadow: active
                                ? "0 6px 14px rgba(79,93,42,0.25)"
                                : "none",
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {errors[q.key] && (
                      <p className="mt-2 text-xs text-red-600">{errors[q.key]}</p>
                    )}
                  </fieldset>
                ))}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading || submitted}
                  className="h-12 gap-3 px-8 text-base"
                  style={{ backgroundColor: C.olive, color: C.card }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Quiero ser empresa fundadora
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              <p
                className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed"
                style={{ color: C.inkMuted }}
              >
                Al enviar este formulario aceptas nuestra{" "}
                <Link
                  to="/politica-privacidad"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  política de privacidad
                </Link>
                . Tus datos se utilizarán únicamente para contactar contigo en relación
                con la iniciativa FERDUQUE.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Ferduque;
