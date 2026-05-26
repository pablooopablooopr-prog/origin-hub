import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveMap from "@/components/InteractiveMap";
import BusinessSection from "@/components/BusinessSection";
import HumanRatings from "@/components/HumanRatings";
import Footer from "@/components/Footer";
import SeasonalHero from "@/components/seasonal/SeasonalHero";
import { seasons } from "@/config/seasons";
import { getCurrentSeason } from "@/utils/getCurrentSeason";
import SpotlightToday from "@/components/home/SpotlightToday";
import SeasonalRoutes from "@/components/home/SeasonalRoutes";
import { MapSection } from "@/components/home/MapSection";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/**
 * HOME de ORIGEN ○ — rediseñada FASE 3.
 *
 * Orden de secciones (briefing FASE 3):
 *   1. HERO con vídeo (componente <Hero/> existente, NO se toca)
 *   2. TEMPORADA ACTIVA (<SeasonHero/>) — dinámico por fecha
 *   3. HOY EN ORIGEN ○ — spotlight rotatorio (<SpotlightToday/>)
 *   4. EL MAPA (<InteractiveMap/> existente, sólo se mantiene)
 *   5. RUTAS · [TEMPORADA ACTIVA] (<SeasonalRoutes/>)
 *   6. EMPRESAS / NEGOCIOS (<BusinessSection/> existente)
 *
 * + extras: HumanRatings, "Cómo funciona", manifiesto final.
 *
 * Cambios respecto a la versión anterior:
 *   - ❌ Eliminada la sección "Selecciones del territorio" (PackTypeCards)
 *   - ❌ Eliminado <RoutesExplorer/> (sustituido por <SeasonalRoutes/> con season filter)
 *   - ✅ Añadido <SeasonHero/> antes del mapa
 *   - ✅ Añadido <SpotlightToday/> con 6 nichos rotatorios
 *   - ✅ Las rutas están filtradas por temporada activa
 */

const Index = () => {
  const navigate = useNavigate();
  const [isCompanyUser, setIsCompanyUser] = useState(false);

  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Admin → panel admin
      if (user?.id) {
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminRole) {
          navigate("/admin/companies", { replace: true });
          return;
        }
      }

      if (!user?.id) {
        setIsCompanyUser(false);
        return;
      }

      const { data } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      setIsCompanyUser(!!data);
    };

    check();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => check());
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* ===== SECCIÓN 1: HERO con vídeo (oculto a empresas logueadas) ===== */}
        {!isCompanyUser && <Hero />}

        {/* ===== SECCIÓN 2: TEMPORADA ACTIVA =====
            Sistema reutilizable basado en /config/seasons.ts.
            Para forzar manualmente otra temporada en pruebas:
              <SeasonalHero data={seasons.queso} />
              <SeasonalHero data={seasons.mielAceite} />
              <SeasonalHero data={seasons.caza} />
              <SeasonalHero data={seasons.vino} />
        */}
        <SeasonalHero data={seasons[getCurrentSeason()]} />

        {/* ===== SECCIÓN 3: HOY EN ORIGEN ○ (spotlight 6 nichos) ===== */}
        <SpotlightToday />

        {/* ===== SECCIÓN 4: MAPA INTERACTIVO CON FILTROS =====
            El componente <MapSection/> ya trae su propio header editorial
            (eyebrow + título + subtítulo + laurel). NO añadir título extra aquí. */}
        <MapSection />

        {/* ===== SECCIÓN 5: RUTAS DE LA TEMPORADA ===== */}
        <SeasonalRoutes />

        {/* ===== SECCIÓN 6: EMPRESAS ===== */}
        <BusinessSection />

        <HumanRatings />

        {/* ===== Cómo funciona ORIGEN ===== */}
        <section className="py-10 md:py-14 bg-muted/30">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2
              className="text-4xl md:text-5xl font-bold text-primary text-center mb-8 tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif" }}
            >
              Cómo funciona ORIGEN
            </h2>

            <div className="relative">
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px hidden md:block" />

              {[
                {
                  step: "01",
                  title: "Explora",
                  description:
                    "Descubre lugares, productores y rutas desde el mapa.",
                  align: "right" as const,
                },
                {
                  step: "02",
                  title: "Conecta",
                  description:
                    "Visita, reserva, recorre o compra directamente en origen.",
                  align: "left" as const,
                },
                {
                  step: "03",
                  title: "Vuelve",
                  description:
                    "Guarda lugares, completa rutas y sigue descubriendo nuevos territorios.",
                  align: "right" as const,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`relative flex items-center mb-6 last:mb-0 md:justify-${
                    item.align === "right" ? "start" : "end"
                  }`}
                >
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground items-center justify-center text-xs font-bold shadow-md z-10">
                    {item.step}
                  </div>
                  <div
                    className={`w-full md:w-[calc(50%-2.5rem)] ${
                      item.align === "right"
                        ? "md:ml-0 md:mr-auto"
                        : "md:mr-0 md:ml-auto"
                    }`}
                  >
                    <div className="bg-card rounded-xl p-5 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
                      <span className="inline-block md:hidden text-xs font-bold text-secondary tracking-widest uppercase mb-1">
                        Paso {item.step}
                      </span>
                      <h3
                        className="text-lg md:text-xl font-bold text-primary mb-1"
                        style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Manifiesto + CTA Final ===== */}
        <section className="py-6 md:py-10 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <h2
              className="text-2xl md:text-3xl font-bold text-primary mb-4 leading-tight tracking-tight italic"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif" }}
            >
              «Volver al origen siempre fue una forma de avanzar»
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8" style={{ fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
              Creemos en una España viva, conectada a su tierra, a sus oficios y
              a las personas que la sostienen. ORIGEN nace para dar visibilidad
              a quienes producen, cocinan y cuidan el territorio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/mapa")}
                size="default"
                className="text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                Explorar ORIGEN
              </Button>
              <Button
                onClick={() => navigate("/soy-empresa")}
                variant="outline"
                size="default"
                className="text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-primary"
              >
                Unir mi negocio
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
