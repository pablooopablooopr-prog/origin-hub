import { Link } from "react-router-dom";
import { Leaf, User, Calendar, BadgeCheck, ArrowRight } from "lucide-react";
import type { SeasonData } from "@/config/seasons";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paperWarm: "#efe3ca",
  inkSoft: "#5b4935",
};

const HERO_IMG: Record<string, string> = {
  queso: "/seasons/queso/hero-cheese.jpg",
  vino: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1100&q=90",
  caza: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1100&q=90",
  mielAceite: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1100&q=90",
};

interface Props {
  data: SeasonData;
}

const formatMonth = (month: string | undefined, fallback: string) =>
  month ? month.charAt(0).toUpperCase() + month.slice(1).toLowerCase() : fallback;

const SeasonalHero = ({ data }: Props) => {
  const heroImg = HERO_IMG[data.id] ?? HERO_IMG.queso;
  const titleProduct = data.id === "queso" ? "Queso Manchego" : data.productName;
  const sealTop = data.months[0]?.slice(0, 3) ?? "MAR";
  const sealBottom = data.months[data.months.length - 1]?.slice(0, 3) ?? "JUN";
  const seasonStart = formatMonth(data.months[0], "marzo");
  const seasonEnd = formatMonth(data.months[data.months.length - 1], "junio");
  const sealPathId = `seal-top-${data.id}`;

  const features = [
    { icon: Leaf, title: "Sabor de la estación", text: "El pasto fresco aporta matices únicos y naturales." },
    { icon: User, title: "Productores locales", text: "Apoyamos a quienes mantienen viva la tradición." },
    { icon: Calendar, title: "Disponible por tiempo limitado", text: `Aprovecha lo mejor de la temporada hasta ${seasonEnd}.` },
    { icon: BadgeCheck, title: "Calidad certificada", text: "Productos artesanales con origen y trazabilidad real." },
  ];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: C.paperWarm,
        backgroundImage: "url('/textures/seasonal-wall-bg.jpg')",
        backgroundSize: "760px auto",
      }}
    >
      <div className="relative min-h-[720px] md:min-h-[760px]">
        <div className="absolute inset-y-0 right-0 hidden w-[58%] md:block" aria-hidden="true">
          <img src={heroImg} alt="" className="h-full w-full object-cover object-center" loading="eager" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(239,227,202,0.98) 0%, rgba(239,227,202,0.82) 17%, rgba(239,227,202,0.25) 42%, rgba(239,227,202,0.02) 74%)",
            }}
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background:
              "radial-gradient(circle at 17% 18%, rgba(184,134,11,0.13) 0%, transparent 29%), radial-gradient(circle at 65% 12%, rgba(255,255,255,0.36) 0%, transparent 28%)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute left-[60%] top-10 z-20 hidden h-[142px] w-[142px] items-center justify-center rounded-full md:flex"
          style={{
            border: `1.5px solid ${C.brown}`,
            backgroundColor: "rgba(245,240,232,0.16)",
            boxShadow: "0 14px 34px rgba(61,43,31,0.08)",
          }}
        >
          <svg viewBox="0 0 130 130" width="132" height="132" aria-hidden="true">
            <defs>
              <path id={sealPathId} d="M 65,65 m -48,0 a 48,48 0 0,1 96,0" />
            </defs>
            <text
              fill={C.brown}
              style={{
                fontSize: "8.8px",
                letterSpacing: "0.13em",
                fontFamily: "serif",
                fontWeight: 600,
              }}
            >
              <textPath href={`#${sealPathId}`} startOffset="50%" textAnchor="middle">
                PRODUCTO DE TEMPORADA
              </textPath>
            </text>
            <g stroke={C.olive} strokeWidth="1.15" fill="none" opacity="0.8" transform="translate(65,93)">
              <path d="M-21,0 C-17,-6 -9,-8 -3,-5" />
              <path d="M-17,-1 C-19,-6 -18,-10 -14,-10" />
              <path d="M-11,-4 C-13,-9 -11,-13 -7,-12" />
              <path d="M21,0 C17,-6 9,-8 3,-5" />
              <path d="M17,-1 C19,-6 18,-10 14,-10" />
              <path d="M11,-4 C13,-9 11,-13 7,-12" />
            </g>
            <text
              x="65"
              y="56"
              textAnchor="middle"
              fill={C.brown}
              style={{
                fontSize: "18px",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {sealTop}
            </text>
            <line x1="42" y1="65" x2="88" y2="65" stroke={C.brown} strokeWidth="1" />
            <text
              x="65"
              y="84"
              textAnchor="middle"
              fill={C.brown}
              style={{
                fontSize: "18px",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {sealBottom}
            </text>
          </svg>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-[1540px] flex-col px-6 pb-12 pt-20 sm:px-8 md:min-h-[760px] md:px-12 md:pb-0 md:pt-24 lg:px-12">
          <div className="max-w-[690px] md:max-w-[650px]">
            <p className="mb-5 text-[12px] font-bold uppercase tracking-[0.18em] sm:text-[14px]" style={{ color: C.inkSoft }}>
              Temporada actual
            </p>

            <h1
              className="mb-7 font-bold leading-[0.98]"
              style={{
                color: C.brown,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(3.4rem, 8vw, 6.7rem)",
                letterSpacing: "0",
              }}
            >
              La Temporada del<br />{titleProduct}
            </h1>

            <p
              className="mb-10 max-w-[620px] leading-relaxed"
              style={{ color: "#2f251a", fontSize: "clamp(1.04rem, 1.1vw, 1.35rem)" }}
            >
              De {seasonStart} a {seasonEnd}, el {data.id === "queso" ? "queso manchego" : data.productName.toLowerCase()} alcanza su mejor momento. Un sabor intenso que nace del pasto fresco y de una tradición que se mantiene viva.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to={data.ctas.primary.href} className="inline-flex">
                <button
                  className="min-h-[58px] w-full rounded-lg px-7 py-4 text-[15px] font-semibold transition-all hover:opacity-95 sm:w-auto sm:text-[16px]"
                  style={{ backgroundColor: C.olive, color: C.cream, boxShadow: "0 12px 26px rgba(92,107,46,0.22)" }}
                >
                  Descubrir productos de temporada
                </button>
              </Link>
              <Link to="/rutas" className="inline-flex">
                <button
                  className="min-h-[58px] w-full rounded-lg px-8 py-4 text-[15px] font-semibold transition-all hover:bg-white/45 sm:w-auto sm:text-[16px]"
                  style={{
                    border: "1.5px solid rgba(61,43,31,0.48)",
                    color: C.brown,
                    backgroundColor: "rgba(255,255,255,0.18)",
                  }}
                >
                  Ver experiencias
                </button>
              </Link>
            </div>
          </div>

          <div className="relative mt-10 overflow-hidden rounded-[18px] shadow-[0_18px_38px_rgba(61,43,31,0.16)] md:hidden">
            <img src={heroImg} alt={titleProduct} className="h-[320px] w-full object-cover object-center" loading="eager" />
            <div
              className="absolute left-4 top-4 flex h-[104px] w-[104px] items-center justify-center rounded-full"
              style={{
                border: `1px solid ${C.brown}`,
                backgroundColor: "rgba(245,240,232,0.76)",
              }}
            >
              <svg viewBox="0 0 130 130" width="98" height="98" aria-hidden="true">
                <text
                  x="65"
                  y="56"
                  textAnchor="middle"
                  fill={C.brown}
                  style={{
                    fontSize: "19px",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {sealTop}
                </text>
                <line x1="42" y1="65" x2="88" y2="65" stroke={C.brown} strokeWidth="1" />
                <text
                  x="65"
                  y="84"
                  textAnchor="middle"
                  fill={C.brown}
                  style={{
                    fontSize: "19px",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {sealBottom}
                </text>
              </svg>
            </div>
          </div>

          <div
            className="relative z-20 mt-10 grid grid-cols-1 gap-6 rounded-[18px] px-7 py-8 shadow-[0_22px_48px_rgba(61,43,31,0.14)] sm:grid-cols-2 md:mt-auto md:translate-y-1/2 lg:grid-cols-4 lg:gap-0 lg:px-9"
            style={{
              backgroundColor: "rgba(255,252,246,0.9)",
              border: "1px solid rgba(200,184,154,0.5)",
              backdropFilter: "blur(6px)",
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="relative flex items-start gap-5 lg:px-7">
                  {i > 0 && (
                    <span className="absolute left-0 top-2 hidden h-[78px] w-px lg:block" style={{ backgroundColor: `${C.beige}99` }} aria-hidden="true" />
                  )}
                  <Icon size={44} strokeWidth={1.25} style={{ color: C.brown, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h3 className="mb-2 font-bold leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "17px" }}>
                      {f.title}
                    </h3>
                    <p className="text-[14px] leading-relaxed" style={{ color: "#5d4b37" }}>
                      {f.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative w-full md:pt-[86px]">
        <div
          className="relative flex w-full items-center"
          style={{
            minHeight: "138px",
            backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 60%",
            clipPath: `polygon(
              0% 18%, 2% 12%, 3.5% 16%, 5% 8%, 7% 14%, 8.5% 6%, 10% 12%, 12% 4%, 14% 10%, 15.5% 14%, 17% 6%, 19% 12%, 20.5% 8%, 22% 14%, 24% 4%, 26% 10%, 27.5% 16%, 29% 6%, 31% 12%, 33% 8%, 35% 14%, 36.5% 4%, 38% 10%, 40% 16%, 42% 6%, 44% 12%, 45.5% 8%, 47% 14%, 49% 4%, 51% 12%, 53% 8%, 55% 16%, 57% 6%, 59% 12%, 60.5% 4%, 62% 14%, 64% 8%, 66% 12%, 68% 6%, 70% 16%, 72% 8%, 74% 14%, 75.5% 4%, 77% 10%, 79% 16%, 81% 6%, 83% 12%, 85% 8%, 87% 14%, 88.5% 4%, 90% 10%, 92% 16%, 94% 6%, 96% 12%, 98% 8%, 100% 14%,
              100% 84%, 98% 90%, 96% 86%, 94% 94%, 92% 88%, 90% 96%, 88% 90%, 86% 84%, 84% 92%, 82% 88%, 80% 96%, 78% 90%, 76% 84%, 74% 92%, 72% 88%, 70% 96%, 68% 90%, 66% 84%, 64% 92%, 62% 88%, 60% 96%, 58% 90%, 56% 86%, 54% 94%, 52% 88%, 50% 96%, 48% 90%, 46% 84%, 44% 92%, 42% 88%, 40% 96%, 38% 90%, 36% 84%, 34% 92%, 32% 88%, 30% 96%, 28% 90%, 26% 84%, 24% 92%, 22% 88%, 20% 96%, 18% 90%, 16% 86%, 14% 94%, 12% 88%, 10% 96%, 8% 90%, 6% 86%, 4% 94%, 2% 88%, 0% 94%
            )`,
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(42,30,16,0.84)" }} aria-hidden="true" />
          <div className="relative z-10 mx-auto flex w-full max-w-[1540px] flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-12">
            <div>
              <p className="font-bold leading-tight" style={{ color: C.cream, fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.2vw, 2.3rem)" }}>
                Productores destacados
              </p>
              <p className="mt-1 text-[15px]" style={{ color: "#d8c9a7" }}>
                Elegidos para esta temporada
              </p>
            </div>
            <Link to="/empresas" className="group flex flex-shrink-0 items-center gap-2 text-[14px] font-semibold" style={{ color: C.cream }}>
              Ver todos los productores
              <ArrowRight size={15} style={{ color: C.gold }} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalHero;
