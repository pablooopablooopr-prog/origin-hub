import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, Users, ArrowRight, Bookmark, ChevronDown } from "lucide-react";
import { useRoutesBySeason } from "@/hooks/useRoutesBySeason";
import { getCurrentSeasonInfo } from "@/lib/season";
import { getDemoRoutesBySeason } from "@/data/seasonalRoutesDemo";

// ─── Colores ────────────────────────────────────────────────
const C = {
  brown:     "#2a1c10",
  brownMid:  "#5a3e28",
  olive:     "#3d4a2a",
  gold:      "#b8923f",
  bg:        "#efe7d6",   // ligeramente más cálido que la sección de arriba
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

// ─── Tipo unificado para tarjetas ────────────────────────────
interface URoute {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  capacity: number;
  rating: number;
  stops: number;
  reviews: number;
  image?: string;
}

// ─── Mapeado season → categorías visuales ───────────────────
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
    { cat: "bodega",      label: "BODEGA",      color: "#6b3a20" },
    { cat: "gastronomia", label: "GASTRONOMÍA", color: "#4a5a2e" },
  ],
  miel: [
    { cat: "mercado",    label: "MERCADO",     color: "#5a4020" },
    { cat: "naturaleza", label: "NATURALEZA",  color: "#3a6040" },
  ],
};

// ─── Filtros ─────────────────────────────────────────────────
const FILTER_CATS = [
  { id: "todas",       label: "Todas las rutas", icon: <BookIcon /> },
  { id: "bodegas",     label: "Bodegas",         icon: <WineIcon /> },
  { id: "queso",       label: "Queserías",       icon: <CheeseIcon /> },
  { id: "mercado",     label: "Mercados",        icon: <BasketIcon /> },
  { id: "gastronomia", label: "Gastronomía",     icon: <ForkIcon /> },
  { id: "naturaleza",  label: "Naturaleza",      icon: <LeafIcon /> },
];

