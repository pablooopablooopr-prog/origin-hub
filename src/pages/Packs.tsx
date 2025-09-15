import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegionalPacks from "@/components/RegionalPacks";

const Packs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>Packs Regi</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>nales</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Productos auténticos de cada región, seleccionados por su calidad y tradición.
            </p>
          </div>
        </div>
        <RegionalPacks showTitle={false} />
      </main>
      <Footer />
    </div>
  );
};

export default Packs;