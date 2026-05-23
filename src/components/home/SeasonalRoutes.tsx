import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Star, ArrowRight, Bookmark, ChevronDown } from "lucide-react";
import { useRoutesBySeason } from "@/hooks/useRoutesBySeason";
import { getCurrentSeasonInfo } from "@/lib/season";
import { getDemoRoutesBySeason, type DemoRoute } from "@/data/seasonalRoutesDemo";

// ─── Colores ────────────────────────────────────────────────
const C = {
  brown:     "#2a1c10",
  brownMid:  "#5a3e28",
  olive:     "#3d4a2a",
  oliveLight:"#4a5a2e",
  gold:      "#b8923f",
  cream:     "#f5f0e8",
  beige:     "#e8dcc0",
  beigeText: "#6b5a3e",
};

// ─── Imágenes por categoría ──────────────────────────────────
const CAT_IMAGES: Record<string, string> = {
  bodega:      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=85",
  queseria:    "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=85",
  mercado:     "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=85",
  gastronomia: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85",
  naturaleza:  "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=800&q=85",
  default:     "https://images.unsplash.com/photo-1555532538-dcdbd01d373d?auto=format&fit=crop&w=800&q=85",
};

// ─── Mapeado season → categoría de las tarjetas demo ────────
const DEMO_CAT: Record<string, { cat: string; label: string; color: string }[]> = {
  queso: [
    { cat: "queseria",    label: "QUESERÍA",    color: "#4a5a2e" },
    { cat: "naturaleza",  label: "NATURALEZA",  color: "#3a6040" },
    { cat: "gastronomia", label: "GASTRONOMÍA", color: "#6b3a20" },
  ],
  caza: [
    { cat: "naturaleza", label: "NATURALEZA", color: "#3a6040" },
    { cat: "mercado",    label: "MERCADO",    color: "#5a4020" },
  ],
  vino: [
    { cat: "bodega",     label: "BODEGA",      color: "#6b3a20" },
    { cat: "gastronomia",label: "GASTRONOMÍA", color: "#4a5a2e" },
  ],
  miel: [
    { cat: "mercado",    label: "MERCADO",     color: "#5a4020" },
    { cat: "naturaleza", label: "NATURALEZA",  color: "#3a6040" },
  ],
};

// ─── Filtros de categoría ────────────────────────────────────
const FILTER_CATS = [
  { id: "todas",       label: "Todas las rutas", icon: <BookIcon /> },
  { id: "bodegas",     label: "Bodegas",         icon: <WineIcon /> },
  { id: "queso",       label: "Queserías",       icon: <CheeseIcon /> },
  { id: "mercado",     label: "Mercados",        icon: <BasketIcon /> },
  { id: "gastronomia", label: "Gastronomía",     icon: <ForkIcon /> },
  { id: "naturaleza",  label: "Naturaleza",      icon: <LeafIcon /> },
];

