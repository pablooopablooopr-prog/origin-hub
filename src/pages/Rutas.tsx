import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeasonalRoutes from "@/components/home/SeasonalRoutes";

const GOLD = "#b8923f";

const Rutas = () => {
  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/routes-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 pt-8 pb-0">
          <div className="text-center">
            {/* Eyebrow dorado */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block h-px w-8" style={{ backgroundColor: GOLD }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                Rutas
              </span>
              <span className="block h-px w-8" style={{ backgroundColor: GOLD }} aria-hidden="true" />
            </div>
            {/* Título de la página */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center flex-wrap" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
              <span>Experiencias</span>
              <span className="inline-flex items-center ml-3">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
              </span>
              <span>rigen</span>
            </h1>
            {/* Subtítulo correcto */}
            <p className="leading-relaxed mx-auto mb-2" style={{ color: "#6b4a20", fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)", maxWidth: "720px" }}>
              Rutas activas para esta temporada. Cada una visitada y aprobada por nuestro equipo antes de salir publicada.
            </p>
          </div>
        </div>
        <SeasonalRoutes hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;
