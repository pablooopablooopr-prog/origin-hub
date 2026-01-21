import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveMap from "@/components/InteractiveMap";
import RoutesExplorer from "@/components/RoutesExplorer";
import HumanRatings from "@/components/HumanRatings";
import BusinessSection from "@/components/BusinessSection";
import Footer from "@/components/Footer";
import PackTypeCards from "@/components/PackTypeCards";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const handleSearchPacks = () => {
    navigate('/packs');
  };
  return <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InteractiveMap />
        
        {/* Pack Exploration Section */}
        <section className="pt-6 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Explora los Packs Regionales
              </h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Descubre lo mejor de cada tierra en packs cuidadosamente seleccionados por productores locales.<br />
                <span className="font-medium">Sencillos, equilibrados o gourmet: tú eliges cómo saborear el ORIGEN.</span>
              </p>
            </div>

            {/* Pack Type Information Cards */}
            <PackTypeCards />

            {/* CTA Button */}
            <div className="text-center">
              <Button onClick={handleSearchPacks} size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Descubrir Packs Disponibles</Button>
            </div>
          </div>
        </section>
        
        <RoutesExplorer />
        <BusinessSection />
        <HumanRatings />
      </main>
      <Footer />
    </div>;
};
export default Index;