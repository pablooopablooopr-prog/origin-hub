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
        setArticulos(data || fallbackArticulos);
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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero editorial */}
      <section className="bg-gradient-to-br from-primary to-earth-medium text-white py-8 md:py-10">
        <div className="container mx-auto px-6 max-w-5xl text-center">
<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Actualidad
          </h1>
          <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Análisis, contexto y reflexiones sobre el sector primario, el origen de los alimentos y el futuro del campo español.
          </p>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-14 max-w-5xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
        {/* Artículo destacado */}
        <section className="mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Artículo destacado
          </p>
          <Link to={`/actualidad/${destacado.slug}`} className="group block">
            <Card className="overflow-hidden border border-border hover:shadow-[var(--shadow-earth)] transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-5">
                  {/* Franja de color lateral */}
                  <div className="hidden md:block md:col-span-1 bg-gradient-to-b from-primary/90 to-earth-medium/80 min-h-[260px]" />
                  <div className="md:col-span-4 p-8 md:p-10 flex flex-col justify-between gap-5">
                    <div>
                      <Badge className="mb-4 bg-earth-light text-primary border-0 font-medium text-xs uppercase tracking-wide">
                        {destacado.categoria}
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug tracking-tight mb-4 group-hover:text-primary transition-colors">
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
                          {destacado.tiempoLectura} min de lectura
                        </span>
                        <span>{destacado.fechaPublicacion}</span>
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
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Más artículos
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resto.map((art) => (
                <Link key={art.id} to={`/actualidad/${art.slug}`} className="group block">
                  <Card className="h-full border border-border hover:shadow-[var(--shadow-earth)] transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col gap-4 h-full">
                      <Badge className="self-start bg-earth-light text-primary border-0 font-medium text-xs uppercase tracking-wide">
                        {art.categoria}
                      </Badge>
                      <h3 className="text-lg font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors line-clamp-3">
                        {art.titulo}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                        {art.extracto}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.tiempoLectura} min
                        </span>
                        <span>{art.fechaPublicacion}</span>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Actualidad;
