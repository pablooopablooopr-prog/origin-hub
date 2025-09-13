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
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <span>Packs Regi</span>
              <img 
                src="/lovable-uploads/new-enso-symbol.png" 
                alt="Ensō"
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                style={{ backgroundColor: 'transparent' }}
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