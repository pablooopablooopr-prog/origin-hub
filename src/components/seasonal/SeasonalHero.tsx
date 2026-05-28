import { Link } from "react-router-dom";
import { Leaf, User, Calendar, BadgeCheck } from "lucide-react";
import type { SeasonData } from "@/config/seasons";

// Paleta del brief
const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paperWarm: "#efe6d3",
};

// Imagen hero por temporada (asset reemplazable) — TODO replace asset
const HERO_IMG: Record<string, string> = {
  queso: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1100&q=90",
  vino: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1100&q=90",
  caza: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=90",
  mielAceite: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1100&q=90",
};

interface Props { data: SeasonData; }

const SeasonalHero = ({ data }: Props) => {
  const heroImg = HERO_IMG[data.id] ?? HERO_IMG.queso;

  // Título: "La Temporada del Queso Manchego"
  const titleMain = "La Temporada del";
  const titleProduct = data.id === "queso" ? "Queso Manchego" : data.productName;

  // Meses abreviados para el sello (MAR / JUN)
  const sealTop = data.months[0]?.slice(0, 3) ?? "MAR";
  const sealBottom = data.months[data.months.length - 1]?.slice(0, 3) ?? "JUN";

  const features = [
    { icon: Leaf, title: "Sabor de la estación", text: "El pasto fresco aporta matices únicos y naturales." },
    { icon: User, title: "Productores locales", text: "Apoyamos a quienes mantienen viva la tradición." },
    { icon: Calendar, title: "Disponible por tiempo limitado", text: `Aprovecha lo mejor de la temporada hasta ${data.months[data.months.length-1]?.toLowerCase() ?? "junio"}.` },
    { icon: BadgeCheck, title: "Calidad certificada", text: "Productos artesanales con origen y trazabilidad real." },
  ];

  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: C.cream }}>
      {/* Textura papel sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(200,160,90,0.10) 0%, transparent 32%), radial-gradient(circle at 82% 70%, rgba(160,120,60,0.10) 0%, transparent 36%)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-[1280px] mx-auto px-6 pt-12 md:pt-16 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ── IZQUIERDA: texto ── */}
          <div className="relative z-10">
            <p className="text-[12px] font-bold uppercase tracking-[0.3em] mb-5" style={{ color: C.olive }}>
              Temporada actual
            </p>

            <h1
              className="font-bold leading-[1.04] tracking-tight mb-6"
              style={{
                color: C.brown,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(2.4rem, 1.5rem + 3.5vw, 4.2rem)",
              }}
            >
              {titleMain}<br />{titleProduct}
            </h1>

            <p
              className="mb-8 leading-relaxed"
              style={{ color: "#5a4a38", fontSize: "clamp(1.05rem, 0.95rem + 0.4vw, 1.2rem)", maxWidth: "500px" }}
            >
              De {data.months[0]?.toLowerCase()} a {data.months[data.months.length-1]?.toLowerCase()}, el {data.id === "queso" ? "queso manchego" : data.productName.toLowerCase()} alcanza su mejor momento. Un sabor intenso que nace del pasto fresco y de una tradición que se mantiene viva.
            </p>

            <div className="flex flex-wrap gap-4">
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
                  style={{ border: `1.5px solid ${C.beige}`, color: C.brown, backgroundColor: "transparent" }}
                >
                  Ver experiencias
                </button>
              </Link>
            </div>
          </div>

          {/* ── DERECHA: imagen + sello ── */}
          <div className="relative">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "4/3.4", boxShadow: "0 24px 60px -16px rgba(61,43,31,0.4)" }}
            >
              <img src={heroImg} alt={titleProduct} className="w-full h-full object-cover" loading="eager" />
            </div>

            {/* Sello PRODUCTO DE TEMPORADA */}
            <div
              className="absolute -top-5 left-6 lg:-left-5 w-[124px] h-[124px] rounded-full flex items-center justify-center"
              style={{
                background: C.cream,
                border: `1.5px solid ${C.olive}`,
                boxShadow: "0 8px 20px rgba(61,43,31,0.18)",
              }}
            >
              <svg viewBox="0 0 130 130" width="124" height="124">
                <defs>
                  <path id="seal-top" d="M 65,65 m -48,0 a 48,48 0 0,1 96,0" />
                  <path id="seal-bot" d="M 65,65 m -48,0 a 48,48 0 1,0 96,0" />
                </defs>
                <text fill={C.olive} style={{ fontSize: "8.5px", letterSpacing: "0.14em", fontFamily: "serif", fontWeight: 600 }}>
                  <textPath href="#seal-top" startOffset="50%" textAnchor="middle">PRODUCTO DE TEMPORADA</textPath>
                </text>
                {/* Laurel inferior */}
                <g transform="translate(65,92)" stroke={C.olive} strokeWidth="1" fill="none" opacity="0.8">
                  <path d="M-16,0 C-12,-5 -6,-6 -2,-4" />
                  <path d="M-13,-1 C-15,-4 -14,-7 -11,-7" />
                  <path d="M-9,-3 C-11,-6 -10,-9 -7,-8" />
                  <path d="M16,0 C12,-5 6,-6 2,-4" />
                  <path d="M13,-1 C15,-4 14,-7 11,-7" />
                  <path d="M9,-3 C11,-6 10,-9 7,-8" />
                </g>
                {/* Meses */}
                <text x="65" y="56" textAnchor="middle" fill={C.brown} style={{ fontSize: "16px", fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.05em" }}>{sealTop}</text>
                <line x1="46" y1="63" x2="84" y2="63" stroke={C.olive} strokeWidth="1" />
                <text x="65" y="80" textAnchor="middle" fill={C.brown} style={{ fontSize: "16px", fontFamily: "'Playfair Display', serif", fontWeight: 700, letterSpacing: "0.05em" }}>{sealBottom}</text>
              </svg>
            </div>
          </div>
        </div>

        {/* ── FRANJA DE BENEFICIOS ── */}
        <div
          className="relative z-10 mt-10 md:mt-12 rounded-2xl px-6 md:px-10 py-7"
          style={{ backgroundColor: "rgba(255,253,248,0.7)", border: `1px solid ${C.beige}55`, boxShadow: "0 4px 20px rgba(61,43,31,0.06)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-3.5 relative">
                  {i > 0 && <span className="hidden lg:block absolute -left-2 top-1 bottom-1 w-px" style={{ backgroundColor: `${C.beige}77` }} aria-hidden="true" />}
                  <Icon size={30} strokeWidth={1.4} style={{ color: C.brown, flexShrink: 0 }} />
                  <div>
                    <h3 className="font-bold mb-1 leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>{f.title}</h3>
                    <p className="text-[13px] leading-snug" style={{ color: "#7a6a52" }}>{f.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-12 md:h-16" />
      </div>
    </section>
  );
};

export default SeasonalHero;
