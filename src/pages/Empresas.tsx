import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ChevronRight,
  Lock,
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

// ============================================================================
// TEMPORADAS — mapeo a business_types y orden cronológico anual
// ============================================================================
type TemporadaId = "queso" | "mielAceite" | "caza" | "vino";

interface TemporadaInfo {
  id: TemporadaId;
  label: string;
  title: string;
  range: string;
  months: number[]; // 1-12, meses que cubre
  description: string;
  // business_types de companies que se mapean a esta temporada
  matchTypes: string[];
  // colores
  primary: string;
  light: string;
  border: string;
}

const TEMPORADAS: Record<TemporadaId, TemporadaInfo> = {
  queso: {
    id: "queso",
    label: "PRIMAVERA",
    title: "La Temporada del Queso",
    range: "Marzo – Mayo",
    months: [3, 4, 5],
    description:
      "Pastos verdes, leche cruda y manos que han hecho queso desde siempre. La primavera marca el ritmo de las queserías manchegas.",
    matchTypes: ["Quesos y Lácteos"],
    primary: "#4F5D2A",
    light: "#EAEBC8",
    border: "#9CA875",
  },
  mielAceite: {
    id: "mielAceite",
    label: "VERANO",
    title: "La Temporada de la Miel y el Aceite",
    range: "Junio – Agosto",
    months: [6, 7, 8],
    description:
      "Apicultores que cuidan colmenas centenarias y almazaras de cosecha temprana donde el AOVE y la miel marcan el calendario del verano manchego.",
    matchTypes: ["Miel y Apicultura", "Cooperativas y Aceite"],
    primary: "#A87C1F",
    light: "#F5E9C8",
    border: "#D4A83A",
  },
  caza: {
    id: "caza",
    label: "OTOÑO",
    title: "La Temporada de la Caza",
    range: "Septiembre – Noviembre",
    months: [9, 10, 11],
    description:
      "Monterías, dehesas y carnes de caza mayor. El otoño manchego huele a leña, encina y producto recién recolectado.",
    matchTypes: ["Caza y Monterías", "Carnes y Embutidos"],
    primary: "#8B3A1A",
    light: "#F0DFCB",
    border: "#C66830",
  },
  vino: {
    id: "vino",
    label: "INVIERNO",
    title: "La Temporada del Vino",
    range: "Diciembre – Febrero",
    months: [12, 1, 2],
    description:
      "Reservas y gran reservas que han descansado en barrica. Bodegas familiares, brindis y producto gourmet para el invierno.",
    matchTypes: ["Vinos y Bodegas"],
    primary: "#5C2A4F",
    light: "#E8D5DE",
    border: "#8E4E7F",
  },
};

const TEMPORADA_ORDER: TemporadaId[] = ["queso", "mielAceite", "caza", "vino"];

const getCurrentTemporada = (): TemporadaId => {
  const month = new Date().getMonth() + 1;
  for (const id of TEMPORADA_ORDER) {
    if (TEMPORADAS[id].months.includes(month)) return id;
  }
  return "queso";
};

const getNextTemporada = (current: TemporadaId): TemporadaId => {
  const idx = TEMPORADA_ORDER.indexOf(current);
  return TEMPORADA_ORDER[(idx + 1) % TEMPORADA_ORDER.length];
};

const isTemporadaId = (v: string | null): v is TemporadaId =>
  v === "queso" || v === "mielAceite" || v === "caza" || v === "vino";

const matchesTemporada = (empresa: EmpresaPublica, t: TemporadaInfo) => {
  const haystack = `${empresa.businessType ?? ""} ${empresa.category ?? ""}`.toLowerCase();
  return t.matchTypes.some((type) => haystack.includes(type.toLowerCase()));
};

