import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Compass,
  Users,
  Loader2,
  Clock,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import CompanyPlanGate from "@/components/CompanyPlanGate";

/**
 * PESTAÑA 5: MIS RUTAS (gated por plan Standard)
 *
 * Refactor de la lógica existente del CompanyDashboard:
 *   - Rutas creadas por la propia empresa (con editar/eliminar)
 *   - Rutas en las que la empresa aparece como parada
 *   - Stats trimestrales
 *
 * Uso: <TabMisRutas userId={user.id} companyId={company.id} />
 */

interface CompanyRoute {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  difficulty: string | null;
  image_url: string | null;
  total_participants: number | null;
}

interface TabMisRutasProps {
  userId: string;
  companyId: string;
}

const TabMisRutasInner = ({ userId, companyId }: TabMisRutasProps) => {
  const [ownRoutes, setOwnRoutes] = useState<CompanyRoute[]>([]);
  const [routesAsStop, setRoutesAsStop] = useState<CompanyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  const loadRoutes = async () => {
    setLoading(true);

    // Rutas creadas por el usuario
    const { data: own } = await supabase
      .from("routes")
      .select(
        "id, title, slug, description, duration, difficulty, image_url, total_participants"
      )
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    // Rutas donde el companyId aparece como parada
    const { data: stops } = await supabase
      .from("route_stops")
      .select(
        `route:routes!inner(
          id, title, slug, description, duration, difficulty,
          image_url, total_participants, is_public, is_active
        )`
      )
      .eq("company_id", companyId);

    const filteredStops: CompanyRoute[] = (stops ?? [])
      .map((s: any) => s.route)
      .filter((r: any) => r && r.is_public && r.is_active)
      .map((r: any) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        description: r.description,
        duration: r.duration,
        difficulty: r.difficulty,
        image_url: r.image_url,
        total_participants: r.total_participants,
      }));

    setOwnRoutes((own ?? []) as CompanyRoute[]);
    setRoutesAsStop(filteredStops);
    setLoading(false);
  };

  useEffect(() => {
    void loadRoutes();
  }, [userId, companyId]);

  const handleDelete = async (routeId: string) => {
    // Borra paradas y la ruta (RLS protege a otros usuarios)
    const { error: errStops } = await supabase
      .from("route_stops")
      .delete()
      .eq("route_id", routeId);

    if (errStops) {
      toast.error("No se pudieron eliminar las paradas: " + errStops.message);
      return;
    }

    const { error: errRoute } = await supabase
      .from("routes")
      .delete()
      .eq("id", routeId);

    if (errRoute) {
      toast.error("No se pudo eliminar la ruta: " + errRoute.message);
      return;
    }

    setOwnRoutes((prev) => prev.filter((r) => r.id !== routeId));
    setRouteToDelete(null);
    toast.success("Ruta eliminada");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const totalParticipantsThisQuarter = routesAsStop.reduce(
    (sum, r) => sum + (r.total_participants ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Mis rutas</h2>
          <p className="text-sm text-muted-foreground">
            Crea tus propias rutas o aparece como parada en rutas de ORIGEN.
          </p>
        </div>
        <Link to="/crear-ruta">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Crear nueva ruta
          </Button>
        </Link>
      </div>

      {/* Stats trimestre */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Rutas creadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{ownRoutes.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Apareces como parada en
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{routesAsStop.length}</p>
            <p className="text-xs text-muted-foreground">rutas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" />
              Visitantes este trimestre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalParticipantsThisQuarter}</p>
            <p className="text-xs text-muted-foreground">
              vía rutas en las que apareces
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mis rutas creadas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rutas que has creado</CardTitle>
        </CardHeader>
        <CardContent>
          {ownRoutes.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <Compass className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Aún no has creado ninguna ruta. Pulsa "Crear nueva ruta" para
                empezar.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {ownRoutes.map((route) => (
                <Card
                  key={route.id}
                  className="border border-border hover:shadow-sm transition-shadow"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm leading-snug">
                        {route.title}
                      </h4>
                      {route.difficulty && (
                        <Badge variant="outline" className="text-[10px] shrink-0">
                          {route.difficulty}
                        </Badge>
                      )}
                    </div>
                    {route.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {route.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {route.duration && <span>{route.duration}</span>}
                      {route.total_participants !== null && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {route.total_participants}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border">
                      <Link
                        to={`/editar-ruta/${route.slug}`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setRouteToDelete(route.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rutas donde aparezco — con itinerario expandible */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Apareces en estas rutas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {routesAsStop.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <MapPin className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Aún no apareces como parada en ninguna ruta de ORIGEN.
              </p>
              <Card className="bg-muted/40 max-w-md mx-auto text-left">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Próxima temporada
                  </p>
                  <p className="text-sm">
                    En tu temporada principal hay rutas curadas a las que puedes
                    optar. Sugiérete y nuestro equipo te contactará.
                  </p>
                  <Button
                    size="sm"
                    className="gap-2 mt-2"
                    onClick={() =>
                      window.location.assign("mailto:rutas@origen.it.com?subject=Sugerencia%20de%20ruta")
                    }
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Sugerirme para próxima temporada
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {routesAsStop.map((route, idx) => (
                <RouteWithItinerary
                  key={route.id}
                  route={route}
                  position={idx + 2}
                  companyName={undefined}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de rutas pasadas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground italic">
            Cuando termine una ruta verás aquí los visitantes recibidos y la
            puntuación media de los participantes.
          </p>
        </CardContent>
      </Card>

      {/* Confirmación de borrado */}
      <AlertDialog
        open={!!routeToDelete}
        onOpenChange={(open) => !open && setRouteToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta ruta?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminarán también todas sus paradas. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => routeToDelete && handleDelete(routeToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

/**
 * Card de ruta con itinerario expandible. Datos de paradas son mock por ahora —
 * cuando la tabla route_stops contenga `scheduled_time` por parada, sustituir.
 */
const RouteWithItinerary = ({
  route,
  position,
}: {
  route: CompanyRoute;
  position: number;
  companyName: string | undefined;
}) => {
  const [expanded, setExpanded] = useState(false);

  const mockStops = [
    { time: "09:00", name: "Piedrabuena", note: "Punto de salida" },
    { time: "10:30", name: "Tu empresa", note: "Parada · 15 min", you: true },
    { time: "11:45", name: "Bodega Manchega", note: "Visita guiada" },
    { time: "13:00", name: "Restaurante El Retablo", note: "Comida" },
    { time: "15:00", name: "Apiarios del Bullaque", note: "Fin de ruta" },
  ];

  return (
    <Card className="border border-border hover:shadow-sm transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <h4 className="font-semibold text-sm leading-snug">{route.title}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              Eres parada #{position}
            </p>
          </div>
          {route.difficulty && (
            <Badge variant="outline" className="text-[10px] shrink-0">
              {route.difficulty}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {route.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {route.duration}
            </span>
          )}
          {route.total_participants !== null && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {route.total_participants} visitantes
            </span>
          )}
        </div>

        {expanded && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Itinerario
              </p>
              <ol className="space-y-2">
                {mockStops.map((s, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-3 text-sm ${
                      s.you ? "bg-amber-50 border border-amber-200 rounded-lg p-2 -mx-2" : ""
                    }`}
                  >
                    <div className="flex flex-col items-center pt-0.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          s.you
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{s.time}</p>
                      <p
                        className={`text-sm leading-tight ${s.you ? "font-semibold" : "font-medium"}`}
                      >
                        {s.name}
                        {s.you && (
                          <Badge className="ml-2 bg-amber-100 text-amber-900 border-amber-300 text-[9px] px-1.5 py-0">
                            Tú
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded((v) => !v)}
            className="gap-1 flex-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                Ocultar itinerario
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                Ver itinerario
              </>
            )}
          </Button>
          <Link to={`/rutas/${route.slug}`}>
            <Button size="sm" variant="outline">
              Ruta pública
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const TabMisRutas = (props: TabMisRutasProps) => (
  <CompanyPlanGate
    required="standard"
    upgradeMessage="La gestión de rutas está disponible a partir del plan Standard. Mejora tu plan para crear rutas y aparecer como parada en rutas curadas."
  >
    <TabMisRutasInner {...props} />
  </CompanyPlanGate>
);

export default TabMisRutas;
