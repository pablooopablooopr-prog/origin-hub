import { Link } from "react-router-dom";
import { ArrowRight, Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getTodaysSpotlight,
  SPOTLIGHT_NICHOS,
  type SpotlightCompany,
} from "@/data/spotlightDemo";

/**
 * SECCIÓN 3 de la home: HOY EN ORIGEN ○ · [FECHA].
 *
 * Grid de 6 tarjetas (1 por nicho). Cada día se elige una empresa diferente
 * por nicho via `getTodaysSpotlight()` (rotación estable basada en día del año).
 *
 * Las empresas con plan "destacado" tienen borde dorado y badge ★, y aparecen
 * con más frecuencia en la rotación (peso x2).
 *
 * Sin emojis decorativos: todo es texto, badges y un único icono ★ para
 * marcar destacados (compatible con la regla "solo estrellas si es óptimo").
 */

const formatTodayLabel = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const NichoBadge = ({ label }: { label: string }) => (
  <Badge
    variant="outline"
    className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5"
  >
    {label}
  </Badge>
);

const FeaturedBadge = () => (
  <Badge className="bg-amber-100 text-amber-900 border-amber-300 gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5">
    <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
    Destacada
  </Badge>
);

const SpotlightCard = ({
  company,
  nichoLabel,
}: {
  company: SpotlightCompany;
  nichoLabel: string;
}) => {
  const isFeatured = company.plan === "destacado";
  const linkTo = company.slug ? `/negocio/${company.slug}` : "/soy-empresa";

  return (
    <Card
      className={`h-full transition-shadow duration-300 hover:shadow-[var(--shadow-earth)] ${
        isFeatured
          ? "border-2 border-amber-300/70"
          : "border border-border"
      }`}
    >
      <CardContent className="p-5 flex flex-col h-full gap-3">
        <div className="flex items-center justify-between gap-2">
          <NichoBadge label={nichoLabel} />
          {isFeatured && <FeaturedBadge />}
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold tracking-tight leading-snug">
            {company.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {company.locality}
          </p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {company.description}
        </p>

        <Link to={linkTo} className="pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="px-0 h-auto font-medium text-primary hover:bg-transparent hover:text-primary group/btn"
          >
            Ver ficha
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const SpotlightToday = () => {
  const today = new Date();
  const todays = getTodaysSpotlight(today);

  return (
    <section className="container mx-auto px-6 py-16 max-w-6xl">
      <header className="mb-10 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Hoy en ORIGEN ○ · {formatTodayLabel(today)}
        </p>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Empresas destacadas de hoy en Castilla-La Mancha
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Una empresa por nicho cada día. Las destacadas ocupan más turnos y
          aparecen con borde dorado.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPOTLIGHT_NICHOS.map(({ id, label }) => (
          <SpotlightCard
            key={id}
            company={todays[id]}
            nichoLabel={label}
          />
        ))}
      </div>
    </section>
  );
};

export default SpotlightToday;