const normalize = (value: string | null | undefined) =>
  (value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const matchesTab = (empresa: EmpresaPublica, tab: string) => {
  if (tab === "Todas") return true;
  const haystack = normalize(
    `${empresa.category} ${empresa.businessType} ${empresa.name} ${empresa.description}`
  );
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

// ============================================================================
// Castilla-La Mancha — 5 provincias clickables
// Coordenadas simplificadas (no GeoJSON exacto) pero reconocibles
// ============================================================================
interface ProvinceShape {
  name: string;
  d: string;
  labelX: number;
  labelY: number;
}

const CLM_PROVINCES: ProvinceShape[] = [
  // Toledo — NW, dominante
  {
    name: "Toledo",
    d: "M30,40 L 165,30 L 195,70 L 175,115 L 110,130 L 50,118 L 22,80 Z",
    labelX: 100,
    labelY: 82,
  },
  // Guadalajara — NE
  {
    name: "Guadalajara",
    d: "M165,30 L 295,28 L 335,72 L 305,110 L 235,108 L 195,70 Z",
    labelX: 245,
    labelY: 65,
  },
  // Cuenca — E vertical
  {
    name: "Cuenca",
    d: "M235,108 L 305,110 L 360,170 L 330,225 L 245,215 L 215,165 L 195,135 Z",
    labelX: 280,
    labelY: 165,
  },
  // Ciudad Real — S grande
  {
    name: "Ciudad Real",
    d: "M50,118 L 110,130 L 175,115 L 195,135 L 215,165 L 195,215 L 105,250 L 35,230 L 18,170 Z",
    labelX: 110,
    labelY: 185,
  },
  // Albacete — SE
  {
    name: "Albacete",
    d: "M215,165 L 245,215 L 330,225 L 340,275 L 235,285 L 195,215 Z",
    labelX: 275,
    labelY: 240,
  },
];

const Empresas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const temporadaParam = searchParams.get("temporada");
  const focusedTemporada: TemporadaId | null = isTemporadaId(temporadaParam) ? temporadaParam : null;

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
            `id, business_name, slug, description, address, business_type,
             cover_image_url, logo_url, avg_rating, total_reviews,
             categories!category_id(name), regions!region_id(name)`
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
            province: row.regions?.name || extractProvince(row.address) || null,
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

    void loadEmpresas();
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

  const provinceCounts = useMemo(() => {
    const map: Record<string, number> = {};
    provinceStats.forEach((p) => {
      map[p.name] = p.count;
    });
    return map;
  }, [provinceStats]);

  const metrics = useMemo(() => {
    const niches = new Set(empresas.map((e) => e.category || e.businessType).filter(Boolean));
    const provinces = new Set(empresas.map((e) => e.province).filter(Boolean));
    return {
      empresas: empresas.length,
      nichos: niches.size,
      provincias: provinces.size,
    };
  }, [empresas]);

  const filteredEmpresas = useMemo(() => {
    const q = normalize(searchTerm);
    return empresas
      .filter((e) => matchesTab(e, activeTab))
      .filter((e) => !selectedProvince || e.province === selectedProvince)
      .filter((e) => {
        if (!q) return true;
        return normalize(
          `${e.name} ${e.category} ${e.businessType} ${e.province} ${e.address} ${e.description}`
        ).includes(q);
      })
      .sort((a, b) => {
        if (sortBy === "nombre") return a.name.localeCompare(b.name);
        if (sortBy === "provincia")
          return (a.province || "").localeCompare(b.province || "") || a.name.localeCompare(b.name);
        if (sortBy === "recientes") return a.name.localeCompare(b.name);
        return (
          (b.rating || 0) - (a.rating || 0) ||
          (b.totalReviews || 0) - (a.totalReviews || 0) ||
          a.name.localeCompare(b.name)
        );
      });
  }, [activeTab, empresas, searchTerm, selectedProvince, sortBy]);

  // ==========================================================================
  // MODO TEMPORADA (?temporada=X)
  // ==========================================================================
  if (focusedTemporada) {
    return (
      <TemporadaView
        focused={focusedTemporada}
        empresas={empresas}
        loading={loading}
        error={error}
        onExit={() => {
          const next = new URLSearchParams(searchParams);
          next.delete("temporada");
          setSearchParams(next);
        }}
        onPickTemporada={(id) => {
          const next = new URLSearchParams(searchParams);
          next.set("temporada", id);
          setSearchParams(next);
        }}
      />
    );
  }

  // ==========================================================================
  // MODO DIRECTORIO (todas las empresas)
  // ==========================================================================
  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: C.paper, color: C.brown }}
    >
      <Header />

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ background: `linear-gradient(180deg, ${C.cream} 0%, ${C.paper} 100%)` }}
        >
          <div className={`${pageShell} relative py-8 md:py-10`}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
              <div className="max-w-2xl">
                <p
                  className="text-xs font-bold uppercase tracking-[0.22em]"
                  style={{ color: C.gold }}
                >
                  Directorio · Castilla-La Mancha
                </p>
                <h1
                  className="mt-2 text-balance font-bold leading-[1.02]"
                  style={{
                    fontFamily: editorialFont,
                    fontSize: "clamp(2.15rem, 4vw, 3.6rem)",
                  }}
                >
                  Todas las empresas
                </h1>
                <p
                  className="mt-4 max-w-xl text-[16px] leading-[1.6] md:text-[17px]"
                  style={{ color: "#4d3d2d" }}
                >
                  Un directorio vivo de negocios, productores y proyectos que
                  mantienen vivo el valor de cada territorio.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {TEMPORADA_ORDER.map((id) => {
                    const t = TEMPORADAS[id];
                    const active = id === getCurrentTemporada();
                    return (
                      <Link
                        key={id}
                        to={`/empresas?temporada=${id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-white/60"
                        style={{
                          borderColor: t.border,
                          color: t.primary,
                          backgroundColor: active ? t.light : "transparent",
                        }}
                      >
                        Ver {t.title.replace("La Temporada de ", "").replace("La Temporada del ", "").replace("La Temporada de la ", "")}
                        {active && <span className="text-[9px] opacity-70">· ACTIVA</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Logo RITM⊙RIGEN — versión compacta, sin tag inferior */}
              <div className="hidden lg:flex items-start justify-center pt-2">
                <div
                  className="relative flex items-center justify-center rounded-full"
                  style={{
                    width: "260px",
                    height: "260px",
                    background: `radial-gradient(circle at 50% 45%, ${C.cream} 0%, ${C.paper} 70%, transparent 100%)`,
                  }}
                >
                  <div
                    className="absolute inset-3 rounded-full border"
                    style={{ borderColor: `${C.olive}33` }}
                  />
                  <div
                    className="absolute inset-8 rounded-full border"
                    style={{ borderColor: `${C.gold}55` }}
                  />
                  <div className="relative flex items-center" aria-label="RitmOrigen">
                    <span
                      className="font-bold leading-none tracking-tight"
                      style={{
                        fontFamily: editorialFont,
                        fontSize: "42px",
                        color: C.oliveDark,
                      }}
                    >
                      RITM
                    </span>
                    <span
                      className="relative inline-flex items-center justify-center"
                      style={{ width: "44px", height: "44px", margin: "0 1px" }}
                    >
                      <img
                        src="/lovable-uploads/enso-transparent.png"
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain"
                        style={{
                          filter:
                            "drop-shadow(0 3px 8px rgba(184, 134, 11, 0.35))",
                        }}
                      />
                    </span>
                    <span
                      className="font-bold leading-none tracking-tight"
                      style={{
                        fontFamily: editorialFont,
                        fontSize: "42px",
                        color: C.oliveDark,
                      }}
                    >
                      RIGEN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${pageShell} pb-14`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="min-w-0">
              <div
                className="overflow-hidden rounded-lg border shadow-[0_14px_38px_rgba(61,43,31,0.08)]"
                style={{ backgroundColor: "rgba(255,250,241,0.78)", borderColor: `${C.beige}66` }}
              >
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
                          style={{
                            backgroundColor: active ? C.oliveDark : "transparent",
                            color: active ? C.card : C.brown,
                          }}
                        >
                          {tab}
                          {active && (
                            <span
                              className="absolute bottom-[-11px] left-1/2 h-0.5 w-7 -translate-x-1/2"
                              style={{ backgroundColor: C.oliveDark }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="grid gap-4 border-b p-4 md:grid-cols-[minmax(0,1fr)_280px]"
                  style={{ borderColor: `${C.beige}66` }}
                >
                  <label className="relative block">
                    <Search
                      className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: C.brown }}
                    />
                    <input
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Buscar empresa, producto o localidad..."
                      className="h-12 w-full rounded-md border bg-transparent pl-11 pr-4 text-sm outline-none transition-colors focus:border-[#7c6d58]"
                      style={{
                        borderColor: `${C.beige}66`,
                        color: C.brown,
                        backgroundColor: "rgba(255,250,241,0.75)",
                      }}
                    />
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-12 rounded-md border bg-transparent px-4 text-sm outline-none"
                    style={{
                      borderColor: `${C.beige}66`,
                      color: C.brown,
                      backgroundColor: "rgba(255,250,241,0.75)",
                    }}
                  >
                    <option value="destacadas">Ordenar por: Destacadas</option>
                    <option value="recientes">Ordenar por: Más recientes</option>
                    <option value="nombre">Ordenar por: Nombre</option>
                    <option value="provincia">Ordenar por: Provincia</option>
                  </select>
                </div>

                <div className="p-4">
                  {selectedProvince && (
                    <div
                      className="mb-4 flex items-center justify-between rounded-md border px-4 py-3 text-sm"
                      style={{
                        borderColor: `${C.beige}66`,
                        backgroundColor: "#efe4d2",
                        color: C.brown,
                      }}
                    >
                      <span>Provincia: {selectedProvince}</span>
                      <button
                        type="button"
                        className="font-semibold"
                        onClick={() => setSelectedProvince(null)}
                      >
                        Quitar filtro
                      </button>
                    </div>
                  )}

                  {loading ? (
                    <div className="grid min-h-[360px] place-items-center">
                      <Loader2 className="h-8 w-8 animate-spin" style={{ color: C.olive }} />
                    </div>
                  ) : error ? (
                    <div
                      className="rounded-lg border p-8 text-center"
                      style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}
                    >
                      <p className="font-semibold">{error}</p>
                    </div>
                  ) : filteredEmpresas.length === 0 ? (
                    <div
                      className="rounded-lg border p-10 text-center"
                      style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}
                    >
                      <p className="font-semibold" style={{ color: C.brown }}>
                        No hay empresas publicadas con estos filtros.
                      </p>
                      <p className="mt-2 text-sm" style={{ color: C.inkMuted }}>
                        Prueba con otra categoría, provincia o búsqueda.
                      </p>
                    </div>
                  ) : (
                    <EmpresaGrid empresas={filteredEmpresas} />
                  )}
                </div>
              </div>

              <div
                className="mt-6 overflow-hidden rounded-lg px-6 py-5 text-white md:px-8"
                style={{
                  backgroundColor: C.oliveDark,
                  boxShadow: "0 12px 28px rgba(59,67,35,0.18)",
                }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/35">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Apoyamos lo auténtico. Elegimos lo real.</p>
                      <p className="mt-1 text-sm text-white/80">
                        Cada compra, cada visita y cada experiencia fortalece el territorio.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/sobre-origen"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md border border-white/35 px-5 text-sm transition-colors hover:bg-white/10"
                  >
                    Conoce nuestra filosofía <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: "rgba(255,250,241,0.72)",
                  borderColor: `${C.beige}66`,
                  boxShadow: "0 12px 30px rgba(61,43,31,0.07)",
                }}
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">
                  Directorio en números
                </h2>
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: Store, value: metrics.empresas, label: "Empresas activas" },
                    { icon: Tags, value: metrics.nichos, label: "Nichos" },
                    { icon: MapPinned, value: metrics.provincias, label: "Provincias" },
                  ].map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <div key={metric.label}>
                        <div
                          className="mx-auto grid h-14 w-14 place-items-center rounded-full border"
                          style={{ borderColor: `${C.beige}66`, backgroundColor: "#f0e6d5" }}
                        >
                          <Icon className="h-6 w-6" style={{ color: C.olive }} />
                        </div>
                        <p
                          className="mt-3 font-bold"
                          style={{ fontFamily: editorialFont, fontSize: "30px" }}
                        >
                          {metric.value}
                        </p>
                        <p className="text-xs leading-tight" style={{ color: C.inkMuted }}>
                          {metric.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/soy-empresa"
                  className="mt-6 flex h-10 items-center justify-center rounded-md border text-sm font-medium transition-colors hover:bg-[#efe4d2]"
                  style={{ borderColor: C.beige, color: C.brown }}
                >
                  Quiero formar parte
                </Link>
              </div>

              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: "rgba(255,250,241,0.72)",
                  borderColor: `${C.beige}66`,
                  boxShadow: "0 12px 30px rgba(61,43,31,0.07)",
                }}
              >
                <h2 className="text-sm font-semibold uppercase tracking-[0.08em]">
                  Explora por provincia
                </h2>
                <p className="mt-1 text-xs" style={{ color: C.inkMuted }}>
                  Mapa de Castilla-La Mancha. Pulsa una provincia.
                </p>

                <CastillaLaManchaMap
                  selectedProvince={selectedProvince}
                  counts={provinceCounts}
                  onSelect={(name) =>
                    setSelectedProvince((prev) => (prev === name ? null : name))
                  }
                />

                <div className="mt-3 divide-y" style={{ borderColor: `${C.beige}66` }}>
                  {CLM_PROVINCES.map((p) => {
                    const count = provinceCounts[p.name] || 0;
                    const sel = selectedProvince === p.name;
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setSelectedProvince(sel ? null : p.name)}
                        className="flex w-full items-center justify-between py-2.5 text-left text-sm transition-colors"
                        style={{ color: sel ? C.olive : C.brown }}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: sel ? C.olive : C.beige,
                            }}
                          />
                          {p.name}
                        </span>
                        <span className="flex items-center gap-2" style={{ color: C.inkMuted }}>
                          {count} {count === 1 ? "empresa" : "empresas"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 pt-1">
                  <p className="text-sm font-semibold">¿Tu empresa no está aquí?</p>
                  <p className="mt-1 text-sm" style={{ color: C.inkMuted }}>
                    Contacta con nosotros y la añadimos al directorio.
                  </p>
                  <Link
                    to="/contacto"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
                    style={{ color: C.brown }}
                  >
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

// ============================================================================
// Sub-componentes
// ============================================================================

const EmpresaGrid = ({ empresas }: { empresas: EmpresaPublica[] }) => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
    {empresas.map((empresa, index) => (
      <Link key={empresa.id} to={`/negocio/${empresa.slug || empresa.id}`} className="group block">
        <article
          className="h-full overflow-hidden rounded-lg border transition-transform duration-300 group-hover:-translate-y-0.5"
          style={{
            backgroundColor: C.card,
            borderColor: `${C.beige}66`,
            boxShadow: "0 8px 22px rgba(61,43,31,0.08)",
          }}
        >
          <div className="relative h-40 overflow-hidden">
            <img
              src={getCardImage(empresa, index)}
              alt={empresa.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <span
              className="absolute bottom-3 left-3 rounded-md px-3 py-1.5 text-xs font-medium"
              style={{ backgroundColor: "#e8d2a8", color: C.brown }}
            >
              {empresa.category || empresa.businessType || "Empresa"}
            </span>
            <span
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md border bg-black/25 text-white backdrop-blur-sm"
              aria-hidden="true"
            >
              <Bookmark className="h-4 w-4" />
            </span>
          </div>
          <div className="flex min-h-[164px] flex-col p-4">
            <h3
              className="line-clamp-1 font-bold leading-snug"
              style={{ fontFamily: editorialFont, color: C.brown, fontSize: "20px" }}
            >
              {empresa.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed" style={{ color: "#4c3d2e" }}>
              {empresa.description ||
                "Negocio verificado dentro del directorio público de ORIGEN."}
            </p>
            <div
              className="mt-3 flex items-start gap-2 text-xs leading-relaxed"
              style={{ color: C.inkMuted }}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="line-clamp-1">{getLocation(empresa)}</span>
            </div>
            <div
              className="mt-auto flex items-center justify-end pt-4 text-sm font-medium"
              style={{ color: C.brown }}
            >
              Ver ficha <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    ))}
  </div>
);

// ============================================================================
// Modo TEMPORADA
// ============================================================================
const TemporadaView = ({
  focused,
  empresas,
  loading,
  error,
  onExit,
  onPickTemporada,
}: {
  focused: TemporadaId;
  empresas: EmpresaPublica[];
  loading: boolean;
  error: string | null;
  onExit: () => void;
  onPickTemporada: (id: TemporadaId) => void;
}) => {
  const t = TEMPORADAS[focused];
  const next = getNextTemporada(focused);
  const otros = TEMPORADA_ORDER.filter((id) => id !== focused);

  const empresasTemporada = useMemo(
    () => empresas.filter((e) => matchesTemporada(e, t)),
    [empresas, t]
  );

  return (
    <div
      className="min-h-screen flex flex-col overflow-x-hidden"
      style={{ backgroundColor: C.paper, color: C.brown }}
    >
      <Header />

      <main className="flex-1">
        {/* HERO de la temporada */}
        <section
          className="relative overflow-hidden"
          style={{
            background: `linear-gradient(180deg, ${t.light} 0%, ${C.paper} 100%)`,
          }}
        >
          <div className={`${pageShell} relative py-12 lg:pb-10 lg:pt-14`}>
            <button
              type="button"
              onClick={onExit}
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: t.primary }}
            >
              <ArrowLeft className="h-4 w-4" />
              Ver todas las empresas
            </button>
            <p
              className="text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: t.primary }}
            >
              {t.label} · TEMPORADA · {t.range.toUpperCase()}
            </p>
            <h1
              className="mt-3 text-balance font-bold leading-[1.02]"
              style={{
                fontFamily: editorialFont,
                fontSize: "clamp(2.15rem, 4vw, 3.6rem)",
                color: t.primary,
              }}
            >
              Empresas de {t.title.replace("La Temporada de la ", "la ").replace("La Temporada del ", "el ").replace("La Temporada de ", "")}
            </h1>
            <p
              className="mt-5 max-w-2xl text-[16px] leading-[1.65] md:text-[18px]"
              style={{ color: "#4d3d2d" }}
            >
              {t.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold"
                style={{
                  backgroundColor: t.primary,
                  color: "#fff",
                }}
              >
                {empresasTemporada.length} {empresasTemporada.length === 1 ? "empresa" : "empresas"} en esta temporada
              </span>
            </div>
          </div>
        </section>

        {/* GRID empresas de la temporada */}
        <section className={`${pageShell} py-10`}>
          {loading ? (
            <div className="grid min-h-[360px] place-items-center">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: t.primary }} />
            </div>
          ) : error ? (
            <div
              className="rounded-lg border p-8 text-center"
              style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}
            >
              <p className="font-semibold">{error}</p>
            </div>
          ) : empresasTemporada.length === 0 ? (
            <div
              className="rounded-lg border p-10 text-center"
              style={{ borderColor: `${C.beige}66`, backgroundColor: C.card }}
            >
              <p className="font-semibold" style={{ color: C.brown }}>
                Todavía no hay empresas publicadas para esta temporada.
              </p>
              <p className="mt-2 text-sm" style={{ color: C.inkMuted }}>
                Estamos curando los productores y restaurantes. Vuelve pronto o
                <Link to="/soy-empresa" className="ml-1 underline">
                  únete como empresa
                </Link>
                .
              </p>
            </div>
          ) : (
            <EmpresaGrid empresas={empresasTemporada} />
          )}
        </section>

        {/* OTRAS TEMPORADAS — bloqueadas / próximamente */}
        <section className={`${pageShell} pb-16`}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: C.gold }}
              >
                Próximas temporadas
              </p>
              <h2
                className="mt-1 text-2xl font-bold"
                style={{ fontFamily: editorialFont, color: C.brown }}
              >
                El ritmo continúa
              </h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otros.map((id) => {
              const o = TEMPORADAS[id];
              const isNext = id === next;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onPickTemporada(id)}
                  className="group relative overflow-hidden rounded-xl border p-6 text-left transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(255, 250, 241, 0.62)",
                    borderColor: `${o.border}55`,
                    boxShadow: "0 8px 22px rgba(61,43,31,0.05)",
                  }}
                >
                  {/* Overlay candado / próximamente */}
                  <div
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    style={{
                      backgroundColor: "rgba(245, 240, 232, 0.55)",
                      backdropFilter: "blur(1px)",
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-1 rounded-full px-3 py-1.5"
                      style={{ backgroundColor: o.primary, color: "#fff" }}
                    >
                      <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                        <Lock className="h-3 w-3" />
                        {isNext ? "Próximamente" : "Más adelante"}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: o.primary, opacity: 0.85 }}
                  >
                    {o.label}
                  </p>
                  <h3
                    className="mt-2 text-xl font-bold leading-tight"
                    style={{ fontFamily: editorialFont, color: o.primary }}
                  >
                    {o.title}
                  </h3>
                  <p className="mt-1.5 text-sm" style={{ color: C.inkMuted }}>
                    {o.range}
                  </p>
                  <p
                    className="mt-3 line-clamp-3 text-sm leading-relaxed"
                    style={{ color: "#4c3d2e", opacity: 0.8 }}
                  >
                    {o.description}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="mt-6 text-center text-xs italic" style={{ color: C.inkMuted }}>
            En RitmOrigen cada temporada activa su propio elenco de productores. Vuelve cuando
            llegue su momento o pulsa una para previsualizar.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// ============================================================================
