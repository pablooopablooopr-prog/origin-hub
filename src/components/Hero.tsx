import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/** Orden: agricultor → vacas (corte ~7s) → plantación (corte ~7s) */
const HERO_VIDEOS: { src: string; maxTime: number }[] = [
  { src: "https://assets.mixkit.co/videos/46563/46563-720.mp4", maxTime: 7.5 },
  { src: "https://assets.mixkit.co/videos/44923/44923-720.mp4", maxTime: 7 },
  { src: "https://assets.mixkit.co/videos/47313/47313-720.mp4", maxTime: 7 },
];

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const advancingRef = useRef(false);

  const advanceVideo = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setCurrentVideo((prev) => (prev + 1) % HERO_VIDEOS.length);
  }, []);

  /* Precargar todos los vídeos al montar */
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.load();
    });
  }, []);

  useEffect(() => {
    advancingRef.current = false;

    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentVideo) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });

    const video = videoRefs.current[currentVideo];
    if (!video) return;

    const { maxTime } = HERO_VIDEOS[currentVideo];

    const onTimeUpdate = () => {
      if (video.currentTime >= maxTime) {
        video.removeEventListener("timeupdate", onTimeUpdate);
        video.pause();
        advanceVideo();
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, [currentVideo, advanceVideo]);

  return (
    <section className="min-h-[93vh] flex items-center justify-center relative overflow-hidden pt-0">

      {/* ── Los 3 vídeos precargados, solo el activo visible ── */}
      {HERO_VIDEOS.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, opacity: i === currentVideo ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}
          src={v.src}
          muted
          playsInline
          preload="auto"
        />
      ))}

      {/* ── Velo oscuro para legibilidad ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* ── Símbolo Ensō (marca de agua) — negro 65% ────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          width: "300px",
          height: "300px",
          backgroundImage: "url('/lovable-uploads/enso-transparent.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          opacity: 0.65,
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          filter: "brightness(0)",
        }}
      />

      {/* ── Degradado de color sutil ─────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-earth-light/10 via-transparent to-moss-light/10"
        style={{ zIndex: 3 }}
      />

      {/* ── Contenido principal ──────────────────────────── */}
      <div
        className="container mx-auto px-6 py-4 text-center relative z-10"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
      >
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
          RITMO DE LA TIERRA
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto leading-relaxed font-medium">
          Negocios tradicionales. Calidad real. Comunidad nacional.
        </p>

        <p className="text-white text-lg md:text-lg font-sans text-center leading-relaxed max-w-2xl mx-auto mb-12" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
          La única plataforma estacional que conecta tu mesa con el ritmo real de cultivo. Productores, empresas, sabores, rutas y experiencias que varían según el calendario agrícola. Porque el territorio no es estático, y nosotros tampoco.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-4xl mx-auto">
          <Link to="/mapa">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#5C6B2E", color: "#FFFFFF" }}>
              DESCUBRIR
            </Button>
          </Link>
          <Link to="/soy-empresa">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "transparent", color: "#FFFFFF", border: "2px solid #B8860B" }}>
              UNIRME COMO EMPRESA
            </Button>
          </Link>
          <button
            onClick={() => {
              const mapSection = document.querySelector('.map-section');
              mapSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 text-lg font-semibold rounded-md text-white border-2 border-white hover:bg-white/10 transition-all"
          >
            VER EL MAPA
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">53</div>
            <p className="text-sm text-white/70">Negocios locales</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-300">4</div>
            <p className="text-sm text-white/70">Provincias cubiertas</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-white">100+</div>
            <p className="text-sm text-white/70">Consumidores conscientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
