import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  return <section className="min-h-screen bg-gradient-warm enso-watermark flex items-center justify-center relative overflow-hidden pt-0">
      {/* Fondo sutil con textura */}
      <div className="absolute inset-0 bg-gradient-to-br from-earth-light/20 via-transparent to-moss-light/20"></div>
      
      <div className="container mx-auto px-6 py-4 text-center relative z-10">
        {/* Título principal con Ensō integrado */}
        <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight flex items-center justify-center flex-wrap gap-1">
          <span>Vuelve al</span>
          <span className="inline-flex items-center">
            <img src="/lovable-uploads/enso-transparent.png" alt="Ensō" className="w-12 h-12 md:w-20 md:h-20 object-contain mx-0" />
            <span>rigen</span>
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">Negocios tradicionales. Calidad real. Comunidad nacional.</p>

        {/* Descripción adicional */}
        <p className="text-muted-foreground mb-16 max-w-3xl mx-auto opacity-90 text-lg font-normal font-sans text-center leading-relaxed">
  Conectamos, sin intermediarios, a consumidores con productores, cooperativas, restaurantes, negocios con identidad y experiencias rurales exclusivas por toda España, impulsando la visibilidad del sector primario y el valor de su origen real.
</p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
          <Link to="/mapa">
            <Button size="lg" className="group px-8 py-4 text-lg shadow-earth">
              Explorar el mapa
            </Button>
          </Link>
          
          <Link to="/rutas">
            <Button size="lg" className="px-8 py-4 text-lg bg-earth-dark text-white hover:bg-earth-dark/90 transition-colors">
              Descubrir rutas
            </Button>
          </Link>
          
          <Link to="/packs">
            <Button variant="secondary" size="lg" className="px-8 py-4 text-lg shadow-moss">
              Selecciones del territorio
            </Button>
          </Link>
        </div>

        {/* Indicadores sutiles */}
        <div className="-mt-2 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
    </section>;
};
export default Hero;
