import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Building } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-warm enso-watermark flex items-center justify-center relative overflow-hidden pt-16">
      {/* Fondo sutil con textura */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-light/20 via-transparent to-moss-light/20"></div>
      
      <div className="container mx-auto px-6 py-4 text-center relative z-10">
        {/* Título principal con Ensō integrado */}
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight flex items-center justify-center flex-wrap gap-1">
          <span>Vuelve al</span>
          <span className="inline-flex items-center">
            <img 
              src="/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png" 
              alt="Ensō" 
              className="w-12 h-12 md:w-20 md:h-20 object-contain mx-0"
              style={{ backgroundColor: 'transparent' }}
            />
            <span>rigen</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Negocios de siempre. Salud real. Comunidad local.
        </p>

        {/* Descripción adicional */}
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto opacity-90">
          Conectamos consumidores conscientes con pequeñas y medianas empresas que trabajan 
          con productos auténticos, naturales y sin refinamiento.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button size="lg" className="group px-8 py-4 text-lg shadow-earth">
            <Map className="w-5 h-5 mr-3" />
            Explora el mapa
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg" 
            className="px-8 py-4 text-lg shadow-moss"
          >
            <Building className="w-5 h-5 mr-3" />
            Soy una empresa
          </Button>
        </div>

        {/* Indicadores sutiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">500+</div>
            <p className="text-sm text-muted-foreground">Negocios locales</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-secondary">15</div>
            <p className="text-sm text-muted-foreground">Provincias cubiertas</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-primary">10k+</div>
            <p className="text-sm text-muted-foreground">Consumidores conscientes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;