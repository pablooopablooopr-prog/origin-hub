import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";

const Mapa = () => {
  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/map-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8 pb-2">
          <div className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center flex-wrap" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
              <span>Expl</span>
              <span className="inline-flex items-center">
                <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
              </span>
              <span>ra el territorio</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#5a3e20", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
              Filtra por provincia, tipo de negocio o experiencia y recorre España a través de su red gastronómica.
            </p>
          </div>
        </div>
        <InteractiveMap showTitle={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Mapa;