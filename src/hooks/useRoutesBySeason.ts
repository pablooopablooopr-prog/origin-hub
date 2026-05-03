import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentSeason, type Season } from "@/lib/season";

export interface SeasonRoute {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  duration: string | null;
  difficulty: string | null;
  image_url: string | null;
  total_stops: number | null;
  total_participants: number | null;
  avg_rating: number | null;
  is_featured: boolean | null;
  season: Season | null;
}

export interface UseRoutesBySeasonOptions {
  /** Temporada concreta. Si no se pasa, usa la temporada actual. */
  season?: Season;
  /** Máximo de rutas a devolver. Default: 3. */
  limit?: number;
  /** Si true, prioriza is_featured. Default: true. */
  featuredFirst?: boolean;
}

export interface UseRoutesBySeasonResult {
  routes: SeasonRoute[];
  season: Season;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook para listar rutas filtradas por temporada (con fallback razonable).
 *
 * Comportamiento:
 *   1. Pide rutas activas/públicas con la temporada indicada
 *   2. Si no hay suficientes, completa con rutas sin temporada (genéricas)
 *   3. Ordena: featured primero (si featuredFirst=true), luego avg_rating desc
 *
 * Pensado para la sección "RUTAS · [TEMPORADA ACTIVA]" de la home.
 */
export function useRoutesBySeason(
  options: UseRoutesBySeasonOptions = {}
): UseRoutesBySeasonResult {
  const { season: requestedSeason, limit = 3, featuredFirst = true } = options;
  const season = requestedSeason ?? getCurrentSeason();

  const [routes, setRoutes] = useState<SeasonRoute[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1) rutas con la temporada exacta
      const { data: seasonal, error: errSeasonal } = await supabase
        .from("routes")
        .select(
          "id, slug, title, description, duration, difficulty, image_url, total_stops, total_participants, avg_rating, is_featured, season"
        )
        .eq("is_active", true)
        .eq("is_public", true)
        .eq("season", season)
        .order(featuredFirst ? "is_featured" : "avg_rating", { ascending: false })
        .order("avg_rating", { ascending: false })
        .limit(limit);

      if (errSeasonal) throw errSeasonal;

      let result: SeasonRoute[] = (seasonal ?? []) as SeasonRoute[];

      // 2) si faltan, rellenar con rutas sin temporada (NULL)
      if (result.length < limit) {
        const remaining = limit - result.length;
        const excludeIds = result.map((r) => r.id);

        let q = supabase
          .from("routes")
          .select(
            "id, slug, title, description, duration, difficulty, image_url, total_stops, total_participants, avg_rating, is_featured, season"
          )
          .eq("is_active", true)
          .eq("is_public", true)
          .is("season", null)
          .order(featuredFirst ? "is_featured" : "avg_rating", { ascending: false })
          .order("avg_rating", { ascending: false })
          .limit(remaining);

        if (excludeIds.length > 0) {
          q = q.not("id", "in", `(${excludeIds.join(",")})`);
        }

        const { data: generic, error: errGeneric } = await q;
        if (errGeneric) throw errGeneric;
        result = result.concat((generic ?? []) as SeasonRoute[]);
      }

      setRoutes(result);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al cargar rutas por temporada";
      console.warn("useRoutesBySeason error:", msg);
      setError(msg);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, limit, featuredFirst]);

  return { routes, season, isLoading, error, refresh: fetchRoutes };
}
