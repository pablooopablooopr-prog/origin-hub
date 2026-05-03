import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentSeasonInfo } from "@/lib/season";

/**
 * SECCIÓN 2 de la home: TEMPORADA ACTIVA.
 *
 * Bloque destacado de ancho completo con la temporada en curso,
 * descripción corta y dos CTAs (Ver rutas, Suscribirme al trimestre).
 *
 * El contenido cambia automáticamente según `getCurrentSeasonInfo()`.
 * Sin emojis decorativos — sólo letras, badges con texto y CTAs limpios.
 */

const SEASON_COPY: Record<string, { headline: string; sub: string }> = {
  queso: {
    headline: "El campo huele a leche cruda y maduración lenta",
    sub: "Tres meses de quesos de pastor, queserías de pueblo y catas en cuevas familiares.",
  },
  miel: {
    headline: "El verano se cosecha en colmenas y olivares",
    sub: "Mieles de jara, AOVES de cosecha temprana y cooperativas con puertas abiertas.",
  },
  caza: {
    headline: "Empieza la temporada de monterías",
    sub: "Caza mayor y menor en cotos privados con gestión sostenible y rehalas locales.",
  },
  vino: {
    headline: "Vendimia, fermentación y bodegas que cuentan siglos",
    sub: "Bodegas centenarias, catas verticales y la vendimia tradicional al alcance de cualquiera.",
  },
};

const SeasonHero = () => {
  const season = getCurrentSeasonInfo();
  const copy = SEASON_COPY[season.id] ?? SEASON_COPY.queso;

  return (
    <section className="bg-gradient-to-br from-primary to-earth-medium text-white">
      <div className="container mx-auto px-6 py-14 md:py-20 max-w-5xl">
        <div className="space-y-6">
          {/* Badge superior */}
          <Badge
            variant="outline"
            className="border-white/40 text-white bg-white/10 backdrop-blur-sm font-medium uppercase tracking-widest text-xs px-3 py-1"
          >
            Temporada activa · {season.label}
          </Badge>

          {/* Headline grande */}
          <div className="space-y-3 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {copy.headline}
            </h2>
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              {copy.sub}
            </p>
            <p className="text-xs uppercase tracking-widest text-white/60 pt-2">
              {season.range}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/rutas">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-medium gap-2"
              >
                Ver rutas de esta temporada
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/customer-auth?intent=suscribirme">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white bg-transparent hover:bg-white/10 font-medium gap-2"
              >
                Suscribirme al trimestre
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonHero;
