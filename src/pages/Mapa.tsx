import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";

const Mapa = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8 pb-2">
          <div className="text-center mb-2">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
              Explora el territorio
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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