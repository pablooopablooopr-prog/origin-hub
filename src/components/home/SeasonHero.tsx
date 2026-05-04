import { Link } from "react-router-dom";
import { ArrowRight, Wheat, Utensils, Signpost, Tag } from "lucide-react";
import { getCurrentSeasonInfo } from "@/lib/season";

/**
 * SECCIÓN 2 de la home — TEMPORADA ACTIVA · "Atelier Gastronómico".
 *
 * Iteración 2 — correcciones pedidas por Pablo:
 *  1. Fondo madera con vetas y grietas (SVG turbulence + overlays)
 *  2. Cinta beige superior con 4 features sobre la cinta verde
 *  3. Sello de cera como "broche" colgando de un cordel verde sobre el papel
 *  4. Sello circular Castilla-La Mancha DENTRO del papel
 *  5. Tarjeta region con mapa real de España + región C-LM en verde + ganado
 */

interface SeasonTheme {
  conceptIndex: string;
  seasonName: string; // PRIMAVERA / VERANO / OTOÑO / INVIERNO
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
    seasonName: "PRIMAVERA",
    title: "La Temporada\ndel Queso",
    description:
      "Queserías que honran la tradición, restaurantes que lo interpretan con creatividad y rutas que te llevan al origen de todo. Descubre el queso manchego y el sabor auténtico de Castilla–La Mancha en su mejor momento.",
    region: "Castilla–La Mancha",
    regionShort: "CASTILLA–\nLA MANCHA",
    regionMapDescription:
      "Tierra de pastos infinitos, quesos con historia y personas que cuidan cada detalle.",
    quote: "Sabor que nace\nde la tierra y\nse comparte.",
    heroImage:
      "https://images.unsplash.com/photo-1631379578550-7d8db9b32a8c?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "Queso Manchego Artesano",
    bottomLeftImage:
      "https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&w=600&q=80",
    bottomRightImage:
      "https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=600&q=80",
    productorCount: 12,
    rutaCount: 3,
  },
  miel: {
    conceptIndex: "Concepto 4",
    seasonName: "VERANO",
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
    seasonName: "OTOÑO",
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
    seasonName: "INVIERNO",
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

const FEATURE_ITEMS = [
  { Icon: Wheat, label: "Queserías\ndestacadas" },
  { Icon: Utensils, label: "Restaurantes\nseleccionados" },
  { Icon: Signpost, label: "Rutas\nverificadas" },
  { Icon: Tag, label: "Descuentos\nexclusivos" },
];

const SeasonHero = () => {
  const season = getCurrentSeasonInfo();
  const theme = SEASON_THEMES[season.id] ?? SEASON_THEMES.queso;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: "#2a1c10" }}>
      {/* ===== SVG FILTERS DEFINITIONS ===== */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="wood-grain-filter" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.85"
              numOctaves="3"
              seed="7"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.18
                      0 0 0 0 0.10
                      0 0 0 0 0.04
                      0 0 0 1 0"
            />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>

          <filter id="paper-grain-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" seed="3" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.45
                      0 0 0 0 0.32
                      0 0 0 0 0.16
                      0 0 0 0.18 0"
            />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
        </defs>
      </svg>

      {/* ===== FONDO MADERA: 4 capas ===== */}
      {/* 1) Base degradado madera */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #3a2516 0%, #2e1c10 40%, #251608 100%)",
        }}
      />
      {/* 2) Vetas verticales largas (planks) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 180px,
            rgba(0,0,0,0.35) 180px,
            rgba(0,0,0,0.35) 182px,
            rgba(70,40,20,0.18) 182px,
            rgba(70,40,20,0.18) 188px,
            transparent 188px,
            transparent 380px
          )`,
        }}
      />
      {/* 3) Vetas finas (grano fino) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(
            89deg,
            rgba(0,0,0,0.1) 0,
            rgba(0,0,0,0.1) 1px,
            transparent 1px,
            transparent 8px,
            rgba(255,220,180,0.04) 8px,
            rgba(255,220,180,0.04) 9px,
            transparent 9px,
            transparent 22px
          )`,
        }}
      />
      {/* 4) Grietas/nudos (SVG noise) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay"
        style={{ filter: "url(#wood-grain-filter)", backgroundColor: "#000" }}
      />
      {/* 5) Grietas diagonales largas (overlay sutil) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
      >
        <path d="M0 120 Q 300 110 600 130 T 1200 140" stroke="#0a0502" strokeWidth="1.5" fill="none" />
        <path d="M0 280 Q 350 290 700 270 T 1200 300" stroke="#0a0502" strokeWidth="1" fill="none" />
        <path d="M0 540 Q 400 530 800 555 T 1200 540" stroke="#0a0502" strokeWidth="1.5" fill="none" />
        <path d="M0 720 Q 300 715 700 730 T 1200 715" stroke="#0a0502" strokeWidth="1" fill="none" />
        {/* nudos */}
        <ellipse cx="180" cy="220" rx="22" ry="12" fill="none" stroke="#1a0d05" strokeWidth="1" />
        <ellipse cx="180" cy="220" rx="14" ry="7" fill="none" stroke="#1a0d05" strokeWidth="0.6" />
        <ellipse cx="950" cy="450" rx="28" ry="14" fill="none" stroke="#1a0d05" strokeWidth="1" />
        <ellipse cx="950" cy="450" rx="18" ry="9" fill="none" stroke="#1a0d05" strokeWidth="0.6" />
      </svg>
      {/* 6) Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />

      {/* ===== HEADER tipo etiqueta ===== */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-6">
        <p
          className="text-[11px] tracking-[0.32em] uppercase font-medium"
          style={{
            color: "#c9b89a",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {theme.conceptIndex} · Atelier Gastronómico
        </p>
      </div>

      {/* ===== GRID PRINCIPAL ===== */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-8 pb-6 grid grid-cols-12 gap-6">
        {/* ============================================ */}
        {/* COLUMNA IZQUIERDA — TARJETA DE PAPEL          */}
        {/* ============================================ */}
        <div className="col-span-12 lg:col-span-7 relative">
          {/* ===== BROCHE: cordel verde + sello de cera ===== */}
          <div
            className="absolute z-30 pointer-events-none"
            style={{ top: "-24px", left: "62%" }}
            aria-hidden="true"
          >
            {/* Cordel verde vertical */}
            <div
              className="absolute"
              style={{
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "26px",
                height: "230px",
                background:
                  "linear-gradient(180deg, #4a5a2e 0%, #3d4a2a 60%, #324020 100%)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 70% 96%, 50% 100%, 30% 96%, 0 100%)",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.55)",
              }}
            />
            {/* Sombra suave del cordel sobre el papel */}
            <div
              className="absolute"
              style={{
                top: "12px",
                left: "50%",
                transform: "translateX(-50%) translateX(4px)",
                width: "26px",
                height: "210px",
                background: "rgba(0,0,0,0.18)",
                filter: "blur(6px)",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 70% 96%, 50% 100%, 30% 96%, 0 100%)",
              }}
            />
            {/* Sello de cera dorado encima del cordel */}
            <div
              className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center text-center"
              style={{
                top: "85px",
                left: "-42px",
                background:
                  "radial-gradient(circle at 32% 28%, #f5d97a 0%, #d4a83a 30%, #b8923f 60%, #8a6f2e 100%)",
                boxShadow:
                  "0 10px 22px rgba(0,0,0,0.55), inset -5px -6px 12px rgba(70,40,10,0.55), inset 3px 3px 6px rgba(255,230,160,0.55)",
                border: "2px solid #6b5220",
              }}
            >
              {/* borde exterior dentado tipo cera */}
              <div
                className="absolute inset-[-4px] rounded-full opacity-70"
                style={{
                  background:
                    "radial-gradient(circle, transparent 60%, #8a6f2e 65%, transparent 75%)",
                  filter: "blur(1px)",
                }}
              />
              <div className="relative flex flex-col items-center gap-0.5">
                <span
                  className="text-[8.5px] tracking-[0.22em] font-bold uppercase"
                  style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Temporada
                </span>
                {/* florecita */}
                <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                  <circle cx="11" cy="10" r="1.5" fill="#3a2c10" />
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="11"
                      cy="5"
                      rx="1.6"
                      ry="3"
                      fill="#3a2c10"
                      opacity="0.85"
                      transform={`rotate(${deg} 11 10)`}
                    />
                  ))}
                  <path d="M11 14 L11 18" stroke="#3a2c10" strokeWidth="0.8" />
                  <path d="M9 17 Q 11 16 13 17" stroke="#3a2c10" strokeWidth="0.6" fill="none" />
                </svg>
                <span
                  className="text-[8.5px] tracking-[0.22em] font-bold uppercase"
                  style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {theme.seasonName}
                </span>
              </div>
            </div>
          </div>

          {/* ===== TARJETA DE PAPEL ENVEJECIDO ===== */}
          <div
            className="relative px-8 md:px-12 py-10 md:py-12 shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, #f7eed8 0%, #f1e5c8 50%, #ead7b3 100%)",
              boxShadow:
                "0 30px 60px -20px rgba(0,0,0,0.6), 0 12px 24px -6px rgba(0,0,0,0.35), inset 0 0 80px rgba(180, 140, 80, 0.10)",
              clipPath:
                "polygon(0% 1.5%, 4% 0%, 12% 1.8%, 24% 0.4%, 38% 1.6%, 52% 0.2%, 66% 1.8%, 78% 0.4%, 92% 1.5%, 100% 1%, 99.5% 14%, 100% 28%, 99% 44%, 100% 60%, 99.4% 76%, 100% 92%, 96% 100%, 82% 98.5%, 65% 100%, 48% 99%, 32% 100%, 14% 98.8%, 3% 100%, 0% 96%, 0.6% 80%, 0% 64%, 0.7% 48%, 0% 32%, 0.6% 18%)",
            }}
          >
            {/* textura papel */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(150, 100, 50, 0.10) 0%, transparent 30%),
                  radial-gradient(circle at 78% 72%, rgba(120, 80, 40, 0.12) 0%, transparent 35%),
                  radial-gradient(circle at 55% 18%, rgba(160, 120, 70, 0.08) 0%, transparent 22%),
                  radial-gradient(circle at 12% 88%, rgba(140, 95, 45, 0.10) 0%, transparent 28%)
                `,
              }}
            />

            {/* ORIGEN logo */}
            <div className="relative flex items-center gap-2 mb-6">
              <span
                className="text-[24px] font-semibold tracking-[0.18em]"
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: "#3d4a2a",
                  color: "#f1e5c8",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Temporada activa
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border"
                  style={{ borderColor: "#f1e5c8" }}
                />
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: "#e8dcc0",
                  color: "#3d4a2a",
                  border: "1px solid #c9b89a",
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full border"
                  style={{ borderColor: "#3d4a2a" }}
                />
                {theme.seasonName}
              </span>
            </div>

            {/* Título */}
            <h1
              className="relative text-[44px] md:text-[60px] leading-[0.95] mb-6 max-w-[480px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#2a2418",
                fontWeight: 500,
                whiteSpace: "pre-line",
              }}
            >
              {theme.title}
              {/* sprig botánico */}
              <svg
                className="absolute -right-4 top-12 opacity-55"
                width="60"
                height="80"
                viewBox="0 0 60 80"
                fill="none"
              >
                <path d="M30 8 Q28 35 30 72" stroke="#7a6a3a" strokeWidth="0.8" fill="none" />
                <ellipse cx="22" cy="20" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="38" cy="26" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="20" cy="36" rx="4.5" ry="2.2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="40" cy="44" rx="4.5" ry="2.2" fill="#7a6a3a" opacity="0.55" />
                <ellipse cx="22" cy="54" rx="4" ry="2" fill="#7a6a3a" opacity="0.55" />
              </svg>
            </h1>

            {/* Descripción + sello CLM */}
            <div className="relative flex flex-col md:flex-row gap-4 items-start mb-6">
              <p
                className="text-[15px] md:text-[15.5px] leading-[1.65] flex-1 max-w-[480px]"
                style={{
                  color: "#3a3326",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                }}
              >
                {theme.description}
              </p>

              {/* SELLO CIRCULAR CASTILLA-LA MANCHA — DENTRO DEL PAPEL */}
              <div
                className="relative w-[120px] h-[120px] flex-shrink-0 -rotate-[6deg] opacity-90"
                aria-hidden="true"
              >
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                  {/* círculo exterior */}
                  <circle
                    cx="60"
                    cy="60"
                    r="56"
                    fill="none"
                    stroke="#7a6a3a"
                    strokeWidth="1.2"
                    strokeDasharray="0.5 0"
                    opacity="0.7"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#7a6a3a"
                    strokeWidth="0.6"
                    opacity="0.5"
                  />
                  {/* texto curvado superior */}
                  <defs>
                    <path
                      id="circle-clm-top"
                      d="M 60,60 m -44,0 a 44,44 0 0,1 88,0"
                    />
                    <path
                      id="circle-clm-bot"
                      d="M 60,60 m -44,0 a 44,44 0 1,0 88,0"
                    />
                  </defs>
                  <text fill="#6b5832" style={{ fontSize: "8.5px", letterSpacing: "0.32em" }}>
                    <textPath href="#circle-clm-top" startOffset="50%" textAnchor="middle">
                      CASTILLA · LA MANCHA
                    </textPath>
                  </text>
                  <text fill="#6b5832" style={{ fontSize: "7.5px", letterSpacing: "0.4em" }}>
                    <textPath href="#circle-clm-bot" startOffset="50%" textAnchor="middle">
                      ORIGEN
                    </textPath>
                  </text>
                  {/* paisaje con molino */}
                  <g transform="translate(60 60)">
                    {/* línea horizonte */}
                    <line x1="-28" y1="14" x2="28" y2="14" stroke="#6b5832" strokeWidth="0.5" />
                    {/* hierba */}
                    <path d="M-26 14 L-24 11 L-22 14 L-20 12 L-18 14" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    <path d="M14 14 L16 11 L18 14 L20 12 L22 14" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    {/* molino */}
                    <line x1="-2" y1="14" x2="-2" y2="-2" stroke="#6b5832" strokeWidth="0.8" />
                    <path d="M-7 14 L-5 -4 L1 -4 L3 14 Z" stroke="#6b5832" strokeWidth="0.7" fill="#f1e5c8" />
                    <rect x="-4" y="6" width="3" height="4" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    <circle cx="-2" cy="-4" r="1.2" fill="#6b5832" />
                    {/* aspas */}
                    <line x1="-2" y1="-4" x2="-2" y2="-14" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="8" y2="-8" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="-12" y2="-8" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="6" y2="6" stroke="#6b5832" strokeWidth="0.6" />
                    {/* segundo molino al fondo */}
                    <line x1="14" y1="14" x2="14" y2="6" stroke="#6b5832" strokeWidth="0.5" />
                    <path d="M11 14 L13 4 L15 4 L17 14 Z" stroke="#6b5832" strokeWidth="0.5" fill="#f1e5c8" />
                    <circle cx="14" cy="4" r="0.8" fill="#6b5832" />
                    <line x1="14" y1="4" x2="14" y2="-2" stroke="#6b5832" strokeWidth="0.4" />
                    <line x1="14" y1="4" x2="20" y2="2" stroke="#6b5832" strokeWidth="0.4" />
                    <line x1="14" y1="4" x2="8" y2="2" stroke="#6b5832" strokeWidth="0.4" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Meses */}
            <p
              className="relative text-[12px] tracking-[0.4em] uppercase font-semibold mb-1"
              style={{ color: "#3d4a2a", fontFamily: "'Cormorant Garamond', serif" }}
            >
              {season.range}
            </p>
            <div
              className="relative h-[1px] w-[80px] mb-4"
              style={{ background: "#b8923f" }}
            />

            {/* Cita italica */}
            <p
              className="relative text-[15px] italic mb-7 pb-7"
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
        </div>

        {/* ============================================ */}
        {/* COLUMNA DERECHA — COLLAGE DE POLAROIDS        */}
        {/* ============================================ */}
        <div className="col-span-12 lg:col-span-5 relative min-h-[600px]">
          {/* POLAROID PRINCIPAL — protagonista */}
          <div
            className="absolute top-0 left-[2%] w-[78%] rotate-[1.5deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "12px 12px 50px 12px",
              boxShadow:
                "0 18px 40px -10px rgba(0,0,0,0.6), 0 8px 16px -4px rgba(0,0,0,0.35)",
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
              className="absolute bottom-3 left-0 right-0 text-center text-[20px]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#3a3326",
              }}
            >
              {theme.heroCaption}
            </p>
            {/* chinche dorada */}
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-10"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #f5d97a 0%, #b8923f 70%, #6b5220 100%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
              }}
            />
          </div>

          {/* TARJETA REGION — MAPA REAL DE ESPAÑA + RAMO */}
          <div
            className="absolute -top-2 right-[2%] w-[36%] rotate-[4deg] z-20"
            style={{
              background: "linear-gradient(180deg, #f7eed8 0%, #ead9b4 100%)",
              padding: "16px 14px 14px 14px",
              boxShadow: "0 12px 24px -6px rgba(0,0,0,0.55)",
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
                  <ellipse cx="22" cy={y + 6} rx="2.4" ry="3.2" fill="#9d8db5" opacity="0.85" />
                  <ellipse cx="34" cy={y} rx="2.4" ry="3.2" fill="#8a7aa3" opacity="0.85" />
                  <ellipse cx="44" cy={y + 8} rx="2.4" ry="3.2" fill="#9d8db5" opacity="0.85" />
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

            {/* MAPA REAL DE ESPAÑA con CLM en verde */}
            <svg viewBox="0 0 130 95" className="w-full h-auto mb-1">
              {/* Silueta peninsular España (simplificada pero reconocible) */}
              <path
                d="M 8,42 C 6,36 10,28 18,24 C 26,20 38,17 50,16 C 60,15 72,13 84,15 C 96,17 110,20 118,28 C 124,33 122,42 119,48 C 117,54 115,60 110,65 C 105,72 96,76 86,77 C 76,78 64,76 54,77 C 44,78 32,76 22,72 C 14,68 9,60 8,52 C 7,48 8,45 8,42 Z"
                fill="none"
                stroke="#3d4a2a"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              {/* Portugal (recorte oeste) */}
              <path
                d="M 8,42 C 6,38 8,32 12,30 C 14,38 12,48 14,58 C 16,64 18,68 22,72"
                fill="none"
                stroke="#3d4a2a"
                strokeWidth="0.6"
                strokeDasharray="1 1"
                opacity="0.5"
              />
              {/* Baleares decorativas */}
              <circle cx="118" cy="50" r="0.8" fill="#3d4a2a" />
              <circle cx="122" cy="48" r="0.6" fill="#3d4a2a" />
              <circle cx="120" cy="54" r="0.5" fill="#3d4a2a" />

              {/* CASTILLA - LA MANCHA en verde sólido */}
              <path
                d="M 48,42 C 50,38 56,36 64,36 C 72,36 80,38 86,42 C 90,46 91,52 89,57 C 86,62 80,64 72,64 C 64,64 56,62 50,58 C 46,54 46,47 48,42 Z"
                fill="#5a6b3a"
                stroke="#3d4a2a"
                strokeWidth="0.6"
              />
              {/* Punto/marca centro */}
              <circle cx="68" cy="50" r="1.5" fill="#f1e5c8" />
            </svg>

            {/* GANADO PASTANDO debajo del mapa */}
            <svg viewBox="0 0 130 30" className="w-full h-auto mb-2 opacity-90">
              {/* Línea de campo con relieves */}
              <path
                d="M 0,22 Q 20,15 35,18 Q 55,11 75,16 Q 95,12 115,17 Q 125,18 130,20 L 130,28 L 0,28 Z"
                fill="#5a6b3a"
                opacity="0.30"
              />
              <path
                d="M 0,24 Q 20,17 35,20 Q 55,13 75,18 Q 95,14 115,19 Q 125,20 130,22"
                fill="none"
                stroke="#3d4a2a"
                strokeWidth="0.5"
              />
              {/* Hierba */}
              <g stroke="#3d4a2a" strokeWidth="0.3" fill="none">
                <path d="M5 24 L5 21 M8 24 L8 22 M11 24 L11 21" />
                <path d="M85 22 L85 19 M88 22 L88 20 M91 22 L91 19" />
                <path d="M118 22 L118 19 M121 22 L121 20" />
              </g>
              {/* Ovejas pastando */}
              <g fill="#3d4a2a">
                {/* oveja 1 */}
                <ellipse cx="22" cy="19" rx="3.5" ry="2.2" />
                <circle cx="25.5" cy="18" r="1.2" />
                <line x1="20" y1="21" x2="20" y2="23" stroke="#3d4a2a" strokeWidth="0.5" />
                <line x1="24" y1="21" x2="24" y2="23" stroke="#3d4a2a" strokeWidth="0.5" />
                {/* oveja 2 */}
                <ellipse cx="42" cy="20" rx="3" ry="2" />
                <circle cx="45" cy="19" r="1" />
                <line x1="40" y1="22" x2="40" y2="23.5" stroke="#3d4a2a" strokeWidth="0.5" />
                <line x1="43" y1="22" x2="43" y2="23.5" stroke="#3d4a2a" strokeWidth="0.5" />
                {/* oveja 3 grande */}
                <ellipse cx="62" cy="18" rx="4" ry="2.4" />
                <circle cx="66" cy="17" r="1.3" />
                <line x1="59" y1="20" x2="59" y2="22.5" stroke="#3d4a2a" strokeWidth="0.5" />
                <line x1="64" y1="20" x2="64" y2="22.5" stroke="#3d4a2a" strokeWidth="0.5" />
                {/* oveja 4 */}
                <ellipse cx="78" cy="19" rx="3" ry="2" />
                <circle cx="81" cy="18" r="1.1" />
                <line x1="76" y1="21" x2="76" y2="22.5" stroke="#3d4a2a" strokeWidth="0.5" />
                <line x1="79" y1="21" x2="79" y2="22.5" stroke="#3d4a2a" strokeWidth="0.5" />
                {/* oveja 5 lejos */}
                <ellipse cx="100" cy="20" rx="2.2" ry="1.5" opacity="0.7" />
                <circle cx="102" cy="19.5" r="0.8" opacity="0.7" />
              </g>
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
          </div>

          {/* CITA MANUSCRITA "Sabor que nace..." */}
          <div
            className="hidden md:block absolute z-20 rotate-[-4deg]"
            style={{ top: "44%", left: "10%", maxWidth: "150px" }}
            aria-hidden="true"
          >
            <p
              className="text-[19px] leading-[1.3]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#d9c89a",
                whiteSpace: "pre-line",
              }}
            >
              {theme.quote}
            </p>
            {/* línea decorativa */}
            <svg width="80" height="10" viewBox="0 0 80 10" className="opacity-60">
              <path d="M0 5 Q 20 0 40 4 T 80 3" stroke="#d9c89a" strokeWidth="0.8" fill="none" />
            </svg>
          </div>

          {/* POLAROID inferior izquierda — paisaje/ovejas */}
          <div
            className="absolute bottom-2 left-[4%] w-[42%] rotate-[-4deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "10px 10px 36px 10px",
              boxShadow:
                "0 14px 30px -8px rgba(0,0,0,0.6), 0 6px 12px -3px rgba(0,0,0,0.35)",
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
            <span
              className="absolute -top-3 right-4 w-5 h-9 rounded-sm rotate-[15deg]"
              style={{
                background:
                  "linear-gradient(180deg, #d8d4c0 0%, #b8b4a0 50%, #d8d4c0 100%)",
                border: "1px solid #888473",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* POLAROID inferior derecha — productor */}
          <div
            className="absolute bottom-10 right-[6%] w-[40%] rotate-[5deg] z-10"
            style={{
              background: "#fafaf3",
              padding: "10px 10px 36px 10px",
              boxShadow:
                "0 14px 30px -8px rgba(0,0,0,0.6), 0 6px 12px -3px rgba(0,0,0,0.35)",
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
            <span
              className="absolute -top-2 left-6 w-4 h-8 rounded-sm rotate-[-10deg]"
              style={{
                background:
                  "linear-gradient(180deg, #e8c66a 0%, #b8923f 50%, #e8c66a 100%)",
                border: "1px solid #6b5220",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* POST-IT VERDE */}
          <div
            className="absolute -right-3 bottom-[8%] w-[140px] rotate-[8deg] z-30 px-3 py-4"
            style={{
              background:
                "linear-gradient(180deg, #5a6b3a 0%, #4a5a2e 100%)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.45)",
              clipPath:
                "polygon(0% 4%, 8% 0%, 100% 2%, 98% 100%, 4% 96%)",
            }}
          >
            <p
              className="text-[16px] leading-[1.2]"
              style={{
                fontFamily: "'Caveat', cursive",
                color: "#e8dcc0",
                whiteSpace: "pre-line",
              }}
            >
              {"Personas\ny lugares\nque hacen\nque todo\nsuceda."}
            </p>
            {/* florecita esquina */}
            <svg className="absolute top-1 right-2" width="14" height="14" viewBox="0 0 14 14">
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="7"
                  cy="3.5"
                  rx="1.2"
                  ry="2.2"
                  fill="#d4a83a"
                  opacity="0.9"
                  transform={`rotate(${deg} 7 7)`}
                />
              ))}
              <circle cx="7" cy="7" r="1" fill="#d4a83a" />
            </svg>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CINTA BEIGE SUPERIOR — 4 features            */}
      {/* ============================================ */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div
          className="relative px-6 md:px-12 py-5 md:py-6"
          style={{
            background:
              "linear-gradient(180deg, #f1e5c8 0%, #e8dcc0 60%, #ddd0b0 100%)",
            boxShadow: "0 8px 20px rgba(0,0,0,0.35), inset 0 0 30px rgba(180,140,80,0.10)",
            clipPath:
              "polygon(0% 8%, 4% 0%, 12% 6%, 22% 0%, 32% 6%, 42% 0%, 52% 6%, 62% 0%, 72% 6%, 82% 0%, 92% 6%, 100% 0%, 99% 50%, 100% 100%, 92% 96%, 82% 100%, 72% 96%, 62% 100%, 52% 96%, 42% 100%, 32% 96%, 22% 100%, 12% 96%, 4% 100%, 0% 96%, 1% 50%)",
          }}
        >
          {/* Textura papel */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 50%, rgba(150, 100, 50, 0.10) 0%, transparent 30%),
                radial-gradient(circle at 75% 50%, rgba(120, 80, 40, 0.10) 0%, transparent 30%)
              `,
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {FEATURE_ITEMS.map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-center md:justify-start gap-3">
                <Icon
                  className="w-7 h-7 flex-shrink-0"
                  style={{ color: "#3d4a2a", strokeWidth: 1.4 }}
                />
                <p
                  className="text-[13px] md:text-[14px] leading-[1.2] font-medium"
                  style={{
                    color: "#3a3326",
                    fontFamily: "'Cormorant Garamond', serif",
                    whiteSpace: "pre-line",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* CINTA INFERIOR VERDE — STATS                  */}
      {/* ============================================ */}
      <div className="relative z-10 mt-2 pb-2">
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
            {/* Pastor con ovejas */}
            <svg viewBox="0 0 110 50" className="hidden md:block w-[120px] h-auto opacity-90">
              <path d="M30 38 L30 28 L25 22 L28 16 L33 16 L36 22 L32 28 L33 38" stroke="#e8dcc0" strokeWidth="0.8" fill="none" />
              <line x1="36" y1="22" x2="42" y2="14" stroke="#e8dcc0" strokeWidth="0.8" />
              <ellipse cx="55" cy="40" rx="6" ry="4" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="50" cy="38" r="1.5" fill="#e8dcc0" />
              <ellipse cx="72" cy="42" rx="5" ry="3" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="68" cy="40" r="1.2" fill="#e8dcc0" />
              <ellipse cx="86" cy="40" rx="5" ry="3.5" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
              <circle cx="82" cy="38" r="1.3" fill="#e8dcc0" />
              <line x1="2" y1="46" x2="108" y2="46" stroke="#e8dcc0" strokeWidth="0.4" />
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
                <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  productores
                </p>
                <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  en foco
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-12 bg-white/20" />

            {/* Stat 2 — rutas */}
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
                <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  rutas
                </p>
                <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  activas
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-12 bg-white/20" />

            {/* Stat 3 — beneficios */}
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
                <p className="text-[13px] leading-tight font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
