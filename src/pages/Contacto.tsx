import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronDown,
  Facebook,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import { submitContactMessage } from "@/hooks/useSupabaseData";
import { toast } from "sonner";
import { z } from "zod";

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

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().trim().min(1, "El mensaje es obligatorio").max(2000),
});

const inputStyle = {
  backgroundColor: "rgba(255,250,241,0.62)",
  borderColor: `${C.beige}88`,
  color: C.brown,
};

const Contacto = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const { error } = await submitContactMessage({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      subject: result.data.subject,
      message: result.data.message,
    });

    setLoading(false);

    if (error) {
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.");
    } else {
      setSubmitted(true);
      toast.success("¡Mensaje enviado correctamente!");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.paper }}>
        <Header />
        <main className="flex-1">
          <div className={`${pageShell} py-20`}>
            <div className="mx-auto max-w-xl rounded-lg border p-10 text-center" style={{ backgroundColor: C.card, borderColor: `${C.beige}66`, boxShadow: "0 16px 40px rgba(61,43,31,0.08)" }}>
              <CheckCircle className="mx-auto mb-6 h-16 w-16" style={{ color: C.olive }} />
              <h1 className="mb-4 font-bold" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                Mensaje enviado
              </h1>
              <p className="mb-8 leading-relaxed" style={{ color: C.brownSoft }}>
                Gracias por contactar con RITMORIGEN. Te responderemos lo antes posible.
              </p>
              <Button onClick={() => setSubmitted(false)} style={{ backgroundColor: C.olive, color: C.card }}>
                Enviar otro mensaje
              </Button>
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
        <section className="relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${C.cream} 0%, ${C.cream} 42%, rgba(245,240,232,0.82) 58%, rgba(245,240,232,0.25) 100%)` }}>
          <div
            className="absolute inset-y-0 right-0 hidden w-[58%] md:block"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(245,240,232,0.98) 0%, rgba(245,240,232,0.72) 28%, rgba(245,240,232,0.18) 54%), url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1500&q=88')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
          <div className={`${pageShell} relative z-10 py-16 md:py-20`}>
            <div className="max-w-2xl">
              <h1
                className="font-bold leading-[1]"
                style={{
                  color: C.brown,
                  fontFamily: editorialFont,
                  fontSize: "clamp(4rem, 8vw, 6.4rem)",
                  letterSpacing: "0",
                }}
              >
                Hablemos
              </h1>
              <h2
                className="mt-5 font-bold"
                style={{
                  color: C.olive,
                  fontFamily: editorialFont,
                  fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                }}
              >
                Estamos aquí para ayudarte
              </h2>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.8]" style={{ color: "#201812" }}>
                ¿Tienes alguna duda, sugerencia o quieres colaborar con nosotros?
                <br />
                Rellena el formulario o utiliza cualquiera de nuestros canales para ponerte en contacto. Te responderemos lo antes posible.
              </p>
            </div>

            <div className="absolute right-[30%] top-20 hidden h-36 w-36 items-center justify-center rounded-full border text-center md:flex" style={{ borderColor: `${C.olive}88`, backgroundColor: "rgba(245,240,232,0.58)", color: C.olive }}>
              <div className="rounded-full border p-6 text-[10px] font-bold uppercase tracking-[0.16em]" style={{ borderColor: `${C.olive}66` }}>
                Bien de<br />territorio
              </div>
            </div>
          </div>
        </section>

        <section className={`${pageShell} -mt-6 pb-16 md:-mt-10`}>
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
            <div className="rounded-lg border p-6 md:p-10" style={{ backgroundColor: "rgba(255,250,241,0.9)", borderColor: `${C.beige}66`, boxShadow: "0 18px 44px rgba(61,43,31,0.08)" }}>
              <h2 className="mb-7 font-bold" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "clamp(1.7rem, 3vw, 2.1rem)" }}>
                Envíanos un mensaje
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                      Nombre
                    </label>
                    <Input
                      name="name"
                      placeholder="Tu nombre"
                      value={formData.name}
                      onChange={handleChange}
                      className={`h-12 ${errors.name ? "border-red-500" : ""}`}
                      style={inputStyle}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                      Correo electrónico
                    </label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Tu correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                      className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                      style={inputStyle}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Asunto
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-12 w-full appearance-none rounded-md border px-4 pr-11 text-sm outline-none"
                      style={inputStyle}
                    >
                      <option value="">¿En qué podemos ayudarte?</option>
                      <option value="Consulta general">Consulta general</option>
                      <option value="Colaboración">Colaboración</option>
                      <option value="Soy empresa">Soy empresa</option>
                      <option value="Soporte">Soporte</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.brownSoft }} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold" style={{ color: C.brown }}>
                    Mensaje
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? "border-red-500" : ""}
                    style={inputStyle}
                  />
                  {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
                </div>

                <Button type="submit" disabled={loading} className="h-12 gap-3 px-7" style={{ backgroundColor: C.olive, color: C.card }}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar mensaje
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed" style={{ color: C.inkMuted }}>
                RITMORIGEN es una plataforma digital que actúa como intermediario tecnológico.
                Al enviar este formulario aceptas nuestra{" "}
                <Link to="/politica-privacidad" className="underline underline-offset-4 hover:opacity-80">
                  política de privacidad
                </Link>
                .
              </p>
            </div>

            <aside className="space-y-6">
              <div className="rounded-lg border p-6 md:p-9" style={{ backgroundColor: "rgba(255,250,241,0.9)", borderColor: `${C.beige}66`, boxShadow: "0 18px 44px rgba(61,43,31,0.08)" }}>
                <h2 className="mb-8 font-bold" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "clamp(1.6rem, 3vw, 2rem)" }}>
                  Información de contacto
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-5">
                    <Mail className="mt-1 h-7 w-7 shrink-0" style={{ color: C.olive }} />
                    <div>
                      <p className="font-semibold" style={{ color: C.brown }}>Email</p>
                      <p className="mt-1" style={{ color: "#201812" }}>info@origen.it.com</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <Phone className="mt-1 h-7 w-7 shrink-0" style={{ color: C.olive }} />
                    <div>
                      <p className="font-semibold" style={{ color: C.brown }}>Teléfono</p>
                      <p className="mt-1" style={{ color: "#201812" }}>+34 633 804 448</p>
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <MapPin className="mt-1 h-7 w-7 shrink-0" style={{ color: C.olive }} />
                    <div>
                      <p className="font-semibold" style={{ color: C.brown }}>Dirección</p>
                      <p className="mt-1" style={{ color: "#201812" }}>Ciudad Real, España</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-6 md:p-9" style={{ backgroundColor: "rgba(255,250,241,0.9)", borderColor: `${C.beige}66`, boxShadow: "0 18px 44px rgba(61,43,31,0.08)" }}>
                <h2 className="mb-7 font-bold" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "clamp(1.6rem, 3vw, 2rem)" }}>
                  Síguenos
                </h2>
                <div className="flex flex-wrap items-center gap-7">
                  {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                    <span key={index} className="grid h-9 w-9 place-items-center rounded-full" style={{ color: C.olive }} aria-hidden="true">
                      <Icon className="h-8 w-8" />
                    </span>
                  ))}
                </div>
                <p className="mt-5 text-sm font-medium" style={{ color: C.inkMuted }}>@origen</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;
