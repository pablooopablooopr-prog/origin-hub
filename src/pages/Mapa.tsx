import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapSection } from "@/components/home/MapSection";
import { ORIGEN_COLORS } from "@/components/home/map/mapStyles";

const Mapa = () => {
  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/map-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8 pb-2">
          <div className="text-center">
            {/* Eyebrow dorado */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block h-px w-10" style={{ backgroundColor: ORIGEN_COLORS.gold }} aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: ORIGEN_COLORS.gold }}>
                El Mapa
              </span>
              <span className="block h-px w-10" style={{ backgroundColor: ORIGEN_COLORS.gold }} aria-hidden="true" />
            </div>
            {/* Título de la página */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center flex-wrap" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
              <span>Expl</span>
              <span className="inline-flex items-center">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
              </span>
              <span>ra el territorio</span>
            </h1>
            {/* Subtítulo del MapSection (sin repetirlo dentro) */}
            <p className="leading-relaxed mx-auto mb-2" style={{ color: ORIGEN_COLORS.brownSoft, fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)", maxWidth: "720px" }}>
              Explora productores, restaurantes, experiencias y alojamientos de la región con una navegación clara, curada y visualmente elegante.
            </p>
          </div>
        </div>
        <MapSection hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default Mapa;
