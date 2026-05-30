import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeasonalRoutes from "@/components/home/SeasonalRoutes";

const Rutas = () => {
  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/routes-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-2">
        <SeasonalRoutes hideHeader />
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;
