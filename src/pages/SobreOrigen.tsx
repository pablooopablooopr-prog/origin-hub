import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Leaf, Scale, MapPin, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";

const SERIF = "'Playfair Display', 'Cormorant Garamond', Georgia, serif";
const GOLD = "#b8923f";
const BROWN = "#2a1c10";
const BROWN_MID = "#5a3e20";
const CARD_BG = "rgba(245,238,218,0.88)";
const CARD_INNER = "rgba(245,235,210,0.90)";
const CARD_BORDER = "1px solid rgba(180,140,80,0.3)";

const Eyebrow = ({ label }: { label: string }) => (
  <div className="flex items-center justify-center gap-3 mb-4">
    <span className="block h-px w-10" style={{ backgroundColor: GOLD }} aria-hidden="true" />
    <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>{label}</span>
    <span className="block h-px w-10" style={{ backgroundColor: GOLD }} aria-hidden="true" />
  </div>
);

const SobreOrigen = () => {
  const values = [
    { icon: Heart, title: "Autenticidad", description: "Negocios verificados que mantienen tradiciones ancestrales y procesos artesanales genuinos." },
    { icon: Leaf, title: "Sostenibilidad", description: "Compromiso con prácticas responsables que respetan el medio ambiente y las comunidades locales." },
    { icon: Scale, title: "Comercio Justo", description: "Precios justos para productores y transparencia total en toda la cadena de valor." },
  ];
  const howItWorks = [
    { icon: MapPin, title: "Explora negocios", description: "Descubre negocios auténticos verificados por ORIGEN en toda España." },
    { icon: Package, title: "Descubre experiencias", description: "Elige selecciones curadas o crea experiencias personalizadas para explorar." },
    { icon: Users, title: "Apoya la economía local", description: "Cada compra fortalece a pequeños productores y preserva tradiciones." },
  ];
  const timeline = [
    { year: "2024", title: "Nacimiento de ORIGEN", description: "Iniciamos la misión de conectar consumidores con la autenticidad." },
    { year: "2025", title: "Expansión nacional", description: "Crecimos a más de 50 negocios verificados en toda España." },
    { year: "Futuro", title: "Preservando tradiciones", description: "Continuamos nuestra misión de preservar lo tradicional y auténtico." },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('/textures/adobe-wall.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="flex-1">

        {/* HERO */}
        <section className="pt-3 pb-10" style={{ background: "rgba(230,210,170,0.75)" }}>
          <div className="container text-center max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center gap-3 mb-3 mt-3">
              <span className="block h-px w-10" style={{ backgroundColor: GOLD }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>Historia</span>
              <span className="block h-px w-10" style={{ backgroundColor: GOLD }} aria-hidden="true" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-5 flex items-center justify-center flex-wrap tracking-tight" style={{ fontFamily: SERIF, color: BROWN }}>
              <span>S</span>
              <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-12 h-12 md:w-16 md:h-16 object-contain mx-1" />
              <span>bre ORIGEN</span>
            </h1>
            <p className="max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: SERIF, color: BROWN_MID, fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
              Creemos en una España viva, conectada a su tierra, a sus oficios y a las personas que la sostienen. ORIGEN nace para dar visibilidad a quienes producen, cocinan y cuidan el territorio.
            </p>
          </div>
        </section>

        {/* MISIÓN */}
        <section className="py-14 px-6" style={{ background: CARD_BG, backdropFilter: "blur(2px)" }}>
          <div className="container max-w-4xl mx-auto text-center">
            <Eyebrow label="Nuestra Misión" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: SERIF, color: BROWN }}>Conectar lo auténtico con quienes lo valoran</h2>
            <p className="text-lg leading-relaxed" style={{ fontFamily: SERIF, color: BROWN_MID }}>
              En ORIGEN sabemos que cada producto tiene una historia que merece ser contada. Nuestra misión es conectar a consumidores conscientes con negocios auténticos que mantienen vivas las tradiciones, preservando técnicas artesanales y valores como la sostenibilidad y el comercio justo.
            </p>
          </div>
        </section>

        {/* HISTORIA */}
        <section className="py-14 px-6" style={{ background: "rgba(240,228,200,0.78)" }}>
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Nuestra Historia" />
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: BROWN }}>El camino de ORIGEN</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              {timeline.map((step, i) => (
                <div key={i} className="flex-1 p-6 rounded-xl text-center" style={{ background: CARD_INNER, border: CARD_BORDER }}>
                  <div className="w-12 h-1 mx-auto mb-4 rounded" style={{ background: GOLD }} />
                  <div className="text-2xl font-bold mb-2" style={{ fontFamily: SERIF, color: GOLD }}>{step.year}</div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: SERIF, color: BROWN }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: BROWN_MID }}>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="py-14 px-6" style={{ background: CARD_BG }}>
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Cómo Funciona" />
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: BROWN }}>Así trabaja ORIGEN</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="p-6 rounded-xl text-center" style={{ background: CARD_INNER, border: CARD_BORDER }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(180,140,60,0.15)" }}>
                    <item.icon className="w-8 h-8" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: SERIF, color: BROWN }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: BROWN_MID }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALORES */}
        <section className="py-14 px-6" style={{ background: "rgba(240,228,200,0.78)" }}>
          <div className="container max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <Eyebrow label="Nuestros Valores" />
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: SERIF, color: BROWN }}>Lo que nos define</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className="p-6 rounded-xl text-center" style={{ background: CARD_INNER, border: CARD_BORDER }}>
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(180,140,60,0.15)" }}>
                    <v.icon className="w-8 h-8" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: SERIF, color: BROWN }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: BROWN_MID }}>{v.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 text-center" style={{ background: CARD_BG }}>
          <div className="container max-w-2xl mx-auto">
            <Eyebrow label="Únete" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: SERIF, color: BROWN }}>¿Tu negocio es ORIGEN?</h2>
            <p className="mb-8 leading-relaxed" style={{ color: BROWN_MID, fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>Forma parte de nuestra comunidad de negocios auténticos</p>
            <Button asChild size="lg" style={{ backgroundColor: "#5c6b2e", color: "#f2e4c0" }}>
              <Link to="/soy-empresa">Unirse como Empresa</Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default SobreOrigen;
