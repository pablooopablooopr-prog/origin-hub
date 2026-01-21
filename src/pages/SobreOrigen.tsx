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
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <img src="/lovable-uploads/new-enso-symbol.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div className="container relative z-10 text-center">
            <h1 className="text-5xl md:text-6xl font-serif mb-6 text-primary">Sobre ORIGEN</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Preservamos y aseguramos la autenticidad y crecimiento de negocios tradicionales</p>
          </div>
        </section>

        {/* Misión */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <Card className="border-0 shadow-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto leading-relaxed">
                  En ORIGEN creemos que cada producto tiene una historia que merece ser contada. Nuestra misión es
                  conectar a consumidores conscientes con negocios auténticos que mantienen vivas las tradiciones de
                  toda la vida, preservando técnicas artesanales y valores fundamentales como la sostenibilidad y el
                  comercio justo. Construimos puentes entre lo auténtico y quienes lo valoran.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Historia */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-serif text-center mb-12 text-primary">Nuestra Historia</h2>
            <div className="relative max-w-5xl mx-auto">
              {/* Línea de camino conectando las tarjetas */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary/50 transform -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {timeline.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Conector circular en el camino */}
                    <div className="hidden md:flex absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-4 border-background items-center justify-center z-20">
                      <div className="w-3 h-3 rounded-full bg-background"></div>
                    </div>
                    
                    {/* Tarjeta */}
                    <Card className="text-center p-6 bg-background hover:shadow-lg transition-shadow border-2 border-primary/10 mt-6 md:mt-8">
                      <div className="text-2xl font-bold text-primary mb-2">{step.year}</div>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Cómo Funciona */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-serif text-center mb-12 text-primary">Cómo Funciona ORIGEN</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{item.description}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-serif text-center mb-12 text-primary">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-secondary" />
                    </div>
                    <CardTitle className="text-xl text-center">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">{value.description}</CardDescription>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Equipo */}
        

        {/* Testimonios */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-serif text-center mb-12 text-primary">Lo Que Dicen de Nosotros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {testimonials.map((testimonial, index) => <Card key={index} className="shadow-sm">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">— {testimonial.name}</p>
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => <Heart key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
                      </div>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-primary/5">
          <div className="container text-center">
            <h2 className="text-3xl font-serif mb-6 text-primary">Únete a ORIGEN</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Forma parte de nuestra comunidad de negocios auténticos
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/soy-empresa">Unirse como Empresa</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default SobreOrigen;