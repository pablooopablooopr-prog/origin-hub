import { Link } from "react-router-dom";
import {
  ArrowRight, Wheat, Utensils, Signpost, Tag, Users, Star, type LucideIcon,
} from "lucide-react";
import type { SeasonData, SeasonFeatureIcon, SeasonStatIcon } from "@/config/seasons";
import "./SeasonalHero.css";

// ============================================================
// FALLBACKS — fotos de Unsplash de alta calidad por temporada
// ============================================================
const FALLBACK_IMAGES: Record<string, { hero: string; sheep: string; maker: string; wood: string }> = {
  queso: {
    hero: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=1200&q=90",
    sheep: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=85",
    maker: "https://images.unsplash.com/photo-1605707447752-4cf680f18ead?auto=format&fit=crop&w=700&q=85",
    wood: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=2400&q=80",
  },
  mielAceite: {
    hero: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=90",
    sheep: "https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?auto=format&fit=crop&w=700&q=85",
    maker: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85",
    wood: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=2400&q=80",
  },
  caza: {
    hero: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=90",
    sheep: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85",
    maker: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=700&q=85",
    wood: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=2400&q=80",
  },
  vino: {
    hero: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=90",
    sheep: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=700&q=85",
    maker: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=700&q=85",
    wood: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=2400&q=80",
  },
};

const FEATURE_ICON_MAP: Record<SeasonFeatureIcon, LucideIcon> = {
  cheese: Wheat, utensils: Utensils, route: Signpost, tag: Tag,
};

interface Props { data: SeasonData; }