// ─── Sello "RUTA VERIFICADA" (tarjeta) ──────────────────────
const VerifiedBadge = () => (
  <div
    className="w-[70px] h-[70px] rounded-full flex items-center justify-center"
    style={{
      background: "rgba(245,240,232,0.97)",
      border: `2px solid ${C.olive}`,
      boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
    }}
  >
    <svg viewBox="0 0 80 80" width="64" height="64">
      <defs>
        <path id="rv-arc" d="M 40,40 m -29,0 a 29,29 0 0,1 58,0" />
        <path id="rv-arc2" d="M 40,40 m -29,0 a 29,29 0 1,0 58,0" />
      </defs>
      <text fill={C.olive} style={{ fontSize: "7.5px", letterSpacing: "0.2em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#rv-arc" startOffset="50%" textAnchor="middle">RUTA</textPath>
      </text>
      <text fill={C.olive} style={{ fontSize: "7px", letterSpacing: "0.13em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#rv-arc2" startOffset="50%" textAnchor="middle">VERIFICADA</textPath>
      </text>
      <LeafSprig cx={40} cy={40} scale={1} />
    </svg>
  </div>
);

// ─── Sello header "VERIFICADO EN PERSONA" ───────────────────
const HeaderStamp = () => (
  <div
    className="w-[104px] h-[104px] rounded-full flex items-center justify-center flex-shrink-0"
    style={{
      background: C.cream,
      border: `2px solid ${C.olive}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    }}
  >
    <svg viewBox="0 0 110 110" width="104" height="104">
      <defs>
        <path id="hs-top" d="M 55,55 m -42,0 a 42,42 0 0,1 84,0" />
        <path id="hs-bot" d="M 55,55 m -42,0 a 42,42 0 1,0 84,0" />
      </defs>
      <text fill={C.olive} style={{ fontSize: "8px", letterSpacing: "0.22em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#hs-top" startOffset="50%" textAnchor="middle">VERIFICADO</textPath>
      </text>
      <text fill={C.olive} style={{ fontSize: "8px", letterSpacing: "0.13em", fontFamily: "serif", fontWeight: "bold" }}>
        <textPath href="#hs-bot" startOffset="50%" textAnchor="middle">EN PERSONA</textPath>
      </text>
      <LeafSprig cx={55} cy={55} scale={1.5} />
    </svg>
  </div>
);

// ─── Ramita de olivo (centro de sellos) ─────────────────────
function LeafSprig({ cx, cy, scale }: { cx: number; cy: number; scale: number }) {
  return (
    <g transform={`translate(${cx},${cy}) scale(${scale})`}>
      {/* tallo */}
      <line x1="0" y1="-9" x2="0" y2="9" stroke={C.olive} strokeWidth="1.1" />
      {/* hojas pares */}
      {[-6, 0, 6].map((y) => (
        <g key={y}>
          <path d={`M0,${y} C5,${y-4} 8,${y-1} 5,${y+3} C2,${y+5} 0,${y} 0,${y} Z`} fill={C.olive} opacity="0.85" />
          <path d={`M0,${y} C-5,${y-4} -8,${y-1} -5,${y+3} C-2,${y+5} 0,${y} 0,${y} Z`} fill={C.olive} opacity="0.85" />
        </g>
      ))}
    </g>
  );
}

// ─── Estrella ────────────────────────────────────────────────
const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 20 20" width="14" height="14" fill={filled ? "#d4a03a" : "none"} stroke={filled ? "#d4a03a" : "#c4a870"} strokeWidth="1.5">
    <path d="M10 1.5l2.47 5 5.53.8-4 3.9.94 5.5L10 14.5l-4.94 2.2.94-5.5-4-3.9 5.53-.8z" />
  </svg>
);

// ─── Ramita floral delicada (esquina header) ────────────────
const FloralSprig = ({ className = "", w = 70, h = 100 }: { className?: string; w?: number; h?: number }) => (
  <svg viewBox="0 0 70 100" width={w} height={h} fill="none" className={className} aria-hidden="true" style={{ opacity: 0.45 }}>
    {/* tallo principal curvo */}
    <path d="M35 98 C33 70 38 45 35 20" stroke={C.gold} strokeWidth="1" fill="none" strokeLinecap="round" />
    {/* ramitas laterales con florecitas */}
    {[
      { x: 35, y: 70, dir: -1 }, { x: 36, y: 56, dir: 1 },
      { x: 34, y: 42, dir: -1 }, { x: 36, y: 28, dir: 1 },
    ].map((b, i) => (
      <g key={i}>
        <path
          d={`M${b.x},${b.y} q ${b.dir * 12},-4 ${b.dir * 20},-12`}
          stroke={C.gold} strokeWidth="0.7" fill="none" strokeLinecap="round"
        />
        {/* florecitas al final */}
        {[0, 1, 2].map((j) => {
          const fx = b.x + b.dir * (12 + j * 4);
          const fy = b.y - 6 - j * 3;
          return (
            <g key={j}>
              {[0, 72, 144, 216, 288].map((deg) => (
                <ellipse key={deg}
                  cx={fx + 2 * Math.cos(deg * Math.PI / 180)}
                  cy={fy + 2 * Math.sin(deg * Math.PI / 180)}
                  rx="1.4" ry="1.4" fill={C.gold} opacity="0.6"
                />
              ))}
              <circle cx={fx} cy={fy} r="1" fill={C.gold} opacity="0.9" />
            </g>
          );
        })}
      </g>
    ))}
    {/* florecita superior */}
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg}
          cx={35 + 2.2 * Math.cos(deg * Math.PI / 180)}
          cy={20 + 2.2 * Math.sin(deg * Math.PI / 180)}
          rx="1.6" ry="1.6" fill={C.gold} opacity="0.65"
        />
      ))}
      <circle cx="35" cy="20" r="1.2" fill={C.gold} />
    </g>
  </svg>
);

// ─── Iconos filtros ──────────────────────────────────────────
function BookIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 3h12v14H4z"/><line x1="8" y1="3" x2="8" y2="17"/></svg>; }
function WineIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 2h8l-1 6a4 4 0 0 1-8 0Z"/><line x1="10" y1="12" x2="10" y2="18"/><line x1="7" y1="18" x2="13" y2="18"/></svg>; }
function CheeseIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M2 11 L10 4 L18 11 L18 15 Q18 16 17 16 L3 16 Q2 16 2 15 Z"/><circle cx="7" cy="13" r="0.8" fill="currentColor"/><circle cx="13" cy="12" r="0.8" fill="currentColor"/></svg>; }
function BasketIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 9h14l-1.5 7H4.5Z"/><path d="M6 9L9 4"/><path d="M14 9l-3-5"/></svg>; }
function ForkIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><line x1="7" y1="2" x2="7" y2="8"/><line x1="10" y1="2" x2="10" y2="8"/><path d="M7 8 Q7 12 8.5 12 L8.5 18"/><line x1="14" y1="2" x2="14" y2="18"/></svg>; }
function LeafIcon() { return <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 18 C4 18 6 10 14 6 C18 4 18 4 18 4 C18 4 16 10 10 14 C7 16 4 18 4 18 Z"/><line x1="4" y1="18" x2="10" y2="12"/></svg>; }

// ─── Tarjeta de ruta ─────────────────────────────────────────
const RouteCard = ({ route, catLabel, catColor, catKey }: {
  route: URoute; catLabel: string; catColor: string; catKey: string;
}) => {
  const [saved, setSaved] = useState(false);
  const imgSrc = route.image || CAT_IMAGES[catKey] || CAT_IMAGES.default;

  return (
    <article
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        boxShadow: "0 2px 16px rgba(42,28,16,0.10), 0 1px 4px rgba(42,28,16,0.07)",
        border: "1px solid rgba(232,220,192,0.7)",
      }}
    >
      <div className="relative w-full overflow-hidden" style={{ height: "200px" }}>
        <img src={imgSrc} alt={route.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 45%, rgba(0,0,0,0.5) 100%)" }} />
        <span
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.18em] uppercase"
          style={{ background: catColor, color: "#fff" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white opacity-80 flex-shrink-0" />
          {catLabel}
        </span>
        <div className="absolute -bottom-5 right-4 z-10"><VerifiedBadge /></div>
      </div>

      <div className="flex flex-col flex-1 px-5 pt-8 pb-5 gap-3">
        <h3 className="leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "clamp(1rem, 1.2vw + 0.6rem, 1.2rem)", fontWeight: 600 }}>
          {route.title}
        </h3>
        <p className="text-[13px] leading-[1.55] line-clamp-2" style={{ color: C.beigeText }}>
          {route.description}
        </p>
        <div className="flex items-center gap-4 text-[12px] pt-1 flex-wrap" style={{ color: C.beigeText }}>
          <span className="flex items-center gap-1"><MapPin size={12} style={{ color: C.olive }} />{route.stops} paradas</span>
          <span className="flex items-center gap-1"><Clock size={12} style={{ color: C.olive }} />{route.duration}</span>
          <span className="flex items-center gap-1"><Users size={12} style={{ color: C.olive }} />Máx. {route.capacity}</span>
        </div>
        <div className="flex items-center gap-1 pt-0.5">
          {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < Math.round(route.rating)} />)}
          <span className="text-[12px] font-semibold ml-1.5" style={{ color: C.brownMid }}>{route.rating.toFixed(1)}</span>
          <span className="text-[11px] ml-0.5" style={{ color: C.beigeText }}>({route.reviews})</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Link to={`/rutas/${route.slug}`} className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold tracking-[0.14em] uppercase transition-all hover:opacity-90" style={{ background: C.brown, color: C.cream }}>
              Ver ruta completa<ArrowRight size={13} />
            </button>
          </Link>
          <button type="button" onClick={() => setSaved((s) => !s)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border transition-all"
            style={{ borderColor: saved ? C.gold : "rgba(232,220,192,0.9)", background: saved ? `${C.gold}18` : "transparent" }}
            title={saved ? "Guardado" : "Guardar"}>
            <Bookmark size={15} fill={saved ? C.gold : "none"} stroke={saved ? C.gold : C.beigeText} />
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Componente principal ────────────────────────────────────
const SeasonalRoutes = ({ hideHeader = false }: { hideHeader?: boolean }) => {
  const seasonInfo = getCurrentSeasonInfo();
  const { routes: dbRoutes } = useRoutesBySeason({ limit: 3 });
  const [activeFilter, setActiveFilter] = useState("todas");
  const [sortBy] = useState("Más recientes");

  // Adaptador: BD primero, demo como fallback
  const routes: URoute[] =
    dbRoutes.length > 0
      ? dbRoutes.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          description: r.description ?? "",
          duration: r.duration ?? "1 día",
          capacity: 25,
          rating: r.avg_rating ?? 0,
          stops: r.total_stops ?? 3,
          reviews: Math.max(1, Math.floor((r.avg_rating ?? 4) * 5 + 8)),
          image: r.image_url ?? undefined,
        }))
      : getDemoRoutesBySeason(seasonInfo.id, 3).map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          description: r.description,
          duration: r.duration,
          capacity: r.capacity,
          rating: r.rating,
          stops: r.recorrido.split("→").length,
          reviews: Math.floor(r.rating * 5 + 10),
        }));

  const cats = DEMO_CAT[seasonInfo.id] ?? DEMO_CAT.queso;

  return (
    <section style={{ backgroundImage: "url('/textures/routes-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }} className="w-full">
      {/* ── HEADER SECCIÓN ── */}
      <div className="max-w-[1280px] mx-auto px-6 pt-7 pb-6 relative">
        {/* Ramita floral esquina derecha */}
        <div className="absolute top-4 right-4 hidden md:block pointer-events-none">
          <FloralSprig w={64} h={94} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Izquierda */}
          <div className="flex-1 min-w-0">
            {!hideHeader && <div className="flex items-center gap-3 mb-3">
              <span className="block h-px w-8" style={{ backgroundColor: C.gold }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
                Rutas
              </span>
              <span className="block h-px w-8" style={{ backgroundColor: C.gold }} aria-hidden="true" />
            </div>}
            {!hideHeader && <h2
              className="font-bold leading-tight tracking-tight mb-3"
              style={{
                color: C.brown,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(1.5rem, 1rem + 2.4vw, 2.875rem)",
                whiteSpace: "nowrap",
              }}
            >
              Experiencias curadas, verificadas en&nbsp;persona
            </h2>}
            {!hideHeader && <p className="leading-relaxed" style={{ color: C.beigeText, fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)", whiteSpace: "nowrap" }}>
              Rutas activas para esta temporada. Cada una visitada y aprobada por nuestro equipo antes de salir publicada.
            </p>}
          </div>

          {/* Derecha: sello + claim */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="hidden lg:block w-px self-stretch my-2" style={{ background: "rgba(184,146,63,0.3)" }} />
            <HeaderStamp />
            <p className="text-[15px] leading-snug font-medium max-w-[150px]" style={{ color: C.brownMid, fontFamily: "'Cormorant Garamond', serif" }}>
              Solo recomendamos lo que hemos vivido.
            </p>
          </div>
        </div>

        {/* ── FILTROS + ORDENAR ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-7">
          <div className="flex flex-wrap items-center gap-2">
            {FILTER_CATS.map((f) => {
              const active = activeFilter === f.id;
              return (
                <button key={f.id} type="button" onClick={() => setActiveFilter(f.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                  style={{
                    background: active ? C.olive : "rgba(255,255,255,0.5)",
                    color: active ? "#fff" : C.brownMid,
                    border: active ? `1.5px solid ${C.olive}` : `1.5px solid rgba(184,146,63,0.35)`,
                  }}>
                  <span style={{ color: active ? "#fff" : C.olive }}>{f.icon}</span>
                  {f.label}
                </button>
              );
            })}
          </div>
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

      {/* ── GRID DE RUTAS ── */}
      <div className="max-w-[1280px] mx-auto px-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 pt-2">
          {routes.map((r, i) => {
            const catInfo = cats[i % cats.length];
            return (
              <RouteCard key={r.id} route={r} catLabel={catInfo.label} catColor={catInfo.color} catKey={catInfo.cat} />
            );
          })}
        </div>

        {/* ── CTA FOOTER ── */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link to="/rutas">
            <button
              className="flex items-center gap-2 px-8 py-3 rounded-2xl text-[13px] font-semibold tracking-[0.1em] transition-all hover:bg-white"
              style={{ border: `1.5px solid rgba(184,146,63,0.5)`, color: C.brownMid, background: "transparent" }}
            >
              Ver todas las rutas
              <ArrowRight size={14} style={{ color: C.gold }} />
            </button>
          </Link>
          <FloralSprig w={40} h={58} />
        </div>
      </div>
    </section>
  );
};

export default SeasonalRoutes;
