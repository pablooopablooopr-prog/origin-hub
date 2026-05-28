import { Link } from "react-router-dom";
import { MapPin, User, ArrowRight } from "lucide-react";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  dark: "#1f1a14",
  darkCard: "#2a241c",
};

// Datos mock — 4 empresas destacadas de hoy (TODO: rotación diaria desde BD)
const EMPRESAS = [
  {
    id: "1",
    nombre: "Finca Los Álamos",
    ubicacion: "Albacete",
    categoria: "Hortalizas",
    badge: "PRODUCTOR LOCAL",
    badgeColor: "#5C6B2E",
    descripcion: "Cultivo ecológico con sabor de verdad, directo de nuestra huerta a tu mesa.",
    persona: "Familia García",
    img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=700&q=85",
    slug: "finca-los-alamos",
  },
  {
    id: "2",
    nombre: "Quesería El Refugio",
    ubicacion: "Ciudad Real",
    categoria: "Quesos",
    badge: "ARTESANO",
    badgeColor: "#6b3a20",
    descripcion: "Quesos artesanos madurados con tiempo, paciencia y pasión por lo auténtico.",
    persona: "Manuel López",
    img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=700&q=85",
    slug: "queseria-el-refugio",
  },
  {
    id: "3",
    nombre: "La Era de Don Quijote",
    ubicacion: "Toledo",
    categoria: "Cocina tradicional",
    badge: "RESTAURANTE",
    badgeColor: "#5C6B2E",
    descripcion: "Cocina de siempre con producto local y recetas que cuentan historias.",
    persona: "Elena Martín",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=700&q=85",
    slug: "la-era-de-don-quijote",
  },
  {
    id: "4",
    nombre: "Taller Tierra Viva",
    ubicacion: "Cuenca",
    categoria: "Experiencias",
    badge: "EXPERIENCIA",
    badgeColor: "#6b3a20",
    descripcion: "Vive la artesanía en primera persona y conecta con lo esencial.",
    persona: "Julio Romero",
    img: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=700&q=85",
    slug: "taller-tierra-viva",
  },
];

const EmpresaCard = ({ e }: { e: typeof EMPRESAS[0] }) => (
  <article className="flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: C.cream }}>
    {/* Imagen + badge */}
    <div className="relative w-full overflow-hidden" style={{ height: "200px" }}>
      <img src={e.img} alt={e.nombre} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
      <span
        className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.16em] uppercase"
        style={{ backgroundColor: e.badgeColor, color: "#fff" }}
      >
        {e.badge}
      </span>
    </div>

    {/* Contenido */}
    <div className="flex flex-col flex-1 p-5 gap-3">
      <h3 className="leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "21px", fontWeight: 600 }}>
        {e.nombre}
      </h3>

      <div className="flex items-center gap-2 flex-wrap text-[14px]" style={{ color: "#7a6a52" }}>
        <span className="flex items-center gap-1"><MapPin size={14} style={{ color: C.olive }} />{e.ubicacion}</span>
        <span style={{ color: C.beige }}>·</span>
        <span className="px-2.5 py-0.5 rounded-full text-[12px] font-medium" style={{ border: `1px solid ${C.beige}`, color: C.brown }}>{e.categoria}</span>
      </div>

      <p className="text-[14.5px] leading-[1.55] flex-1" style={{ color: "#6b5a44" }}>{e.descripcion}</p>

      <div className="flex items-center justify-between pt-2 mt-1" style={{ borderTop: `1px solid ${C.beige}55` }}>
        <span className="flex items-center gap-1.5 text-[13px]" style={{ color: "#8a7a62" }}>
          <User size={14} />{e.persona}
        </span>
        <Link to={`/empresa/${e.slug}`} className="flex items-center gap-1.5 text-[13px] font-semibold group" style={{ color: C.olive }}>
          Ver perfil
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  </article>
);

const SpotlightToday = () => {
  return (
    <section className="relative w-full" style={{ backgroundColor: C.dark }}>
      <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-10">
          <div className="flex-1">
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: C.gold }}>
              Hoy en Ritmo Origen
            </p>
            <h2
              className="font-bold leading-[1.05] tracking-tight mb-4"
              style={{
                color: C.cream,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(2.1rem, 1.4rem + 2.6vw, 3.4rem)",
              }}
            >
              Empresas destacadas de hoy
            </h2>
            <p className="text-[16px] leading-relaxed mb-4" style={{ color: "#c5bba8", maxWidth: "560px" }}>
              Cada día, 4 negocios auténticos tienen su momento en la portada de RITMO ORIGEN. Conócelos, apóyalos y forma parte del ritmo real.
            </p>
            <Link to="/empresas" className="inline-flex items-center gap-2 text-[14px] font-semibold group" style={{ color: C.gold }}>
              Cómo funciona
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

      {/* ── GRID 4 CARDS + columna periódico ── */}
      <div className="relative">
        {/* Columna de periódico decorativa — extremo derecho */}
        <div
          className="hidden xl:flex absolute right-0 top-0 bottom-0 w-[88px] flex-col gap-3 py-1 overflow-hidden pointer-events-none select-none"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
          aria-hidden="true"
        >
          <p className="text-[7px] font-bold uppercase tracking-[0.3em] px-3 mb-1" style={{ color: "rgba(184,134,11,0.7)", writingMode: "horizontal-tb" }}>
            — Origen · {new Date().toLocaleDateString("es-ES", { day: "numeric", month: "short" })} —
          </p>
          {[
            "Queso manchego de Porzuna, temporada de primavera",
            "Bodegas familiares de Valdepeñas abren sus puertas al viajero",
            "La trashumancia regresa a las rutas del campo",
            "Productores locales: el tejido vivo de Castilla-La Mancha",
            "Turismo de proximidad, la tendencia que transforma el territorio",
            "Cosecha 2026: los mejores vinos de la región ya están disponibles",
          ].map((txt, i) => (
            <div key={i} className="px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[9px] leading-[1.45]" style={{ color: "rgba(197,187,168,0.55)", fontFamily: "'Cormorant Garamond', serif" }}>
                {txt}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 xl:pr-[96px]">
          {EMPRESAS.map((e) => <EmpresaCard key={e.id} e={e} />)}
        </div>
      </div>

        {/* ── CTA ── */}
        <div className="flex justify-center mt-10">
          <Link to="/empresas">
            <button
              className="px-9 py-3.5 rounded-xl text-[14px] font-semibold tracking-[0.06em] transition-all hover:-translate-y-0.5 flex items-center gap-2"
              style={{ border: `1.5px solid ${C.gold}`, color: C.cream, backgroundColor: "transparent" }}
            >
              Ver todas las empresas
              <ArrowRight size={16} style={{ color: C.gold }} />
            </button>
          </Link>
        </div>

        {/* Decoración laurel */}
        <div className="flex justify-center mt-8 opacity-50">
          <svg viewBox="0 0 120 16" width="110" height="15" aria-hidden="true">
            <line x1="0" y1="8" x2="40" y2="8" stroke={C.gold} strokeWidth="0.6" />
            <line x1="80" y1="8" x2="120" y2="8" stroke={C.gold} strokeWidth="0.6" />
            <g transform="translate(54,8)" stroke={C.gold} strokeWidth="0.7" fill="none">
              <path d="M0,0 C4,-4 9,-3 11,1" /><path d="M0,0 C-4,-4 -9,-3 -11,1" />
              <path d="M5,-1 C6,-4 9,-4 10,-2" /><path d="M-5,-1 C-6,-4 -9,-4 -10,-2" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default SpotlightToday;
