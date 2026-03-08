import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveMap from "@/components/InteractiveMap";
import RoutesExplorer from "@/components/RoutesExplorer";
import HumanRatings from "@/components/HumanRatings";
import BusinessSection from "@/components/BusinessSection";
import Footer from "@/components/Footer";
import PackTypeCards from "@/components/PackTypeCards";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isCompanyUser, setIsCompanyUser] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) { setIsCompanyUser(false); return; }
      const { data } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      setIsCompanyUser(!!data);
    };
    check();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => check());
    return () => subscription.unsubscribe();
  }, []);

  const handleSearchPacks = () => {
    navigate('/packs');
  };
  return <div className="min-h-screen">
      <Header />
      <main>
        {!isCompanyUser && <Hero />}
        <InteractiveMap />
        
        {/* Pack Exploration Section */}
        <section className="-mt-4 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                Selecciones del territorio
              </h2>
                <p className="text-lg text-muted-foreground whitespace-nowrap mx-auto leading-relaxed">
                 Packs y propuestas originales creadas por productores de toda la vida para llevarte una parte del origen a casa
               </p>
            </div>

            {/* Pack Type Information Cards */}
            <PackTypeCards />

            {/* CTA Button */}
            <div className="text-center">
              <Button onClick={handleSearchPacks} size="lg" className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">Descubrir selecciones disponibles</Button>
            </div>
          </div>
        </section>
        
        <RoutesExplorer />
        <BusinessSection />
        <HumanRatings />
      </main>
      <Footer />
    </div>;
};
export default Index;