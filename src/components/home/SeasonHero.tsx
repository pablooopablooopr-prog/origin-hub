import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCurrentSeasonInfo } from "@/lib/season";

/**
 * SECCIÓN 2 de la home — TEMPORADA ACTIVA · "Atelier Gastronómico".
 *
 * Rediseño completo en formato collage editorial:
 *   - Fondo de madera oscura con vetas
 *   - Tarjeta principal de papel envejecido con sello de cera y cinta
 *   - Polaroids con rotación sutil + leyendas manuscritas
 *   - Sello circular de Castilla–La Mancha + tarjeta de mapa con ramo
 *   - Cinta verde inferior con estadísticas y silueta de pastor
 *
 * El contenido es dinámico por temporada (queso → miel → caza → vino),
 * pero la temporada de referencia visual es QUESO (Marzo · Abril · Mayo).
 *
 * Tipografías cargadas en index.html:
 *   - Playfair Display (display serif para títulos)
 *   - Cormorant Garamond (serif fina para citas)
 *   - Caveat (manuscrita para post-its y polaroids)
 */

interface SeasonTheme {
  conceptIndex: string;
  title: string;
  description: string;
  region: string;
  regionShort: string;
  regionMapDescription: string;
  quote: string;
  heroImage: string;
  heroCaption: string;
  bottomLeftImage: string;
  bottomRightImage: string;
  productorCount: number;
  rutaCount: number;
}

const SEASON_THEMES: Record<string, SeasonTheme> = {
  queso: {
    conceptIndex: "Concepto 4",
    title: "La Temporada\ndel Queso",
    description:
      "Queserías que honran la tradición, restaurantes que lo interpretan con creatividad y rutas que te llevan al origen de todo. Descubre el queso manchego y el sabor auténtico de Castilla–La Mancha en su mejor momento.",
    region: "Castilla–La Mancha",
    regionShort: "CASTILLA–\nLA MANCHA",
    regionMapDescription:
      "Tierra de pastos infinitos, quesos con historia y personas que cuidan cada detalle.",
    quote: "Sabor que nace\nde la tierra y\nse comparte.",
    heroImage:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "Queso Manchego Artesano",
    bottomLeftImage:
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80",
    bottomRightImage:
      "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
    productorCount: 12,
    rutaCount: 3,
  },
  miel: {
    conceptIndex: "Concepto 4",
    title: "La Temporada\nde la Miel",
    description:
      "Apicultores que cuidan colmenas centenarias, almazaras de cosecha temprana y rutas por sierras donde el AOVE y la miel marcan el calendario.",
    region: "Castilla–La Mancha",
    regionShort: "CASTILLA–\nLA MANCHA",
    regionMapDescription:
      "Tierra de jara y romero, panales escondidos y olivares que esperan junio para celebrar la cosecha.",
    quote: "Dulzura que nace\ndel sol y\nde la paciencia.",
    heroImage:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "Miel de Jara y Romero",
    bottomLeftImage:
      "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=600&q=80",
    bottomRightImage:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    productorCount: 9,
    rutaCount: 2,
  },
  caza: {
    conceptIndex: "Concepto 4",
    title: "La Temporada\nde la Caza",
    description:
      "Monterías gestionadas con rigor, rehalas familiares y restaurantes que devuelven a la mesa el venado, el corzo y la perdiz roja en su punto.",
    region: "Castilla–La Mancha",
    regionShort: "CASTILLA–\nLA MANCHA",
    regionMapDescription:
      "Sierras y dehesas inmensas donde la caza mayor y menor sigue siendo oficio, cultura y respeto.",
    quote: "Tradición que vive\nen el monte y\nen la mesa.",
    heroImage:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "Caza Mayor de Cabañeros",
    bottomLeftImage:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    bottomRightImage:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    productorCount: 7,
    rutaCount: 2,
  },
  vino: {
    conceptIndex: "Concepto 4",
    title: "La Temporada\ndel Vino",
    description:
      "Bodegas centenarias en plena vendimia, catas verticales en cuevas familiares y rutas que recorren las cepas de Tempranillo, Airén y Bobal.",
    region: "Castilla–La Mancha",
    regionShort: "CASTILLA–\nLA MANCHA",
    regionMapDescription:
      "El viñedo más grande del mundo, con bodegas que cuentan siglos y enólogos que escriben los próximos.",
    quote: "El tiempo embotellado\nse comparte\ndespacio.",
    heroImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "Vendimia en La Mancha",
    bottomLeftImage:
      "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=600&q=80",
    bottomRightImage:
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80",
    productorCount: 14,
    rutaCount: 4,
  },
};

