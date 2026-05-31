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
  month ? month.toLocaleLowerCase("es-ES") : fallback;

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
    { icon: BadgeCheck, title: "Calidad certificada", text: "Productores artesanales con origen y trazabilidad real." },
  ];

  return (
    <section
      className="relative w-full overflow-hidden md:h-[calc(100svh-68px)] md:min-h-[800px] md:max-h-[960px]"
      style={{
        backgroundColor: C.paperWarm,
        backgroundImage: "url('/textures/map-bg.jpg')",
        backgroundSize: "cover",
      }}
    >
      <div className="relative min-h-[690px] md:h-[84%] md:min-h-0">
        <div className="absolute right-0 top-0 hidden h-[74%] w-[57%] md:block" aria-hidden="true">
          <img src={heroImg} alt="" className="h-full w-full object-cover object-center" style={{ objectPosition: "right center" }} loading="eager" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(239,227,202,0.98) 0%, rgba(239,227,202,0.62) 17%, rgba(239,227,202,0.14) 38%, rgba(239,227,202,0.02) 74%)",
            }}
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{
            background:
              "radial-gradient(circle at 17% 18%, rgba(184,134,11,0.08) 0%, transparent 28%), radial-gradient(circle at 62% 12%, rgba(255,255,255,0.26) 0%, transparent 26%)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute left-[61.5%] top-[4.5%] z-20 hidden h-[150px] w-[150px] items-center justify-center rounded-full md:flex"
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

        <div className="relative z-10 mx-auto flex min-h-[690px] max-w-none flex-col px-6 pb-12 pt-20 sm:px-8 md:h-full md:min-h-0 md:px-[clamp(38px,3.25vw,52px)] md:pb-0 md:pt-[clamp(76px,9.2vh,96px)]">
          <div className="max-w-[690px] md:max-w-[670px]">
            <p className="mb-6 text-[12px] font-bold uppercase tracking-[0.13em] sm:text-[14px] md:text-[17px]" style={{ color: C.inkSoft }}>
              Temporada actual
            </p>

            <h1
              className="mb-8 font-bold leading-[0.95]"
              style={{
                color: C.brown,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(3.15rem, 4.9vw, 5.35rem)",
                letterSpacing: "0",
              }}
            >
              La Temporada del<br />{titleProduct}
            </h1>

            <p
              className="mb-9 max-w-[590px] leading-[1.38]"
              style={{ color: "#2f251a", fontSize: "clamp(1rem, 1.32vw, 1.35rem)" }}
            >
              <span className="block">
                De {seasonStart} a {seasonEnd}, el {data.id === "queso" ? "queso manchego" : data.productName.toLowerCase()} alcanza su mejor momento.
              </span>
              <span className="block">
                Un sabor intenso que hace del pasto fresco y de una tradición que se mantiene viva.
              </span>
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/empresas" className="inline-flex">
                <button
                  className="min-h-[58px] w-full rounded-lg px-6 py-4 text-[15px] font-semibold transition-all hover:opacity-95 sm:w-auto md:px-7 md:text-[18px]"
                  style={{ backgroundColor: C.olive, color: C.cream, boxShadow: "0 12px 26px rgba(92,107,46,0.22)" }}
                >
                  Descubrir productores de temporada
                </button>
              </Link>
              <Link to="/rutas" className="inline-flex">
                <button
                  className="min-h-[58px] w-full rounded-lg px-8 py-4 text-[15px] font-semibold transition-all hover:bg-white/45 sm:w-auto md:px-10 md:text-[18px]"
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
            className="relative z-20 mt-10 grid grid-cols-1 gap-6 rounded-[18px] px-7 py-8 shadow-[0_16px_32px_rgba(61,43,31,0.13)] sm:grid-cols-2 md:absolute md:bottom-[16px] md:left-[clamp(38px,3.25vw,52px)] md:right-[clamp(38px,3.25vw,52px)] md:mt-0 md:min-h-[170px] md:items-center lg:grid-cols-4 lg:gap-0 lg:px-9"
            style={{
              backgroundColor: "rgba(255,252,246,0.88)",
              border: "1px solid rgba(200,184,154,0.5)",
              backdropFilter: "blur(6px)",
            }}
          >
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="relative flex items-start gap-5 lg:px-7">
                  {i > 0 && (
                    <span className="absolute left-0 top-2 hidden h-[90px] w-px lg:block" style={{ backgroundColor: `${C.beige}99` }} aria-hidden="true" />
                  )}
                  <Icon size={46} strokeWidth={1.25} style={{ color: C.brown, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <h3 className="mb-2 font-bold leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "18px" }}>
                      {f.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "#5d4b37" }}>
                      {f.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative w-full md:h-[16%]">
        <div
          className="relative flex w-full items-center"
          style={{
            minHeight: "126px",
            height: "100%",
            backgroundImage: "url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center 58%",
          }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(92,68,35,0.46)" }} aria-hidden="true" />
          <div className="absolute inset-0 opacity-55 mix-blend-screen" style={{ background: "linear-gradient(180deg, rgba(178,142,82,0.25), rgba(78,52,24,0.04))" }} aria-hidden="true" />
          <svg className="absolute left-0 top-0 z-10 h-[32px] w-full -translate-y-px" viewBox="0 0 1440 38" preserveAspectRatio="none" aria-hidden="true">
            <path
              fill={C.paperWarm}
              opacity="0.96"
              d="M0 0H1440V17.5C1415 12.5 1396 22 1373 16C1348 9.5 1325 22 1300 16.8C1276 11.8 1252 19.6 1228 15.2C1203 10.7 1183 21.2 1158 16.1C1133 11 1112 19.8 1087 15.4C1062 11.1 1040 21.5 1016 16.6C991 11.4 969 19.6 944 15.4C919 11.1 898 22.4 873 16.1C849 10.2 826 19.5 801 15.2C776 10.8 755 21.2 730 16.2C706 11.4 684 19.8 659 15.4C634 11.1 613 21.6 588 16.8C563 12.1 542 19.4 517 15.3C492 11.2 471 22.3 446 16.1C421 10.1 399 19.6 374 15.3C349 11 328 21.5 303 16.5C279 11.6 256 19.8 232 15.4C207 10.8 186 22.2 161 16.3C136 10.4 114 19.5 89 15.2C64 10.9 43 21.8 18 16.7C11 15.2 5 14.5 0 15.1V0Z"
            />
          </svg>
          <div className="relative z-10 mx-auto flex w-full max-w-none flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-[clamp(38px,3.25vw,52px)] md:pb-6 md:pt-11">
            <div>
              <p className="font-bold leading-tight" style={{ color: C.cream, fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 2.05vw, 2.15rem)" }}>
                Productores destacados
              </p>
              <p className="mt-1 text-[15px]" style={{ color: "#eadfbd" }}>
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
