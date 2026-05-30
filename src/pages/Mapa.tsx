import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapSection } from "@/components/home/MapSection";

const Mapa = () => {
  return (
    <div className="min-h-screen" style={{ backgroundImage: "url('/textures/map-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />
      <main className="pt-2">
        <MapSection />
      </main>
      <Footer />
    </div>
  );
};

export default Mapa;
