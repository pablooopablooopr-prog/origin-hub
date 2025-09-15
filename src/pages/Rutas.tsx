import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoutesExplorer from "@/components/RoutesExplorer";

const Rutas = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>Rutas </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>RIGEN</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Marca y comparte rutas visitando negocios locales. Sube valoraciones y reseñas de cada lugar que descubras en tu camino.
            </p>
          </div>
        </div>
        <RoutesExplorer showTitle={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;