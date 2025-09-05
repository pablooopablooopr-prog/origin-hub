import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RegionalPacks from "@/components/RegionalPacks";
import InteractiveMap from "@/components/InteractiveMap";
import RoutesExplorer from "@/components/RoutesExplorer";
import HumanRatings from "@/components/HumanRatings";
import BusinessSection from "@/components/BusinessSection";
import Testimonials from "@/components/Testimonials";

import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <InteractiveMap />
        <RegionalPacks />
        <RoutesExplorer />
        <BusinessSection />
        <HumanRatings />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;