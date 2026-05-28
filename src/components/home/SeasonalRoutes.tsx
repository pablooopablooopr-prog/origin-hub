import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Calendar, Users, Leaf, BadgeCheck } from "lucide-react";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paper: "#f0e6cf",
};

// 4 rutas mock (TODO: conectar BD)
const RUTAS = [
  {
    id: "1",
    duracion: "1 día",
    categoria: "GASTRONÓMICA",
    catColor: "#6b3a20",
    titulo: "Ruta Clásica del Queso Manchego",
    recorrido: ["Porzuna", "Piedrabuena", "Almagro"],
    descripcion: "Descubre el origen del queso manchego con visitas a queserías artesanas.",
    img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=700&q=85",
    slug: "ruta-queso-manchego",
  },
  {
    id: "2",
    duracion: "2 días",
    categoria: "ENOLÓGICA",
    catColor: "#5C6B2E",
    titulo: "Ruta del Vino y la Tierra",
    recorrido: ["Almagro", "Valdepeñas", "Las Virtudes"],
    descripcion: "Viñedos, bodegas familiares y sabores que nacen de la tierra.",
    img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=85",
    slug: "ruta-vino-tierra",
  },
  {
    id: "3",
    duracion: "1 día",
    categoria: "TRADICIÓN",
    catColor: "#8a6a22",
    titulo: "Ruta de la Trashumancia y el Pastor",
    recorrido: ["Las Labores", "Horcajo", "Anchuras"],
    descripcion: "Sigue los pasos del pastor y conoce la vida en la dehesa manchega.",
    img: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=85",
    slug: "ruta-trashumancia",
  },
  {
    id: "4",
    duracion: "1 día",
    categoria: "CULTURAL",
    catColor: "#6b3a20",
    titulo: "Ruta de Pueblos con Historia",
    recorrido: ["Villanueva de los Infantes", "Almagro", "Villahermosa"],
    descripcion: "Arte, patrimonio y rincones únicos que cuentan nuestra historia.",
    img: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?auto=format&fit=crop&w=700&q=85",
    slug: "ruta-pueblos-historia",
  },
];

const FOOTER_FEATURES = [
  { icon: Calendar, title: "Rutas todo el año", text: "Experiencias adaptadas a cada estación." },
  { icon: Users, title: "Grupos reducidos", text: "Más calidad, más cercanía, más autenticidad." },
  { icon: Leaf, title: "Turismo responsable", text: "Apoyamos lo local y cuidamos nuestro entorno." },
  { icon: BadgeCheck, title: "Productores reales", text: "Conecta con quienes hacen posible cada producto." },
];

const RutaCard = ({ r }: { r: typeof RUTAS[0] }) => (
  <article className="flex flex-col rounded-2xl overflow-hidden" style={{ backgroundColor: "#fffdf8", boxShadow: "0 3px 18px rgba(61,43,31,0.10)", border: `1px solid ${C.beige}44` }}>
    <div className="relative w-full overflow-hidden" style={{ height: "170px" }}>
      <img src={r.img} alt={r.titulo} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide" style={{ backgroundColor: C.brown, color: C.cream }}>
        {r.duracion}
      </span>
    </div>

    <div className="flex flex-col flex-1 p-4 gap-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: r.catColor }}>{r.categoria}</p>
      <h3 className="leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', 'Georgia', serif", fontSize: "19px", fontWeight: 600 }}>
        {r.titulo}
      </h3>
      <div className="flex items-start gap-1.5 text-[13px]" style={{ color: "#7a6a52" }}>
        <MapPin size={13} style={{ color: C.olive, marginTop: "2px", flexShrink: 0 }} />
        <span>{r.recorrido.join(" · ")}</span>
      </div>
      <p className="text-[14px] leading-[1.5] flex-1" style={{ color: "#6b5a44" }}>{r.descripcion}</p>
      <Link to={`/rutas/${r.slug}`} className="inline-flex items-center gap-1.5 text-[13px] font-semibold pt-1 group" style={{ color: C.brown }}>
        <span style={{ borderBottom: `1.5px solid ${C.gold}` }}>Ver ruta</span>
        <ArrowRight size={14} style={{ color: C.gold }} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  </article>
);

const SeasonalRoutes = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: C.paper,
        backgroundImage:
          "radial-gradient(circle at 12% 18%, rgba(184,134,11,0.06) 0%, transparent 28%), radial-gradient(circle at 88% 24%, rgba(120,90,40,0.05) 0%, transparent 30%)",
      }}
    >
        {/* Ilustración paisaje con pines — esquina superior derecha */}
        <img
          src="/textures/rutas-illustration.png"
          alt=""
          aria-hidden="true"
          className="absolute top-0 right-0 h-[220px] w-auto pointer-events-none hidden lg:block"
          style={{ objectFit: "contain", objectPosition: "right top" }}
        />

      <div className="relative max-w-[1280px] mx-auto px-6 py-14 md:py-18">
        {/* HEADER */}
        <div className="max-w-[620px] mb-9">
          <p className="text-[12px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: C.gold }}>
            Rutas y experiencias
          </p>
          <h2
            className="font-bold leading-[1.06] tracking-tight mb-4"
            style={{
              color: C.brown,
              fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
              fontSize: "clamp(2.1rem, 1.4rem + 2.6vw, 3.4rem)",
            }}
          >
            Descubre el territorio a través de sus rutas
          </h2>
          <p className="text-[16px] leading-relaxed mb-6" style={{ color: "#6b5a44" }}>
            Itinerarios diseñados para conectar con lo auténtico: productores, paisajes, gastronomía y tradición local.
          </p>
          <Link to="/rutas">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: C.olive, color: C.cream }}
            >
              Explorar todas las rutas
              <ArrowRight size={15} />
            </button>
          </Link>
        </div>

        {/* GRID 4 CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RUTAS.map((r) => <RutaCard key={r.id} r={r} />)}
        </div>

        {/* FRANJA FOOTER */}
        <div className="mt-9 rounded-2xl px-6 md:px-10 py-7" style={{ backgroundColor: "rgba(255,253,248,0.6)", border: `1px solid ${C.beige}44` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {FOOTER_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  {i > 0 && <span className="hidden lg:block absolute -left-2 top-1 bottom-1 w-px" style={{ backgroundColor: `${C.beige}66` }} aria-hidden="true" />}
                  <Icon size={26} strokeWidth={1.4} style={{ color: C.brown, flexShrink: 0 }} />
                  <div>
                    <h3 className="font-bold mb-0.5 leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "14px" }}>{f.title}</h3>
                    <p className="text-[12.5px] leading-snug" style={{ color: "#7a6a52" }}>{f.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Laurel decorativo */}
        <div className="flex justify-center mt-8 opacity-55">
          <svg viewBox="0 0 120 16" width="110" height="15" aria-hidden="true">
            <line x1="0" y1="8" x2="42" y2="8" stroke={C.gold} strokeWidth="0.6" />
            <line x1="78" y1="8" x2="120" y2="8" stroke={C.gold} strokeWidth="0.6" />
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

export default SeasonalRoutes;
