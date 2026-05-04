import { Link } from "react-router-dom";
import {
  ArrowRight,
  Wheat,
  Utensils,
  Signpost,
  Tag,
  Users,
  Star,
  type LucideIcon,
} from "lucide-react";
import type {
  SeasonData,
  SeasonFeatureIcon,
  SeasonStatIcon,
} from "@/config/seasons";
import "./SeasonalHero.css";

/**
 * <SeasonalHero data={seasonData} />
 *
 * Componente UNICO reutilizable para la sección "Temporada activa" de la home.
 * Recibe `data` desde `src/config/seasons.ts` y `getCurrentSeason()`.
 *
 * No hay textos hardcodeados de negocio: todo viene del prop data.
 * Sólo permanecen como texto fijo los elementos estructurales del lienzo
 * decorativo (etiquetas internas del sello, post-it manuscrito, ORIGEN).
 *
 * El branding ORIGEN ○ es marca, por eso se mantiene como literal.
 *
 * Visual:
 *   - Fondo madera (data.images.wood + fallback Unsplash)
 *   - Tarjeta papel envejecido
 *   - Broche colgante (cordel verde + sello dorado) — derecha del papel
 *   - Sello circular Castilla-La Mancha — dentro del papel
 *   - Collage de polaroids
 *   - Mini-mapa de C-LM con sub-región en verde
 *   - Cinta beige con 4 features
 *   - Cinta verde con 3 stats
 */

// ============================================================
// FALLBACKS — Unsplash IDs estables que se usan si falla la
// carga de los assets locales (/seasons/<slug>/*.jpg).
// Cuando subas tus fotos definitivas a /public/seasons/queso/,
// quedarán automáticamente como prioritarias.
// ============================================================
const FALLBACK_IMAGES: Record<string, { hero: string; sheep: string; maker: string; wood: string }> = {
  queso: {
    hero: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=1200&q=80",
    sheep: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=600&q=80",
    maker: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80",
    wood: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?auto=format&fit=crop&w=2400&q=80",
  },
  mielAceite: {
    hero: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80",
    sheep: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=600&q=80",
    maker: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80",
    wood: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?auto=format&fit=crop&w=2400&q=80",
  },
  caza: {
    hero: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    sheep: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    maker: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    wood: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?auto=format&fit=crop&w=2400&q=80",
  },
  vino: {
    hero: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
    sheep: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=600&q=80",
    maker: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=600&q=80",
    wood: "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?auto=format&fit=crop&w=2400&q=80",
  },
};

const FEATURE_ICON_MAP: Record<SeasonFeatureIcon, LucideIcon> = {
  cheese: Wheat,
  utensils: Utensils,
  route: Signpost,
  tag: Tag,
};

interface Props {
  data: SeasonData;
}

