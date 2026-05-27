import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/** Orden: viñedo → vacas originales → cocina/chef → olivos aéreo */
const HERO_VIDEOS: { src: string; maxTime: number }[] = [
  { src: "https://assets.mixkit.co/videos/29340/29340-720.mp4", maxTime: 7 },
  { src: "https://assets.mixkit.co/videos/44923/44923-720.mp4", maxTime: 7 },
  { src: "https://assets.mixkit.co/videos/43900/43900-720.mp4", maxTime: 7 },
  { src: "https://assets.mixkit.co/videos/47313/47313-720.mp4", maxTime: 7 },
];

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
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
    setFadeIn(false);
    // Small delay then fade in
    const fadeTimer = setTimeout(() => setFadeIn(true), 50);

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
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      clearTimeout(fadeTimer);
    };
  }, [currentVideo, advanceVideo]);

  return (
    <section className="min-h-[93vh] flex items-center justify-center relative overflow-hidden pt-0">

      {/* ── Los 3 vídeos precargados, solo el activo visible ── */}
      {HERO_VIDEOS.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, opacity: i === currentVideo ? (fadeIn ? 1 : 0) : 0, transition: i === currentVideo ? "opacity 1s ease-in" : "opacity 0.4s ease-out" }}
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
        className="relative z-10 w-full flex flex-col justify-center min-h-full pt-8"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {/* TÍTULO - Centrado */}
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight flex items-center justify-center flex-wrap gap-1 drop-shadow-lg" >
          <span>RITM</span>
          <span className="inline-flex items-center">
            <img
              src="/lovable-uploads/enso-transparent.png"
              alt="Ensō"
              className="w-12 h-12 md:w-20 md:h-20 object-contain"
              style={{ filter: "brightness(0)" }}
            />
            <span>RIGEN</span>
          </span>
        </h1>

        {/* CONTENIDO CENTRAL - Centrado */}
        <div className="w-full flex flex-col items-center text-center px-6 py-4">
          <p className="text-2xl md:text-[2.1rem] text-white/90 mb-4 mx-auto leading-relaxed font-medium" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", whiteSpace: "nowrap" }}>
            Negocios tradicionales. Calidad real. Comunidad nacional.
          </p>

          <p className="text-white text-xl md:text-2xl font-sans text-center leading-relaxed max-w-4xl mx-auto mb-12" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif", textShadow: "0 1px 6px rgba(0,0,0,0.3)" }}>
            La única plataforma estacional que conecta tu mesa con el ritmo real de cultivo.
            <br />
            Productores, empresas, sabores, rutas y experiencias que varían según el calendario agrícola.
            <br />
            Porque el territorio no es estático, y nosotros tampoco.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto w-full">
            {/* BOTÓN IZQUIERDA: DESCUBRIR EXPERIENCIAS (Verde) */}
            <Link to="/mapa" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#5C6B2E", color: "#FFFFFF" }}>
                DESCUBRIR EXPERIENCIAS
              </Button>
            </Link>

            {/* BOTÓN CENTRO: VER EL MAPA (Marrón como Log in) */}
            <button
              onClick={() => {
                const mapSection = document.querySelector('section:has(> div[class*="relative"] > div[class*="flex"])');
                mapSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3 text-base font-semibold rounded-md text-white transition-all hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: "#8B6233" }}
            >
              VER EL MAPA
            </button>

            {/* BOTÓN DERECHA: UNIRME COMO EMPRESA (Gold/Marrón) */}
            <Link to="/soy-empresa" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#B8860B", color: "#3D2B1F", border: "2px solid #B8860B" }}>
                UNIRME COMO EMPRESA
              </Button>
            </Link>
          </div>
        </div>

        {/* ESTADÍSTICAS - Distribuidas (izq, centro, drch) */}
        <div className="w-full flex justify-between items-center px-6 md:px-12 mt-8 pb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">53</div>
            <p className="text-sm text-white/70">Negocios locales</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-300">4</div>
            <p className="text-sm text-white/70">Provincias cubiertas</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">100+</div>
            <p className="text-sm text-white/70">Consumidores conscientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
