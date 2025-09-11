import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoutesExplorer from "@/components/RoutesExplorer";

const Rutas = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-2">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <span>Explora las Rutas</span>
              <img 
                src="/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png" 
                alt="Ensō" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain"
                style={{ backgroundColor: 'transparent' }}
              />
              <span>RIGEN</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conecta con la autenticidad: rutas curadas con negocios locales, cultura y sabor.
            </p>
          </div>
        </div>
        <RoutesExplorer />
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;