const SeasonalHero = ({ data }: Props) => {
  const fallback = FALLBACK_IMAGES[data.id] ?? FALLBACK_IMAGES.queso;

  // Helpers para fallback en imgs
  const handleImgError = (
    e: React.SyntheticEvent<HTMLImageElement>,
    fallbackUrl: string
  ) => {
    if (e.currentTarget.src !== fallbackUrl) {
      e.currentTarget.src = fallbackUrl;
    }
  };

  // Background wood: intenta asset local; si falla cae al fallback Unsplash
  // (no hay onError sobre divs con background-image, así que precargamos)
  const woodUrl = data.images.wood && data.images.wood.startsWith("/")
    ? `${data.images.wood}, ${fallback.wood}` // probará el local primero (404 invisible) y luego el remoto NO funciona en CSS comma
    : data.images.wood;
  // CSS no soporta fallback con coma para background-image; usamos directamente
  // el remoto si el local empieza por "/" (asumimos no existe aún).
  const woodResolved =
    data.images.wood && data.images.wood.startsWith("/")
      ? fallback.wood
      : woodUrl;

  return (
    <section
      className={`seasonal-hero ${data.themeClass}`}
      style={
        {
          "--season-primary": data.colors.primary,
          "--season-accent": data.colors.accent,
          "--season-cream": data.colors.cream,
          "--season-beige": data.colors.beige,
          "--season-dark": data.colors.dark,
        } as React.CSSProperties
      }
    >
      {/* ========== FONDO MADERA (foto + capas) ========== */}
      <div
        className="seasonal-hero__wood"
        style={{ backgroundImage: `url('${woodResolved}')` }}
      />
      <div className="seasonal-hero__wood-tint" />
      <div className="seasonal-hero__wood-planks" />
      <div className="seasonal-hero__wood-grain" />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        preserveAspectRatio="none"
        viewBox="0 0 1200 800"
        aria-hidden="true"
      >
        <path d="M0 120 Q 300 110 600 130 T 1200 140" stroke="#0a0502" strokeWidth="1.4" fill="none" />
        <path d="M0 280 Q 350 290 700 270 T 1200 300" stroke="#0a0502" strokeWidth="1" fill="none" />
        <path d="M0 540 Q 400 530 800 555 T 1200 540" stroke="#0a0502" strokeWidth="1.4" fill="none" />
        <path d="M0 720 Q 300 715 700 730 T 1200 715" stroke="#0a0502" strokeWidth="1" fill="none" />
        <ellipse cx="180" cy="220" rx="22" ry="12" fill="none" stroke="#1a0d05" strokeWidth="1" />
        <ellipse cx="180" cy="220" rx="14" ry="7" fill="none" stroke="#1a0d05" strokeWidth="0.6" />
        <ellipse cx="950" cy="450" rx="28" ry="14" fill="none" stroke="#1a0d05" strokeWidth="1" />
        <ellipse cx="950" cy="450" rx="18" ry="9" fill="none" stroke="#1a0d05" strokeWidth="0.6" />
      </svg>
      <div className="seasonal-hero__vignette" />

      {/* ========== GRID PRINCIPAL ========== */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-6 pb-6 grid grid-cols-12 gap-6">
        {/* ============================================ */}
        {/* COLUMNA IZQUIERDA — TARJETA DE PAPEL          */}
        {/* ============================================ */}
        <div className="col-span-12 lg:col-span-7 relative">
          {/* ===== BROCHE: cordel + sello dorado (derecha del papel) ===== */}
          <div
            className="seasonal-hero__brooch absolute z-30 pointer-events-none hidden md:block"
            style={{ top: "-22px", right: "8%" }}
            aria-hidden="true"
          >
            {/* Cordel verde — más estrecho que el sello */}
            <div
              className="absolute"
              style={{
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "70px",
                height: "260px",
                background:
                  "linear-gradient(180deg, #4a5a2e 0%, #3d4a2a 50%, #324020 100%)",
                clipPath:
                  "polygon(0 0, 100% 0, 100% 100%, 75% 94%, 50% 100%, 25% 94%, 0 100%)",
                boxShadow:
                  "3px 3px 10px rgba(0,0,0,0.6), inset -3px 0 6px rgba(0,0,0,0.25), inset 3px 0 5px rgba(120,140,80,0.25)",
              }}
            />
            {/* Pliegue central */}
            <div
              className="absolute"
              style={{
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "2px",
                height: "240px",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 100%)",
              }}
            />
            {/* Sello de cera dorado — MÁS ANCHO que el cordel: sobresale por ambos lados */}
            <div
              className="relative w-[110px] h-[110px] rounded-full flex items-center justify-center text-center"
              style={{
                top: "95px",
                left: "-20px", // cord 70 + sello 110 → -20 lo centra (sobresale 20px por cada lado)
                background:
                  "radial-gradient(circle at 32% 28%, #f5d97a 0%, #d4a83a 30%, #b8923f 60%, #8a6f2e 100%)",
                boxShadow:
                  "0 10px 22px rgba(0,0,0,0.6), inset -5px -6px 12px rgba(70,40,10,0.55), inset 3px 3px 6px rgba(255,230,160,0.55)",
                border: "2px solid #6b5220",
              }}
            >
              <div className="relative flex flex-col items-center gap-0.5">
                <span
                  className="text-[8.5px] tracking-[0.22em] font-bold uppercase"
                  style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Temporada
                </span>
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
                  {data.productName.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* ===== TARJETA DE PAPEL ===== */}
          <div className="seasonal-hero__paper px-7 md:px-10 py-7 md:py-9">
            {/* textura papel */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 30%, rgba(150,100,50,0.10) 0%, transparent 30%),
                  radial-gradient(circle at 78% 72%, rgba(120,80,40,0.12) 0%, transparent 35%),
                  radial-gradient(circle at 55% 18%, rgba(160,120,70,0.08) 0%, transparent 22%),
                  radial-gradient(circle at 12% 88%, rgba(140,95,45,0.10) 0%, transparent 28%)
                `,
              }}
            />

            {/* ORIGEN — sin círculo */}
            <div className="relative mb-4">
              <span
                className="text-[24px] font-semibold tracking-[0.18em]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "#3d4a2a",
                }}
              >
                ORIGEN ○
              </span>
            </div>

            {/* Badges (sin círculos decorativos) */}
            <div className="relative flex flex-wrap items-center gap-2 mb-5">
              <span
                className="inline-flex items-center px-5 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: data.colors.primary,
                  color: data.colors.cream,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {data.activeBadge}
              </span>
              <span
                className="inline-flex items-center px-5 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
                style={{
                  background: "#e8dcc0",
                  color: data.colors.primary,
                  border: `1px solid ${data.colors.beige}`,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                {data.productName.toUpperCase()}
              </span>
            </div>

            {/* Título */}
            <h2
              className="seasonal-hero__title relative text-[40px] md:text-[56px] leading-[0.95] mb-4 max-w-[460px]"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: data.colors.dark,
                fontWeight: 500,
              }}
            >
              {data.title.split(" del ").length > 1
                ? (
                    <>
                      {data.title.split(" del ")[0]}
                      <br />
                      <span style={{ display: "inline-block" }}>
                        del {data.title.split(" del ")[1]}
                      </span>
                    </>
                  )
                : data.title.split(" de la ").length > 1
                ? (
                    <>
                      {data.title.split(" de la ")[0]}
                      <br />
                      <span>de la {data.title.split(" de la ").slice(1).join(" de la ")}</span>
                    </>
                  )
                : data.title}
            </h2>

            {/* Meses justo debajo del título */}
            <p
              className="relative text-[12px] tracking-[0.4em] uppercase font-semibold mb-4 flex flex-wrap items-center gap-x-3"
              style={{ color: data.colors.primary, fontFamily: "'Cormorant Garamond', serif" }}
            >
              {data.months.map((m, i) => (
                <span key={m} className="inline-flex items-center gap-3">
                  <span style={{ borderBottom: `1.5px solid ${data.colors.accent}`, paddingBottom: "2px" }}>
                    {m}
                  </span>
                  {i < data.months.length - 1 && <span aria-hidden="true">·</span>}
                </span>
              ))}
            </p>

            {/* Descripción + sello CLM */}
            <div className="relative flex flex-col md:flex-row gap-4 items-start mb-5">
              <p
                className="text-[14.5px] md:text-[15px] leading-[1.6] flex-1 max-w-[460px]"
                style={{
                  color: "#3a3326",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                }}
              >
                {data.description}
              </p>

              {/* Sello circular Castilla-La Mancha — DENTRO del papel */}
              <div
                className="seasonal-hero__clm-stamp relative w-[110px] h-[110px] flex-shrink-0 -rotate-[6deg] opacity-90"
                aria-hidden="true"
              >
                <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                  <circle cx="60" cy="60" r="56" fill="none" stroke="#7a6a3a" strokeWidth="1.2" opacity="0.7" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#7a6a3a" strokeWidth="0.6" opacity="0.5" />
                  <defs>
                    <path id="circle-clm-top" d="M 60,60 m -44,0 a 44,44 0 0,1 88,0" />
                    <path id="circle-clm-bot" d="M 60,60 m -44,0 a 44,44 0 1,0 88,0" />
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
                  <g transform="translate(60 60)">
                    <line x1="-28" y1="14" x2="28" y2="14" stroke="#6b5832" strokeWidth="0.5" />
                    <path d="M-26 14 L-24 11 L-22 14 L-20 12 L-18 14" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    <path d="M14 14 L16 11 L18 14 L20 12 L22 14" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    <line x1="-2" y1="14" x2="-2" y2="-2" stroke="#6b5832" strokeWidth="0.8" />
                    <path d="M-7 14 L-5 -4 L1 -4 L3 14 Z" stroke="#6b5832" strokeWidth="0.7" fill="#f1e5c8" />
                    <rect x="-4" y="6" width="3" height="4" stroke="#6b5832" strokeWidth="0.4" fill="none" />
                    <circle cx="-2" cy="-4" r="1.2" fill="#6b5832" />
                    <line x1="-2" y1="-4" x2="-2" y2="-14" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="8" y2="-8" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="-12" y2="-8" stroke="#6b5832" strokeWidth="0.6" />
                    <line x1="-2" y1="-4" x2="6" y2="6" stroke="#6b5832" strokeWidth="0.6" />
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

            {/* Cita italica */}
            <p
              className="relative text-[14.5px] italic mb-5 pb-5"
              style={{
                color: "#5a4a30",
                fontFamily: "'Cormorant Garamond', serif",
                borderBottom: `1px dashed ${data.colors.beige}`,
              }}
            >
              {data.quote}
            </p>

            {/* CTAs */}
            <div className="relative flex flex-wrap gap-3">
              <Link to={data.ctas.primary.href}>
                <button
                  className="seasonal-hero__cta-primary group inline-flex items-center gap-3 px-5 py-3 text-[11px] tracking-[0.28em] uppercase font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {data.ctas.primary.label}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
              <Link to={data.ctas.secondary.href}>
                <button
                  className="seasonal-hero__cta-secondary group inline-flex items-center gap-3 px-5 py-3 text-[11px] tracking-[0.28em] uppercase font-semibold"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {data.ctas.secondary.label}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* COLUMNA DERECHA — COLLAGE                     */}
        {/* ============================================ */}
        <div className="col-span-12 lg:col-span-5 relative min-h-[560px]">
          {/* POLAROID PRINCIPAL */}
          <div
            className="seasonal-hero__polaroid absolute top-0 left-[2%] w-[78%] rotate-[1.5deg] z-10"
            style={{ padding: "12px 12px 50px 12px" }}
          >
            <div className="aspect-[5/4] w-full overflow-hidden" style={{ background: "#3a2516" }}>
              <img
                src={data.images.hero}
                alt={`${data.productName} ${data.sideNote.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImgError(e, fallback.hero)}
              />
            </div>
            <p
              className="absolute bottom-3 left-0 right-0 text-center text-[20px]"
              style={{ fontFamily: "'Caveat', cursive", color: "#3a3326" }}
            >
              {`${data.productName} de ${data.sideNote.title.split("–").slice(-1)[0].trim()}`}
            </p>
            <span
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-10"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #f5d97a 0%, #b8923f 70%, #6b5220 100%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.6)",
              }}
            />
          </div>

          {/* TARJETA REGION (sideNote) con mini-mapa C-LM */}
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
            {/* Lavanda */}
            <svg className="absolute -right-2 -top-3 z-30" width="60" height="100" viewBox="0 0 60 100">
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
                color: data.colors.primary,
                fontFamily: "'Cormorant Garamond', serif",
                whiteSpace: "pre-line",
                lineHeight: 1.15,
              }}
            >
              {data.sideNote.title.replace("–", "–\n")}
            </p>

            {/* Silueta C-LM con sub-región verde */}
            <svg viewBox="0 0 130 90" className="w-full h-auto mb-1">
              <path
                d="M 18,32 C 14,28 16,22 22,20 L 36,18 C 42,16 48,18 52,16 L 62,14 C 68,12 76,14 82,18 L 96,22 C 104,24 110,28 112,34 L 116,46 C 118,54 114,62 108,66 L 96,72 C 88,76 80,78 72,78 L 60,80 C 52,82 44,80 38,76 L 28,68 C 22,62 18,54 16,46 L 16,38 C 16,36 17,34 18,32 Z"
                fill="#f1e5c8"
                stroke="#7a6a3a"
                strokeWidth="1"
                strokeLinejoin="round"
              />
              <path
                d="M 50,38 C 56,32 66,32 74,36 C 82,40 86,46 84,54 C 80,62 70,64 60,62 C 50,60 44,52 46,46 C 47,42 48,40 50,38 Z"
                fill={data.colors.primary}
                stroke="#3d4a2a"
                strokeWidth="0.8"
              />
              <circle cx="66" cy="48" r="1.4" fill="#f1e5c8" />
            </svg>

            <p
              className="text-[10.5px] leading-[1.4] text-center"
              style={{ color: "#3a3326", fontFamily: "'Cormorant Garamond', serif" }}
            >
              {data.sideNote.text}
            </p>
          </div>

          {/* CITA MANUSCRITA destacada (afuera del polaroid, abajo izq) */}
          <div
            className="seasonal-hero__handwritten--floating hidden md:block absolute z-0 rotate-[-4deg]"
            style={{ top: "60%", left: "-24%", maxWidth: "180px" }}
            aria-hidden="true"
          >
            <p className="seasonal-hero__handwritten text-[26px]">
              {data.handwrittenNote}
            </p>
            <svg width="90" height="10" viewBox="0 0 90 10" className="opacity-70">
              <path d="M0 5 Q 22 0 45 4 T 90 3" stroke="#f5e4b8" strokeWidth="1" fill="none" />
            </svg>
          </div>

          {/* POLAROID inferior izquierda */}
          <div
            className="seasonal-hero__polaroid absolute bottom-2 left-[4%] w-[42%] rotate-[-4deg] z-10"
            style={{ padding: "10px 10px 36px 10px" }}
          >
            <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: "#3a2516" }}>
              <img
                src={data.images.sheep}
                alt={`Paisaje ${data.productName}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImgError(e, fallback.sheep)}
              />
            </div>
            <span
              className="absolute -top-3 right-4 w-5 h-9 rounded-sm rotate-[15deg]"
              style={{
                background: "linear-gradient(180deg, #d8d4c0 0%, #b8b4a0 50%, #d8d4c0 100%)",
                border: "1px solid #888473",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* POLAROID inferior derecha */}
          <div
            className="seasonal-hero__polaroid absolute bottom-10 right-[6%] w-[40%] rotate-[5deg] z-10"
            style={{ padding: "10px 10px 36px 10px" }}
          >
            <div className="aspect-[4/5] w-full overflow-hidden" style={{ background: "#3a2516" }}>
              <img
                src={data.images.maker}
                alt={`Productor ${data.productName}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => handleImgError(e, fallback.maker)}
              />
            </div>
            <span
              className="absolute -top-2 left-6 w-4 h-8 rounded-sm rotate-[-10deg]"
              style={{
                background: "linear-gradient(180deg, #e8c66a 0%, #b8923f 50%, #e8c66a 100%)",
                border: "1px solid #6b5220",
                boxShadow: "1px 1px 2px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ========== CINTA BEIGE FEATURES ========== */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="seasonal-hero__features-ribbon px-6 md:px-12 py-5 md:py-6">
          <div
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 50%, rgba(150,100,50,0.10) 0%, transparent 30%),
                radial-gradient(circle at 75% 50%, rgba(120,80,40,0.10) 0%, transparent 30%)
              `,
            }}
          />
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {data.features.map((f) => {
              const Icon = FEATURE_ICON_MAP[f.icon] ?? Wheat;
              return (
                <div
                  key={f.label}
                  className="flex items-center justify-center md:justify-start gap-3"
                >
                  <Icon
                    className="w-7 h-7 flex-shrink-0"
                    style={{ color: data.colors.primary, strokeWidth: 1.4 }}
                  />
                  <p
                    className="text-[13px] md:text-[14px] leading-[1.2] font-medium"
                    style={{
                      color: "#3a3326",
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {f.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========== CINTA VERDE STATS ========== */}
      <div className="relative z-10 mt-2 pb-2">
        <div className="seasonal-hero__stats-ribbon max-w-[1280px] mx-auto px-6 md:px-10 py-6 md:py-7">
          <div className="flex flex-wrap items-center justify-around gap-6 md:gap-10">
            {/* Pastor + ovejas decorativo */}
            <svg viewBox="0 0 110 50" className="hidden md:block w-[120px] h-auto opacity-90" aria-hidden="true">
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

            {data.stats.map((stat, i) => (
              <StatBlock
                key={`${stat.label}-${i}`}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                accent={data.colors.accent}
                href={stat.icon === "seal" ? "/customer-auth?intent=suscribirme" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================================
// SUB-COMPONENT — Stat block
// ============================================================
interface StatBlockProps {
  value: string;
  label: string;
  icon: SeasonStatIcon;
  accent: string;
  href?: string;
}

const StatBlock = ({ value, label, icon, accent, href }: StatBlockProps) => {
  const content = (
    <div className="flex items-center gap-3">
      {icon === "route" && (
        <svg viewBox="0 0 30 40" width="32" height="40" fill="none" aria-hidden="true">
          <line x1="15" y1="6" x2="15" y2="38" stroke={accent} strokeWidth="1.2" />
          <rect x="3" y="10" width="20" height="6" stroke={accent} strokeWidth="1" fill="none" />
          <polygon points="23,10 27,13 23,16" fill={accent} />
          <rect x="7" y="20" width="20" height="6" stroke={accent} strokeWidth="1" fill="none" />
          <polygon points="7,20 3,23 7,26" fill={accent} />
        </svg>
      )}
      {icon === "producer" && (
        <Users className="w-7 h-7" style={{ color: accent }} aria-hidden="true" />
      )}
      {icon === "seal" && (
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
          style={{ border: `1.5px solid ${accent}` }}
          aria-hidden="true"
        >
          <Star className="w-5 h-5" style={{ color: accent }} />
        </div>
      )}

      {/* Si el value es numérico, lo mostramos grande; si no, integramos como label */}
      {/^\d/.test(value) ? (
        <>
          <span
            className="text-[42px] leading-none font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: accent }}
          >
            {value}
          </span>
          <div className="text-left">
            <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {label.split(" ")[0]}
            </p>
            <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {label.split(" ").slice(1).join(" ")}
            </p>
          </div>
        </>
      ) : (
        <div className="text-left">
          <p
            className="text-[13px] leading-tight font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {value}
          </p>
          <p
            className="text-[13px] leading-tight underline decoration-dotted underline-offset-4 transition-colors"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {label}
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link to={href} className="group">
        {content}
      </Link>
    );
  }
  return content;
};

export default SeasonalHero;
