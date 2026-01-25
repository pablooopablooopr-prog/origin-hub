import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveMap from "@/components/InteractiveMap";

const Mapa = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center">
              <span>Mapa de </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>rigen</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre negocios auténticos cerca de ti filtrando por categoría, zona o producto.
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