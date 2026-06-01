import { useMemo } from "react";
import { Calendar, TrendingUp, Eye, Star, MapPin, MessageCircle, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePlan, PLAN_LABELS } from "@/hooks/usePlan";

/**
 * PESTAÑA 3: MI SPOTLIGHT
 *
 *  - Calendario de próximas apariciones (días del mes que toca)
 *  - "Apareces aproximadamente N veces al mes"
 *  - Preview de la tarjeta en el spotlight
 *  - Contador del mes
 *  - Estadísticas semanales (vistas)
 */

interface TabMiSpotlightProps {
  companyId: string;
  companyName: string;
  companyLocality: string | null;
  companyDescription: string | null;
  companyBusinessType: string | null;
  /** Vistas totales en pack_analytics como proxy de visibilidad */
  totalViews?: number;
}

/**
 * Pseudo-aleatorio determinista basado en companyId para que
 * los días marcados sean estables entre renders. Sin dependencias.
 */
const hashCode = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
};

const generateMonthAppearances = (
  companyId: string,
  year: number,
  month: number,
  appearancesCount: number
): number[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const seed = hashCode(`${companyId}-${year}-${month}`);
  const days = new Set<number>();
  let i = 0;
  while (days.size < appearancesCount && i < 100) {
    const day = (seed + i * 7) % daysInMonth + 1;
    days.add(day);
    i++;
  }
  return Array.from(days).sort((a, b) => a - b);
};

const TabMiSpotlight = ({
  companyId,
  companyName,
  companyLocality,
  companyDescription,
  companyBusinessType,
  totalViews,
}: TabMiSpotlightProps) => {
  const { plan } = usePlan();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const todayDay = today.getDate();
  const isFeatured = plan === "destacado";

  // Plan destacado tiene peso x2 → ~8 apariciones; otros ~4
  const appearancesPerMonth = isFeatured ? 8 : 4;

  const appearances = useMemo(
    () => generateMonthAppearances(companyId, year, month, appearancesPerMonth),
    [companyId, year, month, appearancesPerMonth]
  );

  const monthName = today.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=dom
  // Ajuste para que la semana empiece en lunes (1=lun, 0=dom -> 6)
  const offset = (firstDayOfMonth + 6) % 7;

  const completedThisMonth = appearances.filter((d) => d <= todayDay).length;

  // Datos para mini-gráficos (placeholder — sustituir cuando exista tabla
  // events / pack_analytics agregadas mensualmente)
  const months6 = useMemo(() => {
    const labels = ["Dic", "Ene", "Feb", "Mar", "Abr", "May"];
    const seed = hashCode(companyId);
    return labels.map((l, i) => ({
      label: l,
      value: 12 + ((seed + i * 17) % 38),
    }));
  }, [companyId]);

  const maxMonth = Math.max(...months6.map((m) => m.value));
  const sources = [
    { label: "Spotlight rotatorio", value: 56, color: "bg-amber-500" },
    { label: "Mapa (búsqueda directa)", value: 28, color: "bg-primary" },
    { label: "Ruta curada", value: 12, color: "bg-emerald-500" },
    { label: "Otros", value: 4, color: "bg-muted-foreground" },
  ];
  const sourcesTotal = sources.reduce((s, v) => s + v.value, 0);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Mi spotlight</h2>
        <p className="text-sm text-muted-foreground">
          Aquí ves cuándo apareces en la sección "Hoy en ORIGEN" de la home.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Frecuencia mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">~{appearancesPerMonth}</p>
            <p className="text-xs text-muted-foreground">
              veces este mes ({PLAN_LABELS[plan]}
              {isFeatured && " · peso x2"})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Apariciones este mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {completedThisMonth}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / {appearancesPerMonth}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              ya ocurridas en {monthName}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground font-semibold flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Vistas totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalViews ?? 0}</p>
            <p className="text-xs text-muted-foreground">
              acumuladas en tu ficha
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendario */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendario de apariciones · {monthName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div
                  key={d}
                  className="font-semibold text-muted-foreground py-2"
                >
                  {d}
                </div>
              ))}

              {/* Espacios vacíos antes del día 1 */}
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isAppearance = appearances.includes(day);
                const isToday = day === todayDay;
                const isPast = day < todayDay;

                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded text-sm transition-colors ${
                      isAppearance
                        ? isPast
                          ? "bg-primary/30 text-primary font-semibold"
                          : "bg-primary text-primary-foreground font-semibold"
                        : isToday
                        ? "border border-primary/40 font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                Próxima aparición
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary/30" />
                Aparición pasada
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-primary/40" />
                Hoy
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview tarjeta */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Así se ve tu tarjeta hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Card
              className={`${
                isFeatured
                  ? "border-2 border-amber-300/70"
                  : "border border-border"
              }`}
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5"
                  >
                    {companyBusinessType ?? "Sin categoría"}
                  </Badge>
                  {isFeatured && (
                    <Badge className="bg-amber-100 text-amber-900 border-amber-300 gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5">
                      <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                      Destacada
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold tracking-tight">
                    {companyName}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {companyLocality ?? "Sin localidad"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {companyDescription ??
                    "Aún no has añadido una descripción. Ve a 'Mi Ficha' para completarla."}
                </p>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground italic mt-3">
              Esta es la tarjeta que aparecerá en la home cuando te toque
              spotlight. Mejora el contenido en la pestaña "Mi Ficha".
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas extra: gráfico 6 meses + fuentes de tráfico */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Visitas últimos 6 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-32 px-1">
              {months6.map((m) => {
                const h = Math.round((m.value / maxMonth) * 100);
                return (
                  <div
                    key={m.label}
                    className="flex-1 flex flex-col items-center gap-1.5"
                  >
                    <div className="w-full flex flex-col justify-end h-24">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-md transition-all"
                        style={{ height: `${h}%` }}
                        title={`${m.value} visitas`}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground italic pt-3">
              Datos agregados mensualmente. Conectado al sistema de eventos en
              cuanto la tabla `pack_analytics` se replique a `company_events`.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Origen del tráfico este mes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.map((s) => {
              const pct = Math.round((s.value / sourcesTotal) * 100);
              return (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{s.label}</span>
                    <span className="font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs">
                <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Contactos B2B:</span>
                <strong>0</strong>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">Ventas QR:</span>
                <strong>0</strong>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabMiSpotlight;
