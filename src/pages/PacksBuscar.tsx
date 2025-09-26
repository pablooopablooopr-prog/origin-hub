import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegionalPacks from "@/components/RegionalPacks";

const PacksBuscar = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <RegionalPacks showTitle={false} />
      </main>
      <Footer />
    </div>
  );
};

export default PacksBuscar;