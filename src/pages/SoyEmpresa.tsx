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
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Building,
  Users,
  Globe,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Sparkles,
  Wheat,
  Flower2,
  Trees,
  Snowflake,
  Lock,
  FileText,
  Star,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Soy Empresa — landing comercial alineada al modelo del PDF (Mayo 2026).
 *
 * Decisión de UX: nunca mostramos los precios aquí (igual que en el dashboard,
 * sólo aparecen en el modal de upgrade). Comunicamos planes con tres niveles
 * cualitativos: Básico · Intermedio · Premium.
 */

const SoyEmpresa = () => {
  const benefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad real",
      description:
        "Acceso directo a consumidores conscientes que valoran la autenticidad de tu producto",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Visibilidad nacional",
      description:
        "Presencia en toda España manteniendo tu identidad y arraigo local",
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "Venta directa",
      description:
        "Sin intermediarios. Relación directa con tus clientes y restaurantes",
    },
  ];

  const seasons = [
    {
      id: "primavera",
      icon: <Flower2 className="w-5 h-5" />,
      label: "Primavera",
      range: "Mar – May",
      product: "Queso manchego",
      color: "bg-emerald-50 text-emerald-900 border-emerald-200",
    },
    {
      id: "verano",
      icon: <Wheat className="w-5 h-5" />,
      label: "Verano",
      range: "Jun – Ago",
      product: "Miel y aceite",
      color: "bg-amber-50 text-amber-900 border-amber-200",
    },
    {
      id: "otono",
      icon: <Trees className="w-5 h-5" />,
      label: "Otoño",
      range: "Sep – Nov",
      product: "Caza y vino vendimia",
      color: "bg-orange-50 text-orange-900 border-orange-200",
    },
    {
      id: "invierno",
      icon: <Snowflake className="w-5 h-5" />,
      label: "Invierno",
      range: "Dic – Feb",
      product: "Vino reserva y gourmet",
      color: "bg-sky-50 text-sky-900 border-sky-200",
    },
  ];

  const planTiers = [
    {
      tier: "Básico",
      tagline: "Empieza a aparecer en ORIGEN",
      icon: <Sparkles className="w-5 h-5 text-muted-foreground" />,
      highlight: false,
      features: [
        "Ficha pública de tu empresa",
        "Spotlight rotatorio en la home (~4 veces/mes)",
        "Mapa B2B en modo lectura",
        "Dashboard básico con estadísticas",
      ],
    },
    {
      tier: "Intermedio",
      tagline: "Visibilidad reforzada en temporada",
      icon: <Star className="w-5 h-5 text-primary" />,
      highlight: true,
      features: [
        "Todo lo del plan Básico",
        "Pin dorado en mapa + borde dorado en spotlight",
        "TOP de la newsletter trimestral",
        "Aparición garantizada en rutas de tu temporada",
        "Mensajes B2B con restaurantes verificados",
      ],
    },
    {
      tier: "Premium",
      tagline: "Visibilidad + cumplimiento legal",
      icon: <FileText className="w-5 h-5 text-amber-700" />,
      highlight: false,
      badge: "Nuevo · Antifraude",
      features: [
        "Todo lo del plan Intermedio",
        "Digitalización de facturas (Verifactu / Ley Crea y Crece)",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Header />
      <main className="pt-6">
        {/* HERO */}
        <section className="container mx-auto px-6 py-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge className="bg-emerald-50 text-emerald-900 border-emerald-200 gap-1.5">
              <Sparkles className="w-3 h-3" />
              Fase lanzamiento · Gratis para los primeros 150 productores
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center tracking-tight">
              <span>S</span>
              <img
                src="/lovable-uploads/enso-transparent.png"
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>y Empresa</span>
            </h1>
            <p className="text-muted-foreground font-sans text-lg leading-relaxed">
              Únete a la comunidad estacional que conecta productores rurales,
              restaurantes y consumidores conscientes en toda España.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link to="/company-auth?tab=signup">
                <Button size="lg" variant="default" className="shadow-earth gap-2">
                  Unirme a ORIGEN
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/company-auth?tab=signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-card shadow-md hover:shadow-lg border-border"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="container mx-auto px-6 pb-12">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Por qué unirse
            </p>
            <h2 className="text-3xl font-semibold text-primary tracking-tight">
              Lo que ganas con ORIGEN
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <Card
                key={benefit.title}
                className="text-center hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex justify-center mb-3 text-primary">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ROTACIÓN ESTACIONAL */}
        <section className="container mx-auto px-6 pb-12">
          <Card className="bg-gradient-warm border-border">
            <CardHeader className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                Lo que nos hace únicos
              </p>
              <CardTitle className="text-3xl text-primary tracking-tight flex items-center justify-center gap-2">
                <Calendar className="w-7 h-7" />
                Una plataforma estacional
              </CardTitle>
              <CardDescription className="text-base max-w-2xl mx-auto pt-2">
                Cada 3 meses cambia todo: el producto protagonista, las rutas
                curadas, el TOP de la newsletter y el ranking del mapa. Tu
                temporada es tu momento de máxima visibilidad.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {seasons.map((s) => (
                  <div
                    key={s.id}
                    className={`rounded-xl p-4 border ${s.color} flex flex-col gap-2`}
                  >
                    <div className="flex items-center gap-2">
                      {s.icon}
                      <span className="font-semibold">{s.label}</span>
                    </div>
                    <p className="text-xs opacity-80">{s.range}</p>
                    <p className="text-sm font-medium">{s.product}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* SPOTLIGHT 24H */}
        <section className="container mx-auto px-6 pb-12">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Spotlight rotatorio · 24h
              </p>
              <h2 className="text-3xl font-semibold text-primary tracking-tight">
                Tu turno en la home, cada semana
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Cada día 6 empresas se muestran destacadas en la home, una por
                nicho. Aparecerás aproximadamente <strong>4 veces al mes</strong>{" "}
                (8 si eres Premium), con foto principal, localidad y CTA directa
                a tu ficha.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>Rotación automática por nicho y temporada</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>Card con foto 16:9, descripción y badges</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                  <span>Click → ficha completa con galería e historia</span>
                </li>
              </ul>
            </div>
            <Card className="border-2 border-amber-300/50 shadow-earth">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    Quesos y Lácteos
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 gap-1 text-[10px] uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                    Destacada
                  </Badge>
                </div>
                <div className="aspect-video bg-gradient-to-br from-amber-100/40 via-muted/30 to-emerald-100/30 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-muted-foreground italic">
                    [ tu foto principal aparecerá aquí ]
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold tracking-tight">
                    Quesería Los Montes
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Porzuna, Ciudad Real
                  </p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Familia desde 1990 haciendo queso con ovejas propias. Leche
                  cruda, método ancestral, 30 meses de curación.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PLANES (sin precios) */}
        <section className="container mx-auto px-6 pb-12">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
              Tres niveles de presencia
            </p>
            <h2 className="text-3xl font-semibold text-primary tracking-tight">
              Elige cómo quieres aparecer
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto pt-2">
              Verás los precios al hacer "Upgrade" desde tu dashboard, una vez
              registrada tu empresa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {planTiers.map((p) => (
              <Card
                key={p.tier}
                className={`relative flex flex-col ${
                  p.highlight
                    ? "border-2 border-primary shadow-earth"
                    : p.tier === "Premium"
                    ? "border-2 border-amber-300/70 bg-gradient-to-b from-amber-50/30 to-card"
                    : "border border-border"
                }`}
              >
                {p.highlight && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    Recomendado
                  </Badge>
                )}
                {p.badge && (
                  <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 bg-amber-100 text-amber-900 border-amber-300 gap-1">
                    <FileText className="w-3 h-3" />
                    {p.badge}
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{p.tier}</CardTitle>
                    {p.icon}
                  </div>
                  <CardDescription className="text-sm">{p.tagline}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <Separator />
                  <ul className="space-y-2 text-sm flex-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic text-center mt-6">
            Comisiones aplicables a las tres modalidades: 10% sobre ventas
            mediante QR del consumidor, 5% en deals B2B cerrados vía la
            plataforma.
          </p>
        </section>

        {/* B2B PRIVADO */}
        <section className="container mx-auto px-6 pb-12">
          <Card className="bg-gradient-warm border-border">
            <CardContent className="p-8 grid md:grid-cols-[auto,1fr] gap-6 items-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto md:mx-0">
                <Lock className="w-10 h-10" />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                  Sistema B2B privado
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">
                  Contacto anónimo restaurantes ↔ productores
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Un restaurante puede buscar nuevo proveedor sin que se entere
                  el actual. Tu identidad permanece oculta hasta que ambos
                  aceptáis revelarla. Solo entonces se intercambian datos de
                  contacto. Privacidad por diseño.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CRITERIOS */}
        <section className="container mx-auto px-6 pb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <CardTitle className="text-2xl text-center text-primary tracking-tight">
                  ¿Tu negocio es ORIGEN?
                </CardTitle>
              </div>
              <CardDescription className="text-center">
                Verifica si cumples con nuestros criterios de autenticidad
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-fit">
                {criteria.map((criterion) => (
                  <div key={criterion} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-muted-foreground">{criterion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTACTO */}
        <section className="container mx-auto px-6 pb-16">
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <h3 className="text-xl font-semibold text-primary mb-6 text-center tracking-tight">
              ¿Tienes dudas antes de registrarte?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">+34 633 804 448</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">info@origen.it.com</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-muted-foreground">Ciudad Real, España</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/company-auth?tab=signup">
                <Button className="shadow-earth gap-2">
                  Empezar registro
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SoyEmpresa;