// ─── Sello "RUTA VERIFICADA" ─────────────────────────────────
const VerifiedBadge = () => (
  <div
    className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
    style={{
      background: "rgba(245,240,232,0.96)",
      border: `2px solid ${C.olive}`,
      boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    }}
  >
    <svg viewBox="0 0 80 80" width="68" height="68">
      <defs>
        <path id="rv-arc" d="M 40,40 m -30,0 a 30,30 0 0,1 60,0" />
        <path id="rv-arc2" d="M 40,40 m -30,0 a 30,30 0 1,0 60,0" />
      </defs>
      <text fill={C.olive} style={{ fontSize: "7.5px", letterSpacing: "0.18em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#rv-arc" startOffset="50%" textAnchor="middle">RUTA</textPath>
      </text>
      <text fill={C.olive} style={{ fontSize: "7.5px", letterSpacing: "0.14em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#rv-arc2" startOffset="50%" textAnchor="middle">VERIFICADA</textPath>
      </text>
      {/* Hoja central */}
      <g transform="translate(40,40)">
        <path d="M0,-10 C6,-6 6,0 0,8 C-6,0 -6,-6 0,-10 Z" fill={C.olive} opacity="0.85" />
        <line x1="0" y1="-10" x2="0" y2="8" stroke={C.cream} strokeWidth="0.8" />
        <path d="M0,-2 C3,-5 0,-8 0,-8 M0,-2 C-3,-5 0,-8 0,-8" stroke={C.cream} strokeWidth="0.5" fill="none" />
      </g>
    </svg>
  </div>
);

// ─── Sello grande "VERIFICADO EN PERSONA" del header ────────
const HeaderStamp = () => (
  <div
    className="w-[100px] h-[100px] rounded-full flex items-center justify-center flex-shrink-0"
    style={{
      background: C.cream,
      border: `2px solid ${C.olive}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    }}
  >
    <svg viewBox="0 0 110 110" width="100" height="100">
      <defs>
        <path id="hs-top" d="M 55,55 m -42,0 a 42,42 0 0,1 84,0" />
        <path id="hs-bot" d="M 55,55 m -42,0 a 42,42 0 1,0 84,0" />
      </defs>
      <text fill={C.olive} style={{ fontSize: "8px", letterSpacing: "0.22em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#hs-top" startOffset="50%" textAnchor="middle">VERIFICADO</textPath>
      </text>
      <text fill={C.olive} style={{ fontSize: "8px", letterSpacing: "0.12em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#hs-bot" startOffset="50%" textAnchor="middle">EN PERSONA</textPath>
      </text>
      {/* Rama con hojas */}
      <g transform="translate(55,52)">
        <line x1="0" y1="-14" x2="0" y2="10" stroke={C.olive} strokeWidth="1.2" />
        <path d="M0,-2 C7,-8 12,-4 8,2 C4,6 0,-2 0,-2 Z" fill={C.olive} opacity="0.8" />
        <path d="M0,-2 C-7,-8 -12,-4 -8,2 C-4,6 0,-2 0,-2 Z" fill={C.olive} opacity="0.8" />
        <path d="M0,-10 C5,-16 10,-12 7,-6 C4,-2 0,-10 0,-10 Z" fill={C.olive} opacity="0.7" />
        <path d="M0,-10 C-5,-16 -10,-12 -7,-6 C-4,-2 0,-10 0,-10 Z" fill={C.olive} opacity="0.7" />
      </g>
    </svg>
  </div>
);

// ─── Estrella ────────────────────────────────────────────────
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill={filled ? "#d4a03a" : "none"} stroke={filled ? "#d4a03a" : "#c4a870"} strokeWidth="1.5">
    <path d="M10 1.5l2.47 5 5.53.8-4 3.9.94 5.5L10 14.5l-4.94 2.2.94-5.5-4-3.9 5.53-.8z" />
  </svg>
);

// ─── Decoración botánica header (esquina derecha) ────────────
const BotanicalCorner = () => (
  <svg viewBox="0 0 80 120" width="64" height="96" fill="none" className="absolute top-0 right-0 opacity-50" aria-hidden="true">
    <line x1="40" y1="115" x2="42" y2="20" stroke={C.olive} strokeWidth="1.2" />
    {[20,32,44,56,68,80].map((y, i) => (
      <g key={i}>
        <path d={`M42,${y} C52,${y-8} 62,${y-4} 58,${y+6} C54,${y+12} 42,${y} 42,${y} Z`} fill={C.olive} opacity={0.55 - i*0.04} />
        <path d={`M42,${y} C32,${y-8} 22,${y-4} 26,${y+6} C30,${y+12} 42,${y} 42,${y} Z`} fill={C.olive} opacity={0.45 - i*0.04} />
      </g>
    ))}
    <path d="M42,20 C46,12 52,8 50,14 Z" fill={C.olive} opacity="0.5" />
    <path d="M42,20 C38,12 32,8 34,14 Z" fill={C.olive} opacity="0.4" />
  </svg>
);

// ─── Decoración botánica footer ──────────────────────────────
const BotanicalSmall = () => (
  <svg viewBox="0 0 60 80" width="44" height="60" fill="none" aria-hidden="true" style={{ opacity: 0.5 }}>
    <line x1="30" y1="78" x2="32" y2="18" stroke={C.olive} strokeWidth="1" />
    {[18,30,42,54,66].map((y, i) => (
      <g key={i}>
        <path d={`M32,${y} C40,${y-6} 48,${y-2} 44,${y+5} C40,${y+9} 32,${y} 32,${y} Z`} fill={C.olive} opacity={0.5 - i*0.05} />
        <path d={`M32,${y} C24,${y-6} 16,${y-2} 20,${y+5} C24,${y+9} 32,${y} 32,${y} Z`} fill={C.olive} opacity={0.4 - i*0.04} />
      </g>
    ))}
  </svg>
);

// ─── Icons para filtros ──────────────────────────────────────
function BookIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 3h12v14H4z"/><line x1="8" y1="3" x2="8" y2="17"/></svg>;
}
function WineIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 2h8l-1 6a4 4 0 0 1-8 0Z"/><line x1="10" y1="12" x2="10" y2="18"/><line x1="7" y1="18" x2="13" y2="18"/></svg>;
}
function CheeseIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 11 L10 4 L18 11 L18 15 Q18 16 17 16 L3 16 Q2 16 2 15 Z"/><circle cx="7" cy="13" r="0.8" fill="currentColor"/><circle cx="13" cy="12" r="0.8" fill="currentColor"/></svg>;
}
function BasketIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 9h14l-1.5 7H4.5Z"/><path d="M6 9L9 4"/><path d="M14 9l-3-5"/></svg>;
}
function ForkIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="7" y1="2" x2="7" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><path d="M7 8 Q7 12 8.5 12 L8.5 18"/><line x1="14" y1="2" x2="14" y2="18"/></svg>;
}
function LeafIcon() {
  return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 18 C4 18 6 10 14 6 C18 4 18 4 18 4 C18 4 16 10 10 14 C7 16 4 18 4 18 Z"/><line x1="4" y1="18" x2="10" y2="12"/></svg>;
}

// ─── Tarjeta de ruta ─────────────────────────────────────────
interface RouteCardProps {
  route: DemoRoute;
  catLabel: string;
  catColor: string;
  catKey: string;
  stops: number;
}

const RouteCard = ({ route, catLabel, catColor, catKey, stops }: RouteCardProps) => {
  const [saved, setSaved] = useState(false);
  const imgSrc = CAT_IMAGES[catKey] ?? CAT_IMAGES.default;

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 2px 16px rgba(42,28,16,0.10), 0 1px 4px rgba(42,28,16,0.07)",
        border: "1px solid rgba(232,220,192,0.6)",
      }}
    >
      {/* FOTO */}
      <div className="relative w-full overflow-hidden" style={{ height: "200px" }}>
        <img
          src={imgSrc}
          alt={route.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        {/* Degradado bottom */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Badge categoría */}
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: catColor, color: "#fff", backdropFilter: "blur(4px)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0" />
          {catLabel}
        </span>

        {/* Sello verificada — esquina inferior derecha, solapando */}
        <div className="absolute -bottom-5 right-4 z-10">
          <VerifiedBadge />
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-col flex-1 px-5 pt-8 pb-5 gap-3">
        {/* Título */}
        <h3
          className="leading-tight"
          style={{
            color: C.brown,
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: "clamp(1rem, 1.2vw + 0.6rem, 1.2rem)",
            fontWeight: 600,
          }}
        >
          {route.title}
        </h3>

        {/* Descripción */}
        <p
          className="text-[13px] leading-[1.55] line-clamp-2"
          style={{ color: C.beigeText }}
        >
          {route.description}
        </p>

        {/* Info paradas | duración | máx. */}
        <div
          className="flex items-center gap-4 text-[12px] pt-1 flex-wrap"
          style={{ color: C.beigeText }}
        >
          <span className="flex items-center gap-1">
            <MapPin size={12} style={{ color: C.olive }} />
            {stops} paradas
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} style={{ color: C.olive }} />
            {route.duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} style={{ color: C.olive }} />
            Máx. {route.capacity}
          </span>
        </div>

        {/* Estrellas */}
        <div className="flex items-center gap-1 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < Math.round(route.rating)} />
          ))}
          <span className="text-[12px] font-semibold ml-1.5" style={{ color: C.brownMid }}>
            {route.rating.toFixed(1)}
          </span>
          <span className="text-[11px] ml-0.5" style={{ color: C.beigeText }}>
            ({Math.floor(route.rating * 5 + 10)})
          </span>
        </div>

        {/* CTA row */}
        <div className="flex items-center gap-2 mt-1">
          <Link to={`/rutas/${route.slug}`} className="flex-1">
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold tracking-[0.14em] uppercase transition-all hover:opacity-90"
              style={{ background: C.brown, color: C.cream }}
            >
              Ver ruta completa
              <ArrowRight size={13} />
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border transition-all"
            style={{
              borderColor: saved ? C.gold : "rgba(232,220,192,0.8)",
              background: saved ? `${C.gold}18` : "transparent",
            }}
            title={saved ? "Guardado" : "Guardar"}
          >
            <Bookmark size={15} fill={saved ? C.gold : "none"} stroke={saved ? C.gold : C.beigeText} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Componente principal ────────────────────────────────────
const SeasonalRoutes = () => {
  const seasonInfo = getCurrentSeasonInfo();
  const { routes: dbRoutes } = useRoutesBySeason({ limit: 3 });
  const [activeFilter, setActiveFilter] = useState("todas");
  const [sortBy, setSortBy] = useState("Más recientes");

  const demoRoutes = getDemoRoutesBySeason(seasonInfo.id, 3);
  const routes = dbRoutes.length > 0 ? [] : demoRoutes; // usa demo si BD vacía

  const cats = DEMO_CAT[seasonInfo.id] ?? DEMO_CAT.queso;

  return (
    <section style={{ backgroundColor: C.cream }} className="w-full">
      {/* ── HEADER SECCIÓN ── */}
      <div className="max-w-[1280px] mx-auto px-6 pt-12 pb-8 relative">
        <BotanicalCorner />

        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Izquierda: eyebrow + título + subtítulo */}
          <div className="flex-1">
            {/* Eyebrow */}
            <p
              className="text-[11px] font-bold uppercase tracking-[0.35em] mb-3"
              style={{ color: C.gold }}
            >
              Rutas
            </p>

            {/* Título — mismo tamaño que "El Mapa" */}
            <h2
              className="font-bold leading-tight tracking-tight mb-3"
              style={{
                color: C.brown,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(1.5rem, 1rem + 2.4vw, 2.875rem)",
              }}
            >
              Experiencias curadas,<br className="hidden sm:block" /> verificadas en persona
            </h2>

            <p className="text-[14px] leading-relaxed" style={{ color: C.beigeText, maxWidth: "540px" }}>
              Rutas activas para esta temporada. Cada una visitada y aprobada por nuestro equipo antes de salir publicada.
            </p>
          </div>

          {/* Derecha: sello + claim */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Línea divisora */}
            <div className="hidden lg:block w-px self-stretch" style={{ background: "rgba(184,146,63,0.3)" }} />
            <HeaderStamp />
            <p
              className="text-[15px] leading-snug font-medium max-w-[160px]"
              style={{ color: C.brownMid, fontFamily: "'Cormorant Garamond', serif" }}
            >
              Solo recomendamos lo que hemos vivido.
            </p>
          </div>
        </div>

        {/* ── FILTROS + ORDENAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-7">
          {/* Chips de categoría */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_CATS.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                  style={{
                    background: active ? C.olive : "transparent",
                    color: active ? "#fff" : C.brownMid,
                    border: active ? `1.5px solid ${C.olive}` : `1.5px solid rgba(184,146,63,0.35)`,
                  }}
                >
                  <span style={{ color: active ? "#fff" : C.olive }}>{f.icon}</span>
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Ordenar por */}
          <div className="relative">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-medium cursor-pointer"
              style={{ border: `1.5px solid rgba(184,146,63,0.35)`, color: C.brownMid, background: "#fff" }}
            >
              <span style={{ color: C.beigeText }}>Ordenar por</span>
              <span style={{ color: C.brown, fontWeight: 600 }}>{sortBy}</span>
              <ChevronDown size={13} style={{ color: C.beigeText }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── GRID DE RUTAS ── */}
      <div className="max-w-[1280px] mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-4">
          {routes.map((r, i) => {
            const catInfo = cats[i % cats.length];
            return (
              <RouteCard
                key={r.id}
                route={r}
                catLabel={catInfo.label}
                catColor={catInfo.color}
                catKey={catInfo.cat}
                stops={parseInt(r.recorrido.split("→").length.toString()) + 1}
              />
            );
          })}
        </div>

        {/* ── CTA FOOTER ── */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link to="/rutas">
            <button
              className="flex items-center gap-2 px-8 py-3 rounded-2xl text-[13px] font-semibold tracking-[0.1em] transition-all hover:bg-white"
              style={{
                border: `1.5px solid rgba(184,146,63,0.5)`,
                color: C.brownMid,
                background: "transparent",
              }}
            >
              Ver todas las rutas
              <ArrowRight size={14} style={{ color: C.gold }} />
            </button>
          </Link>
          <BotanicalSmall />
        </div>
      </div>
    </section>
  );
};

export default SeasonalRoutes;
