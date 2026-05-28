import { Link } from "react-router-dom";
import { MapPin, Quote, Star, ShoppingBasket, Grape, Utensils, Users, Award, MessageCircle, ArrowRight } from "lucide-react";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paper: "#f3ede0",
};

const Stars = ({ n = 5 }: { n?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} fill={i < n ? C.gold : "none"} stroke={C.gold} strokeWidth={1.5} />
    ))}
  </div>
);

const FEATURED = {
  texto: "Una experiencia increíble en la ruta del queso. Visitamos dos queserías artesanales y la comida en el restaurante fue espectacular. Repetiremos seguro.",
  nombre: "María López",
  rol: "Viajera",
  ruta: "Ruta Clásica del Queso Manchego",
  lugares: "Porzuna · Piedrabuena · Almagro",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
};

const REVIEWS = [
  {
    texto: "Productos de muchísima calidad y trato cercano. Se nota el cariño con el que trabajan y el respeto por la tradición.",
    nombre: "Carlos Martínez", rol: "Cliente",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    negocio: "Quesería Artesanal El Refugio", icon: ShoppingBasket,
  },
  {
    texto: "La cata de vinos fue una maravilla. Aprendimos mucho y disfrutamos de unos paisajes que te dejan sin palabras.",
    nombre: "Lucía Fernández", rol: "Enoturista",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    negocio: "Ruta del Vino y la Tierra", icon: Grape,
  },
  {
    texto: "Cocina tradicional de verdad, con producto local y recetas que cuentan historias. Volveremos muy pronto.",
    nombre: "Javier Ruiz", rol: "Comensal",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    negocio: "La Era de Don Quijote", icon: Utensils,
  },
];

