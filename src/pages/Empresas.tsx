import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bookmark,
  ChevronRight,
  Loader2,
  MapPin,
  Search,
  Store,
  Tags,
  MapPinned,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const C = {
  cream: "#F5F0E8",
  paper: "#F3EADB",
  card: "#FFFAF1",
  brown: "#3D2B1F",
  brownSoft: "#6F4E37",
  olive: "#4F5D2A",
  oliveDark: "#3B4323",
  beige: "#C8B89A",
  gold: "#B8860B",
  inkMuted: "#756650",
};

const pageShell = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";
const editorialFont = "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif";

const tabs = [
  "Todas",
  "Productores",
  "Cooperativas",
  "Restaurantes",
  "Fincas",
  "Cotos",
  "Vinos",
  "Aceite",
  "Quesos",
  "Miel",
  "Experiencias",
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=760&q=86",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=760&q=86",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=760&q=86",
  "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=760&q=86",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=760&q=86",
];

interface EmpresaPublica {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  address: string | null;
  businessType: string | null;
  category: string | null;
  province: string | null;
  image: string | null;
  rating: number | null;
  totalReviews: number | null;
}

const normalize = (value: string | null | undefined) =>
  (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const matchesTab = (empresa: EmpresaPublica, tab: string) => {
  if (tab === "Todas") return true;
  const haystack = normalize(`${empresa.category} ${empresa.businessType} ${empresa.name} ${empresa.description}`);
  const tabValue = normalize(tab);

  if (tabValue === "productores") return /productor|produccion|agricult|ganader|artesano/.test(haystack);
  if (tabValue === "cooperativas") return /cooperativa|almazara/.test(haystack);
  if (tabValue === "vinos") return /vino|bodega|vin/.test(haystack);
  if (tabValue === "quesos") return /queso|lacteo|lacteos/.test(haystack);
  if (tabValue === "fincas") return /finca|granja|ganader/.test(haystack);
  if (tabValue === "cotos") return /coto|caza|monte/.test(haystack);

  return haystack.includes(tabValue.replace(/s$/, ""));
};

const getLocation = (empresa: EmpresaPublica) =>
  [empresa.address, empresa.province].filter(Boolean).join(", ") || "Territorio ORIGEN";

const getCardImage = (empresa: EmpresaPublica, index: number) =>
  empresa.image || fallbackImages[index % fallbackImages.length];

const Empresas = () => {
  const [empresas, setEmpresas] = useState<EmpresaPublica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("destacadas");
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    const loadEmpresas = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from("companies_public")
          .select(
            `
            id,
            business_name,
            slug,
            description,
            address,
            business_type,
            cover_image_url,
            logo_url,
            avg_rating,
            total_reviews,
            categories!category_id(name),
            regions!region_id(name)
          `
          )
          .order("business_name", { ascending: true });

        if (fetchError) throw fetchError;

        const mapped = (data || [])
          .filter((row: any) => row.id && row.business_name)
          .map((row: any) => ({
            id: row.id,
            name: row.business_name,
            slug: row.slug,
            description: row.description,
            address: row.address,
            businessType: row.business_type,
            category: row.categories?.name || row.business_type || null,
            province: row.regions?.name || null,
            image: row.cover_image_url || row.logo_url || null,
            rating: row.avg_rating,
            totalReviews: row.total_reviews,
          }));

        setEmpresas(mapped);
        setError(null);
      } catch (err) {
        console.error("Error loading empresas publicas:", err);
        setError("No se pudieron cargar las empresas en este momento.");
      } finally {
        setLoading(false);
      }
    };

    loadEmpresas();
  }, []);

  const provinceStats = useMemo(() => {
    const counts = new Map<string, number>();
    empresas.forEach((empresa) => {
      if (!empresa.province) return;
      counts.set(empresa.province, (counts.get(empresa.province) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [empresas]);

  const metrics = useMemo(() => {
    const niches = new Set(empresas.map((empresa) => empresa.category || empresa.businessType).filter(Boolean));
    const provinces = new Set(empresas.map((empresa) => empresa.province).filter(Boolean));
    return {
      empresas: empresas.length,
      nichos: niches.size,
      provincias: provinces.size,
    };
  }, [empresas]);

  const filteredEmpresas = useMemo(() => {
    const q = normalize(searchTerm);

    return empresas
      .filter((empresa) => matchesTab(empresa, activeTab))
      .filter((empresa) => !selectedProvince || empresa.province === selectedProvince)
      .filter((empresa) => {
        if (!q) return true;
        return normalize(`${empresa.name} ${empresa.category} ${empresa.businessType} ${empresa.province} ${empresa.address} ${empresa.description}`).includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "nombre") return a.name.localeCompare(b.name);
        if (sortBy === "provincia") return (a.province || "").localeCompare(b.province || "") || a.name.localeCompare(b.name);
        if (sortBy === "recientes") return a.name.localeCompare(b.name);
        return (b.rating || 0) - (a.rating || 0) || (b.totalReviews || 0) - (a.totalReviews || 0) || a.name.localeCompare(b.name);
      });
  }, [activeTab, empresas, searchTerm, selectedProvince, sortBy]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" style={{ backgroundColor: C.paper, color: C.brown }}>
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 100%)` }}>
          <div className={`${pageShell} relative py-12 lg:pb-10 lg:pt-14`}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-end">
              <div className="max-w-2xl">
                <h1
                  className="text-balance font-bold leading-[1.02]"
                  style={{
                    fontFamily: editorialFont,
                    fontSize: "clamp(2.15rem, 4vw, 3.6rem)",
                    letterSpacing: "0",
                  }}
                >
                  Todas las empresas
                </h1>
                <p className="mt-5 max-w-xl text-[16px] leading-[1.65] md:text-[18px]" style={{ color: "#4d3d2d" }}>
                  Un directorio vivo de negocios, productores y proyectos que mantienen vivo el valor de cada territorio.
                </p>
              </div>

              <div className="relative hidden min-h-[230px] lg:block">
                <div className="absolute right-16 top-2 h-[190px] w-[360px] rotate-[-1deg] overflow-hidden border p-2 shadow-[0_18px_42px_rgba(61,43,31,0.15)]" style={{ backgroundColor: C.card, borderColor: `${C.beige}77` }}>
                  <img
                    src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=920&q=86"
                    alt=""
                    className="h-full w-full object-cover grayscale-[0.28] sepia-[0.18]"
                  />
                </div>
                <div className="absolute left-6 top-24 grid h-28 w-28 place-items-center rounded-full border text-center shadow-[0_10px_28px_rgba(61,43,31,0.16)]" style={{ backgroundColor: "rgba(255,250,241,0.88)", borderColor: C.gold, color: C.gold }}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em]">
                    Ritmo<br />Origen
                  </div>
                </div>
                <div className="absolute right-4 top-0 h-44 w-px rotate-[-18deg]" style={{ backgroundColor: `${C.olive}55` }} />
                <div className="absolute right-1 top-0 h-8 w-8 rounded-full border" style={{ borderColor: `${C.olive}55` }} />
                <div className="absolute right-0 top-9 h-28 w-px rotate-[16deg]" style={{ backgroundColor: `${C.olive}55` }} />
                <div className="absolute right-44 -top-1 h-8 w-24 rotate-[-3deg]" style={{ backgroundColor: C.olive, opacity: 0.82 }} />
              </div>
            </div>
          </div>
        </section>

        <section className={`${pageShell} pb-14`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-lg border shadow-[0_14px_38px_rgba(61,43,31,0.08)]" style={{ backgroundColor: "rgba(255,250,241,0.78)", borderColor: `${C.beige}66` }}>
                <div className="overflow-x-auto border-b" style={{ borderColor: `${C.beige}66` }}>
                  <div className="flex min-w-max gap-1 px-3 pt-3">
                    {tabs.map((tab) => {
                      const active = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className="relative h-11 rounded-md px-4 text-sm transition-colors"
                          style={{ backgroundColor: active ? C.oliveDark : "transparent", color: active ? C.card : C.brown }}
                        >
                          {tab}
                          {active && <span className="absolute bottom-[-11px] left-1/2 h-0.5 w-7 -translate-x-1/2" style={{ backgroundColor: C.oliveDark }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 border-b p-4 md:grid-cols-[minmax(0,1fr)_280px]" style={{ borderColor: `${C.beige}66` }}>
                  <label className="relative block">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: C.brown }} />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar empresa, producto o localidad..."
                      className="h-12 w-full rounded-md border bg-transparent pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#7c6d58]"
                      style={{ borderColor: `${C.beige}66`, color: C.brown, backgroundColor: "rgba(255,250,241,0.75)" }}
                    />
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-12 rounded-md border bg-transparent px-4 text-sm outline-none"
                    style={{ borderColor: `${C.beige}66`, color: C.brown, backgroundColor: "rgba(255,250,241,0.75)" }}
                  >
                    <option value="destacadas">Ordenar por: Destacadas</option>
                    <option value="recientes">Ordenar por: Más recientes</option>
                    <option value="nombre">Ordenar por: Nombre</option>
                    <option value="provincia">Ordenar por: Provincia</option>
                  </select>
                </div>

                <div className="p-4">
                  {selectedProvince && (
                    <div className="mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm" style={{ borderColor: `${C.beige}66`, backgroundColor: "#efe4d2", color: C.brown }}>
                      <span>Provincia: {selectedProvince}</span>
                      <button type="button" className="font-semibold" onClick={() => setSelectedProvince(null)}>
                        Quitar filtro
                      </button>
                    </div>
                  )}

                  {loading ? (
                    <div className="grid min-h-[360px] place-items-center">
                      <Loader2 className="h-8 w-8 animate-spin" style={{ color: C.olive }} />
                    </div>
                  ) : error ? (
                    <div className="rounded-lg border p-8 text-center" style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}>
                      <p className="font-semibold">{error}</p>
                    </div>
                  ) : filteredEmpresas.length === 0 ? (
                    <div className="rounded-lg border p-10 text-center" style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}>
                      <p className="font-semibold" style={{ color: C.brown }}>
                        No hay empresas publicadas con estos filtros.
                      </p>
                      <p className="mt-2 text-sm" style={{ color: C.inkMuted }}>
                        Prueba con otra categoría, provincia o búsqueda.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {filteredEmpresas.map((empresa, index) => (
                        <Link key={empresa.id} to={`/negocio/${empresa.slug || empresa.id}`} className="group block">
                          <article className="h-full overflow-hidden rounded-lg border transition-transform duration-300 group-hover:-translate-y-0.5" style={{ backgroundColor: C.card, borderColor: `${C.beige}66`, boxShadow: "0 8px 22px rgba(61,43,31,0.08)" }}>
                            <div className="relative h-40 overflow-hidden">
                              <img src={getCardImage(empresa, index)} alt={empresa.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                              <span className="absolute bottom-3 left-3 rounded-md px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: "#e8d2a8", color: C.brown }}>
                                {empresa.category || empresa.businessType || "Empresa"}
                              </span>
                              <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border bg-black/25 text-white backdrop-blur-sm" aria-hidden="true">
                                <Bookmark className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="flex min-h-[164px] flex-col p-4">
                              <h3 className="line-clamp-1 font-bold leading-snug" style={{ fontFamily: editorialFont, color: C.brown, fontSize: "20px" }}>
                                {empresa.name}
                              </h3>
                              <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "#4c3d2e" }}>
                                {empresa.description || "Negocio verificado dentro del directorio público de ORIGEN."}
                              </p>
                              <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed" style={{ color: C.inkMuted }}>
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-1">{getLocation(empresa)}</span>
                              </div>
                              <div className="mt-auto flex items-center justify-end pt-4 text-sm font-medium" style={{ color: C.brown }}>
                                Ver ficha <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-lg px-6 py-5 text-white md:px-8" style={{ backgroundColor: C.oliveDark, boxShadow: "0 12px 28px rgba(59,67,35,0.18)" }}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Apoyamos lo auténtico. Elegimos lo real.</p>
                      <p className="mt-1 text-sm text-white/80">Cada compra, cada visita y cada experiencia fortalece el territorio.</p>
                    </div>
                  </div>
                  <Link to="/sobre-origen" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-white/35 px-5 text-sm transition-colors hover:bg-white/10">
                    Conoce nuestra filosofía <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:pt-[72px]">
              <div className="rounded-lg border p-6" style={{ backgroundColor: "rgba(255,250,241,0.72)", borderColor: `${C.beige}66`, boxShadow: "0 12px 30px rgba(61,43,31,0.07)" }}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">Directorio en números</h2>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Store, value: metrics.empresas, label: "Empresas activas" },
                    { icon: Tags, value: metrics.nichos, label: "Nichos" },
                    { icon: MapPinned, value: metrics.provincias, label: "Provincias" },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label}>
                        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border" style={{ borderColor: `${C.beige}66`, backgroundColor: "#f0e6d5" }}>
                          <Icon className="h-6 w-6" style={{ color: C.olive }} />
                        </div>
                        <p className="mt-3 font-bold" style={{ fontFamily: editorialFont, fontSize: "30px" }}>
                          {metric.value}
                        </p>
                        <p className="text-xs leading-tight" style={{ color: C.inkMuted }}>
                          {metric.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Link to="/soy-empresa" className="mt-6 flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-[#efe4d2]" style={{ borderColor: C.beige, color: C.brown }}>
                  Quiero formar parte
                </Link>
              </div>

              <div className="rounded-lg border p-6" style={{ backgroundColor: "rgba(255,250,241,0.72)", borderColor: `${C.beige}66`, boxShadow: "0 12px 30px rgba(61,43,31,0.07)" }}>
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">Explora por provincia</h2>
                <div className="relative my-5 h-44 overflow-hidden rounded-md" style={{ backgroundColor: "#efe4d2" }}>
                  <svg viewBox="0 0 260 170" className="h-full w-full" aria-hidden="true">
                    <path d="M58 30 112 22 148 46 136 88 90 95 48 72Z" fill="#eee0ca" stroke="#cbb893" />
                    <path d="M122 32 190 42 216 84 176 112 136 88 148 46Z" fill="#a5aa8e" stroke="#cbb893" />
                    <path d="M78 100 136 90 178 118 152 152 92 142 54 120Z" fill="#e7d8bf" stroke="#cbb893" />
                    <path d="M176 112 224 96 232 134 190 154 152 152Z" fill="#8d9675" stroke="#cbb893" />
                    <path d="M32 76 54 120 92 142 50 150 22 112Z" fill="#f4eadb" stroke="#cbb893" />
                  </svg>
                </div>
                <div className="divide-y" style={{ borderColor: `${C.beige}66` }}>
                  {provinceStats.length === 0 ? (
                    <p className="py-3 text-sm" style={{ color: C.inkMuted }}>No hay provincias publicadas todavía.</p>
                  ) : (
                    provinceStats.slice(0, 6).map((province) => (
                      <button
                        key={province.name}
                        type="button"
                        onClick={() => setSelectedProvince(province.name)}
                        className="flex w-full items-center justify-between py-3 text-left text-sm"
                        style={{ color: selectedProvince === province.name ? C.olive : C.brown }}
                      >
                        <span>{province.name}</span>
                        <span className="flex items-center gap-3" style={{ color: C.inkMuted }}>
                          {province.count} empresas <ChevronRight className="h-4 w-4" />
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className="mt-6 pt-2">
                  <p className="text-sm font-semibold">¿Tu empresa no está aquí?</p>
                  <p className="mt-1 text-sm" style={{ color: C.inkMuted }}>
                    Contacta con nosotros y la añadimos al directorio.
                  </p>
                  <Link to="/contacto" className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4" style={{ color: C.brown }}>
                    Contactar <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Empresas;
