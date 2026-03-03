import { Button } from "@/components/ui/button";
import { ArrowRight, Map, Building } from "lucide-react";
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
  Conectamos sin intermediarios consumidores con productores artesanos que cuidan de tu alimentación y de su tierra junto a experiencias rurales por toda España preservando y fomentando el crecimiento del sector primario nacional.
</p>

        {/* Botones de acción */}
        <div className="-mt-4 flex flex-col sm:flex-row gap-6 justify-center items-center max-w-4xl mx-auto">
          <Link to="/mapa">
            <Button size="lg" className="group px-8 py-4 text-lg shadow-earth">
              <Map className="w-5 h-5 mr-3" />
              Explora el mapa
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link to="/packs">
            <Button size="lg" className="px-8 py-4 text-lg bg-earth-dark text-white hover:bg-earth-dark/90 transition-colors">
              Descubrir packs
            </Button>
          </Link>
          
          <Link to="/soy-empresa">
            <Button variant="secondary" size="lg" className="shadow-moss">
              <Building className="w-5 h-5 mr-2" />
              Soy empresa
            </Button>
          </Link>
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
    </section>;
};
export default Hero;
