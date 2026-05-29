import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HERO_VIDEOS: { src: string; maxTime: number; startTime?: number }[] = [
  { src: "https://videos.pexels.com/video-files/8659129/8659129-hd_1920_1080_30fps.mp4",                              maxTime: 6, startTime: 2 }, // 1. manos cosechando (empieza s2, termina en s6)
  { src: "https://assets.mixkit.co/videos/29340/29340-720.mp4",                                                       maxTime: 3              }, // 2. cosecha viñedo (se abre)
  { src: "https://videos.pexels.com/video-files/15909400/15909400-uhd_2560_1440_25fps.mp4", maxTime: 5 }, // 3. agricultor andando maíz
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

  useEffect(() => {
    videoRefs.current.forEach((v) => { if (v) v.load(); });
  }, []);

  useEffect(() => {
    advancingRef.current = false;
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentVideo) { v.currentTime = HERO_VIDEOS[i].startTime ?? 0; v.play().catch(() => {}); }
      else if (i !== prevVideo) { v.pause(); v.currentTime = 0; }
    });
    const crossfadeTimer = setTimeout(() => { setPrevVideo(null); }, 1200);
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
    video.addEventListener("ended", advanceVideo, { once: true });
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", advanceVideo);
      clearTimeout(crossfadeTimer);
    };
  }, [currentVideo, advanceVideo]);

  return (
    <section className="relative overflow-hidden" style={{ height: "100vh" }}>

      {/* Vídeos */}
      {HERO_VIDEOS.map((v, i) => (
        <video
          key={v.src}
          ref={(el) => { videoRefs.current[i] = el; }}
          onError={(e) => {
            // Si falla 25fps, intentar 30fps (Pexels puede variar)
            const vid = e.currentTarget;
            if (vid.src.includes("25fps") && !vid.dataset.retried) {
              vid.dataset.retried = "1";
              vid.src = vid.src.replace("25fps", "30fps");
              vid.load();
            }
          }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: i === currentVideo ? 2 : i === prevVideo ? 1 : 0,
            opacity: i === currentVideo ? 1 : i === prevVideo ? 1 : 0,
            transition: i === currentVideo ? "opacity 1.0s ease-in-out" : "none",
          }}
          src={v.src} muted playsInline preload="auto"
        />
      ))}

      {/* Velo oscuro */}
      <div className="absolute inset-0" style={{ zIndex: 3, background: "linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.75) 100%)" }} />

      {/* Ensō watermark — centro absoluto */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          width: "360px", height: "360px",
          backgroundImage: "url('/lovable-uploads/enso-transparent.png')",
          backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain",
          opacity: 0.55, transform: "translate(-50%, -50%)",
          zIndex: 4, filter: "brightness(0)",
        }}
        aria-hidden="true"
      />

      {/* Degradado color sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-light/10 via-transparent to-moss-light/10" style={{ zIndex: 4 }} />

      {/* Contenido */}
      <div className="relative flex flex-col h-full" style={{ zIndex: 10 }}>

        {/* Spacer top */}
        <div style={{ flex: "0 0 14%" }} />

        {/* TÍTULO */}
        <h1
          className="text-4xl md:text-7xl font-bold text-white tracking-tight flex items-center justify-center flex-wrap gap-1 mb-6"
          style={{ textShadow: "0 3px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)" }}
        >
          <span>RITM</span>
          <span className="inline-flex items-center">
            <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-12 h-12 md:w-20 md:h-20 object-contain" style={{ filter: "brightness(0)" }} />
            <span>RIGEN</span>
          </span>
        </h1>

        {/* TAGLINE */}
        <p
          className="text-center font-medium text-white mb-5 px-4 mt-10"
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.25rem, 1.5vw + 0.5rem, 2.1rem)",
            textShadow: "0 2px 14px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.85)",
            lineHeight: 1.35,
          }}
        >
          Negocios tradicionales. Calidad real. Comunidad nacional.
        </p>

        {/* DESCRIPCIÓN */}
        <p
          className="text-white text-center leading-relaxed max-w-4xl mx-auto mb-8 px-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "clamp(1.08rem, 1.1vw + 0.55rem, 1.45rem)",
            textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          La única plataforma estacional que conecta tu mesa con el ritmo real de cultivo.<br />
          Productores, empresas, sabores, rutas y experiencias que varían según el calendario agrícola.<br />
          Porque el territorio no es estático, y nosotros tampoco.
        </p>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mx-auto w-full max-w-4xl">
          <Link to="/mapa" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 py-3 text-lg font-semibold" style={{ backgroundColor: "#5C6B2E", color: "#FFFFFF" }}>
              DESCUBRIR EXPERIENCIAS
            </Button>
          </Link>
          <button
            onClick={() => { document.querySelector('[data-section="mapa"]')?.scrollIntoView({ behavior: "smooth" }); }}
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

        {/* Spacer flexible */}
        <div style={{ flex: 1 }} />

        {/* ESTADÍSTICAS — fondo */}
        <div
          className="w-full flex justify-between items-center px-6 md:px-16 pb-5 pt-4"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)" }}
        >
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
