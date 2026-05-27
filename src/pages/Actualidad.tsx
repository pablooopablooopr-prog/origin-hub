import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, BookOpen, ChevronRight, Newspaper, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articulos as fallbackArticulos } from "@/data/articulos";
import { supabase } from "@/integrations/supabase/client";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: string;
  categoria_color: string;
  fecha_publicacion: string;
  tiempo_lectura: number;
  autor: string;
  destacado: boolean;
}

const Actualidad = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArticulos = async () => {
      try {
        const { data, error } = await supabase
          .from("articulos")
          .select("*")
          .order("fecha_publicacion", { ascending: false });

        if (error) throw error;

        // Transform snake_case from DB to camelCase for component
        const transformedData = data?.map(art => ({
          ...art,
          tiempoLectura: art.tiempo_lectura,
          fechaPublicacion: art.fecha_publicacion,
          categoriaColor: art.categoria_color,
          parrafosCierre: art.parrafos_cierre,
        }));

        setArticulos(transformedData || fallbackArticulos);
      } catch (error) {
        console.error("Error loading articles:", error);
        setArticulos(fallbackArticulos);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticulos();
  }, []);

  const destacado = articulos.find((a) => a.destacado) ?? articulos[0];
  const resto = articulos.filter((a) => a.id !== destacado.id);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: "url('/textures/dark-stone.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <Header />

      {/* Hero editorial */}
      <section className="pt-3 pb-6" style={{ background: "rgba(20,12,4,0.60)" }}>
        <div className="container mx-auto px-6 max-w-5xl text-center">
          <div className="flex items-center justify-center gap-3 mb-2 mt-3">
            <span className="block h-px w-10" style={{ backgroundColor: "#b8923f" }} aria-hidden="true" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#b8923f" }}>Actualidad</span>
            <span className="block h-px w-10" style={{ backgroundColor: "#b8923f" }} aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#f2e4c0" }}>
            Análisis del territorio
          </h1>
          <p className="max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#d4b98a", fontSize: "clamp(0.95rem, 0.85rem + 0.4vw, 1.125rem)" }}>
            Análisis, contexto y reflexiones sobre el sector primario, el origen de los alimentos y el futuro del campo español.
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-6 max-w-5xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div style={{ background: "rgba(245,240,232,0.90)", borderRadius: "16px", padding: "2rem 1.5rem", backdropFilter: "blur(3px)" }}>
        {/* Artículo destacado */}
        <section className="mb-14">
          <div className="flex items-center gap-3 mb-6"><span className="block h-px w-8" style={{ backgroundColor: "#b8923f" }} /><span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#b8923f" }}>Artículo destacado</span><span className="block h-px w-8" style={{ backgroundColor: "#b8923f" }} /></div>
          <Link to={`/actualidad/${destacado.slug}`} className="group block">
            <Card className="overflow-hidden border border-border hover:shadow-[var(--shadow-earth)] transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Franja de color lateral */}
                  <div className="hidden md:block md:col-span-1 min-h-[260px]" style={{ background: "linear-gradient(to bottom, #5c6b2e, #3d4a1e)" }} />
                  <div className="md:col-span-4 p-8 md:p-10 flex flex-col justify-between gap-5">
                    <div>
                      <Badge className="mb-4 bg-earth-light text-primary border-0 font-medium text-xs uppercase tracking-wide">
                        {destacado.categoria}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold leading-snug tracking-tight mb-4 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
                        {destacado.titulo}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
                        {destacado.extracto}
                      </p>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {destacado.tiempo_lectura} min de lectura
                        </span>
                        <span>{destacado.fecha_publicacion}</span>
                        <span className="font-medium text-foreground">{destacado.autor}</span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Leer artículo <ChevronRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Grid de más artículos — se mostrará cuando haya más */}
        {resto.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6"><span className="block h-px w-8" style={{ backgroundColor: "#b8923f" }} /><span className="text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: "#b8923f" }}>Más artículos</span><span className="block h-px w-8" style={{ backgroundColor: "#b8923f" }} /></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resto.map((art) => (
                <Link key={art.id} to={`/actualidad/${art.slug}`} className="group block">
                  <Card className="h-full border border-border hover:shadow-[var(--shadow-earth)] transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col gap-4 h-full">
                      <Badge className="self-start bg-earth-light text-primary border-0 font-medium text-xs uppercase tracking-wide">
                        {art.categoria}
                      </Badge>
                      <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-3" style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif", color: "#2a1c10" }}>
                        {art.titulo}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                        {art.extracto}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.tiempo_lectura} min
                        </span>
                        <span>{art.fecha_publicacion}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Estado vacío (sólo artículo destacado) */}
        {resto.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Próximamente más artículos</p>
          </div>
        )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Actualidad;
