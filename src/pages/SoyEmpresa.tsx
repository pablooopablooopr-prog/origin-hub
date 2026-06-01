import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  Check,
  Flower2,
  Leaf,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Snowflake,
  Sprout,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";

const BotanicalDetail = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute opacity-[0.09] mix-blend-multiply ${className}`}
  >
    <div className="h-24 w-24 rotate-12 rounded-full border border-[#8a6337]" />
    <div className="-mt-20 ml-12 h-20 w-20 -rotate-12 rounded-full border border-[#6c7d4b]" />
    <div className="-mt-14 ml-5 h-16 w-16 rotate-45 rounded-full border border-[#c29848]" />
  </div>
);

const SoyEmpresa = () => {
  const benefits = [
    {
      icon: <Users className="h-7 w-7" />,
      title: "Comunidad real",
      description:
        "Acceso directo a consumidores conscientes que valoran la autenticidad de tu producto.",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Visibilidad nacional",
      description:
        "Presencia en toda España manteniendo tu identidad y arraigo local.",
    },
    {
      icon: <Store className="h-7 w-7" />,
      title: "Venta directa",
      description:
        "Sin intermediarios. Relación directa con tus clientes y restaurantes.",
    },
  ];

  const seasons = [
    {
      id: "primavera",
      icon: <Sprout className="h-6 w-6" />,
      label: "Primavera",
      range: "Mar - May",
      product: "Queso manchego",
      className: "border-emerald-200 bg-emerald-50/70 text-emerald-950",
    },
    {
      id: "verano",
      icon: <Flower2 className="h-6 w-6" />,
      label: "Verano",
      range: "Jun - Ago",
      product: "Miel y aceite",
      className: "border-amber-200 bg-amber-50/70 text-amber-950",
    },
    {
      id: "otono",
      icon: <Leaf className="h-6 w-6" />,
      label: "Otoño",
      range: "Sep - Nov",
      product: "Caza y vino vendimia",
      className: "border-orange-200 bg-orange-50/70 text-orange-950",
    },
    {
      id: "invierno",
      icon: <Snowflake className="h-6 w-6" />,
      label: "Invierno",
      range: "Dic - Feb",
      product: "Vino reserva y gourmet",
      className: "border-sky-200 bg-sky-50/70 text-sky-950",
    },
  ];

  const spotlightBullets = [
    "Rotación automática por nicho y temporada.",
    "Card con foto 16:9, descripción y badges.",
    "Click directo a ficha completa con galería e historia.",
    "Visibilidad aproximada varias veces al mes según plan.",
  ];

  const planTiers = [
    {
      tier: "Básico",
      tagline: "Empieza a formar parte de RitmOrigen",
      icon: <Leaf className="h-7 w-7" />,
      highlight: false,
      features: [
        "Ficha pública de tu empresa",
        "Spotlight rotatorio en la home",
        "Mapa B2B en modo lectura",
        "Dashboard básico con estadísticas",
      ],
    },
    {
      tier: "Intermedio",
      tagline: "Más visibilidad, más oportunidades",
      icon: <TrendingUp className="h-7 w-7" />,
      highlight: true,
      features: [
        "Todo lo del plan Básico",
        "Pin dorado en mapa",
        "Borde destacado en spotlight",
        "TOP de newsletter trimestral",
        "Aparición garantizada en rutas de temporada",
        "Mensajes B2B con restaurantes verificados",
      ],
    },
    {
      tier: "Premium",
      tagline: "Visibilidad completa y beneficios exclusivos",
      icon: <ShieldCheck className="h-7 w-7" />,
      highlight: false,
      features: [
        "Todo lo del plan Intermedio",
        "Digitalización de facturas / adaptación Verifactu y Ley Crea y Crece",
        "Soporte de implementación durante el periodo de adaptación",
        "Acceso prioritario a leads B2B",
      ],
    },
  ];

  const criteria = [
    "Eres productor, restaurante o negocio",
    "Productos artesanos o tradicionales",
    "Sin aditivos químicos innecesarios",
    "Métodos de producción auténticos",
    "Compromiso con la calidad sobre la cantidad",
    "Negocio familiar o local establecido",
    "Respeto por el entorno y el territorio",
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f0e5] text-[#2a1c10]">
      <Header />
      <main className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(194,152,72,0.15),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(98,119,65,0.13),transparent_26%)]" />

        <section className="relative container mx-auto px-6 pb-9 pt-10 md:pb-12 md:pt-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b07a2a]">
              Únete a RitmOrigen
            </p>
            <h1
              className="mx-auto max-w-2xl text-[clamp(2.45rem,7vw,4.85rem)] font-semibold leading-[0.94] text-[#1f140c]"
              style={{ fontFamily: editorialFont }}
            >
              Forma parte de RitmOrigen
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-[#3c2b1d] md:text-lg">
              Únete a la comunidad estacional que conecta productores rurales,
              restaurantes y consumidores conscientes en toda España.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="min-w-[240px] bg-[#4f6f3f] text-[#fffaf2] shadow-[0_10px_24px_rgba(48,70,36,0.22)] hover:bg-[#425f34]"
              >
                <Link to="/company-auth?tab=signup">Unirme a RitmOrigen</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-[210px] border-[#d8c7ad] bg-[#fffaf2]/82 text-[#2a1c10] shadow-[0_8px_18px_rgba(76,51,25,0.09)] hover:bg-[#f7ead8]"
              >
                <Link to="/company-auth?tab=signin">Ya tengo cuenta</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-10">
          <div className="mx-auto grid max-w-6xl gap-7 md:grid-cols-3 md:gap-0">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`px-4 text-center ${
                  index > 0 ? "md:border-l md:border-[#d7c7ad]" : ""
                }`}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#efe4d3] text-[#7b572d]">
                  {benefit.icon}
                </div>
                <h2
                  className="text-xl font-semibold text-[#2a1c10]"
                  style={{ fontFamily: editorialFont }}
                >
                  {benefit.title}
                </h2>
                <p className="mx-auto mt-2 max-w-[260px] text-sm font-medium leading-6 text-[#4e4032]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-8">
          <div className="relative overflow-hidden rounded-sm border border-[#ddceb8] bg-[#fffaf2]/72 p-6 shadow-[0_12px_36px_rgba(76,51,25,0.08)] md:p-9">
            <BotanicalDetail className="-right-4 -top-4 hidden md:block" />
            <div className="relative">
              <div className="mb-6 max-w-3xl">
                <div className="mb-2 flex items-center gap-3 text-[#7b572d]">
                  <Calendar className="h-6 w-6" />
                  <p className="text-xs font-bold uppercase tracking-[0.18em]">
                    Lo que nos hace únicos
                  </p>
                </div>
                <h2
                  className="text-3xl font-semibold leading-tight text-[#1f140c] md:text-4xl"
                  style={{ fontFamily: editorialFont }}
                >
                  Una plataforma estacional
                </h2>
                <p className="mt-3 max-w-4xl text-[15px] font-medium leading-7 text-[#5b4b3d]">
                  Cada 3 meses cambia todo: el producto protagonista, las rutas
                  curadas, el TOP de la newsletter, el ranking del mapa y el
                  spotlight rotatorio. Tu temporada es tu momento de máxima
                  visibilidad.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {seasons.map((season) => (
                  <div
                    key={season.id}
                    className={`rounded-sm border p-5 shadow-[0_8px_18px_rgba(76,51,25,0.04)] ${season.className}`}
                  >
                    <div className="mb-4 flex items-center gap-3">
                      {season.icon}
                      <h3 className="font-bold">{season.label}</h3>
                    </div>
                    <p className="mb-3 text-sm opacity-70">{season.range}</p>
                    <p className="font-bold">{season.product}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button
                  asChild
                  variant="outline"
                  className="border-[#bba98e] bg-[#fffaf2]/75 text-[#2a1c10] hover:bg-[#f3e5cf]"
                >
                  <Link to="/rutas">
                    Ver todas las temporadas
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-10">
          <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-sm border border-[#ddceb8] bg-[#fbf3e7]/76 p-6 shadow-[0_12px_30px_rgba(76,51,25,0.07)] md:p-8">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b07a2a]">
                Spotlight rotatorio
              </p>
              <h2
                className="text-3xl font-semibold leading-tight text-[#1f140c] md:text-4xl"
                style={{ fontFamily: editorialFont }}
              >
                Tu turno en la home, cada semana
              </h2>
              <p className="mt-4 text-[15px] font-medium leading-7 text-[#4e4032]">
                Cada día se muestran empresas destacadas en la home, con
                rotación por nicho y temporada. Tu empresa puede aparecer con
                foto principal, localidad y acceso directo a su ficha.
              </p>
              <ul className="mt-6 grid gap-3 text-sm font-medium text-[#342519] sm:grid-cols-2">
                {spotlightBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4f6f3f]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-sm border border-[#d2bd9b] bg-[#fffaf2]/82 p-5 shadow-[0_16px_36px_rgba(76,51,25,0.1)]">
              <div className="aspect-video overflow-hidden rounded-sm bg-[linear-gradient(135deg,#eadfc9,#dfe8d4_52%,#f6ead5)]">
                <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(255,250,242,0.82),transparent_34%)]">
                  <Leaf className="h-16 w-16 text-[#6c7d4b]/45" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-[#c9b68f] bg-[#f8efd6] text-[#6d4a1f]"
                >
                  Temporada
                </Badge>
                <Badge className="bg-[#4f6f3f] text-[#fffaf2]">Destacada</Badge>
              </div>
              <h3
                className="mt-4 text-2xl font-semibold text-[#1f140c]"
                style={{ fontFamily: editorialFont }}
              >
                Quesería Los Montes
              </h3>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#6b5844]">
                <MapPin className="h-4 w-4 text-[#7b572d]" />
                Porzuna, Ciudad Real
              </p>
              <p className="mt-3 text-sm leading-6 text-[#4e4032]">
                Card editorial con imagen principal, descripción breve, badges
                de temporada y acceso directo a la ficha completa.
              </p>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-10">
          <div className="mb-7 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7b572d]">
              Elige tu nivel de presencia
            </p>
            <h2
              className="text-3xl font-semibold leading-tight text-[#1f140c] md:text-4xl"
              style={{ fontFamily: editorialFont }}
            >
              Planes pensados para cada etapa de tu negocio
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {planTiers.map((plan) => (
              <Card
                key={plan.tier}
                className={`relative rounded-sm border-[#ddceb8] bg-[#fffaf2]/78 shadow-[0_10px_28px_rgba(76,51,25,0.06)] ${
                  plan.highlight
                    ? "border-[#4f6f3f] ring-1 ring-[#4f6f3f]"
                    : ""
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4f6f3f] text-[#fffaf2]">
                    Recomendado
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#efe4d3] text-[#7b572d]">
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle
                        className="text-2xl text-[#1f140c]"
                        style={{ fontFamily: editorialFont }}
                      >
                        {plan.tier}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium text-[#5b4b3d]">
                        {plan.tagline}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm font-medium text-[#342519]">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4f6f3f]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mx-auto mt-6 max-w-4xl text-center text-sm italic text-[#7a6a5a]">
            Comisiones aplicables a las tres modalidades: 10% sobre ventas
            mediante QR del consumidor, 5% en deals B2B cerrados vía la
            plataforma.
          </p>
        </section>

        <section className="relative container mx-auto px-6 pb-9">
          <div className="relative overflow-hidden rounded-sm border border-[#ddceb8] bg-[#fbf3e7]/82 p-6 shadow-[0_10px_28px_rgba(76,51,25,0.06)] md:p-8">
            <BotanicalDetail className="-right-2 -top-8 hidden md:block" />
            <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#efe4d3] text-[#7b572d]">
                <Lock className="h-8 w-8" />
              </div>
              <div>
                <h2
                  className="text-2xl font-semibold text-[#1f140c] md:text-3xl"
                  style={{ fontFamily: editorialFont }}
                >
                  Sistema B2B privado
                </h2>
                <p className="mt-2 max-w-4xl text-[15px] font-medium leading-7 text-[#5b4b3d]">
                  Contacto anónimo entre restaurantes y productores. Tu
                  identidad permanece oculta hasta que ambas partes aceptáis
                  compartirla. Privacidad por diseño.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-9">
          <div className="mx-auto max-w-5xl">
            <div className="mb-5 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-3">
              <ShieldCheck className="h-6 w-6 text-[#4f6f3f]" />
              <h2
                className="text-2xl font-semibold text-[#1f140c] md:text-3xl"
                style={{ fontFamily: editorialFont }}
              >
                ¿Tu negocio es RitmOrigen?
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {criteria.map((criterion) => (
                <div key={criterion} className="flex items-start gap-3 text-sm font-medium text-[#342519]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4f6f3f]" />
                  <span>{criterion}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative container mx-auto px-6 pb-14">
          <div className="rounded-sm border border-[#ddceb8] bg-[#fffaf2]/76 p-6 shadow-[0_12px_30px_rgba(76,51,25,0.07)] md:p-7">
            <h2
              className="mb-6 text-center text-2xl font-semibold text-[#1f140c] md:text-3xl"
              style={{ fontFamily: editorialFont }}
            >
              ¿Tienes dudas antes de registrarte?
            </h2>
            <div className="grid gap-4 text-sm font-medium text-[#5b4b3d] md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <Phone className="h-5 w-5 text-[#4f6f3f]" />
                <span>+34 633 804 448</span>
              </div>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <Mail className="h-5 w-5 text-[#4f6f3f]" />
                <span>info@origen.it.com</span>
              </div>
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <MapPin className="h-5 w-5 text-[#4f6f3f]" />
                <span>Ciudad Real, España</span>
              </div>
              <Button
                asChild
                className="bg-[#4f6f3f] text-[#fffaf2] shadow-[0_10px_24px_rgba(48,70,36,0.18)] hover:bg-[#425f34]"
              >
                <Link to="/company-auth?tab=signup">
                  Empezar registro
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer brandLabel="RITMORIGEN" compact />
    </div>
  );
};

export default SoyEmpresa;