// Mapa Castilla-La Mancha clickable
// ============================================================================
const CastillaLaManchaMap = ({
  selectedProvince,
  counts,
  onSelect,
}: {
  selectedProvince: string | null;
  counts: Record<string, number>;
  onSelect: (name: string) => void;
}) => (
  <div
    className="relative my-4 overflow-hidden rounded-md"
    style={{ backgroundColor: "#efe4d2", aspectRatio: "360 / 300" }}
  >
    <svg viewBox="0 0 360 300" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id="hatch" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#cbb893" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="360" height="300" fill="url(#hatch)" opacity="0.35" />

      {CLM_PROVINCES.map((p) => {
        const isSelected = selectedProvince === p.name;
        const count = counts[p.name] || 0;
        const hasEmpresas = count > 0;
        return (
          <g
            key={p.name}
            onClick={() => onSelect(p.name)}
            style={{ cursor: "pointer" }}
            className="transition-opacity"
          >
            <path
              d={p.d}
              fill={
                isSelected
                  ? C.olive
                  : hasEmpresas
                  ? "#d4c9a8"
                  : "#e9ddc4"
              }
              stroke="#8b7855"
              strokeWidth="1.4"
              opacity={isSelected ? 1 : hasEmpresas ? 0.95 : 0.7}
              className="hover:opacity-100"
            />
            <text
              x={p.labelX}
              y={p.labelY}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={isSelected ? "#fff" : "#3D2B1F"}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {p.name}
            </text>
            {count > 0 && (
              <text
                x={p.labelX}
                y={p.labelY + 13}
                textAnchor="middle"
                fontSize="9"
                fill={isSelected ? "rgba(255,255,255,0.85)" : "#6F4E37"}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {count} {count === 1 ? "empresa" : "empresas"}
              </text>
            )}
          </g>
        );
      })}
    </svg>

    {selectedProvince && (
      <button
        type="button"
        onClick={() => onSelect(selectedProvince)}
        className="absolute bottom-2 right-2 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold shadow-sm"
        style={{ color: C.brown }}
      >
        Quitar filtro ×
      </button>
    )}
  </div>
);

// ============================================================================
// Helper: extraer provincia de address libre
// ============================================================================
function extractProvince(address: string | null): string | null {
  if (!address) return null;
  const provs = ["Toledo", "Ciudad Real", "Cuenca", "Guadalajara", "Albacete"];
  const lower = address.toLowerCase();
  for (const p of provs) {
    if (lower.includes(p.toLowerCase())) return p;
  }
  return null;
}

export default Empresas;
