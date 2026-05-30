import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Loader2, UserRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { articulos } from "@/data/articulos";
import {
  actualidadColors as C,
  formatActualidadDate,
  getActualidadArticleImage,
} from "@/lib/actualidadVisual";

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
  secciones?: {
    titulo: string;
    tipo: "lista" | "lista-numerada" | "texto";
    contenido?: string;
    items: string[];
    nota?: string;
  }[];
  parrafosCierre?: string[];
  referencias?: string[];
  destacado: boolean;
}

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";

const localArticleToDetail = (article: (typeof articulos)[number]): Articulo => ({
  id: article.id,
  slug: article.slug,
  titulo: article.titulo,
  extracto: article.extracto,
  categoria: article.categoria,
  categoria_color: article.categoriaColor,
  fecha_publicacion: article.fechaPublicacion,
  tiempo_lectura: article.tiempoLectura,
  autor: article.autor,
  parrafos: article.parrafos,
  secciones: article.secciones,
  parrafosCierre: article.parrafosCierre,
  referencias: article.referencias,
  destacado: article.destacado ?? false,
});

const relatedArticlesFor = (slug: string) =>
  articulos.filter((article) => article.slug !== slug).slice(0, 2);

const ActualidadArticulo = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticulo = async () => {
      if (!slug) {
        setArticulo(null);
        setLoading(false);
        return;
      }

      const localArticle = articulos.find((item) => item.slug === slug);
      if (localArticle) {
        setArticulo(localArticleToDetail(localArticle));
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setArticulo(null);
      } else {
        const transformedData = {
          ...data,
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
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.paper }}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.olive }} />
        </div>
        <Footer />
      </div>
    );
  }

  if (!articulo || !slug) return <Navigate to="/actualidad" replace />;

  const heroImage = getActualidadArticleImage(articulo.slug);
  const relatedArticles = relatedArticlesFor(articulo.slug);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.paper, color: C.brown }}>
      <Header />

      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#17120c",
          backgroundImage: "url('/textures/actualidad-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120c]/96 via-[#17120c]/80 to-[#17120c]/40" aria-hidden="true" />
        <div className={`${pageShell} relative z-10 py-10 lg:py-14`}>
          <Link
            to="/actualidad"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "#f0e7d7" }}
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Actualidad
          </Link>

          <div className="max-w-4xl">
            <span className="inline-flex rounded-md px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.08em]" style={{ backgroundColor: C.olive, color: C.card }}>
              {articulo.categoria}
            </span>
            <h1
              className="mt-6 text-balance font-bold leading-[1.04]"
              style={{
                color: C.cream,
                fontFamily: editorialFont,
                fontSize: "clamp(2.1rem, 5vw, 4.6rem)",
                letterSpacing: "0",
              }}
            >
              {articulo.titulo}
            </h1>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.7] md:text-[19px]" style={{ color: "#f1e6d4" }}>
              {articulo.extracto}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm" style={{ color: "#d9ccb9" }}>
              <span className="flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                {articulo.autor}
              </span>
              <span>·</span>
              <span>{formatActualidadDate(articulo.fecha_publicacion)}</span>
              <span>·</span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {articulo.tiempo_lectura} min de lectura
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className={`${pageShell} -mt-8 relative z-20`}>
        <figure
          className="mx-auto max-w-5xl overflow-hidden rounded-lg"
          style={{
            border: `1px solid ${C.beige}66`,
            boxShadow: "0 20px 48px rgba(61,43,31,0.18)",
          }}
        >
          <img src={heroImage} alt={articulo.titulo} className="h-[260px] w-full object-cover md:h-[420px]" />
        </figure>
      </div>

      <main className="flex-1">
        <article className={`${pageShell} py-12 lg:py-16`}>
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 rounded-lg border-l-4 p-6" style={{ backgroundColor: C.card, borderColor: C.olive, boxShadow: "0 8px 24px rgba(61,43,31,0.06)" }}>
              <p className="text-[18px] font-medium italic leading-[1.75]" style={{ color: C.brown }}>
                {articulo.extracto}
              </p>
            </div>

            <div className="space-y-7">
              {articulo.parrafos.map((parrafo, i) =>
                parrafo.startsWith("## ") ? (
                  <h2
                    key={i}
                    className="pt-5 text-balance font-bold leading-[1.15]"
                    style={{
                      color: C.brown,
                      fontFamily: editorialFont,
                      fontSize: "clamp(1.7rem, 3vw, 2.35rem)",
                      letterSpacing: "0",
                    }}
                  >
                    {parrafo.slice(3)}
                  </h2>
                ) : (
                  <p key={i} className="text-[17px] leading-[1.9] md:text-[18px]" style={{ color: "#3f3024" }}>
                    {parrafo}
                  </p>
                )
              )}
            </div>

            {articulo.secciones && articulo.secciones.length > 0 && (
              <div className="mt-12 space-y-8">
                {articulo.secciones.map((seccion, i) => (
                  <section key={i} className="rounded-lg border p-6 md:p-8" style={{ backgroundColor: C.card, borderColor: `${C.beige}88`, boxShadow: "0 10px 28px rgba(61,43,31,0.06)" }}>
                    <h2
                      className="mb-4 text-balance font-bold leading-snug"
                      style={{
                        color: C.brown,
                        fontFamily: editorialFont,
                        fontSize: "clamp(1.45rem, 2.4vw, 2rem)",
                      }}
                    >
                      {seccion.titulo}
                    </h2>
                    {seccion.contenido && (
                      <p className="mb-5 text-[16px] leading-[1.8]" style={{ color: "#4d3c2c" }}>
                        {seccion.contenido}
                      </p>
                    )}
                    {seccion.items.length > 0 && seccion.tipo === "lista-numerada" ? (
                      <ol className="space-y-4">
                        {seccion.items.map((item, j) => (
                          <li key={j} className="flex gap-4 text-[16px] leading-[1.75]" style={{ color: "#4d3c2c" }}>
                            <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: `${C.olive}22`, color: C.olive }}>
                              {j + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <ul className="space-y-4">
                        {seccion.items.map((item, j) => (
                          <li key={j} className="flex gap-4 text-[16px] leading-[1.75]" style={{ color: "#4d3c2c" }}>
                            <span className="mt-3 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: C.olive }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {seccion.nota && (
                      <p className="mt-6 border-t pt-4 text-[13px] italic leading-[1.7]" style={{ borderColor: `${C.beige}88`, color: C.inkMuted }}>
                        {seccion.nota}
                      </p>
                    )}
                  </section>
                ))}
              </div>
            )}

            {articulo.parrafosCierre && articulo.parrafosCierre.length > 0 && (
              <div className="mt-12 space-y-7">
                {articulo.parrafosCierre.map((parrafo, i) => (
                  <p key={i} className="text-[17px] leading-[1.9] md:text-[18px]" style={{ color: "#3f3024" }}>
                    {parrafo}
                  </p>
                ))}
              </div>
            )}

            {articulo.referencias && articulo.referencias.length > 0 && (
              <aside className="mt-14 rounded-lg border p-6" style={{ backgroundColor: "#efe4d2", borderColor: `${C.beige}88` }}>
                <div className="mb-5 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" style={{ color: C.olive }} />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: C.inkMuted }}>
                    Referencias bibliográficas
                  </h2>
                </div>
                <ul className="space-y-3">
                  {articulo.referencias.map((ref, i) => (
                    <li key={i} className="border-l-2 pl-4 text-sm leading-relaxed" style={{ borderColor: `${C.olive}88`, color: C.inkMuted }}>
                      {ref}
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="mt-14 border-t pt-8" style={{ borderColor: `${C.beige}88` }}>
              <Link
                to="/actualidad"
                className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.brownSoft, color: C.card }}
              >
                <ArrowLeft className="h-4 w-4" /> Volver a Actualidad
              </Link>
            </div>
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className={`${pageShell} pb-14`}>
            <div className="mx-auto max-w-5xl border-t pt-10" style={{ borderColor: `${C.beige}88` }}>
              <h2
                className="mb-6 font-bold"
                style={{
                  color: C.brown,
                  fontFamily: editorialFont,
                  fontSize: "clamp(1.6rem, 3vw, 2.15rem)",
                }}
              >
                Más artículos
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {relatedArticles.map((article) => (
                  <Link key={article.id} to={`/actualidad/${article.slug}`} className="group block">
                    <article className="overflow-hidden rounded-lg border" style={{ backgroundColor: C.card, borderColor: `${C.beige}66`, boxShadow: "0 8px 22px rgba(61,43,31,0.07)" }}>
                      <img src={getActualidadArticleImage(article.slug)} alt={article.titulo} className="h-36 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="p-5">
                        <span className="text-[11px] font-bold uppercase tracking-[0.08em]" style={{ color: C.olive }}>
                          {article.categoria}
                        </span>
                        <h3 className="mt-3 text-balance font-bold leading-[1.18]" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "20px" }}>
                          {article.titulo}
                        </h3>
                        <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: C.inkMuted }}>
                          Leer análisis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ActualidadArticulo;
