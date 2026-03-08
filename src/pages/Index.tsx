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

        {/* Cómo funciona ORIGEN */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-4xl md:text-5xl font-bold text-primary text-center mb-16 tracking-tight">
              Cómo funciona ORIGEN
            </h2>

            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px hidden md:block" />

              {[
                {
                  step: "01",
                  title: "Explora",
                  description: "Descubre lugares, productores y rutas desde el mapa.",
                  align: "right" as const,
                },
                {
                  step: "02",
                  title: "Conecta",
                  description: "Visita, reserva, recorre o compra directamente en origen.",
                  align: "left" as const,
                },
                {
                  step: "03",
                  title: "Vuelve",
                  description: "Guarda lugares, completa rutas y sigue descubriendo nuevos territorios.",
                  align: "right" as const,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-center mb-12 last:mb-0 md:justify-${item.align === "right" ? "start" : "end"}`}
                >
                  {/* Step dot on timeline */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground items-center justify-center text-sm font-bold shadow-lg z-10">
                    {item.step}
                  </div>

                  {/* Card */}
                  <div
                    className={`w-full md:w-[calc(50%-3rem)] ${
                      item.align === "right" ? "md:ml-0 md:mr-auto" : "md:mr-0 md:ml-auto"
                    }`}
                  >
                    <div className="bg-card rounded-2xl p-8 shadow-md border border-border/50 hover:shadow-lg transition-shadow">
                      <span className="inline-block md:hidden text-xs font-bold text-secondary tracking-widest uppercase mb-2">
                        Paso {item.step}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">{item.title}</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manifiesto + CTA Final */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-6">Importante</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-8 leading-tight tracking-tight">
              Volver al origen también es una forma de avanzar
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12">
              Creemos en una España viva, conectada a su tierra, a sus oficios y a las personas que la sostienen. ORIGEN nace para dar visibilidad a quienes producen, cocinan y cuidan el territorio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/mapa')} size="lg" className="text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                Explorar ORIGEN
              </Button>
              <Button onClick={() => navigate('/soy-empresa')} variant="outline" size="lg" className="text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all border-2 border-primary">
                Unir mi negocio
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default Index;