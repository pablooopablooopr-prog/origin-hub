import { UserPlus, FileCheck, Users, TrendingUp, Shield, Leaf, Handshake, Lock, Heart } from "lucide-react";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paper: "#f4eee1",
};

const STEPS = [
  { n: 1, icon: UserPlus, title: "Únete", text: "Crea tu perfil y cuéntanos quién eres y qué haces.", img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=85" },
  { n: 2, icon: FileCheck, title: "Comparte", text: "Publica tus productos, experiencias y lo que te hace único.", img: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=85" },
  { n: 3, icon: Users, title: "Conecta", text: "Te mostramos a la comunidad y creas relaciones reales.", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=85" },
  { n: 4, icon: TrendingUp, title: "Crece", text: "Más visibilidad, más oportunidades y más impacto para tu negocio.", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=85" },
];

const VALUES = [
  { icon: Shield, title: "Verificado", text: "Solo negocios reales con calidad comprobada." },
  { icon: Leaf, title: "Sostenible", text: "Apoyamos lo local y cuidamos el territorio." },
  { icon: Handshake, title: "Comunidad", text: "Personas que comparten valores y propósito." },
  { icon: Lock, title: "Seguro", text: "Tus datos y tu negocio siempre protegidos." },
];

const HowItWorks = () => {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: C.paper }}>
      <div className="relative max-w-[1280px] mx-auto px-6 py-14 md:py-20">
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf size={15} style={{ color: C.gold }} />
            <span className="text-[12px] font-bold uppercase tracking-[0.28em]" style={{ color: C.gold }}>¿Cómo funciona?</span>
          </div>
          <h2
            className="font-bold leading-[1.05] tracking-tight mb-3"
            style={{ color: C.brown, fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(2.1rem, 1.4rem + 2.6vw, 3.4rem)" }}
          >
            Así es el ritmo de RITMO ORIGEN
          </h2>
          <p className="text-[17px]" style={{ color: "#6b5a44", fontFamily: "'Cormorant Garamond', serif" }}>
            Conectar es fácil. Formar parte del cambio, también.
          </p>
          <div className="flex justify-center mt-3">
            <span className="block h-0.5 w-24 rounded-full" style={{ backgroundColor: `${C.gold}99` }} />
          </div>
        </div>

        {/* 4 PASOS */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {/* Línea de proceso punteada */}
          <div className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px pointer-events-none" style={{ borderTop: `2px dashed ${C.beige}` }} aria-hidden="true" />

          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="relative flex flex-col">
                {/* Número */}
                <div className="relative z-10 mx-auto mb-3 w-9 h-9 rounded-full flex items-center justify-center text-[15px] font-bold" style={{ backgroundColor: C.olive, color: C.cream, fontFamily: "'Playfair Display', serif" }}>
                  {s.n}
                </div>
                {/* Card */}
                <div className="flex flex-col rounded-2xl overflow-hidden flex-1" style={{ backgroundColor: "#fffdf8", boxShadow: "0 3px 16px rgba(61,43,31,0.09)" }}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="relative px-5 pb-6 pt-8 text-center flex-1">
                    {/* Icono circular solapando */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: C.cream, boxShadow: "0 3px 10px rgba(61,43,31,0.15)" }}>
                      <Icon size={26} strokeWidth={1.5} style={{ color: C.brown }} />
                    </div>
                    <h3 className="font-bold mb-2" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "22px" }}>{s.title}</h3>
                    <p className="text-[14px] leading-[1.5]" style={{ color: "#6b5a44" }}>{s.text}</p>
                    <div className="flex justify-center mt-3"><span className="block h-px w-10" style={{ backgroundColor: C.beige }} /></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* FRANJA VALORES */}
        <div className="rounded-2xl px-6 md:px-10 py-7" style={{ backgroundColor: "rgba(255,253,248,0.65)", border: `1px solid ${C.beige}44` }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  {i > 0 && <span className="hidden lg:block absolute -left-2 top-1 bottom-1 w-px" style={{ backgroundColor: `${C.beige}66` }} aria-hidden="true" />}
                  <Icon size={28} strokeWidth={1.4} style={{ color: C.olive, flexShrink: 0 }} />
                  <div>
                    <h3 className="font-bold mb-0.5 leading-tight" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>{v.title}</h3>
                    <p className="text-[12.5px] leading-snug" style={{ color: "#7a6a52" }}>{v.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cierre manuscrito */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <p className="text-[28px]" style={{ fontFamily: "'Caveat', cursive", color: C.olive }}>Juntos, damos ritmo al origen.</p>
          <Heart size={26} fill={C.gold} stroke="none" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
