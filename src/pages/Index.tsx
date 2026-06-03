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
import HowItWorks from "@/components/home/HowItWorks";
import FerduqueModal from "@/components/home/FerduqueModal";
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
      {/* Modal FERDUQUE — aparece automáticamente al entrar, formulario completo */}
      <FerduqueModal />
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

        <HowItWorks />

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
