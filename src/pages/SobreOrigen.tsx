import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, Leaf, Scale, MapPin, Package, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
const SobreOrigen = () => {
  const values = [{
    icon: Heart,
    title: "Autenticidad",
    description: "Negocios verificados que mantienen tradiciones ancestrales y procesos artesanales genuinos."
  }, {
    icon: Leaf,
    title: "Sostenibilidad",
    description: "Compromiso con prácticas responsables que respetan el medio ambiente y las comunidades locales."
  }, {
    icon: Scale,
    title: "Comercio Justo",
    description: "Precios justos para productores y transparencia total en toda la cadena de valor."
  }];
  const howItWorks = [{
    icon: MapPin,
    title: "Explora negocios",
    description: "Descubre negocios auténticos verificados por ORIGEN en toda España."
  }, {
    icon: Package,
    title: "Descubre packs y rutas",
    description: "Elige entre packs curados o crea rutas personalizadas para explorar."
  }, {
    icon: Users,
    title: "Apoya la economía local",
    description: "Cada compra fortalece a pequeños productores y preserva tradiciones."
  }];
  const timeline = [{
    year: "2024",
    title: "Nacimiento de ORIGEN",
    description: "Iniciamos la misión de conectar consumidores con la autenticidad."
  }, {
    year: "2025",
    title: "Expansión nacional",
    description: "Crecimos a más de 50 negocios verificados en toda España."
  }, {
    year: "Futuro",
    title: "Preservando tradiciones",
    description: "Continuamos nuestra misión de preservar lo tradicional y auténtico."
  }];
  const team = [{
    name: "María González",
    role: "Fundadora & CEO",
    image: "/lovable-uploads/clean-enso-symbol.png"
  }, {
    name: "Carlos Ruiz",
    role: "Director de Operaciones",
    image: "/lovable-uploads/clean-enso-symbol.png"
  }, {
    name: "Ana Martínez",
    role: "Responsable de Comunidad",
    image: "/lovable-uploads/clean-enso-symbol.png"
  }];
  const testimonials = [{
    name: "Laura P.",
    text: "ORIGEN me ha permitido descubrir negocios auténticos que jamás habría encontrado por mi cuenta. La calidad es excepcional.",
    rating: 5
  }, {
    name: "Roberto M.",
    text: "Como empresa, ORIGEN nos ha ayudado a llegar a clientes que valoran nuestro trabajo artesanal y nuestra historia.",
    rating: 5
  }];
  return <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-muted/20 to-background">
          <div className="absolute inset-0 opacity-[0.03]">
            <img src="/lovable-uploads/new-enso-symbol.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="container relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-primary flex items-center justify-center tracking-tight">
              <span>S</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 object-contain mx-1"
              />
              <span>bre ORIGEN</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Preservamos y aseguramos la autenticidad y crecimiento de negocios tradicionales
            </p>
          </div>
        </section>

        {/* Misión */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                  Nuestra Misión
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2 pb-10 px-8 md:px-12">
                <p className="text-lg md:text-xl text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                  En ORIGEN creemos que cada producto tiene una historia que merece ser contada. Nuestra misión es
                  conectar a consumidores conscientes con negocios auténticos que mantienen vivas las tradiciones de
                  toda la vida, preservando técnicas artesanales y valores fundamentales como la sostenibilidad y el
                  comercio justo. Construimos puentes entre lo auténtico y quienes lo valoran.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Historia - MANTENER IGUAL */}
        <section className="py-16 md:py-20 bg-muted/20">
          <div className="container">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-primary tracking-tight">
              Nuestra Historia
            </h2>
            <div className="relative max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
                {timeline.map((step, index) => (
                  <div key={index} className="flex items-center">
                    {/* Tarjeta */}
                    <Card className="text-center p-6 bg-background hover:shadow-lg transition-shadow border-2 border-primary/10 w-64">
                      {/* Línea de acento superior */}
                      <div className="w-12 h-1 bg-secondary mx-auto mb-4"></div>
                      <div className="text-2xl font-bold text-primary mb-2">{step.year}</div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </Card>
                    
                    {/* Conector entre tarjetas (excepto después de la última) */}
                    {index < timeline.length - 1 && (
                      <div className="hidden md:flex items-center mx-2">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <div className="w-8 border-t-2 border-dashed border-primary"></div>
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-primary tracking-tight">
              Cómo Funciona ORIGEN
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {howItWorks.map((item, index) => (
                <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <item.icon className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <CardDescription className="text-base md:text-lg leading-relaxed">{item.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 md:py-20">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-primary tracking-tight">
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <value.icon className="w-10 h-10 text-secondary" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-center font-semibold">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <CardDescription className="text-center text-base md:text-lg leading-relaxed">{value.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-14 text-primary tracking-tight">
              Lo Que Dicen de Nosotros
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-12">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow border-0">
                  <CardContent className="pt-8 pb-8 px-8">
                    <p className="text-muted-foreground italic mb-6 text-lg leading-relaxed">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">— {testimonial.name}</p>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Heart key={i} className="w-5 h-5 fill-secondary text-secondary" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8 py-6 h-auto shadow-md hover:shadow-lg transition-all">
                <Link to="/valoraciones">Ver Todas las Valoraciones</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-secondary/10 via-secondary/5 to-background">
          <div className="container text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-primary tracking-tight">
              Únete a ORIGEN
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Forma parte de nuestra comunidad de negocios auténticos
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-10 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
              <Link to="/soy-empresa">Unirse como Empresa</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default SobreOrigen;