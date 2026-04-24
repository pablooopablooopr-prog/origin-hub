import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: string;
  categoria_color?: string;
  fecha_publicacion: string;
  tiempo_lectura: number;
  autor: string;
  parrafos: string[];
  referencias?: string[];
  destacado: boolean;
}

const ActualidadArticulo = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticulo = async () => {
      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setArticulo(null);
      } else {
        // Transform snake_case from DB to camelCase for component
        const transformedData = {
          ...data,
          tiempoLectura: data.tiempo_lectura,
          fechaPublicacion: data.fecha_publicacion,
          categoriaColor: data.categoria_color,
          parrafosCierre: data.parrafos_cierre,
        };
        setArticulo(transformedData);
      }
      setLoading(false);
    };

    fetchArticulo();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!articulo) return <Navigate to="/actualidad" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Cabecera del artículo */}
      <section className="bg-gradient-to-br from-primary to-earth-medium text-white pt-14 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            to="/actualidad"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Actualidad
          </Link>
          <div className="mb-5">
            <Badge className="bg-white/20 text-white border-0 font-medium text-xs uppercase tracking-wide">
              {articulo.categoria}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            {articulo.titulo}
          </h1>
          <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {articulo.tiempo_lectura} min de lectura
            </span>
            <Separator orientation="vertical" className="h-4 bg-white/30" />
            <span>{articulo.fecha_publicacion}</span>
            <Separator orientation="vertical" className="h-4 bg-white/30" />
            <span className="font-medium text-white">{articulo.autor}</span>
          </div>
        </div>
      </section>

      {/* Extracto destacado */}
      <div className="bg-muted/40 border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl py-7">
          <p className="text-lg text-foreground font-medium leading-relaxed italic border-l-4 border-primary pl-5">
            {articulo.extracto}
          </p>
        </div>
      </div>

      {/* Cuerpo del artículo */}
      <main className="flex-1 container mx-auto px-6 py-12 max-w-3xl">
        <article>
          {/* Párrafos principales */}
          {articulo.parrafos.map((parrafo, i) =>
            parrafo.startsWith('## ') ? (
              <h2
                key={i}
                className="text-xl md:text-2xl font-bold text-foreground mt-10 mb-4 tracking-tight"
              >
                {parrafo.slice(3)}
              </h2>
            ) : (
              <p
                key={i}
                className="text-foreground/90 leading-[1.85] text-base md:text-lg mb-6 last:mb-0 text-justify hyphens-auto"
              >
                {parrafo}
              </p>
            )
          )}

          {/* Secciones estructuradas (listas, bloques especiales) */}
          {articulo.secciones && articulo.secciones.length > 0 && (
            <div className="mt-10 space-y-10">
              {articulo.secciones.map((seccion, i) => (
                <div key={i} className="bg-muted/30 rounded-xl border border-border p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 leading-snug">
                    {seccion.titulo}
                  </h2>
                  {seccion.contenido && (
                    <p className="text-foreground/80 leading-relaxed mb-5 text-base text-justify hyphens-auto">
                      {seccion.contenido}
                    </p>
                  )}
                  {seccion.tipo === "lista-numerada" ? (
                    <ol className="space-y-3 list-none">
                      {seccion.items.map((item, j) => (
                        <li key={j} className="flex gap-3 text-foreground/85 leading-relaxed text-base">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mt-0.5">
                            {j + 1}
                          </span>
                          <span className="text-justify hyphens-auto">{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="space-y-3 list-none">
                      {seccion.items.map((item, j) => (
                        <li key={j} className="flex gap-3 text-foreground/85 leading-relaxed text-base">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-[0.65rem]" />
                          <span className="text-justify hyphens-auto">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {seccion.nota && (
                    <p className="mt-5 text-xs text-muted-foreground leading-relaxed italic border-t border-border pt-4">
                      {seccion.nota}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Párrafos de cierre */}
          {articulo.parrafosCierre && articulo.parrafosCierre.length > 0 && (
            <div className="mt-10 space-y-6">
              {articulo.parrafosCierre.map((parrafo, i) => (
                <p
                  key={i}
                  className="text-foreground/90 leading-[1.85] text-base md:text-lg text-justify hyphens-auto"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          )}
        </article>

        {/* Referencias */}
        {articulo.referencias && articulo.referencias.length > 0 && (
          <div className="mt-14">
            <Separator className="mb-8" />
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Referencias bibliográficas
              </h2>
            </div>
            <ul className="space-y-2">
              {articulo.referencias.map((ref, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-muted"
                >
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Volver */}
        <div className="mt-14 pt-8 border-t border-border">
          <Link
            to="/actualidad"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Actualidad
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ActualidadArticulo;
