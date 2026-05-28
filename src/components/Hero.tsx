import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/** Orden: olivos → viñedo → vacas */
const HERO_VIDEOS: { src: string; maxTime: number }[] = [
  { src: "https://assets.mixkit.co/videos/39767/39767-720.mp4", maxTime: 4 }, // recolector verduras/campo
  { src: "https://assets.mixkit.co/videos/47313/47313-720.mp4", maxTime: 3 }, // olivos
  { src: "https://assets.mixkit.co/videos/29340/29340-720.mp4", maxTime: 3 }, // viñedo
  { src: "https://assets.mixkit.co/videos/44923/44923-720.mp4", maxTime: 3 }, // vacas
];

const Hero = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [prevVideo, setPrevVideo] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const advancingRef = useRef(false);

  const advanceVideo = useCallback(() => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    setCurrentVideo((prev) => {
      setPrevVideo(prev);
      return (prev + 1) % HERO_VIDEOS.length;
    });
  }, []);

  /* Precargar todos los vídeos al montar */
  useEffect(() => {
    videoRefs.current.forEach((v) => {
      if (v) v.load();
    });
  }, []);

  useEffect(() => {
    advancingRef.current = false;

    // Start new video immediately
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentVideo) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else if (i !== prevVideo) {
        // Keep prevVideo playing during crossfade, pause others
        v.pause();
        v.currentTime = 0;
      }
    });

    // After crossfade duration, hide the previous video
    const crossfadeTimer = setTimeout(() => {
      setPrevVideo(null);
    }, 1200);

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
      clearTimeout(crossfadeTimer);
    };
  }, [currentVideo, advanceVideo]);

  return (
    <section className="relative overflow-hidden" style={{ height: "100vh" }}>

      {/* ── Los 3 vídeos precargados, solo el activo visible ── */}
      {HERO_VIDEOS.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: i === currentVideo ? 2 : i === prevVideo ? 1 : 0,
            opacity: i === currentVideo ? 1 : i === prevVideo ? 1 : 0,
            transition: i === currentVideo ? "opacity 1.0s ease-in-out" : "none",
            filter: "none"
          }}
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
            "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.75) 100%)",
        }}
      />



      {/* ── Degradado de color sutil ─────────────────────── */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-earth-light/10 via-transparent to-moss-light/10"
        style={{ zIndex: 3 }}
      />

      {/* ── Contenido principal ──────────────────────────── */}
      <div
        className="relative z-10 w-full flex flex-col h-screen"
        style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.5)" }}
      >
        {/* Spacer top pequeño */}
        <div className="flex-[0.06]" />

        {/* TÍTULO RITMORIGEN */}
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-3 tracking-tight flex items-center justify-center flex-wrap gap-1" style={{ textShadow: "0 3px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)" }}>
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

        {/* TAGLINE dentro del Ensō grande */}
        <div className="relative flex items-center justify-center py-0 flex-shrink-0" style={{ minHeight: "clamp(260px, 36vw, 440px)" }}>
          {/* Ensō grande detrás del tagline */}
          <div
            className="absolute pointer-events-none inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <div style={{
              width: "clamp(260px, 38vw, 460px)",
              height: "clamp(260px, 38vw, 460px)",
              backgroundImage: "url('/lovable-uploads/enso-transparent.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "contain",
              opacity: 0.6,
              filter: "brightness(0)",
            }} />
          </div>
          {/* Tagline encima del Ensō */}
          <p
            className="relative z-10 text-white text-center font-medium px-16"
            style={{
              fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(1.1rem, 1.3vw + 0.55rem, 1.9rem)",
              textShadow: "0 2px 14px rgba(0,0,0,0.95), 0 1px 4px rgba(0,0,0,0.9)",
              lineHeight: 1.4,
              maxWidth: "560px",
            }}
          >
            Negocios tradicionales. Calidad real.<br />Comunidad nacional.
          </p>
        </div>

        {/* DESCRIPCIÓN y BOTONES */}
        <div className="w-full flex flex-col items-center text-center px-4 md:px-8 -mt-4">
          <p
            className="text-white text-lg md:text-xl text-center leading-relaxed max-w-4xl mx-auto mb-7"
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            La única plataforma estacional que conecta tu mesa con el ritmo real de cultivo.<br />
            Productores, empresas, sabores, rutas y experiencias que varían según el calendario agrícola.<br />
            Porque el territorio no es estático, y nosotros tampoco.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto w-full">
            <Link to="/mapa" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#5C6B2E", color: "#FFFFFF" }}>
                DESCUBRIR EXPERIENCIAS
              </Button>
            </Link>
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
            <Link to="/soy-empresa" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#B8860B", color: "#3D2B1F", border: "2px solid #B8860B" }}>
                UNIRME COMO EMPRESA
              </Button>
            </Link>
          </div>
        </div>

        {/* Spacer flexible */}
        <div className="flex-1" />

        {/* ESTADÍSTICAS pegadas al fondo */}
        <div className="w-full flex justify-between items-center px-6 md:px-12 pb-5 pt-3" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)" }}>
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
