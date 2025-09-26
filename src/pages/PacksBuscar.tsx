import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegionalPacks from "@/components/RegionalPacks";

const PacksBuscar = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Buscar Packs Regionales
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encuentra el pack perfecto usando nuestros filtros de búsqueda
            </p>
          </div>
        </div>
        <RegionalPacks showTitle={false} />
      </main>
      <Footer />
    </div>
  );
};

export default PacksBuscar;