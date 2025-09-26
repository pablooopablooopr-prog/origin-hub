import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegionalPacks from "@/components/RegionalPacks";
import PackTypeCards from "@/components/PackTypeCards";
import { Button } from "@/components/ui/button";

const Packs = () => {
  const scrollToSearch = () => {
    const searchSection = document.getElementById('buscador');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        {/* Header Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Explora los Packs Regionales
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Descubre lo mejor de cada tierra en packs cuidadosamente seleccionados por productores locales.<br />
              <span className="font-medium">Sencillos, equilibrados o gourmet: tú eliges cómo saborear el origen.</span>
            </p>
          </div>

          {/* Pack Type Information Cards */}
          <PackTypeCards />

          {/* CTA Button */}
          <div className="text-center mb-16">
            <Button 
              onClick={scrollToSearch}
              size="lg"
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Buscar Packs Disponibles
            </Button>
          </div>
        </div>

        {/* Search and Results Section */}
        <div id="buscador">
          <RegionalPacks showTitle={false} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packs;