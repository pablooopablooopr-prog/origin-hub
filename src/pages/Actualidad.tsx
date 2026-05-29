import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { articulos as fallbackArticulos } from "@/data/articulos";
import { supabase } from "@/integrations/supabase/client";

const C = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  gold: "#B8860B",
  ocre: "#e8dcc8",
};

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
  imagen_url?: string;
}

const CAT_IMG: Record<string, string> = {
  "Salud": "https://images.unsplash.com/photo-1505576399279-0d309cb90e76?auto=format&fit=crop&w=800&q=85",
  "Alimentación": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=85",
  "Territorio": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=85",
  "Sostenibilidad": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=85",
  "Temporada": "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=85",
  "Salud y alimentación": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=85",
  "Cadena alimentaria": "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=85",
  "Política agraria": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=85",
  default: "https://images.unsplash.com/photo-1505576399279-0d309cb90e76?auto=format&fit=crop&w=800&q=85",
};

const getImg = (art: Articulo) => (art as any).imagen_url || CAT_IMG[art.categoria] || CAT_IMG.default;

const Actualidad = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase.from("articulos").select("*").order("fecha_publicacion", { ascending: false });
        if (error) throw error;
        setArticulos(data || fallbackArticulos);
      } catch { setArticulos(fallbackArticulos); }
      finally { setIsLoading(false); }
    };
    load();
  }, []);

  const destacado = articulos.find((a) => a.destacado) ?? articulos[0];
  const resto = articulos.filter((a) => a.id !== destacado?.id);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: C.cream }}>
      <Header />

      {/* ═══════ SECCIÓN OSCURA: Hero + Artículo destacado ═══════ */}
      <section
        className="relative w-full"
        style={{
          backgroundImage: "url('/textures/actualidad-hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          {/* TÍTULO */}
          <div className="py-14 md:py-16" style={{ maxWidth: "620px" }}>
            <p className="text-[12px] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: C.gold }}>
              Actualidad
            </p>
            <h1
              className="font-bold leading-[1.08] tracking-tight mb-4"
              style={{
                color: C.cream,
                fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(2.2rem, 1.6rem + 2.6vw, 3.4rem)",
              }}
            >
              Artículos, estudios y conocimientos<br />sobre alimentación, territorio y salud
            </h1>
            <p className="leading-relaxed" style={{ color: "#c5bba8", fontSize: "clamp(1rem, 0.9rem + 0.3vw, 1.15rem)", maxWidth: "520px" }}>
              Investigación, tradición y evidencia científica para comprender mejor<br />lo que comemos y cómo impacta en nuestro bienestar.
            </p>
          </div>

          {/* ARTÍCULO DESTACADO — dentro de la sección oscura */}
          {!isLoading && destacado && (
            <div className="pb-14 md:pb-16">
              <Link to={`/actualidad/${destacado.slug}`} className="group block">
                <article
                  className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[42%_1fr]"
                  style={{ backgroundColor: "rgba(255,253,248,0.97)", boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
                >
                  {/* Imagen */}
                  <div className="relative overflow-hidden" style={{ minHeight: "300px" }}>
                    <img
                      src={getImg(destacado)}
                      alt={destacado.titulo}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.16em]" style={{ backgroundColor: C.olive, color: "#fff" }}>
                      Artículo destacado
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-col justify-between p-7 md:p-9 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3 text-[12px] uppercase tracking-[0.14em] font-semibold" style={{ color: "#8a7a62" }}>
                        <span>{destacado.categoria}</span>
                        <span>·</span>
                        <span>Artículo científico comentado</span>
                      </div>
                      <h2
                        className="font-bold leading-[1.12] tracking-tight mb-3"
                        style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem, 1.3rem + 1.2vw, 2.4rem)" }}
                      >
                        {destacado.titulo}
                      </h2>
                      <p className="leading-relaxed text-[15px]" style={{ color: "#6b5a44" }}>
                        {destacado.extracto}
                      </p>
                    </div>
                    <div className="flex items-center justify-between flex-wrap gap-3 pt-3" style={{ borderTop: `1px solid ${C.beige}44` }}>
                      <div className="flex items-center gap-3 text-[13px] flex-wrap" style={{ color: "#8a7a62" }}>
                        <span className="flex items-center gap-1"><BookOpen size={13} />{destacado.autor || "Equipo RITMO ORIGEN"}</span>
                        <span>·</span>
                        <span>{destacado.fecha_publicacion}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={13} />{destacado.tiempo_lectura} min de lectura</span>
                      </div>
                      <span
                        className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-semibold transition-all group-hover:gap-2.5"
                        style={{ border: `1.5px solid ${C.beige}`, color: C.brown }}
                      >
                        Leer análisis <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ SECCIÓN OCRE: Todos los artículos ═══════ */}
      <main className="flex-1" style={{ backgroundColor: C.ocre }}>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.olive }} />
          </div>
        ) : resto.length > 0 ? (
          <div className="max-w-[1280px] mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-7">
              <h2 className="font-bold" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.3rem, 1rem + 0.8vw, 1.8rem)" }}>
                Todos los artículos
              </h2>
              <div className="flex items-center gap-2">
                <select className="text-[13px] px-3 py-1.5 rounded-lg border appearance-none pr-7 cursor-pointer" style={{ borderColor: `${C.beige}`, color: C.brown, backgroundColor: "#fffdf8" }}>
                  <option>Más recientes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {resto.map((art) => (
                <Link key={art.id} to={`/actualidad/${art.slug}`} className="group block">
                  <article className="flex flex-col rounded-2xl overflow-hidden h-full" style={{ backgroundColor: "#fffdf8", boxShadow: "0 2px 14px rgba(61,43,31,0.08)", border: `1px solid ${C.beige}55` }}>
                    <div className="relative w-full overflow-hidden" style={{ height: "170px" }}>
                      <img
                        src={getImg(art)}
                        alt={art.titulo}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[0.14em]" style={{ backgroundColor: C.olive, color: "#fff" }}>
                        {art.categoria}
                      </span>
                    </div>
                    <div className="flex flex-col flex-1 p-4 gap-2">
                      <h3 className="font-bold leading-tight line-clamp-2" style={{ color: C.brown, fontFamily: "'Playfair Display', serif", fontSize: "15px" }}>
                        {art.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mt-auto pt-2 text-[12px]" style={{ color: "#8a7a62" }}>
                        <span>{art.fecha_publicacion}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{art.tiempo_lectura} min de lectura</span>
                        <ArrowRight size={13} className="ml-auto" style={{ color: C.brown }} />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: C.gold, opacity: 0.5 }} />
            <p className="text-[14px]" style={{ color: "#8a7a62" }}>Próximamente más artículos</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Actualidad;
