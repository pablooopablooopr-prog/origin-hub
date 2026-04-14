import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HERO_VIDEOS = [
  "https://assets.mixkit.co/videos/44923/44923-720.mp4",  // Vacas pastando en pradera
  "https://assets.mixkit.co/videos/47313/47313-720.mp4",  // Plantación de almendros
  "https://assets.mixkit.co/videos/46563/46563-720.mp4",  // Agricultor recogiendo tomates
];

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = useCallback(() => {
    setCurrentVideo((prev) => (prev + 1) % HERO_VIDEOS.length);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-warm flex items-center justify-center relative overflow-hidden pt-0">

      {/* ── Video de fondo ──────────────────────────────── */}
      <video
        key={currentVideo}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
        src={HERO_VIDEOS[currentVideo]}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
      />

      {/* ── Velo cálido para mantener legibilidad del texto ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom right, hsl(35 20% 96% / 0.72), hsl(35 20% 96% / 0.55), hsl(35 20% 96% / 0.72))",
        }}
      />

      {/* ── Símbolo Ensō (marca de agua) ─────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          backgroundImage:
            "url('/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          opacity: 0.07,
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      />

      {/* ── Degradado de color sutil ─────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-earth-light/20 via-transparent to-moss-light/20"
        style={{ zIndex: 3 }}
      />

      {/* ── Contenido principal ──────────────────────────── */}
      <div className="container mx-auto px-6 py-4 text-center relative z-10">
        {/* Título principal con Ensō integrado */}
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight flex items-center justify-center flex-wrap gap-1">
          <span>Vuelve al</span>
          <span className="inline-flex items-center">
            <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-12 h-12 md:w-20 md:h-20 object-contain mx-0" />
            <span>rigen</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">Negocios tradicionales. Calidad real. Comunidad nacional.</p>

        {/* Descripción adicional */}
        <p className="text-muted-foreground mb-16 max-w-3xl mx-auto opacity-90 text-lg font-normal font-sans text-center leading-relaxed">
          Conectamos, sin intermediarios, a consumidores con productores, cooperativas, fincas privadas y cotos, restaurantes y negocios con identidad junto a experiencias rurales exclusivas por toda España, impulsando la visibilidad del sector primario y el valor de su origen real.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
          <Link to="/mapa">
            <Button size="lg" className="group px-8 py-4 text-lg shadow-earth">
              Explorar el mapa
            </Button>
          </Link>

          <Link to="/rutas">
            <Button size="lg" className="px-8 py-4 text-lg bg-earth-dark text-white hover:bg-earth-dark/90 transition-colors">
              Descubrir experiencias
            </Button>
          </Link>

          <Link to="/packs">
            <Button variant="secondary" size="lg" className="px-8 py-4 text-lg shadow-moss">
              Selecciones del territorio
            </Button>
          </Link>
        </div>

        {/* Indicadores sutiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">53</div>
            <p className="text-sm text-muted-foreground">Negocios locales</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-secondary">4</div>
            <p className="text-sm text-muted-foreground">Provincias cubiertas</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">100+</div>
            <p className="text-sm text-muted-foreground">Consumidores conscientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
