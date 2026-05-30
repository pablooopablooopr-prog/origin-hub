import { Link } from "react-router-dom";
import { ArrowRight, Grid3X3, List, UserRound } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articulos } from "@/data/articulos";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  paper: "#f3eadb",
  inkMuted: "#8a7a62",
};

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

const articleImages: Record<string, string> = {
  "efecto-mercosur-futuro-campo-espanol":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=920&q=88",
  "pesticidas-glifosato-rastro-invisible-tu-cuerpo":
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=720&q=86",
  "del-campo-al-supermercado-pagas-mas-agricultor-cobra-menos":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=720&q=86",
};

const formatDate = (date: string) => date.replace(" de ", " ").replace(" de ", " ");

const displayArticles: DisplayArticle[] = articulos.map((article) => ({
  id: article.id,
  slug: article.slug,
  title: article.titulo,
  excerpt: article.extracto,
  category: article.categoria,
  date: formatDate(article.fechaPublicacion),
  readTime: article.tiempoLectura,
  author: article.autor,
  image: articleImages[article.slug],
  featured: article.destacado,
}));

const featuredArticle = displayArticles.find((article) => article.featured) ?? displayArticles[0];
const visibleArticles = displayArticles.filter((article) => article.slug !== featuredArticle.slug);

const Actualidad = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.cream }}>
      <Header />

      <section
        className="relative w-full overflow-hidden md:h-[60svh] md:min-h-[585px] md:max-h-[650px]"
        style={{
          backgroundColor: "#17120c",
          backgroundImage: "url('/textures/actualidad-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#17120c]/95 via-[#17120c]/72 to-[#17120c]/22" aria-hidden="true" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1284px] flex-col px-5 py-10 sm:px-6 lg:px-8 xl:px-0 md:pb-5 md:pt-[50px]">
          <div className="max-w-[860px]">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.gold }}>
              Actualidad
            </p>
            <h1
              className="mb-4 font-bold leading-[1.05]"
              style={{
                color: C.cream,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(2.2rem, 2.95vw, 3rem)",
                letterSpacing: "0",
              }}
            >
              Artículos, estudios y conocimientos<br className="hidden md:block" /> sobre alimentación, territorio y salud
            </h1>
            <p className="max-w-[610px] text-[16px] leading-[1.55] md:text-[17px]" style={{ color: "#f0e7d7" }}>
              Investigación, tradición y evidencia científica para comprender mejor<br className="hidden md:block" />
              lo que comemos y cómo impacta en nuestro bienestar.
            </p>
          </div>

          <Link to={`/actualidad/${featuredArticle.slug}`} className="group mt-10 block md:mt-auto">
            <article
              className="grid overflow-hidden rounded-lg md:h-[266px] md:grid-cols-[422px_1fr]"
              style={{
                backgroundColor: "rgba(255,251,244,0.98)",
                boxShadow: "0 18px 45px rgba(0,0,0,0.26)",
              }}
            >
              <div className="relative min-h-[220px] overflow-hidden md:min-h-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: "center center" }}
                  loading="eager"
                />
                <span className="absolute left-4 top-5 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em]" style={{ backgroundColor: C.olive, color: "#fffaf1" }}>
                  Artículo destacado
                </span>
              </div>

              <div className="flex min-w-0 flex-col justify-between gap-4 p-7 md:px-10 md:py-7">
                <div>
                  <div className="mb-5 flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: C.olive }}>
                    <span>{featuredArticle.category}</span>
                    <span style={{ color: C.inkMuted }}>·</span>
                    <span>Artículo comentado</span>
                  </div>
                  <h2
                    className="mb-4 max-w-[700px] font-bold leading-[1.1]"
                    style={{
                      color: C.brown,
                      fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                      fontSize: "clamp(1.65rem, 2.05vw, 2.35rem)",
                      letterSpacing: "0",
                    }}
                  >
                    {featuredArticle.title}
                  </h2>
                  <p className="max-w-[690px] text-[15px] leading-[1.45] md:text-[16px]" style={{ color: "#292016" }}>
                    {featuredArticle.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 text-[13px]" style={{ color: "#6f614f" }}>
                  <div className="flex flex-wrap items-center gap-3">
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
                    className="inline-flex h-[42px] items-center gap-2 rounded-md px-5 text-[14px] font-semibold transition-all group-hover:gap-3"
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
        <div className="mx-auto w-full max-w-[1284px] px-5 py-8 sm:px-6 lg:px-8 xl:px-0">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="font-bold" style={{ color: C.brown, fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif", fontSize: "clamp(1.45rem, 2vw, 1.7rem)" }}>
              Todos los artículos
            </h2>
            <div className="flex items-center gap-3">
              <button type="button" className="hidden h-[38px] items-center gap-2 rounded-md border px-4 text-[13px] md:inline-flex" style={{ borderColor: `${C.beige}88`, color: C.brown, backgroundColor: "#fffaf1" }}>
                Más recientes
                <span className="text-[12px]">⌄</span>
              </button>
              <div className="hidden overflow-hidden rounded-md border md:flex" style={{ borderColor: `${C.beige}88`, backgroundColor: "#fffaf1" }}>
                <button type="button" className="grid h-[38px] w-[42px] place-items-center border-r" style={{ borderColor: `${C.beige}88`, color: C.brown }} aria-label="Vista en cuadrícula">
                  <Grid3X3 size={16} />
                </button>
                <button type="button" className="grid h-[38px] w-[42px] place-items-center" style={{ color: C.brown }} aria-label="Vista en lista">
                  <List size={17} />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {visibleArticles.map((article) => (
              <Link key={article.id} to={`/actualidad/${article.slug}`} className="group block">
                <article
                  className="flex h-full min-h-[260px] flex-col overflow-hidden rounded-lg"
                  style={{
                    backgroundColor: "#fffaf1",
                    border: `1px solid ${C.beige}66`,
                    boxShadow: "0 4px 16px rgba(61,43,31,0.07)",
                  }}
                >
                  <div className="relative h-[148px] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      <span className="rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.05em]" style={{ backgroundColor: "#77552c", color: "#fffaf1" }}>
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3
                      className="line-clamp-2 font-bold leading-[1.18]"
                      style={{
                        color: C.brown,
                        fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                        fontSize: "18px",
                      }}
                    >
                      {article.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-3 pt-4 text-[12px]" style={{ color: "#6f614f" }}>
                      <span>{article.date}</span>
                      <span>·</span>
                      <span>{article.readTime} min de lectura</span>
                      <ArrowRight size={15} className="ml-auto transition-transform group-hover:translate-x-0.5" style={{ color: C.brown }} />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Actualidad;
