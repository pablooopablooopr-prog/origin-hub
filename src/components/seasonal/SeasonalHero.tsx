import { Link } from "react-router-dom";
import { Leaf, User, Calendar, BadgeCheck } from "lucide-react";
import type { SeasonData } from "@/config/seasons";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paperWarm: "#f0e6d3",
};

const HERO_IMG: Record<string, string> = {
  queso: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1100&q=90",
  vino:  "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1100&q=90",
  caza:  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=90",
  mielAceite: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1100&q=90",
};

interface Props { data: SeasonData; }

const SeasonalHero = ({ data }: Props) => {
  const heroImg = HERO_IMG[data.id] ?? HERO_IMG.queso;
  const titleProduct = data.id === "queso" ? "Queso Manchego" : data.productName;
  const sealTop    = data.months[0]?.slice(0, 3) ?? "MAR";
  const sealBottom = data.months[data.months.length - 1]?.slice(0, 3) ?? "JUN";

  const features = [
    { icon: Leaf,       title: "Sabor de la estación",           text: "El pasto fresco aporta matices únicos y naturales." },
    { icon: User,       title: "Productores locales",            text: "Apoyamos a quienes mantienen viva la tradición." },
    { icon: Calendar,   title: "Disponible por tiempo limitado", text: `Aprovecha lo mejor de la temporada hasta ${data.months[data.months.length-1]?.charAt(0).toUpperCase() + data.months[data.months.length-1]?.slice(1).toLowerCase() ?? "junio"}.` },
    { icon: BadgeCheck, title: "Calidad certificada",            text: "Productos artesanales con origen y trazabilidad real." },
  ];

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: C.paperWarm }}>

      {/* ─── SPLIT HERO ─── */}
      <div className="relative flex flex-col lg:flex-row" style={{ minHeight: "520px" }}>

        {/* ── IZQUIERDA: texto sobre fondo crema ── */}
        <div
          className="relative z-10 flex flex-col justify-center px-8 md:px-12 lg:px-16 py-14 lg:py-16"
          style={{ flex: "0 0 50%", maxWidth: "50%", backgroundColor: C.paperWarm }}
        >
          {/* Textura papel sutil */}
          <div className="absolute inset-0 pointer-events-none opacity-40"
            style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(184,134,11,0.07) 0%, transparent 30%)" }}
            aria-hidden="true" />

          <p className="relative text-[12px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: C.olive }}>
            Temporada actual
          </p>

          <h1
            className="relative font-bold leading-[1.02] tracking-tight mb-6"
            style={{
              color: C.brown,
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(2.6rem, 2rem + 2.8vw, 4.5rem)",
            }}
          >
            La Temporada del<br />{titleProduct}
          </h1>

          <p
            className="relative mb-8 leading-relaxed"
            style={{ color: "#5a4a38", fontSize: "clamp(1.05rem, 0.95rem + 0.3vw, 1.18rem)", maxWidth: "440px" }}
          >
            De {data.months[0]?.charAt(0).toUpperCase() + data.months[0]?.slice(1).toLowerCase() ?? "marzo"} a {data.months[data.months.length-1]?.charAt(0).toUpperCase() + data.months[data.months.length-1]?.slice(1).toLowerCase() ?? "mayo"}, el {data.id === "queso" ? "queso manchego" : data.productName.toLowerCase()} alcanza su mejor momento. Un sabor intenso que nace del pasto fresco y de una tradición que se mantiene viva.
          </p>

          <div className="relative flex flex-wrap gap-4">
            <Link to={data.ctas.primary.href}>
              <button
                className="px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ backgroundColor: C.olive, color: C.cream }}
              >
                Descubrir productos de temporada
              </button>
            </Link>
            <Link to="/rutas">
              <button
                className="px-7 py-3.5 rounded-xl text-[15px] font-semibold transition-all hover:bg-white/60"
                style={{ border: `1.5px solid ${C.beige}`, color: C.brown, backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                Ver experiencias
              </button>
            </Link>
          </div>
        </div>

        {/* ── DERECHA: foto a sangre, sin tarjeta, sin bordes ── */}
        <div className="relative" style={{ flex: "0 0 50%", maxWidth: "50%", minHeight: "420px" }}>
          <img
            src={heroImg}
            alt={titleProduct}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />

          {/* Gradiente sutil izquierda para fundir con el texto */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(240,230,211,0.35) 0%, transparent 30%)" }}
            aria-hidden="true"
          />

          {/* ── Sello PRODUCTO DE TEMPORADA ── encima de la foto */}
          <div
            className="absolute top-8 left-8 w-[118px] h-[118px] rounded-full flex items-center justify-center z-20"
            style={{
              backgroundColor: "rgba(245,240,232,0.96)",
              border: `1.5px solid ${C.olive}`,
              boxShadow: "0 8px 24px rgba(61,43,31,0.22)",
            }}
          >
            <svg viewBox="0 0 130 130" width="118" height="118">
              <defs>
                <path id="seal-top" d="M 65,65 m -48,0 a 48,48 0 0,1 96,0" />
              </defs>
              <text fill={C.olive} style={{ fontSize: "8.5px", letterSpacing: "0.13em", fontFamily: "serif", fontWeight: 600 }}>
                <textPath href="#seal-top" startOffset="50%" textAnchor="middle">PRODUCTO DE TEMPORADA</textPath>
              </text>
              {/* Laurel inferior */}
              <g stroke={C.olive} strokeWidth="1.1" fill="none" opacity="0.75" transform="translate(65,93)">
                <path d="M-18,0 C-14,-5 -8,-6 -3,-4" />
                <path d="M-14,-1 C-16,-5 -15,-8 -12,-8" />
                <path d="M-9,-3 C-11,-7 -10,-10 -7,-9" />
                <path d="M18,0 C14,-5 8,-6 3,-4" />
                <path d="M14,-1 C16,-5 15,-8 12,-8" />
                <path d="M9,-3 C11,-7 10,-10 7,-9" />
              </g>
              {/* Meses */}
              <text x="65" y="57" textAnchor="middle" fill={C.brown}
                style={{ fontSize: "17px", fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.04em" }}>
                {sealTop}
              </text>
              <line x1="44" y1="65" x2="86" y2="65" stroke={C.olive} strokeWidth="1" />
              <text x="65" y="83" textAnchor="middle" fill={C.brown}
                style={{ fontSize: "17px", fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.04em" }}>
                {sealBottom}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* ── FRANJA BENEFICIOS ── */}
      <div className="relative px-6 md:px-10 py-7" style={{ backgroundColor: "rgba(255,253,248,0.85)", borderTop: `1px solid ${C.beige}55` }}>
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-3.5 relative">
                {i > 0 && (
                  <span className="hidden lg:block absolute -left-2 top-1 bottom-1 w-px" style={{ backgroundColor: `${C.beige}77` }} aria-hidden="true" />
                )}
                <Icon size={30} strokeWidth={1.4} style={{ color: C.brown, flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h3 className="font-bold mb-1 leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>
                    {f.title}
                  </h3>
                  <p className="text-[13px] leading-snug" style={{ color: "#7a6a52" }}>{f.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default SeasonalHero;
