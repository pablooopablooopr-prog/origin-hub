import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, HandHeart, Heart, Leaf, Mountain, Scale, Sprout } from "lucide-react";

const SERIF = "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
const C = {
  cream: "#F4EDE1",
  paper: "#FBF5EA",
  card: "rgba(255, 250, 241, 0.62)",
  brown: "#2F2118",
  brownSoft: "#5F4A36",
  olive: "#4F5D2A",
  gold: "#A9782B",
  line: "rgba(169, 120, 43, 0.34)",
};

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const SectionLabel = ({ children, align = "center" }: { children: string; align?: "left" | "center" }) => (
  <div className={`mb-8 flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
    {align === "center" && <span className="h-px w-12" style={{ backgroundColor: C.line }} aria-hidden="true" />}
    <span className="text-[12px] font-bold uppercase tracking-[0.32em]" style={{ color: C.gold }}>
      {children}
    </span>
    <span className="h-px w-12" style={{ backgroundColor: C.line }} aria-hidden="true" />
  </div>
);

const timeline = [
  {
    year: "2024",
    title: "Nacimiento de ORIGEN",
    text: "Iniciamos la misión de conectar consumidores con la autenticidad del territorio y sus productos.",
    icon: Sprout,
  },
  {
    year: "2025",
    title: "Expansión nacional",
    text: "Crecemos e integramos a más de 50 negocios verificados en toda España.",
    icon: Mountain,
  },
  {
    year: "Futuro",
    title: "Preservando tradiciones",
    text: "Seguimos construyendo un movimiento que pone en valor lo auténtico y protege nuestras raíces.",
    icon: HandHeart,
  },
];

const values = [
  {
    icon: Heart,
    title: "Autenticidad",
    text: "Negocios verificados que mantienen tradiciones ancestrales y procesos artesanales genuinos.",
  },
  {
    icon: Leaf,
    title: "Sostenibilidad",
    text: "Compromiso con prácticas responsables que respetan el medio ambiente y las comunidades locales.",
  },
  {
    icon: Scale,
    title: "Comercio Justo",
    text: "Precios justos para productores y transparencia total en toda la cadena de valor.",
  },
];

const SobreOrigen = () => {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: C.cream, color: C.brown }}>
      <Header />

      <main>
        <section className="relative overflow-hidden border-b" style={{ borderColor: "rgba(95,74,54,0.08)", backgroundColor: C.paper }}>
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: "url('/textures/adobe-wall.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block" aria-hidden="true">
            <img
              src="/lovable-uploads/historia-hero-reference.png"
              alt=""
              className="h-full w-full object-cover"
              loading="eager"
              style={{
                filter: "saturate(0.96) contrast(0.98)",
                WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 100%)",
                maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 100%)",
              }}
            />
          </div>

          <div className={`${pageShell} relative z-10 flex min-h-[520px] flex-col items-start justify-center py-12 lg:py-16`}>
            <div className="relative z-10 max-w-xl">
              <SectionLabel align="left">Nuestra historia</SectionLabel>
              <h1
                className="text-balance font-bold italic leading-[1.05]"
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(2.75rem, 5vw, 4.45rem)",
                  letterSpacing: "0",
                }}
              >
                Donde todo
                <br />
                tiene su origen
              </h1>

              <div className="my-8 flex items-center gap-7" aria-hidden="true">
                <span className="h-px w-32" style={{ backgroundColor: C.olive }} />
                <Leaf className="h-6 w-6" style={{ color: C.olive }} />
              </div>

              <p className="max-w-[520px] text-[17px] leading-[1.8]" style={{ color: "#221914" }}>
                ORIGEN nace para dar visibilidad a quienes producen, cocinan y cuidan el territorio. Conectamos lo auténtico con quienes lo valoran, preservando tradiciones y construyendo un futuro más justo y sostenible.
              </p>

              <Button asChild className="mt-8 h-12 px-7 shadow-md" style={{ backgroundColor: C.olive, color: C.paper }}>
                <a href="#mision">Conoce nuestra misión</a>
              </Button>
            </div>
            <img
              src="/lovable-uploads/historia-hero-reference.png"
              alt="Camino rural al atardecer con señales de territorio, tradición y futuro"
              className="mt-10 block min-h-[260px] w-full object-cover md:hidden"
              loading="eager"
            />
          </div>
        </section>

        <section className="py-10 md:py-12" style={{ backgroundColor: C.paper }}>
          <div className={pageShell}>
            <SectionLabel>Nuestro recorrido</SectionLabel>

            <div className="relative grid gap-7 md:grid-cols-3">
              <div className="pointer-events-none absolute left-4 right-4 top-0 hidden h-px md:block" style={{ backgroundColor: C.line }} aria-hidden="true" />
              {timeline.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article key={item.year} className="relative rounded-lg border px-7 pb-7 pt-8 text-center" style={{ backgroundColor: C.card, borderColor: C.line }}>
                    <span className="absolute left-1/2 top-0 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:block" style={{ backgroundColor: index === 2 ? "#D8C49C" : "#8C894B" }} aria-hidden="true" />
                    <span className="inline-flex rounded-md px-3 py-1 text-sm font-bold text-white" style={{ backgroundColor: C.olive }}>
                      {item.year}
                    </span>
                    <h2 className="mt-5 font-bold" style={{ fontFamily: SERIF, fontSize: "1.32rem" }}>
                      {item.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-[260px] text-[15px] leading-[1.65]" style={{ color: "#231916" }}>
                      {item.text}
                    </p>
                    <Icon className="mx-auto mt-7 h-12 w-12 stroke-[1.35]" style={{ color: C.gold }} />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="mision" className="py-8 md:py-12" style={{ backgroundColor: C.paper }}>
          <div className={`${pageShell} grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center`}>
            <h2 className="max-w-md font-bold leading-[1.12]" style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3.4vw, 2.75rem)" }}>
              Conectar lo auténtico
              <br />
              con quienes lo valoran
            </h2>
            <div>
              <SectionLabel>Nuestra misión</SectionLabel>
              <p className="text-[16px] leading-[1.85]" style={{ color: "#231916" }}>
                En ORIGEN sabemos que cada producto tiene una historia que merece ser contada. Nuestra misión es conectar a consumidores conscientes con negocios auténticos que mantienen vivas las tradiciones, preservando técnicas artesanales y valores como la sostenibilidad y el comercio justo.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-12" style={{ backgroundColor: C.paper }}>
          <div className={pageShell}>
            <SectionLabel>Nuestros valores</SectionLabel>
            <div className="grid gap-6 md:grid-cols-3">
              {values.map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="rounded-lg border px-8 py-8 text-center" style={{ backgroundColor: C.card, borderColor: C.line }}>
                    <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full" style={{ backgroundColor: "rgba(169,120,43,0.15)" }}>
                      <Icon className="h-8 w-8 stroke-[1.7]" style={{ color: C.gold }} />
                    </div>
                    <h2 className="font-bold" style={{ fontFamily: SERIF, fontSize: "1.45rem" }}>
                      {item.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-[280px] text-[15px] leading-[1.65]" style={{ color: "#231916" }}>
                      {item.text}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden" style={{ backgroundColor: "#41511F" }}>
          <div
            className="absolute inset-y-0 right-0 hidden w-[55%] md:block"
            style={{
              backgroundImage: "linear-gradient(90deg, #41511F 0%, rgba(65,81,31,0.7) 12%, rgba(65,81,31,0.12) 34%), url('/lovable-uploads/historia-cta-reference.png')",
              backgroundSize: "cover",
              backgroundPosition: "center right",
            }}
            aria-hidden="true"
          />
          <div className={`${pageShell} relative z-10 py-9 md:py-11`}>
            <div className="max-w-md">
              <h2 className="font-bold text-[#FBF5EA]" style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3.6vw, 2.8rem)" }}>
                Únete al movimiento
              </h2>
              <p className="mt-3 text-[16px] leading-[1.65] text-[#FBF5EA]/90">
                Forma parte de nuestra comunidad de negocios auténticos y consumidores conscientes.
              </p>
              <Button asChild className="mt-7 h-11 bg-[#FBF5EA] px-7 text-[#2F2118] hover:bg-[#F4EDE1]">
                <Link to="/soy-empresa">
                  Quiero formar parte
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SobreOrigen;
