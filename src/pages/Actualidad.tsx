import { Link } from "react-router-dom";
import { ArrowRight, Grid3X3, List, UserRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articulos } from "@/data/articulos";
import {
  actualidadColors as C,
  formatActualidadDate,
  getActualidadArticleImage,
} from "@/lib/actualidadVisual";

interface DisplayArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
  image: string;
  featured?: boolean;
}

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";

const displayArticles: DisplayArticle[] = articulos.map((article) => ({
  id: article.id,
  slug: article.slug,
  title: article.titulo,
  excerpt: article.extracto,
  category: article.categoria,
  date: formatActualidadDate(article.fechaPublicacion),
  readTime: article.tiempoLectura,
  author: article.autor,
  image: getActualidadArticleImage(article.slug),
  featured: article.destacado,
}));

const featuredArticle = displayArticles.find((article) => article.featured) ?? displayArticles[0];
const visibleArticles = displayArticles.filter((article) => article.slug !== featuredArticle.slug);

const Actualidad = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.cream }}>
      <Header />

      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: "#17120c",
          backgroundImage: "url('/textures/actualidad-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120c]/95 via-[#17120c]/76 to-[#17120c]/28" aria-hidden="true" />

        <div className={`${pageShell} relative z-10 flex min-h-[640px] flex-col justify-between gap-10 py-12 lg:py-14`}>
          <div className="max-w-4xl">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.gold }}>
              Actualidad
            </p>
            <h1
              className="mb-5 text-balance font-bold leading-[1.05]"
              style={{
                color: C.cream,
                fontFamily: editorialFont,
                fontSize: "clamp(2.15rem, 4vw, 3.6rem)",
                letterSpacing: "0",
              }}
            >
              Artículos, estudios y conocimientos sobre alimentación, territorio y salud
            </h1>
            <p className="max-w-2xl text-[16px] leading-[1.65] md:text-[18px]" style={{ color: "#f0e7d7" }}>
              Investigación, tradición y evidencia científica para comprender mejor lo que comemos y cómo impacta en nuestro bienestar.
            </p>
          </div>

          <Link to={`/actualidad/${featuredArticle.slug}`} className="group block w-full">
            <article
              className="grid min-h-[310px] overflow-hidden rounded-lg lg:grid-cols-[390px_minmax(0,1fr)]"
              style={{
                backgroundColor: "rgba(255,250,241,0.98)",
                boxShadow: "0 20px 46px rgba(0,0,0,0.26)",
              }}
            >
              <div className="relative min-h-[230px] overflow-hidden lg:min-h-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <span className="absolute left-5 top-5 rounded-md px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ backgroundColor: C.olive, color: C.card }}>
                  Artículo destacado
                </span>
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-7 p-6 sm:p-8 lg:px-10">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.olive }}>
                    <span>{featuredArticle.category}</span>
                    <span style={{ color: C.inkMuted }}>·</span>
                    <span>Artículo comentado</span>
                  </div>
                  <h2
                    className="mb-4 max-w-4xl text-balance font-bold leading-[1.1]"
                    style={{
                      color: C.brown,
                      fontFamily: editorialFont,
                      fontSize: "clamp(1.65rem, 3vw, 2.5rem)",
                      letterSpacing: "0",
                    }}
                  >
                    {featuredArticle.title}
                  </h2>
                  <p className="max-w-3xl text-[15px] leading-[1.55] md:text-[16px]" style={{ color: "#292016" }}>
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="flex flex-col gap-5 text-[13px] sm:flex-row sm:items-center sm:justify-between" style={{ color: "#6f614f" }}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="flex items-center gap-1.5">
                      <UserRound size={15} fill="#c8b89a" strokeWidth={1.4} />
                      {featuredArticle.author}
                    </span>
                    <span>·</span>
                    <span>{featuredArticle.date}</span>
                    <span>·</span>
                    <span>{featuredArticle.readTime} min de lectura</span>
                  </div>
                  <span
                    className="inline-flex h-[44px] shrink-0 items-center justify-center gap-2 self-start rounded-md px-6 text-[14px] font-semibold transition-all group-hover:gap-3 sm:self-auto"
                    style={{ border: `1px solid ${C.beige}`, color: C.brown }}
                  >
                    Leer análisis <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      <main className="flex-1" style={{ backgroundColor: C.paper }}>
        <section className={`${pageShell} py-10 lg:py-12`}>
          <div className="mx-auto w-full max-w-5xl">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-bold" style={{ color: C.brown, fontFamily: editorialFont, fontSize: "clamp(1.7rem, 3vw, 2.25rem)" }}>
                Todos los artículos
              </h2>
              <div className="flex items-center gap-3">
                <button type="button" className="hidden h-[40px] items-center gap-2 rounded-md border px-4 text-[13px] md:inline-flex" style={{ borderColor: `${C.beige}88`, color: C.brown, backgroundColor: C.card }}>
                  Más recientes
                  <span className="text-[12px]">⌄</span>
                </button>
                <div className="hidden overflow-hidden rounded-md border md:flex" style={{ borderColor: `${C.beige}88`, backgroundColor: C.card }}>
                  <button type="button" className="grid h-[40px] w-[42px] place-items-center border-r" style={{ borderColor: `${C.beige}88`, color: C.brown }} aria-label="Vista en cuadrícula">
                    <Grid3X3 size={16} />
                  </button>
                  <button type="button" className="grid h-[40px] w-[42px] place-items-center" style={{ color: C.brown }} aria-label="Vista en lista">
                    <List size={17} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {visibleArticles.map((article) => (
                <Link key={article.id} to={`/actualidad/${article.slug}`} className="group block">
                  <article
                    className="flex h-full min-h-[250px] flex-col overflow-hidden rounded-lg"
                    style={{
                      backgroundColor: C.card,
                      border: `1px solid ${C.beige}66`,
                      boxShadow: "0 8px 22px rgba(61,43,31,0.07)",
                    }}
                  >
                    <div className="relative h-[140px] overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                        <span className="rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ backgroundColor: "#77552c", color: C.card }}>
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3
                        className="line-clamp-2 text-balance font-bold leading-[1.18]"
                        style={{
                          color: C.brown,
                          fontFamily: editorialFont,
                          fontSize: "20px",
                        }}
                      >
                        {article.title}
                      </h3>
                      <div className="mt-auto flex items-center gap-3 pt-5 text-[13px]" style={{ color: "#6f614f" }}>
                        <span>{article.date}</span>
                        <span>·</span>
                        <span>{article.readTime} min de lectura</span>
                        <ArrowRight size={16} className="ml-auto shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: C.brown }} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Actualidad;