const SeasonHero = () => {
  const season = getCurrentSeasonInfo();
  const theme = SEASON_THEMES[season.id] ?? SEASON_THEMES.queso;
  const seasonLabelUpper = season.label.toUpperCase();

  return (
    <section
      className="relative overflow-hidden"
      style={{
        // Fondo de madera oscura con vetas verticales sutiles
        background:
          "radial-gradient(ellipse at 20% 0%, #4a2f1c 0%, #3a2516 35%, #2c1c10 70%, #1f140a 100%)",
        backgroundColor: "#3a2516",
      }}
    >
      {/* Vetas de madera (overlay) */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent 0 60px, rgba(0,0,0,0.07) 60px 61px, transparent 61px 140px, rgba(255,255,255,0.02) 140px 142px),
            repeating-linear-gradient(90deg, transparent 0 230px, rgba(0,0,0,0.12) 230px 232px, transparent 232px 480px)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 55%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Header tipo etiqueta de portada */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-6">
        <p
          className="text-[11px] tracking-[0.3em] uppercase font-medium"
          style={{
            color: "#c9b89a",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {theme.conceptIndex} · Atelier Gastronómico
        </p>
      </div>

      {/* GRID PRINCIPAL */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-6 pb-32 grid grid-cols-12 gap-6">
        {/* ============================================== */}
        {/* COLUMNA IZQUIERDA — TARJETA DE PAPEL ENVEJECIDO */}
        {/* ============================================== */}
        <div className="col-span-12 lg:col-span-6 relative">
          <div
            className="relative px-8 md:px-10 py-10 md:py-12 shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, #f7eed8 0%, #f1e5c8 50%, #e9d9b6 100%)",
              boxShadow:
                "0 30px 60px -20px rgba(0,0,0,0.6), 0 10px 20px -5px rgba(0,0,0,0.3), inset 0 0 60px rgba(180, 140, 80, 0.08)",
              clipPath:
                "polygon(0% 1%, 3% 0%, 12% 1.5%, 28% 0.4%, 48% 1.8%, 68% 0%, 88% 1.4%, 100% 0.6%, 99.5% 14%, 100% 32%, 99% 55%, 100% 76%, 99.7% 96%, 96% 100%, 78% 99%, 55% 100%, 30% 99.2%, 8% 100%, 1% 98%, 0.5% 80%, 0% 60%, 0.6% 35%, 0% 18%)",
            }}
          >
            {/* Textura papel manchas tenues */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(150, 100, 50, 0.08) 0%, transparent 25%),
                  radial-gradient(circle at 80% 70%, rgba(120, 80, 40, 0.10) 0%, transparent 30%),
                  radial-gradient(circle at 60% 20%, rgba(160, 120, 70, 0.06) 0%, transparent 20%)
                `,
              }}
            />

            {/* ORIGEN logo */}
            <div className="relative flex items-center gap-2 mb-6">
              <span
                className="text-[22px] font-semibold tracking-[0.18em]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#3d4a2a",
                }}
              >
                ORIGEN
              </span>
              <span
                className="inline-block w-3.5 h-3.5 rounded-full border-[1.5px]"
                style={{ borderColor: "#3d4a2a" }}
              />
            </div>

            {/* Badges */}
            <div className="relative flex flex-wrap items-center gap-2 mb-7">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: "#3d4a2a",
                  color: "#f1e5c8",
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.22em",
                }}
              >
                Temporada activa
                <span
                  className="inline-block w-2 h-2 rounded-full border"
                  style={{ borderColor: "#f1e5c8" }}
                />
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: "#e8dcc0",
                  color: "#3d4a2a",
                  border: "1px solid #c9b89a",
                  fontFamily: "'Cormorant Garamond', serif",
                  letterSpacing: "0.22em",
                }}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full border"
                  style={{ borderColor: "#3d4a2a" }}
                />
                {seasonLabelUpper}
              </span>
            </div>

            {/* Título display */}
            <h1
              className="relative text-[44px] md:text-[60px] leading-[0.95] mb-6"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#2a2418",
                fontWeight: 500,
                whiteSpace: "pre-line",
              }}
            >
              {theme.title}
              {/* sprig botánico decorativo (SVG inline) */}
              <svg
                className="absolute -right-2 top-12 opacity-50"
                width="60"
                height="80"
                viewBox="0 0 60 80"
                fill="none"
              >
                <path
                  d="M30 10 Q28 35 30 70"
                  stroke="#7a6a3a"
                  strokeWidth="0.8"
                  fill="none"
                />
                <ellipse cx="22" cy="22" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="38" cy="28" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="20" cy="38" rx="4.5" ry="2.2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="40" cy="46" rx="4.5" ry="2.2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="22" cy="56" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
              </svg>
            </h1>

            {/* Descripción */}
            <p
              className="relative text-[15px] md:text-[15.5px] leading-[1.65] mb-6 max-w-[480px]"
              style={{
                color: "#3a3326",
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
              }}
            >
              {theme.description}
            </p>

            {/* Meses */}
            <p
              className="relative text-[12px] tracking-[0.35em] uppercase font-semibold mb-3"
              style={{ color: "#3d4a2a", fontFamily: "'Cormorant Garamond', serif" }}
            >
              {season.range.replace(/·/g, "·")}
            </p>

            {/* Cita italica */}
            <p
              className="relative text-[14.5px] italic mb-7 pb-7"
              style={{
                color: "#5a4a30",
                fontFamily: "'Cormorant Garamond', serif",
                borderBottom: "1px dashed #c9b89a",
              }}
            >
              Una plataforma que cambia con el ritmo de la tierra.
            </p>

            {/* CTAs */}
            <div className="relative flex flex-wrap gap-3">
              <Link to="/rutas">
                <button
                  className="group inline-flex items-center gap-3 px-5 py-3 text-[11px] tracking-[0.28em] uppercase font-semibold transition-all hover:translate-y-[-1px]"
                  style={{
                    background: "#3d4a2a",
                    color: "#f1e5c8",
                    fontFamily: "'Cormorant Garamond', serif",
                    boxShadow: "0 4px 0 #2a3320, 0 8px 16px rgba(0,0,0,0.2)",
                  }}
                >
                  Ver rutas de esta estación
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link to="/customer-auth?intent=suscribirme">
                <button
                  className="group inline-flex items-center gap-3 px-5 py-3 text-[11px] tracking-[0.28em] uppercase font-semibold transition-all hover:translate-y-[-1px]"
                  style={{
                    background: "transparent",
                    color: "#8a6f2e",
                    border: "1.5px solid #b8923f",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Unirme al club trimestral · 29€
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* SELLO CIRCULAR CASTILLA-LA MANCHA (debajo del título, sobre la tarjeta) */}
          <div
            className="hidden lg:block absolute -right-4 top-[44%] z-20 -rotate-[8deg]"
            aria-hidden="true"
          >
            <div
              className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center"
              style={{
                border: "1.5px solid #6b5832",
                color: "#6b5832",
                fontFamily: "'Cormorant Garamond', serif",
                background: "transparent",
              }}
            >
              <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full">
                <defs>
                  <path
                    id="circle-castilla"
                    d="M 55,55 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                  />
                </defs>
                <text fill="#6b5832" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
                  <textPath href="#circle-castilla" startOffset="2%">
                    CASTILLA · LA MANCHA · ORIGEN ·
                  </textPath>
                </text>
              </svg>
              {/* Mini ilustración de molino */}
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                <line x1="10" y1="42" x2="40" y2="42" stroke="#6b5832" strokeWidth="0.6" />
                <path d="M18 42 L20 28 L30 28 L32 42 Z" stroke="#6b5832" strokeWidth="0.7" fill="none" />
                <rect x="22" y="34" width="3" height="4" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                <circle cx="25" cy="26" r="1.2" fill="#6b5832" />
                <line x1="25" y1="26" x2="25" y2="14" stroke="#6b5832" strokeWidth="0.6" />
                <line x1="25" y1="26" x2="35" y2="22" stroke="#6b5832" strokeWidth="0.6" />
                <line x1="25" y1="26" x2="15" y2="22" stroke="#6b5832" strokeWidth="0.6" />
                <line x1="25" y1="26" x2="32" y2="34" stroke="#6b5832" strokeWidth="0.6" />
              </svg>
            </div>
          </div>

          {/* Cita manuscrita debajo del sello */}
          <div
            className="hidden lg:block absolute right-2 top-[68%] z-20 rotate-[6deg] max-w-[160px]"
            aria-hidden="true"
          >
            <p
              className="text-[18px] leading-[1.25]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#d9c89a",
                whiteSpace: "pre-line",
              }}
            >
              {theme.quote}
            </p>
          </div>
        </div>

        {/* ============================================== */}
        {/* COLUMNA DERECHA — COLLAGE DE POLAROIDS         */}
        {/* ============================================== */}
        <div className="col-span-12 lg:col-span-6 relative min-h-[560px]">
          {/* Cinta verde que sostiene el sello (decorativa, top-left de la columna) */}
          <div
            className="hidden lg:block absolute -left-6 -top-6 w-12 h-32 z-10 rotate-[-8deg]"
            style={{
              background:
                "linear-gradient(180deg, #5a6b3a 0%, #4a5a2e 50%, #3d4a2a 100%)",
              boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
              clipPath:
                "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)",
            }}
          />

          {/* SELLO DE CERA */}
          <div
            className="hidden lg:flex absolute -left-2 top-4 z-20 w-[88px] h-[88px] rounded-full items-center justify-center text-center -rotate-[10deg]"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, #d4a83a 0%, #b8923f 45%, #8a6f2e 100%)",
              boxShadow:
                "0 6px 14px rgba(0,0,0,0.45), inset -3px -4px 8px rgba(0,0,0,0.3), inset 2px 2px 4px rgba(255,220,140,0.4)",
              border: "1.5px solid #6b5220",
            }}
          >
            <div className="flex flex-col items-center gap-0.5">
              <span
                className="text-[8px] tracking-[0.2em] font-bold uppercase"
                style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}
              >
                Temporada
              </span>
              <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
                <path d="M11 2 L11 12 M7 5 L11 2 L15 5 M5 9 L11 6 L17 9" stroke="#3a2c10" strokeWidth="0.8" />
                <circle cx="11" cy="2" r="0.8" fill="#3a2c10" />
              </svg>
              <span
                className="text-[8px] tracking-[0.2em] font-bold uppercase"
                style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {seasonLabelUpper}
              </span>
            </div>
          </div>

          {/* POLAROID PRINCIPAL — protagonista (queso/cosecha) */}
          <div
            className="absolute top-0 left-[8%] w-[68%] rotate-[1.5deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "10px 10px 44px 10px",
              boxShadow:
                "0 18px 40px -10px rgba(0,0,0,0.55), 0 8px 16px -4px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="aspect-[5/4] w-full overflow-hidden"
              style={{ background: "#3a2516" }}
            >
              <img
                src={theme.heroImage}
                alt={theme.heroCaption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p
              className="absolute bottom-3 left-0 right-0 text-center text-[18px]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#3a3326",
              }}
            >
              {theme.heroCaption}
            </p>
            {/* chinche dorada */}
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #f5d97a 0%, #b8923f 70%, #6b5220 100%)",
                boxShadow: "0 2px 3px rgba(0,0,0,0.5)",
              }}
            />
          </div>

          {/* TARJETA MAPA CASTILLA-LA MANCHA + RAMO DE LAVANDA */}
          <div
            className="absolute -top-2 right-[2%] w-[34%] rotate-[4deg] z-20"
            style={{
              background: "linear-gradient(180deg, #f7eed8 0%, #ead9b4 100%)",
              padding: "16px 14px 18px 14px",
              boxShadow: "0 12px 24px -6px rgba(0,0,0,0.5)",
              clipPath:
                "polygon(0% 2%, 6% 0%, 35% 2%, 70% 0.5%, 95% 2%, 100% 8%, 99% 35%, 100% 65%, 98% 92%, 92% 100%, 60% 99%, 30% 100%, 5% 99%, 1% 95%, 0% 70%, 1% 35%, 0% 8%)",
            }}
          >
            {/* Ramo de lavanda lateral */}
            <svg
              className="absolute -right-2 -top-3 z-30"
              width="60"
              height="100"
              viewBox="0 0 60 100"
            >
              <line x1="20" y1="100" x2="22" y2="20" stroke="#5a6b3a" strokeWidth="1" />
              <line x1="30" y1="100" x2="34" y2="14" stroke="#5a6b3a" strokeWidth="1" />
              <line x1="40" y1="100" x2="44" y2="22" stroke="#5a6b3a" strokeWidth="1" />
              {[14, 18, 22, 26, 30].map((y, i) => (
                <g key={i}>
                  <ellipse cx="22" cy={y + 6} rx="2.2" ry="3" fill="#9d8db5" opacity="0.85" />
                  <ellipse cx="34" cy={y} rx="2.2" ry="3" fill="#8a7aa3" opacity="0.85" />
                  <ellipse cx="44" cy={y + 8} rx="2.2" ry="3" fill="#9d8db5" opacity="0.85" />
                </g>
              ))}
            </svg>

            <p
              className="text-[10px] tracking-[0.2em] uppercase font-bold text-center mb-2"
              style={{
                color: "#3d4a2a",
                fontFamily: "'Cormorant Garamond', serif",
                whiteSpace: "pre-line",
                lineHeight: 1.15,
              }}
            >
              {theme.regionShort}
            </p>

            {/* Mapa silueta de C-LM (forma simplificada) */}
            <svg viewBox="0 0 100 60" className="w-full h-auto mb-2">
              <path
                d="M10 30 Q12 18 22 14 Q35 10 48 12 Q62 8 75 14 Q88 18 90 28 Q92 38 85 46 Q72 52 58 50 Q42 54 28 50 Q15 46 10 36 Z"
                fill="none"
                stroke="#3d4a2a"
                strokeWidth="0.8"
                strokeDasharray="2 1.5"
              />
              <circle cx="48" cy="32" r="3" fill="#3d4a2a" />
            </svg>

            <p
              className="text-[10.5px] leading-[1.4] text-center"
              style={{
                color: "#3a3326",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              {theme.regionMapDescription}
            </p>

            {/* mini ilustración pastor / paisaje */}
            <svg viewBox="0 0 100 30" className="w-full h-auto mt-2 opacity-70">
              <path d="M5 22 Q20 14 35 18 Q55 10 75 16 Q90 12 95 22 L95 26 L5 26 Z" fill="#3d4a2a" opacity="0.25" />
              <circle cx="30" cy="20" r="1.5" fill="#3d4a2a" />
              <circle cx="35" cy="21" r="1.5" fill="#3d4a2a" />
              <circle cx="42" cy="20" r="1.5" fill="#3d4a2a" />
            </svg>
          </div>

          {/* POLAROID inferior izquierda — paisaje/ovejas */}
          <div
            className="absolute bottom-2 left-[2%] w-[38%] rotate-[-4deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "8px 8px 32px 8px",
              boxShadow:
                "0 14px 30px -8px rgba(0,0,0,0.55), 0 6px 12px -3px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="aspect-[4/3] w-full overflow-hidden"
              style={{ background: "#3a2516" }}
            >
              <img
                src={theme.bottomLeftImage}
                alt="Paisaje"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* clip de papel */}
            <span
              className="absolute -top-3 right-4 w-5 h-9 rounded-sm rotate-[15deg]"
              style={{
                background:
                  "linear-gradient(180deg, #d8d4c0 0%, #b8b4a0 50%, #d8d4c0 100%)",
                border: "1px solid #888473",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* POLAROID inferior derecha — productor */}
          <div
            className="absolute bottom-12 right-[5%] w-[36%] rotate-[5deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "8px 8px 32px 8px",
              boxShadow:
                "0 14px 30px -8px rgba(0,0,0,0.55), 0 6px 12px -3px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="aspect-[4/5] w-full overflow-hidden"
              style={{ background: "#3a2516" }}
            >
              <img
                src={theme.bottomRightImage}
                alt="Productor"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* clip dorado */}
            <span
              className="absolute -top-2 left-6 w-4 h-8 rounded-sm rotate-[-10deg]"
              style={{
                background:
                  "linear-gradient(180deg, #e8c66a 0%, #b8923f 50%, #e8c66a 100%)",
                border: "1px solid #6b5220",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.3)",
              }}
            />
          </div>

          {/* POST-IT VERDE "Personas y lugares..." */}
          <div
            className="absolute -right-2 bottom-[6%] w-[140px] rotate-[8deg] z-30 px-3 py-4"
            style={{
              background:
                "linear-gradient(180deg, #5a6b3a 0%, #4a5a2e 100%)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
              clipPath:
                "polygon(0% 4%, 8% 0%, 100% 2%, 98% 100%, 4% 96%)",
            }}
          >
            <p
              className="text-[16px] leading-[1.2]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#e8dcc0",
              }}
            >
              Personas{"\n"}
              y lugares{"\n"}
              que hacen{"\n"}
              que todo{"\n"}
              suceda.
            </p>
            <span className="absolute top-1 right-3 text-[20px]" style={{ color: "#b8923f" }}>
              ✿
            </span>
          </div>

          {/* Pequeña tarjeta ORIGEN con clip */}
          <div
            className="hidden md:block absolute bottom-[42%] right-[40%] w-[60px] h-[40px] rotate-[-6deg] z-0"
            style={{
              background: "#e8dcc0",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            <p
              className="text-[8px] tracking-[0.2em] text-center mt-3 font-semibold"
              style={{ color: "#6b5832", fontFamily: "'Cormorant Garamond', serif" }}
            >
              ORIGEN ○
            </p>
          </div>
        </div>
      </div>

      {/* ============================================== */}
      {/* CINTA INFERIOR VERDE — STATS CON BORDES RASGADOS */}
      {/* ============================================== */}
      <div className="relative z-10">
        <div
          className="relative max-w-[1280px] mx-auto px-6 md:px-10 py-6 md:py-7"
          style={{
            background:
              "linear-gradient(180deg, #4a5a2e 0%, #3d4a2a 50%, #2f3a20 100%)",
            color: "#e8dcc0",
            clipPath:
              "polygon(0% 8%, 4% 2%, 9% 6%, 16% 0%, 24% 5%, 33% 1%, 42% 6%, 52% 0%, 62% 5%, 72% 1%, 82% 6%, 90% 0%, 96% 5%, 100% 2%, 99% 25%, 100% 50%, 99% 75%, 100% 96%, 96% 100%, 84% 96%, 72% 100%, 60% 96%, 48% 100%, 36% 96%, 24% 100%, 12% 96%, 4% 100%, 0% 95%, 1% 70%, 0% 45%, 1% 25%)",
            boxShadow: "0 -8px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex flex-wrap items-center justify-around gap-6 md:gap-10">
            {/* Pastor con ovejas (silueta) */}
            <svg viewBox="0 0 100 50" className="hidden md:block w-[110px] h-auto opacity-90">
              <path d="M30 38 L30 28 L25 22 L28 16 L33 16 L36 22 L32 28 L33 38" stroke="#e8dcc0" strokeWidth="0.8" fill="none" />
              <line x1="36" y1="22" x2="42" y2="14" stroke="#e8dcc0" strokeWidth="0.8" />
              <ellipse cx="55" cy="40" rx="6" ry="4" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="50" cy="38" r="1.5" fill="#e8dcc0" />
              <ellipse cx="72" cy="42" rx="5" ry="3" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="68" cy="40" r="1.2" fill="#e8dcc0" />
              <ellipse cx="86" cy="40" rx="5" ry="3.5" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="82" cy="38" r="1.3" fill="#e8dcc0" />
              <line x1="2" y1="46" x2="98" y2="46" stroke="#e8dcc0" strokeWidth="0.4" />
            </svg>

            {/* Stat 1 — productores */}
            <div className="flex items-center gap-3">
              <span
                className="text-[42px] leading-none font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", color: "#d4a83a" }}
              >
                {theme.productorCount}
              </span>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  productores
                </p>
                <p
                  className="text-[13px] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  en foco
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-12 bg-white/20" />

            {/* Stat 2 — rutas + icono cartel */}
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 30 40" width="32" height="40" fill="none">
                <line x1="15" y1="6" x2="15" y2="38" stroke="#d4a83a" strokeWidth="1.2" />
                <rect x="3" y="10" width="20" height="6" stroke="#d4a83a" strokeWidth="1" fill="none" />
                <polygon points="23,10 27,13 23,16" fill="#d4a83a" />
                <rect x="7" y="20" width="20" height="6" stroke="#d4a83a" strokeWidth="1" fill="none" />
                <polygon points="7,20 3,23 7,26" fill="#d4a83a" />
              </svg>
              <span
                className="text-[42px] leading-none font-semibold"
                style={{ fontFamily: "'Playfair Display', serif", color: "#d4a83a" }}
              >
                {theme.rutaCount}
              </span>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  rutas
                </p>
                <p
                  className="text-[13px] leading-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  activas
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-12 bg-white/20" />

            {/* Stat 3 — beneficios miembros */}
            <Link
              to="/customer-auth?intent=suscribirme"
              className="flex items-center gap-3 group"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ border: "1.5px solid #d4a83a" }}
              >
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
                  <path
                    d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8 Z"
                    stroke="#d4a83a"
                    strokeWidth="0.8"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight font-medium"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Beneficios
                </p>
                <p
                  className="text-[13px] leading-tight underline decoration-dotted underline-offset-4 group-hover:text-[#d4a83a] transition-colors"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  para miembros
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonHero;
