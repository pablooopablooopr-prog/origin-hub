import { Link } from "react-router-dom";
import { MapPin, Clock, Users, Star, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRoutesBySeason } from "@/hooks/useRoutesBySeason";
import { getCurrentSeasonInfo } from "@/lib/season";
import {
  getDemoRoutesBySeason,
  type DemoRoute,
} from "@/data/seasonalRoutesDemo";

/**
 * SECCIÓN 5 de la home: RUTAS · [TEMPORADA ACTIVA].
 *
 * - Pide rutas reales filtradas por season actual via useRoutesBySeason()
 * - Si la BD aún no tiene rutas con season poblada, cae al fallback demo
 *   (datos hardcoded en src/data/seasonalRoutesDemo.ts)
 *
 * Sustituye al antiguo `PackTypeCards` que mostraba 4 tipos de pack.
 *
 * Sin emojis decorativos: iconos funcionales (MapPin, Clock, Users) y
 * estrellas para la valoración.
 */

interface UnifiedRoute {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  recorrido: string;
  capacity: number;
  rating: number;
}

const adaptDemoRoute = (r: DemoRoute): UnifiedRoute => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  description: r.description,
  duration: r.duration,
  recorrido: r.recorrido,
  capacity: r.capacity,
  rating: r.rating,
});

const RouteCard = ({ route }: { route: UnifiedRoute }) => (
  <Card className="h-full transition-shadow duration-300 hover:shadow-[var(--shadow-earth)] overflow-hidden">
    {/* Banda visual sin imagen — placeholder elegante de tonos tierra */}
    <div className="h-32 bg-gradient-to-br from-earth-light via-earth-medium to-primary/80" />

    <CardContent className="p-6 flex flex-col gap-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight leading-snug">
          {route.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {route.description}
        </p>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span className="leading-snug">{route.recorrido}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {route.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Máx. {route.capacity}
          </span>
        </div>
        <div className="flex items-center gap-1 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.round(route.rating)
                  ? "fill-amber-500 text-amber-500"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="text-xs ml-1.5 font-medium">{route.rating.toFixed(1)}</span>
        </div>
      </div>

      <Link to={`/rutas/${route.slug}`} className="pt-1">
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 group/btn"
        >
          Ver ruta completa
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const SeasonalRoutes = () => {
  const seasonInfo = getCurrentSeasonInfo();
  const { routes: dbRoutes, isLoading } = useRoutesBySeason({ limit: 3 });

  // Si la BD no devuelve nada (vacía o error), usar demo
  const routes: UnifiedRoute[] =
    dbRoutes.length > 0
      ? dbRoutes.map((r) => ({
          id: r.id,
          slug: r.slug,
          title: r.title,
          description: r.description ?? "",
          duration: r.duration ?? "—",
          recorrido: `${r.total_stops ?? 0} paradas`,
          capacity: 25, // valor por defecto si la BD no lo guarda
          rating: r.avg_rating ?? 0,
        }))
      : getDemoRoutesBySeason(seasonInfo.id, 3).map(adaptDemoRoute);

  return (
    <section className="container mx-auto px-6 py-16 max-w-6xl">
      <header className="mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Rutas · {seasonInfo.label}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Experiencias curadas, verificadas en persona
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Rutas activas para esta temporada. Cada una visitada y aprobada
          por nuestro equipo antes de salir publicada.
        </p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((r) => (
              <RouteCard key={r.id} route={r} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link to="/rutas">
              <Button variant="outline" size="lg" className="gap-2">
                Ver todas las rutas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default SeasonalRoutes;