const HumanRatings = () => {
  return (
    <section className="relative w-full" style={{ backgroundColor: C.paper }}>
      <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* ── IZQUIERDA ── */}
          <div className="relative">
            {/* Rama decorativa */}
            <svg className="absolute top-0 right-4 w-28 h-32 pointer-events-none opacity-30 hidden md:block" viewBox="0 0 100 120" fill="none" aria-hidden="true">
              <path d="M50 118 C46 80 54 50 50 18" stroke={C.gold} strokeWidth="1" fill="none" />
              {[24,40,56,72].map((y,i)=>(
                <g key={i}>
                  <path d={`M50,${y} C62,${y-8} 72,${y-3} 66,${y+6} C60,${y+11} 50,${y} 50,${y}Z`} fill={C.gold} opacity="0.3" />
                  <path d={`M50,${y} C38,${y-8} 28,${y-3} 34,${y+6} C40,${y+11} 50,${y} 50,${y}Z`} fill={C.gold} opacity="0.25" />
                </g>
              ))}
            </svg>

            <p className="text-[12px] font-bold uppercase tracking-[0.28em] mb-3" style={{ color: C.gold }}>
              Valoraciones humanas
            </p>
            <h2
              className="font-bold leading-[1.05] tracking-tight mb-4"
              style={{ color: C.brown, fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(2.1rem, 1.4rem + 2.4vw, 3.2rem)" }}
            >
              Lo que dicen quienes viven el ritmo real
            </h2>
            <p className="text-[16px] leading-relaxed mb-7" style={{ color: "#6b5a44", maxWidth: "440px" }}>
              Experiencias auténticas, trato cercano y productos que cuentan historias. Esto es lo que nuestra comunidad comparte.
            </p>

            {/* Valoración destacada */}
            <div className="rounded-2xl p-6 md:p-7 relative" style={{ backgroundColor: "rgba(255,253,248,0.75)", border: `1px solid ${C.beige}55` }}>
              <Quote size={34} fill={C.olive} stroke="none" className="mb-3 opacity-90" />
              <p className="text-[18px] leading-[1.5] mb-6" style={{ color: C.brown, fontFamily: "'Cormorant Garamond', 'Georgia', serif", fontWeight: 500 }}>
                {FEATURED.texto}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={FEATURED.avatar} alt={FEATURED.nombre} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[15px]" style={{ color: C.brown }}>{FEATURED.nombre}</p>
                    <p className="text-[13px]" style={{ color: "#8a7a62" }}>{FEATURED.rol}</p>
                    <Stars />
                  </div>
                </div>
                <div className="flex items-start gap-1.5 max-w-[200px]">
                  <MapPin size={14} style={{ color: C.olive, marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p className="text-[13px] font-semibold leading-tight" style={{ color: C.brown }}>{FEATURED.ruta}</p>
                    <p className="text-[12px]" style={{ color: "#8a7a62" }}>{FEATURED.lugares}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── DERECHA: 3 reviews apiladas ── */}
          <div className="flex flex-col divide-y" style={{ borderColor: `${C.beige}55` }}>
            {REVIEWS.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="flex items-start gap-4 py-5 first:pt-0">
                  <img src={r.avatar} alt={r.nombre} className="w-12 h-12 rounded-full object-cover flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <Quote size={16} fill={C.olive} stroke="none" className="flex-shrink-0 mt-1 opacity-80" />
                      <p className="text-[14.5px] leading-[1.5]" style={{ color: "#5a4a38" }}>{r.texto}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-6">
                      <span className="font-bold text-[14px]" style={{ color: C.brown }}>{r.nombre}</span>
                      <span style={{ color: C.beige }}>·</span>
                      <span className="text-[13px]" style={{ color: "#8a7a62" }}>{r.rol}</span>
                    </div>
                    <div className="ml-6 mt-1"><Stars /></div>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 w-20 text-center">
                    <Icon size={24} strokeWidth={1.4} style={{ color: C.brown }} />
                    <p className="text-[11px] leading-tight" style={{ color: "#8a7a62" }}>{r.negocio}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── BARRA MÉTRICAS + CTA ── */}
        <div className="mt-10 rounded-2xl px-6 md:px-9 py-7" style={{ backgroundColor: "rgba(255,253,248,0.7)", border: `1px solid ${C.beige}44` }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="flex items-center gap-3">
              <Award size={32} strokeWidth={1.3} style={{ color: C.brown, flexShrink: 0 }} />
              <div>
                <p className="font-bold text-[20px] leading-none" style={{ color: C.brown, fontFamily: "'Playfair Display', serif" }}>1.248+</p>
                <p className="text-[13px] font-semibold mt-1" style={{ color: C.brown }}>valoraciones reales</p>
                <p className="text-[12px]" style={{ color: "#8a7a62" }}>De personas que ya viven el ritmo real.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MessageCircle size={32} strokeWidth={1.3} style={{ color: C.brown, flexShrink: 0 }} />
              <div>
                <p className="font-bold text-[20px] leading-none" style={{ color: C.brown, fontFamily: "'Playfair Display', serif" }}>4,9/5</p>
                <p className="text-[13px] font-semibold mt-1" style={{ color: C.brown }}>puntuación media</p>
                <p className="text-[12px]" style={{ color: "#8a7a62" }}>Basado en experiencias verificadas.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users size={32} strokeWidth={1.3} style={{ color: C.brown, flexShrink: 0 }} />
              <div>
                <p className="text-[14px] font-bold leading-tight" style={{ color: C.brown }}>Comunidad activa y comprometida</p>
                <p className="text-[12px] mt-0.5" style={{ color: "#8a7a62" }}>Personas que apoyan lo local y comparten lo auténtico.</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link to="/valoraciones">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold transition-all hover:-translate-y-0.5" style={{ backgroundColor: C.olive, color: C.cream }}>
                  Ver todas las valoraciones
                  <ArrowRight size={15} />
                </button>
              </Link>
              <Link to="/valoraciones" className="flex items-center justify-center gap-1.5 text-[13px] font-semibold group" style={{ color: C.brown }}>
                Cómo funcionan las valoraciones
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HumanRatings;