const SeasonalHero = ({ data }: Props) => {
  const fallback = FALLBACK_IMAGES[data.id] ?? FALLBACK_IMAGES.queso;
  const woodResolved = data.images.wood?.startsWith("/") ? fallback.wood : (data.images.wood || fallback.wood);

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>, fallbackUrl: string) => {
    if (e.currentTarget.src !== fallbackUrl) e.currentTarget.src = fallbackUrl;
  };

  return (
    <div
      style={{
        backgroundImage: "url('/textures/adobe-wall.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        isolation: "isolate",
      }}
    >
      {/* ========== HEADER DE SECCIÓN — sobre la misma madera ========== */}
      <div
        className="w-full pt-4 md:pt-6 pb-2 md:pb-3 text-center relative z-10"
        style={{
          background: "transparent",
        }}
      >
        {/* Eyebrow con guiones */}
        <div className="flex items-center justify-center gap-3 mb-4 relative z-10">
          <span className="block h-px w-10" style={{ backgroundColor: "#3a2008" }} aria-hidden="true" />
          <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#3a2008" }}>
            {data.seasonLabel} · {data.activeBadge}
          </span>
          <span className="block h-px w-10" style={{ backgroundColor: "#3a2008" }} aria-hidden="true" />
        </div>

        {/* Título FIJO con laureles */}
        <div className="flex items-center justify-center gap-4 mb-4 relative z-10">
          <svg viewBox="0 0 80 40" width="52" height="26" aria-hidden="true" style={{ opacity: 0.7 }}>
            <path d="M70,20 C60,8 40,6 25,14 C15,18 10,26 15,30" stroke="#3a2008" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <path d="M65,18 C55,10 42,10 30,16" stroke="#3a2008" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <path d="M60,15 C52,8 42,9 34,14" stroke="#3a2008" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
            <ellipse cx="28" cy="16" rx="5" ry="3.5" fill="#3a2008" opacity="0.6" transform="rotate(-20 28 16)"/>
            <ellipse cx="20" cy="22" rx="5" ry="3.5" fill="#3a2008" opacity="0.5" transform="rotate(-10 20 22)"/>
            <ellipse cx="38" cy="13" rx="4.5" ry="3" fill="#3a2008" opacity="0.55" transform="rotate(-30 38 13)"/>
            <ellipse cx="50" cy="12" rx="4" ry="2.8" fill="#3a2008" opacity="0.5" transform="rotate(-40 50 12)"/>
          </svg>

          <h2
            className="font-bold leading-tight tracking-tight"
            style={{
              color: "#1e1208",
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(1.5rem, 1rem + 2.4vw, 2.875rem)",
              whiteSpace: "nowrap",
            }}
          >
            La Temporada
          </h2>

          <svg viewBox="0 0 80 40" width="52" height="26" aria-hidden="true" style={{ opacity: 0.7, transform: "scaleX(-1)" }}>
            <path d="M70,20 C60,8 40,6 25,14 C15,18 10,26 15,30" stroke="#3a2008" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <path d="M65,18 C55,10 42,10 30,16" stroke="#3a2008" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
            <path d="M60,15 C52,8 42,9 34,14" stroke="#3a2008" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
            <ellipse cx="28" cy="16" rx="5" ry="3.5" fill="#3a2008" opacity="0.6" transform="rotate(-20 28 16)"/>
            <ellipse cx="20" cy="22" rx="5" ry="3.5" fill="#3a2008" opacity="0.5" transform="rotate(-10 20 22)"/>
            <ellipse cx="38" cy="13" rx="4.5" ry="3" fill="#3a2008" opacity="0.55" transform="rotate(-30 38 13)"/>
            <ellipse cx="50" cy="12" rx="4" ry="2.8" fill="#3a2008" opacity="0.5" transform="rotate(-40 50 12)"/>
          </svg>
        </div>

        {/* Subtítulo rotacional */}
        <p
          className="mx-auto leading-relaxed relative z-10"
          style={{
            color: "#3d2508",
            fontSize: "clamp(0.9rem, 0.8rem + 0.35vw, 1.05rem)",
            whiteSpace: "nowrap",
            lineHeight: 1.5,
          }}
        >
          Cada estación, ORIGEN cambia con el ritmo de la tierra. Ahora es el
          turno de <strong style={{ color: "#7a3200", fontWeight: 700, textShadow: "none" }}>{data.productName}</strong> —
          en su mejor momento de cosecha.
        </p>
      </div>

      {/* ========== SECCIÓN OSCURA MADERA ========== */}
      <section
        className={`seasonal-hero ${data.themeClass}`}
        style={
          {
            marginTop: "0",
            "--season-primary": data.colors.primary,
            "--season-accent": data.colors.accent,
            "--season-cream": data.colors.cream,
            "--season-beige": data.colors.beige,
            "--season-dark": data.colors.dark,
          } as React.CSSProperties
        }
      >
        {/* Fondo madera */}
        <div className="seasonal-hero__wood" style={{ backgroundImage: `url('${woodResolved}')`, opacity: 0.0 }} />
        <div className="seasonal-hero__wood-tint" />
        <div className="seasonal-hero__wood-planks" />
        <div className="seasonal-hero__wood-grain" />
        {/* Vetas SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" preserveAspectRatio="none" viewBox="0 0 1200 700" aria-hidden="true">
          <path d="M0 100 Q 300 92 600 108 T 1200 118" stroke="#0a0502" strokeWidth="1.2" fill="none" />
          <path d="M0 260 Q 350 270 700 255 T 1200 280" stroke="#0a0502" strokeWidth="0.9" fill="none" />
          <path d="M0 480 Q 400 470 800 490 T 1200 475" stroke="#0a0502" strokeWidth="1.2" fill="none" />
          <ellipse cx="150" cy="200" rx="20" ry="10" fill="none" stroke="#1a0d05" strokeWidth="0.9" />
          <ellipse cx="900" cy="380" rx="25" ry="12" fill="none" stroke="#1a0d05" strokeWidth="0.9" />
        </svg>
        <div className="seasonal-hero__vignette" />

        {/* GRID PRINCIPAL */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-5 pb-4 grid grid-cols-12 gap-5">

          {/* ============ COLUMNA IZQUIERDA — TARJETA PAPEL ============ */}
          <div className="col-span-12 lg:col-span-7 relative">

            {/* BROCHE: cinta verde + medallón dorado */}
            <div
              className="seasonal-hero__brooch absolute z-30 pointer-events-none hidden md:flex flex-col items-center"
              style={{ top: "-18px", right: "10%" }}
              aria-hidden="true"
            >
              {/* Cinta verde con pliegue central */}
              <div className="relative" style={{ width: "64px", height: "220px" }}>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, #324020 0%, #4a5a2e 30%, #5a6b38 50%, #4a5a2e 70%, #324020 100%)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 75% 93%, 50% 100%, 25% 93%, 0 100%)",
                    boxShadow: "4px 4px 12px rgba(0,0,0,0.7), inset -4px 0 8px rgba(0,0,0,0.3), inset 4px 0 6px rgba(130,150,80,0.2)",
                  }}
                />
                {/* Pliegue central */}
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2" style={{ width: "1.5px", background: "rgba(0,0,0,0.3)" }} />
                {/* Costuras laterales */}
                <div className="absolute top-4 left-2 bottom-16" style={{ width: "1px", background: "rgba(255,255,255,0.08)", borderLeft: "1px dashed rgba(255,255,255,0.06)" }} />
                <div className="absolute top-4 right-2 bottom-16" style={{ width: "1px", background: "rgba(255,255,255,0.08)", borderRight: "1px dashed rgba(255,255,255,0.06)" }} />
              </div>

              {/* Medallón dorado — más ancho que la cinta, se solapa */}
              <div
                className="relative -mt-16 w-[108px] h-[108px] rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle at 30% 28%, #ffe89a 0%, #d4a83a 28%, #b8923f 58%, #8a6a22 100%)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.65), inset -6px -6px 14px rgba(60,35,5,0.6), inset 4px 4px 8px rgba(255,240,160,0.5)",
                  border: "2.5px solid #6b5018",
                }}
              >
                {/* Círculo interior grabado */}
                <div className="absolute inset-3 rounded-full" style={{ border: "1px solid rgba(60,35,5,0.3)" }} />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[8px] tracking-[0.25em] font-bold uppercase" style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}>
                    Temporada
                  </span>
                  {/* Flor asterisco */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="2" fill="#3a2c10" />
                    {[0,45,90,135,180,225,270,315].map((deg) => (
                      <line key={deg}
                        x1={12 + 2.5 * Math.cos(deg * Math.PI/180)}
                        y1={12 + 2.5 * Math.sin(deg * Math.PI/180)}
                        x2={12 + 7 * Math.cos(deg * Math.PI/180)}
                        y2={12 + 7 * Math.sin(deg * Math.PI/180)}
                        stroke="#3a2c10" strokeWidth="1.2" strokeLinecap="round"
                      />
                    ))}
                  </svg>
                  <span className="text-[8px] tracking-[0.25em] font-bold uppercase" style={{ color: "#3a2c10", fontFamily: "'Cormorant Garamond', serif" }}>
                    {data.productName.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* TARJETA DE PAPEL */}
            <div className="seasonal-hero__paper px-7 md:px-10 py-6 md:py-8">
              {/* Textura papel */}
              <div className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-35" style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(150,100,50,0.12) 0%, transparent 30%), radial-gradient(circle at 78% 72%, rgba(120,80,40,0.14) 0%, transparent 35%)`,
              }} />

              {/* ORIGEN ○ */}
              <div className="relative mb-3">
                <span className="text-[22px] font-semibold tracking-[0.18em]" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#3d4a2a" }}>
                  ORIGEN ○
                </span>
              </div>

              {/* Badges */}
              <div className="relative flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ background: data.colors.primary, color: data.colors.cream, fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.activeBadge}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold" style={{ background: "#e8dcc0", color: data.colors.primary, border: `1px solid ${data.colors.beige}`, fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.seasonLabel}
                </span>
              </div>

              {/* Título */}
              <h3
                className="seasonal-hero__title relative leading-[0.95] mb-3 max-w-[460px]"
                style={{ fontFamily: "'Playfair Display', serif", color: data.colors.dark, fontWeight: 500, fontSize: "clamp(2.2rem, 3.2vw + 1rem, 3.5rem)" }}
              >
                {data.title.includes(" del ") ? (
                  <>{data.title.split(" del ")[0]}<br /><span>del {data.title.split(" del ")[1]}</span></>
                ) : data.title.includes(" de la ") ? (
                  <>{data.title.split(" de la ")[0]}<br /><span>de la {data.title.split(" de la ").slice(1).join(" de la ")}</span></>
                ) : data.title}
              </h3>

              {/* Meses */}
              <p className="relative text-[11px] tracking-[0.4em] uppercase font-semibold mb-3 flex flex-wrap items-center gap-x-3" style={{ color: data.colors.primary, fontFamily: "'Cormorant Garamond', serif" }}>
                {data.months.map((m, i) => (
                  <span key={m} className="inline-flex items-center gap-3">
                    <span style={{ borderBottom: `1.5px solid ${data.colors.accent}`, paddingBottom: "2px" }}>{m}</span>
                    {i < data.months.length - 1 && <span aria-hidden="true">·</span>}
                  </span>
                ))}
              </p>

              {/* Descripción + sello CLM */}
              <div className="relative flex flex-col md:flex-row gap-4 items-start mb-4">
                <p className="text-[14px] leading-[1.6] flex-1 max-w-[420px]" style={{ color: "#3a3326", fontFamily: "'Cormorant Garamond', serif" }}>
                  {data.description}
                </p>

                {/* Sello CLM mejorado */}
                <div className="seasonal-hero__clm-stamp relative w-[100px] h-[100px] flex-shrink-0 -rotate-[6deg] opacity-85" aria-hidden="true">
                  <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full">
                    <circle cx="60" cy="60" r="56" fill="rgba(241,229,200,0.15)" stroke="#7a6a3a" strokeWidth="1.5" opacity="0.9" />
                    <circle cx="60" cy="60" r="49" fill="none" stroke="#7a6a3a" strokeWidth="0.7" opacity="0.6" />
                    <defs>
                      <path id="arc-top" d="M 60,60 m -43,0 a 43,43 0 0,1 86,0" />
                      <path id="arc-bot" d="M 60,60 m -43,0 a 43,43 0 1,0 86,0" />
                    </defs>
                    <text fill="#6b5832" style={{ fontSize: "9px", letterSpacing: "0.28em", fontFamily: "serif" }}>
                      <textPath href="#arc-top" startOffset="50%" textAnchor="middle">CASTILLA · LA MANCHA</textPath>
                    </text>
                    <text fill="#6b5832" style={{ fontSize: "8px", letterSpacing: "0.35em", fontFamily: "serif" }}>
                      <textPath href="#arc-bot" startOffset="50%" textAnchor="middle">ORIGEN ○</textPath>
                    </text>
                    {/* Molino de viento */}
                    <g transform="translate(60 56)">
                      <line x1="0" y1="-14" x2="0" y2="12" stroke="#6b5832" strokeWidth="1.2" />
                      <line x1="-10" y1="12" x2="10" y2="12" stroke="#6b5832" strokeWidth="1" />
                      <circle cx="0" cy="-2" r="1.5" fill="#6b5832" />
                      <line x1="0" y1="-2" x2="8" y2="-9" stroke="#6b5832" strokeWidth="1" />
                      <line x1="0" y1="-2" x2="-8" y2="-9" stroke="#6b5832" strokeWidth="1" />
                      <line x1="0" y1="-2" x2="8" y2="5" stroke="#6b5832" strokeWidth="1" />
                      <line x1="0" y1="-2" x2="-8" y2="5" stroke="#6b5832" strokeWidth="1" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Cita italic */}
              <p className="relative text-[13.5px] italic mb-4 pb-4" style={{ color: "#5a4a30", fontFamily: "'Cormorant Garamond', serif", borderBottom: `1px dashed ${data.colors.beige}` }}>
                {data.quote}
              </p>

              {/* CTAs */}
              <div className="relative flex flex-wrap gap-3">
                <Link to={data.ctas.primary.href}>
                  <button className="seasonal-hero__cta-primary group inline-flex items-center gap-3 px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {data.ctas.primary.label}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <Link to={data.ctas.secondary.href}>
                  <button className="seasonal-hero__cta-secondary group inline-flex items-center gap-3 px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {data.ctas.secondary.label}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* ============ COLUMNA DERECHA — COLLAGE ============ */}
          <div className="col-span-12 lg:col-span-5 relative" style={{ minHeight: "500px" }}>

            {/* POLAROID PRINCIPAL (grande, arriba izq del collage) */}
            <div
              className="seasonal-hero__polaroid absolute top-0 left-[2%] w-[76%] rotate-[1.5deg] z-10"
              style={{ padding: "11px 11px 46px 11px" }}
            >
              <div className="aspect-[5/4] w-full overflow-hidden" style={{ background: "#3a2516" }}>
                <img
                  src={data.images.hero} alt={`${data.productName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => handleImgError(e, fallback.hero)}
                />
              </div>
              {/* Chincheta dorada */}
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10" style={{
                background: "radial-gradient(circle at 30% 30%, #f5d97a 0%, #b8923f 70%, #6b5220 100%)",
                boxShadow: "0 2px 5px rgba(0,0,0,0.7)",
              }} />
              <p className="absolute bottom-3 left-0 right-0 text-center text-[18px]" style={{ fontFamily: "'Caveat', cursive", color: "#3a3326" }}>
                {`${data.productName} de ${data.sideNote.title.split("–").slice(-1)[0]?.trim() ?? data.sideNote.title}`}
              </p>
            </div>

            {/* TARJETA REGIÓN Castilla-La Mancha */}
            <div
              className="absolute z-20 rotate-[3.5deg]"
              style={{
                top: "-6px", right: "1%", width: "38%",
                background: "linear-gradient(160deg, #f8eedb 0%, #ecd9b2 100%)",
                padding: "14px 12px 12px 12px",
                boxShadow: "0 16px 32px -8px rgba(0,0,0,0.6)",
                clipPath: "polygon(0% 2%, 6% 0%, 35% 2%, 70% 0.5%, 95% 1.5%, 100% 6%, 99% 35%, 100% 65%, 98% 93%, 93% 100%, 62% 99%, 30% 100%, 5% 99%, 1% 94%, 0% 68%, 1% 35%, 0% 7%)",
              }}
            >
              {/* Flores lavanda — más visibles */}
              <svg className="absolute -right-3 -top-4 z-30" width="64" height="110" viewBox="0 0 64 110">
                <line x1="18" y1="108" x2="20" y2="22" stroke="#4a5e28" strokeWidth="1.2" />
                <line x1="32" y1="108" x2="36" y2="14" stroke="#4a5e28" strokeWidth="1.2" />
                <line x1="46" y1="108" x2="48" y2="24" stroke="#4a5e28" strokeWidth="1.2" />
                {/* Pétalos lavanda */}
                {[14,19,24,29,34].map((y, i) => (
                  <g key={i}>
                    <ellipse cx="20" cy={y+5} rx="3.2" ry="4.2" fill="#b4a0c8" opacity="0.9" />
                    <ellipse cx="36" cy={y} rx="3.2" ry="4.2" fill="#9d8db5" opacity="0.9" />
                    <ellipse cx="48" cy={y+7} rx="3.2" ry="4.2" fill="#b4a0c8" opacity="0.9" />
                  </g>
                ))}
              </svg>

              <p className="text-[9.5px] tracking-[0.2em] uppercase font-bold text-center mb-2" style={{ color: data.colors.primary, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.2 }}>
                {data.sideNote.title.replace("–", "–\n")}
              </p>

              {/* Mapa CLM mejorado */}
              <svg viewBox="0 0 140 95" className="w-full h-auto mb-2" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>
                {/* Sombra */}
                <path d="M 22,36 C 18,30 20,24 26,22 L 40,20 C 46,18 53,20 57,17 L 68,15 C 74,13 82,15 88,20 L 102,24 C 110,27 116,32 118,38 L 122,50 C 124,58 120,67 114,71 L 102,77 C 94,81 86,83 78,83 L 65,85 C 57,87 49,85 43,81 L 33,73 C 27,67 22,58 20,50 L 20,42 Z" fill="rgba(0,0,0,0.08)" transform="translate(2,2)" />
                {/* Contorno C-LM */}
                <path d="M 22,36 C 18,30 20,24 26,22 L 40,20 C 46,18 53,20 57,17 L 68,15 C 74,13 82,15 88,20 L 102,24 C 110,27 116,32 118,38 L 122,50 C 124,58 120,67 114,71 L 102,77 C 94,81 86,83 78,83 L 65,85 C 57,87 49,85 43,81 L 33,73 C 27,67 22,58 20,50 L 20,42 Z"
                  fill="#f3e8cc" stroke="#8a7040" strokeWidth="1.4" strokeLinejoin="round" />
                {/* Sub-región verde */}
                <path d="M 56,40 C 62,33 73,33 81,38 C 89,43 93,50 90,58 C 86,66 76,68 66,66 C 55,64 49,55 51,48 C 52,44 54,42 56,40 Z"
                  fill={data.colors.primary} stroke="#2d3b1a" strokeWidth="1" opacity="0.9" />
                {/* Punto capital */}
                <circle cx="70" cy="51" r="2.2" fill="#f8eedb" />
                <circle cx="70" cy="51" r="1" fill={data.colors.accent} />
                {/* Nombres de provincias en miniatura */}
                <text x="70" y="27" textAnchor="middle" fill="#7a6040" style={{ fontSize: "5px", fontFamily: "serif", letterSpacing: "0.05em" }}>GUADALAJARA</text>
                <text x="40" y="52" textAnchor="middle" fill="#f8eedb" style={{ fontSize: "5.5px", fontFamily: "serif", fontWeight: "bold" }}>C. REAL</text>
                <text x="100" y="55" textAnchor="middle" fill="#7a6040" style={{ fontSize: "5px", fontFamily: "serif" }}>ALBACETE</text>
              </svg>

              <p className="text-[10px] leading-[1.4] text-center" style={{ color: "#3a3326", fontFamily: "'Cormorant Garamond', serif" }}>
                {data.sideNote.text}
              </p>
            </div>

            {/* CITA MANUSCRITA flotante */}
            <div className="seasonal-hero__handwritten--floating hidden md:block absolute z-0 rotate-[-3.5deg]" style={{ top: "58%", left: "-20%", maxWidth: "170px" }} aria-hidden="true">
              <p className="seasonal-hero__handwritten text-[24px]">{data.handwrittenNote}</p>
              <svg width="80" height="10" viewBox="0 0 80 10" className="opacity-60">
                <path d="M0 5 Q 20 0 40 4 T 80 3" stroke="#f5e4b8" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* POLAROID inferior izquierda */}
            <div className="seasonal-hero__polaroid absolute w-[42%] rotate-[-4deg] z-10" style={{ bottom: "8px", left: "4%", padding: "9px 9px 34px 9px" }}>
              <div className="aspect-[4/3] w-full overflow-hidden" style={{ background: "#3a2516" }}>
                <img src={data.images.sheep} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => handleImgError(e, fallback.sheep)} />
              </div>
              {/* Clip plateado */}
              <span className="absolute -top-3 right-4 w-4 h-8 rounded-sm rotate-[15deg]" style={{ background: "linear-gradient(180deg, #d8d4c0 0%, #a8a49a 50%, #d8d4c0 100%)", border: "1px solid #888473", boxShadow: "1px 1px 3px rgba(0,0,0,0.5)" }} />
            </div>

            {/* POLAROID inferior derecha */}
            <div className="seasonal-hero__polaroid absolute w-[40%] rotate-[5deg] z-10" style={{ bottom: "16px", right: "6%", padding: "9px 9px 34px 9px" }}>
              <div className="aspect-[4/5] w-full overflow-hidden" style={{ background: "#3a2516" }}>
                <img src={data.images.maker} alt="" className="w-full h-full object-cover" loading="lazy" onError={(e) => handleImgError(e, fallback.maker)} />
              </div>
              {/* Clip dorado */}
              <span className="absolute -top-2 left-5 w-3.5 h-7 rounded-sm rotate-[-10deg]" style={{ background: "linear-gradient(180deg, #e8c66a 0%, #b8923f 50%, #e8c66a 100%)", border: "1px solid #6b5220", boxShadow: "1px 1px 3px rgba(0,0,0,0.5)" }} />
            </div>
          </div>
        </div>

        {/* CINTA BEIGE FEATURES */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6">
          <div className="seasonal-hero__features-ribbon px-6 md:px-12 py-4 md:py-5">
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.features.map((f) => {
                const Icon = FEATURE_ICON_MAP[f.icon] ?? Wheat;
                return (
                  <div key={f.label} className="flex items-center justify-center md:justify-start gap-3">
                    <Icon className="w-6 h-6 flex-shrink-0" style={{ color: data.colors.primary, strokeWidth: 1.4 }} />
                    <p className="text-[13px] leading-[1.2] font-medium" style={{ color: "#3a3326", fontFamily: "'Cormorant Garamond', serif" }}>
                      {f.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CINTA VERDE STATS — directamente pegada a la beige */}
        <div className="relative z-10 pb-8 md:pb-12">
          <div className="seasonal-hero__stats-ribbon max-w-[1280px] mx-auto px-6 md:px-10 py-5 md:py-6">
            <div className="flex flex-wrap items-center justify-around gap-6 md:gap-10">
              {/* Decoración pastor */}
              <svg viewBox="0 0 110 50" className="hidden md:block w-[110px] h-auto opacity-85" aria-hidden="true">
                <path d="M30 38 L30 28 L25 22 L28 16 L33 16 L36 22 L32 28 L33 38" stroke="#e8dcc0" strokeWidth="0.8" fill="none" />
                <line x1="36" y1="22" x2="42" y2="14" stroke="#e8dcc0" strokeWidth="0.8" />
                <ellipse cx="55" cy="40" rx="6" ry="4" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
                <circle cx="50" cy="38" r="1.5" fill="#e8dcc0" />
                <ellipse cx="72" cy="42" rx="5" ry="3" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
                <circle cx="68" cy="40" r="1.2" fill="#e8dcc0" />
                <ellipse cx="86" cy="40" rx="5" ry="3.5" fill="none" stroke="#e8dcc0" strokeWidth="0.8" />
                <line x1="2" y1="46" x2="108" y2="46" stroke="#e8dcc0" strokeWidth="0.4" />
              </svg>

              {data.stats.map((stat, i) => (
                <StatBlock key={`${stat.label}-${i}`} value={stat.value} label={stat.label} icon={stat.icon} accent={data.colors.accent}
                  href={stat.icon === "seal" ? "/customer-auth?intent=suscribirme" : undefined} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// ============================================================
// StatBlock
// ============================================================
interface StatBlockProps { value: string; label: string; icon: SeasonStatIcon; accent: string; href?: string; }

const StatBlock = ({ value, label, icon, accent, href }: StatBlockProps) => {
  const content = (
    <div className="flex items-center gap-3">
      {icon === "route" && (
        <svg viewBox="0 0 30 40" width="28" height="36" fill="none" aria-hidden="true">
          <line x1="15" y1="6" x2="15" y2="38" stroke={accent} strokeWidth="1.2" />
          <rect x="3" y="10" width="20" height="6" stroke={accent} strokeWidth="1" fill="none" />
          <polygon points="23,10 27,13 23,16" fill={accent} />
          <rect x="7" y="20" width="20" height="6" stroke={accent} strokeWidth="1" fill="none" />
          <polygon points="7,20 3,23 7,26" fill={accent} />
        </svg>
      )}
      {icon === "producer" && <Users className="w-7 h-7" style={{ color: accent }} aria-hidden="true" />}
      {icon === "seal" && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${accent}` }} aria-hidden="true">
          <Star className="w-4 h-4" style={{ color: accent }} />
        </div>
      )}
      {/^\d/.test(value) ? (
        <>
          <span className="text-[38px] leading-none font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: accent }}>{value}</span>
          <div className="text-left">
            <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e8dcc0" }}>{label.split(" ")[0]}</p>
            <p className="text-[13px] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e8dcc0" }}>{label.split(" ").slice(1).join(" ")}</p>
          </div>
        </>
      ) : (
        <div className="text-left">
          <p className="text-[13px] leading-tight font-medium" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e8dcc0" }}>{value}</p>
          <p className="text-[13px] leading-tight underline decoration-dotted underline-offset-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#e8dcc0" }}>{label}</p>
        </div>
      )}
    </div>
  );
  if (href) return <Link to={href} className="group">{content}</Link>;
  return content;
};

export default SeasonalHero;
