import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpotlightToday from "@/components/home/SpotlightToday";
import BusinessSection from "@/components/BusinessSection";
import HumanRatings from "@/components/HumanRatings";

const SobreOrigen = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('/textures/adobe-wall.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="flex-1">
        {/* Hero con título */}
        <section className="relative py-20 md:py-28 overflow-hidden" style={{ background: "rgba(230,210,170,0.72)" }}>
          <div className="container relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 flex items-center justify-center tracking-tight" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
              <span>S</span>
              <img
                src="/lovable-uploads/clean-enso-symbol.png"
                alt="Ensō"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mx-1"
              />
              <span>bre ORIGEN</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed font-light" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#5a3e20", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
              Creemos en una España viva, conectada a su tierra, a sus oficios y a las personas que la sostienen. ORIGEN nace para dar visibilidad a quienes producen, cocinan y cuidan el territorio.
            </p>
          </div>
        </section>

        <SpotlightToday />
        <BusinessSection />
        <HumanRatings />
      </main>
      <Footer />
    </div>
  );
};

export default SobreOrigen;
