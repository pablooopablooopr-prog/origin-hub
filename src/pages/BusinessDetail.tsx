import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { findMockEmpresa } from "@/data/mockEmpresas";
import { SEASONS, type Season } from "@/lib/season";
import { ImageUpload } from "@/components/ImageUpload";
import { PlaceAutocompleteInput, type PlaceResult } from "@/components/PlaceAutocompleteInput";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Camera,
  ExternalLink,
  Facebook,
  Globe,
  Image as ImageIcon,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Route,
  Save,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Twitter,
  X,
} from "lucide-react";

/** Adjetivos sugeridos para "Qué nos hace diferentes" — toggles tipo chip */
const DIFFERENT_TAGS = [
  "Artesanal",
  "Sostenible",
  "Familiar",
  "Ecológico",
  "Tradicional",
  "Local",
  "Premium",
  "Innovador",
  "Auténtico",
  "Selección manual",
  "Sin aditivos",
  "Origen controlado",
  "Producto de proximidad",
  "Procesos lentos",
] as const;

type SocialMedia = {
  instagram?: string | null;
  facebook?: string | null;
  twitter?: string | null;
  x?: string | null;
};

interface Company {
  id: string;
  business_name: string;
  business_type: string | null;
  category_name?: string | null;
  region_name?: string | null;
  locality?: string | null;
  description: string | null;
  authenticity_story: string | null;
  what_makes_us_different?: string | null;
  star_product?: string | null;
  main_season?: string | null;
  address: string | null;
  website: string | null;
  instagram?: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  hero_image_url?: string | null;
  gallery_image_urls?: string[] | null;
  avg_rating: number | null;
  total_reviews: number | null;
  social_media: SocialMedia | null;
  slug: string | null;
  latitude: number | null;
  longitude: number | null;
  email?: string | null;
  phone?: string | null;
  user_id?: string | null;
}

interface CompanyRoute {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  difficulty: string | null;
  image_url: string | null;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  title: string | null;
  created_at: string;
}

const C = {
  paper: "#F6F0E6",
  card: "#FFFCF7",
  border: "rgba(139, 99, 66, 0.16)",
  brown: "#3D2B1F",
  brownSoft: "#6F5A47",
  olive: "#5C6B2E",
  oliveSoft: "#EEF2E0",
  gold: "#B8860B",
  tan: "#8B5E34",
};

const SEASON_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(SEASONS).map((season) => [
    season.id,
    `${season.label} · ${season.range}`,
  ])
);

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [routes, setRoutes] = useState<CompanyRoute[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Edición inline (solo visible si isOwner). Cada campo se edita en su tarjeta;
  // un botón global "Guardar" persiste todo a la vez y "Cancelar" descarta.
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Company>>({});

  const startEditing = () => {
    if (!company) return;
    setEditForm({
      business_name: company.business_name,
      description: company.description,
      authenticity_story: company.authenticity_story,
      what_makes_us_different: company.what_makes_us_different,
      star_product: company.star_product,
      main_season: company.main_season,
      locality: company.locality,
      address: company.address,
      phone: company.phone,
      email: company.email,
      website: company.website,
      instagram: company.instagram,
      social_media: company.social_media,
      latitude: company.latitude,
      longitude: company.longitude,
      logo_url: company.logo_url,
      cover_image_url: company.cover_image_url,
      hero_image_url: company.hero_image_url,
      gallery_image_urls: company.gallery_image_urls ?? [],
    });
    setEditing(true);
  };

  const setSocialField = (key: "facebook" | "twitter" | "instagram", value: string) => {
    setEditForm((prev) => {
      const current: SocialMedia = (prev.social_media as SocialMedia) || {};
      return {
        ...prev,
        social_media: { ...current, [key]: value || null },
      };
    });
  };

  const handlePlaceSelected = (p: PlaceResult) => {
    setEditForm((prev) => ({
      ...prev,
      address: p.formatted_address || p.address || prev.address,
      latitude: p.latitude,
      longitude: p.longitude,
    }));
  };

  const addGalleryImage = (url: string) => {
    setEditForm((prev) => {
      const arr = Array.isArray(prev.gallery_image_urls) ? [...prev.gallery_image_urls] : [];
      if (arr.length >= 8) return prev;
      arr.push(url);
      return { ...prev, gallery_image_urls: arr };
    });
  };

  const removeGalleryImage = (index: number) => {
    setEditForm((prev) => {
      const arr = Array.isArray(prev.gallery_image_urls) ? [...prev.gallery_image_urls] : [];
      arr.splice(index, 1);
      return { ...prev, gallery_image_urls: arr };
    });
  };

  const cancelEditing = () => {
    setEditForm({});
    setEditing(false);
  };

  const handleSaveEdits = async () => {
    if (!company) return;
    setSaving(true);
    const payload: Record<string, unknown> = {};
    (Object.keys(editForm) as (keyof Company)[]).forEach((k) => {
      const v = editForm[k];
      if (v === undefined) return;
      if (typeof v === "string") {
        payload[k as string] = v.trim() || null;
      } else if (Array.isArray(v)) {
        payload[k as string] = v.filter((x) => typeof x === "string" && x.trim().length > 0);
      } else {
        payload[k as string] = v;
      }
    });

    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", company.id);

    setSaving(false);
    if (error) {
      toast({
        title: "No se pudo guardar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCompany({ ...company, ...payload } as Company);
    setEditing(false);
    setEditForm({});
    toast({ title: "Ficha actualizada", description: "Tus cambios están publicados." });
  };

  const setField = <K extends keyof Company>(key: K, value: Company[K]) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (id) void loadCompanyData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadCompanyData = async (param: string) => {
    setLoading(true);

    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(param);

      // Consultamos la VIEW companies_public (filtra status approved y es
      // accesible para anónimos). Solo pedimos columnas que existen en el
      // VIEW base; las extendidas (locality, phone, star_product, etc.) se
      // mergean después desde la tabla companies si el VIEW extendido está
      // aplicado (migración 20260603_000002), o si el visitante es owner.
      const publicCols = `
        id, business_name, business_type, slug,
        description, authenticity_story,
        address, website,
        logo_url, cover_image_url,
        avg_rating, total_reviews,
        social_media,
        latitude, longitude,
        region_id, category_id
      `;

      let companyQuery = supabase
        .from("companies_public")
        .select(publicCols);
      companyQuery = isUuid ? companyQuery.eq("id", param) : companyQuery.eq("slug", param);

      const { data: companyData, error: companyError } = await companyQuery.maybeSingle();

      // Intentar enriquecer con columnas extendidas (no críticas si fallan)
      let extendedData: Record<string, unknown> = {};
      if (companyData) {
        const { data: extRow } = await supabase
          .from("companies_public")
          .select(
            "locality, instagram, hero_image_url, gallery_image_urls, email, phone, what_makes_us_different, star_product, main_season, accepts_visits, visit_schedule"
          )
          .eq("id", (companyData as any).id)
          .maybeSingle();
        if (extRow) extendedData = extRow as Record<string, unknown>;
      }

      if (!companyData) {
        const mock = !isUuid ? findMockEmpresa(param) : undefined;
        if (mock) {
          setCompany({
            id: mock.id,
            business_name: mock.business_name,
            business_type: mock.business_type,
            category_name: mock.category,
            region_name: mock.province,
            locality: mock.locality,
            description: mock.description,
            authenticity_story: mock.authenticity_story,
            what_makes_us_different: null,
            star_product: mock.star_product,
            main_season: null,
            address: mock.address,
            website: mock.website,
            logo_url: mock.logo_url,
            cover_image_url: mock.cover_image_url,
            hero_image_url: mock.cover_image_url,
            gallery_image_urls: [],
            avg_rating: mock.avg_rating,
            total_reviews: mock.total_reviews,
            social_media: mock.social_media,
            slug: mock.slug,
            latitude: mock.latitude,
            longitude: mock.longitude,
            email: mock.email,
            phone: mock.phone,
          });
          setRoutes([]);
          setReviews([]);
          setIsOwner(false);
          return;
        }

        if (companyError) throw companyError;
        throw new Error("Empresa no encontrada");
      }

      const row = { ...(companyData as any), ...extendedData };
      const normalizedCompany: Company = {
        ...row,
        business_name: row.business_name || "Empresa sin nombre",
        category_name: null,
        region_name: null,
        social_media: (row.social_media as SocialMedia) || null,
        gallery_image_urls: Array.isArray(row.gallery_image_urls)
          ? row.gallery_image_urls
          : [],
      };

      setCompany(normalizedCompany);

      // Owner-check separado: RLS de companies solo deja al dueño ver su user_id
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        const { data: ownerRow } = await supabase
          .from("companies")
          .select("user_id")
          .eq("id", row.id)
          .eq("user_id", authData.user.id)
          .maybeSingle();
        setIsOwner(Boolean(ownerRow));
      }

      const [routesRes, reviewsRes] = await Promise.all([
        supabase
          .from("route_stops")
          .select("route_id, routes!inner(id, title, slug, description, duration, difficulty, image_url, is_public, is_active)")
          .eq("company_id", row.id)
          .limit(20),
        supabase
          .from("company_reviews")
          .select("*")
          .eq("company_id", row.id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      const routeMap = new Map<string, CompanyRoute>();
      (routesRes.data || []).forEach((stop: any) => {
        const route = stop.routes;
        if (route?.is_public && route?.is_active && !routeMap.has(route.id)) {
          routeMap.set(route.id, route);
        }
      });

      setRoutes(Array.from(routeMap.values()));
      setReviews((reviewsRes.data || []) as Review[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = company?.business_name || "Ficha de empresa en RitmOrigen";

    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Enlace copiado", description: "Ya puedes compartir esta ficha." });
      }
    } catch {
      // The native share dialog can be cancelled; no visible error needed.
    }
  };

  const avgRating = company?.avg_rating || (reviews.length
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0);

  const images = useMemo(() => {
    if (!company) return [];
    return [
      company.hero_image_url,
      company.cover_image_url,
      company.logo_url,
      ...(company.gallery_image_urls || []),
    ]
      .filter((url): url is string => Boolean(url && url.trim()))
      .filter((url, index, arr) => arr.indexOf(url) === index)
      .slice(0, 6);
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.paper }}>
        <div className="text-center">
          <Leaf className="w-14 h-14 mx-auto mb-4 animate-pulse" style={{ color: C.olive }} />
          <p className="text-sm font-semibold tracking-[0.18em] uppercase" style={{ color: C.brownSoft }}>
            Cargando ficha pública
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: C.paper }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-3" style={{ color: C.brown }}>
            Empresa no encontrada
          </h1>
          <Button onClick={() => navigate("/mapa")}>Volver al mapa</Button>
        </div>
      </div>
    );
  }

  const heroImage = company.hero_image_url || company.cover_image_url;
  const socialMedia = company.social_media || {};
  const instagramValue = company.instagram || socialMedia.instagram;
  const locationText = [company.locality, company.region_name || provinceFromAddress(company.address)]
    .filter(Boolean)
    .join(", ");
  const categoryLabel = company.business_type || company.category_name || "Empresa local";
  const contactItems = [
    company.email && {
      key: "email",
      icon: <Mail size={16} />,
      label: company.email,
      href: `mailto:${company.email}`,
    },
    company.phone && {
      key: "phone",
      icon: <Phone size={16} />,
      label: company.phone,
      href: `tel:${company.phone.replace(/\s/g, "")}`,
    },
    company.website && {
      key: "website",
      icon: <Globe size={16} />,
      label: "Web",
      href: toAbsoluteUrl(company.website),
    },
    instagramValue && {
      key: "instagram",
      icon: <Instagram size={16} />,
      label: "Instagram",
      href: socialHref("instagram", instagramValue),
    },
    socialMedia.facebook && {
      key: "facebook",
      icon: <Facebook size={16} />,
      label: "Facebook",
      href: socialHref("facebook", socialMedia.facebook),
    },
    (socialMedia.twitter || socialMedia.x) && {
      key: "twitter",
      icon: <Twitter size={16} />,
      label: "Twitter/X",
      href: socialHref("twitter", socialMedia.twitter || socialMedia.x),
    },
  ].filter(Boolean) as Array<{ key: string; icon: JSX.Element; label: string; href: string }>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.paper, color: C.brown }}>
      <main className="mx-auto w-full max-w-[1460px] px-4 py-5 md:px-8 md:py-7">
        <TopBar
          isOwner={isOwner}
          editing={editing}
          saving={saving}
          onBack={() => navigate(-1)}
          onShare={handleShare}
          onStartEdit={startEditing}
          onCancelEdit={cancelEditing}
          onSaveEdit={handleSaveEdits}
        />

        <section
          className="relative mt-5 overflow-hidden rounded-xl md:rounded-2xl"
          style={{
            height: "clamp(180px, 22vw, 280px)",
            backgroundColor: "#D8CBB6",
            boxShadow: "0 8px 22px rgba(61, 43, 31, 0.08)",
          }}
        >
          {(editing ? (editForm.hero_image_url || editForm.cover_image_url) : heroImage) ? (
            <img
              src={editing ? (editForm.hero_image_url || editForm.cover_image_url || "") : heroImage || ""}
              alt={company.business_name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(92,107,46,0.35), rgba(139,94,52,0.35)), url('/textures/sage-paper.jpg') center/cover",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-black/10" />

          {/* Botón cambiar foto de portada (modo edición) */}
          {editing && (
            <HeroImagePicker
              companyId={company.id}
              currentUrl={editForm.cover_image_url || editForm.hero_image_url || ""}
              onChange={(url) => {
                setField("cover_image_url", url);
                setField("hero_image_url", url);
              }}
            />
          )}

          <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-4 md:flex-row md:items-end md:justify-start md:gap-5 md:p-6">
            <div
              className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl md:h-24 md:w-24"
              style={{
                backgroundColor: "rgba(255, 252, 247, 0.94)",
                boxShadow: "0 12px 26px rgba(0,0,0,0.2)",
              }}
            >
              {(editing ? editForm.logo_url : company.logo_url) ? (
                <img src={(editing ? editForm.logo_url : company.logo_url) || ""} alt={`Logo de ${company.business_name}`} className="h-full w-full object-contain p-1.5" />
              ) : (
                <Leaf size={36} style={{ color: C.tan }} />
              )}
              {editing && (
                <LogoImagePicker
                  companyId={company.id}
                  currentUrl={editForm.logo_url || ""}
                  onChange={(url) => setField("logo_url", url)}
                />
              )}
            </div>

            <div className="pb-1 text-white">
              <h1
                className="text-3xl font-bold leading-none md:text-4xl"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
              >
                {company.business_name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: "rgba(92, 107, 46, 0.92)" }}
                >
                  {categoryLabel}
                </span>
                {locationText && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/95">
                    <MapPin size={13} />
                    {locationText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {editing ? (
          <div
            className="mt-5 rounded-xl px-5 py-4 space-y-3"
            style={{
              backgroundColor: C.card,
              border: `1px solid rgba(184,134,11,0.4)`,
              boxShadow: "0 0 0 2px rgba(184,134,11,0.15), 0 8px 20px rgba(61, 43, 31, 0.05)",
            }}
          >
            <p className="text-xs uppercase tracking-widest font-semibold flex items-center gap-2" style={{ color: C.brown }}>
              <Pencil size={11} /> Contacto y redes sociales
            </p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <EditField icon={<Mail size={14} />} label="Email público" value={editForm.email ?? ""} onChange={(v) => setField("email", v)} placeholder="contacto@tuempresa.com" type="email" />
              <EditField icon={<Phone size={14} />} label="Teléfono" value={editForm.phone ?? ""} onChange={(v) => setField("phone", v)} placeholder="+34 ..." />
              <EditField icon={<Globe size={14} />} label="Web" value={editForm.website ?? ""} onChange={(v) => setField("website", v)} placeholder="https://www.tuempresa.com" />
              <EditField icon={<Instagram size={14} />} label="Instagram" value={editForm.instagram ?? ""} onChange={(v) => setField("instagram", v.replace(/^@/, ""))} placeholder="tu_usuario" />
              <EditField icon={<Facebook size={14} />} label="Facebook" value={(editForm.social_media as SocialMedia)?.facebook ?? ""} onChange={(v) => setSocialField("facebook", v)} placeholder="tu_pagina" />
              <EditField icon={<Twitter size={14} />} label="Twitter / X" value={(editForm.social_media as SocialMedia)?.twitter ?? ""} onChange={(v) => setSocialField("twitter", v)} placeholder="tu_usuario" />
            </div>
          </div>
        ) : contactItems.length > 0 ? (
          <div
            className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-xl px-5 py-4"
            style={{
              backgroundColor: C.card,
              border: `1px solid ${C.border}`,
              boxShadow: "0 8px 20px rgba(61, 43, 31, 0.05)",
            }}
          >
            {contactItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={item.key === "email" || item.key === "phone" ? undefined : "_blank"}
                rel={item.key === "email" || item.key === "phone" ? undefined : "noopener noreferrer"}
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-75"
                style={{ color: C.brown }}
              >
                <span style={{ color: C.tan }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-7">
            <PublicCard icon={<Leaf size={23} />} title="Nuestra historia" editing={editing}>
              {editing ? (
                <Textarea
                  value={editForm.authenticity_story ?? ""}
                  onChange={(e) => setField("authenticity_story", e.target.value)}
                  rows={5}
                  placeholder="Cuéntanos tu historia: cuándo empezaste, por qué lo haces..."
                  className="bg-white"
                />
              ) : (
                <p className="leading-relaxed whitespace-pre-line" style={{ color: C.brown }}>
                  {company.authenticity_story || "Esta empresa todavía está completando su historia."}
                </p>
              )}
            </PublicCard>

            <PublicCard icon={<Award size={23} />} title="Sobre nosotros" flushBottom editing={editing}>
              {editing ? (
                <Textarea
                  value={editForm.description ?? ""}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
                  placeholder="Presenta tu empresa al mundo..."
                  className="bg-white"
                />
              ) : (
                <p className="leading-relaxed whitespace-pre-line" style={{ color: C.brown }}>
                  {company.description || "Esta empresa está completando su presentación pública en RitmOrigen."}
                </p>
              )}

              <InfoHighlights
                editing={editing}
                different={editing ? editForm.what_makes_us_different ?? "" : company.what_makes_us_different}
                product={editing ? editForm.star_product ?? "" : company.star_product}
                season={editing ? editForm.main_season ?? "" : company.main_season}
                seasonLabel={!editing ? seasonText(company.main_season) : null}
                onDifferentChange={(v) => setField("what_makes_us_different", v)}
                onProductChange={(v) => setField("star_product", v)}
                onSeasonChange={(v) => setField("main_season", v)}
              />
            </PublicCard>

            <PublicCard icon={<Route size={23} />} title="Experiencias en las que aparecemos">
              {routes.length === 0 ? (
                <p className="text-sm" style={{ color: C.brownSoft }}>
                  Esta empresa aún no forma parte de ninguna experiencia.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {routes.slice(0, 3).map((route) => (
                    <Link
                      key={route.id}
                      to={`/rutas/${route.slug || route.id}`}
                      className="group overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-md"
                      style={{ borderColor: C.border, backgroundColor: "#FFF8EF" }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        {route.image_url ? (
                          <img src={route.image_url} alt={route.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: C.oliveSoft }}>
                            <Route size={28} style={{ color: C.olive }} />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase" style={{ color: C.brown }}>
                          Ruta
                        </span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold leading-tight" style={{ color: C.brown }}>{route.title}</h3>
                        <p className="mt-1 text-xs" style={{ color: C.brownSoft }}>
                          {route.duration || route.difficulty || "Experiencia RitmOrigen"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </PublicCard>

            <PublicCard icon={<Camera size={23} />} title="Fotos" editing={editing}>
              {editing ? (
                <GalleryEditor
                  companyId={company.id}
                  urls={editForm.gallery_image_urls || []}
                  onAdd={addGalleryImage}
                  onRemove={removeGalleryImage}
                />
              ) : images.length === 0 ? (
                <p className="text-sm" style={{ color: C.brownSoft }}>
                  Esta empresa todavía está preparando su galería pública.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={image}
                      className={`overflow-hidden rounded-lg border ${index === 0 ? "col-span-2" : ""}`}
                      style={{ borderColor: C.border, aspectRatio: index === 0 ? "16 / 9" : "4 / 3", backgroundColor: "#F4EBDD" }}
                    >
                      <img
                        src={image}
                        alt={`${company.business_name} foto ${index + 1}`}
                        className={`h-full w-full ${image === company.logo_url ? "object-contain p-4" : "object-cover"}`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </PublicCard>
          </div>

          <aside className="space-y-6">
            <SidebarCard icon={<Mail size={22} />} title="Información de contacto">
              <div className="space-y-4">
                {company.email && <ContactRow icon={<Mail size={16} />} text={company.email} href={`mailto:${company.email}`} />}
                {company.phone && <ContactRow icon={<Phone size={16} />} text={company.phone} href={`tel:${company.phone.replace(/\s/g, "")}`} />}
                <Button
                  className="mt-2 w-full gap-2"
                  style={{ backgroundColor: C.tan, color: "#FFF8EF" }}
                  onClick={() => {
                    if (company.email) window.location.href = `mailto:${company.email}`;
                    else navigate("/contacto");
                  }}
                >
                  <Mail size={16} />
                  Contactar empresa
                </Button>
              </div>
            </SidebarCard>

            {editing || (company.latitude && company.longitude) || company.address ? (
              <SidebarCard icon={<MapPin size={22} />} title="Ubicación">
                {editing && (
                  <div className="mb-4 space-y-2">
                    <p className="text-xs font-semibold flex items-center gap-1.5" style={{ color: C.brown }}>
                      <Search size={12} />
                      Busca tu negocio en Google Places
                    </p>
                    <PlaceAutocompleteInput
                      value={editForm.address ?? ""}
                      onChange={(v) => setField("address", v)}
                      onPlaceSelect={handlePlaceSelected}
                      placeholder="Escribe el nombre o dirección de tu empresa..."
                      className="text-sm"
                    />
                    <p className="text-[11px]" style={{ color: C.brownSoft }}>
                      Al seleccionar un resultado se actualizan dirección y coordenadas.
                    </p>
                    <Input
                      value={editForm.locality ?? ""}
                      onChange={(e) => setField("locality", e.target.value)}
                      placeholder="Localidad (ej. Ciudad Real)"
                      className="text-sm bg-white"
                    />
                  </div>
                )}
                <div
                  className="relative flex h-56 items-center justify-center overflow-hidden rounded-xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(61,43,31,0.06) 1px, transparent 1px), linear-gradient(rgba(61,43,31,0.06) 1px, transparent 1px)",
                    backgroundSize: "34px 34px",
                    backgroundColor: "#EFE6DA",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-black/5" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg" style={{ backgroundColor: C.tan }}>
                    <MapPin size={24} fill="currentColor" />
                  </div>
                </div>
                <a
                  href={googleMapsUrl(editing ? { ...company, ...editForm } : company)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border text-sm font-semibold transition-colors hover:bg-white"
                  style={{ borderColor: C.border, color: C.brown }}
                >
                  Ver en Google Maps
                  <ExternalLink size={15} />
                </a>
              </SidebarCard>
            ) : null}

            <SidebarCard icon={<Star size={22} />} title="Valoraciones">
              {reviews.length === 0 ? (
                <div className="py-8 text-center">
                  <Star size={68} className="mx-auto mb-5" style={{ color: "rgba(61,43,31,0.14)" }} />
                  <p className="font-semibold" style={{ color: C.brown }}>
                    Aún no hay valoraciones
                  </p>
                  <p className="mt-2 text-sm" style={{ color: C.brownSoft }}>
                    Sé el primero en valorar esta empresa.
                  </p>
                  <Button
                    className="mt-6"
                    style={{ backgroundColor: C.olive, color: "#FFF8EF" }}
                    onClick={() => navigate("/escribir-valoracion")}
                  >
                    Dejar una valoración
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold" style={{ color: C.brown }}>
                      {avgRating.toFixed(1)}
                    </span>
                    <RatingStars rating={avgRating} />
                  </div>
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="border-t pt-4" style={{ borderColor: C.border }}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold">{review.customer_name}</p>
                        <RatingStars rating={review.rating} compact />
                      </div>
                      {(review.title || review.comment) && (
                        <p className="mt-2 text-sm leading-relaxed" style={{ color: C.brownSoft }}>
                          {review.title || review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </SidebarCard>
          </aside>
        </div>

        <div className="mx-auto mt-10 flex max-w-md items-center justify-center gap-3 text-xs" style={{ color: C.olive }}>
          <span className="h-px flex-1" style={{ backgroundColor: C.border }} />
          <ShieldCheck size={15} />
          Empresa verificada en RitmOrigen
          <span className="h-px flex-1" style={{ backgroundColor: C.border }} />
        </div>
      </main>
    </div>
  );
};

const TopBar = ({
  isOwner,
  editing,
  saving,
  onBack,
  onShare,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
}: {
  isOwner: boolean;
  editing: boolean;
  saving: boolean;
  onBack: () => void;
  onShare: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
      <ArrowLeft size={16} />
      Volver
    </Button>

    <div className="flex items-center gap-2">
      {isOwner && !editing && (
        <Button onClick={onStartEdit} className="gap-2 shadow-md">
          <Pencil size={15} />
          Editar mi ficha
        </Button>
      )}
      {isOwner && editing && (
        <>
          <Button variant="outline" onClick={onCancelEdit} className="gap-2">
            <X size={15} />
            Cancelar
          </Button>
          <Button
            onClick={onSaveEdit}
            disabled={saving}
            className="gap-2 shadow-md"
          >
            <Save size={15} />
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </>
      )}
      <Button
        variant="outline"
        size="icon"
        onClick={onShare}
        aria-label="Compartir ficha"
      >
        <Share2 size={18} />
      </Button>
    </div>
  </div>
);

const PublicCard = ({
  icon,
  title,
  children,
  flushBottom = false,
  editing = false,
}: {
  icon: JSX.Element;
  title: string;
  children: React.ReactNode;
  flushBottom?: boolean;
  editing?: boolean;
}) => (
  <section
    className={`overflow-hidden rounded-xl border ${flushBottom ? "pb-0" : ""}`}
    style={{
      backgroundColor: C.card,
      borderColor: editing ? "rgba(184, 134, 11, 0.45)" : C.border,
      boxShadow: editing
        ? "0 0 0 2px rgba(184, 134, 11, 0.18), 0 10px 28px rgba(61, 43, 31, 0.04)"
        : "0 10px 28px rgba(61, 43, 31, 0.04)",
      transition: "border-color .15s, box-shadow .15s",
    }}
  >
    <div className="p-6 md:p-7">
      <SectionTitle icon={icon} title={title} editing={editing} />
      <div className="mt-5">{children}</div>
    </div>
  </section>
);

const SidebarCard = ({
  icon,
  title,
  children,
}: {
  icon: JSX.Element;
  title: string;
  children: React.ReactNode;
}) => (
  <section
    className="rounded-xl border p-6"
    style={{
      backgroundColor: C.card,
      borderColor: C.border,
      boxShadow: "0 10px 28px rgba(61, 43, 31, 0.04)",
    }}
  >
    <SectionTitle icon={icon} title={title} compact />
    <div className="mt-5">{children}</div>
  </section>
);

const SectionTitle = ({
  icon,
  title,
  compact = false,
  editing = false,
}: {
  icon: JSX.Element;
  title: string;
  compact?: boolean;
  editing?: boolean;
}) => (
  <div className="flex items-center gap-3">
    <span style={{ color: C.tan }}>{icon}</span>
    <h2
      className={`${compact ? "text-xl" : "text-2xl"} font-bold leading-tight`}
      style={{ color: C.brown, fontFamily: "'Playfair Display', 'Cormorant Garamond', Georgia, serif" }}
    >
      {title}
    </h2>
    {editing && (
      <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-900">
        <Pencil size={10} />
        Editando
      </span>
    )}
  </div>
);

const InfoHighlights = ({
  different,
  product,
  season,
  seasonLabel,
  editing = false,
  onDifferentChange,
  onProductChange,
  onSeasonChange,
}: {
  different?: string | null;
  product?: string | null;
  season?: string | null;
  seasonLabel?: string | null;
  editing?: boolean;
  onDifferentChange?: (v: string) => void;
  onProductChange?: (v: string) => void;
  onSeasonChange?: (v: string) => void;
}) => {
  // En modo edición siempre se muestran las 3 celdas para poder rellenarlas
  if (editing) {
    return (
      <div className="mt-6 grid gap-0 border-t md:grid-cols-3" style={{ borderColor: C.border }}>
        <div className="p-5 text-center">
          <div className="mx-auto mb-3 flex justify-center" style={{ color: C.gold }}>
            <Leaf size={22} />
          </div>
          <p className="text-sm font-bold mb-2" style={{ color: C.brown }}>Qué nos hace diferentes</p>
          <DifferentTagsEditor
            value={different ?? ""}
            onChange={(v) => onDifferentChange?.(v)}
          />
        </div>
        <div className="p-5 text-center" style={{ borderLeft: `1px solid ${C.border}` }}>
          <div className="mx-auto mb-3 flex justify-center" style={{ color: C.gold }}>
            <Star size={24} />
          </div>
          <p className="text-sm font-bold mb-2" style={{ color: C.brown }}>Nuestro producto estrella</p>
          <Input
            value={product ?? ""}
            onChange={(e) => onProductChange?.(e.target.value)}
            placeholder="Aceite de Oliva Virgen Extra Premium"
            className="bg-white text-sm"
          />
        </div>
        <div className="p-5 text-center" style={{ borderLeft: `1px solid ${C.border}` }}>
          <div className="mx-auto mb-3 flex justify-center" style={{ color: C.gold }}>
            <CalendarDays size={24} />
          </div>
          <p className="text-sm font-bold mb-2" style={{ color: C.brown }}>Nuestra temporada</p>
          <Select
            value={season ?? ""}
            onValueChange={(v) => onSeasonChange?.(v)}
          >
            <SelectTrigger className="bg-white text-sm">
              <SelectValue placeholder="Elige temporada" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SEASONS).map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label} · {s.range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  const items = [
    different && {
      icon: <Leaf size={22} />,
      title: "Qué nos hace diferentes",
      value: different,
    },
    product && {
      icon: <Star size={24} />,
      title: "Nuestro producto estrella",
      value: product,
    },
    seasonLabel && {
      icon: <CalendarDays size={24} />,
      title: "Nuestra temporada",
      value: seasonLabel,
    },
  ].filter(Boolean) as Array<{ icon: JSX.Element; title: string; value: string }>;

  if (items.length === 0) return null;

  return (
    <div className="mt-6 grid gap-0 border-t md:grid-cols-3" style={{ borderColor: C.border }}>
      {items.map((item, index) => (
        <div
          key={item.title}
          className="p-5 text-center"
          style={{ borderLeft: index > 0 ? `1px solid ${C.border}` : undefined }}
        >
          <div className="mx-auto mb-3 flex justify-center" style={{ color: C.gold }}>
            {item.icon}
          </div>
          <p className="text-sm font-bold" style={{ color: C.brown }}>{item.title}</p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: C.brownSoft }}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

const ContactRow = ({ icon, text, href }: { icon: JSX.Element; text: string; href: string }) => (
  <a href={href} className="flex items-center gap-3 text-sm transition-opacity hover:opacity-75" style={{ color: C.brown }}>
    <span style={{ color: C.tan }}>{icon}</span>
    <span className="break-all">{text}</span>
  </a>
);

const RatingStars = ({ rating, compact = false }: { rating: number; compact?: boolean }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={compact ? 13 : 16}
        className={index < Math.round(rating) ? "fill-current" : ""}
        style={{ color: index < Math.round(rating) ? C.gold : "rgba(61,43,31,0.18)" }}
      />
    ))}
  </div>
);

function seasonText(value?: string | null) {
  if (!value) return null;
  return SEASON_LABELS[value] || SEASON_LABELS[value as Season] || value;
}

function toAbsoluteUrl(value: string) {
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function socialHref(platform: "instagram" | "facebook" | "twitter", value?: string | null) {
  const clean = (value || "").trim().replace(/^@/, "");
  if (!clean) return "#";
  if (/^https?:\/\//i.test(clean)) return clean;
  const base = platform === "instagram"
    ? "https://instagram.com/"
    : platform === "facebook"
    ? "https://facebook.com/"
    : "https://twitter.com/";
  return `${base}${clean}`;
}

function provinceFromAddress(address?: string | null) {
  if (!address) return null;
  const pieces = address.split(",").map((part) => part.trim()).filter(Boolean);
  return pieces.length > 1 ? pieces[pieces.length - 1] : null;
}

function googleMapsUrl(company: Company) {
  if (company.latitude && company.longitude) {
    return `https://www.google.com/maps?q=${company.latitude},${company.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address || company.business_name)}`;
}

// ============================================================================
// Helpers de edición (inputs, pickers de imagen, chip tags)
// ============================================================================

const EditField = ({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) => (
  <div className="space-y-1">
    <label className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5" style={{ color: C.brownSoft }}>
      <span style={{ color: C.tan }}>{icon}</span>
      {label}
    </label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="h-9 text-sm bg-white"
    />
  </div>
);

/**
 * Chips de adjetivos preestablecidos + texto libre. La cadena se almacena
 * con tags y descripción libre separados por " · ", p.ej:
 * "Artesanal · Sostenible · Familiar · Hacemos todo a mano en obrador propio".
 */
const DifferentTagsEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  // Parsear: separamos por " · " y los tokens que coinciden con DIFFERENT_TAGS
  // son etiquetas; el resto va a texto libre.
  const parts = (value || "")
    .split(/\s*[·,]\s*/)
    .map((s) => s.trim())
    .filter(Boolean);
  const selectedTags = parts.filter((p) =>
    (DIFFERENT_TAGS as readonly string[]).includes(p)
  );
  const freeText = parts.filter((p) => !(DIFFERENT_TAGS as readonly string[]).includes(p)).join(" · ");

  const buildValue = (tags: string[], free: string) =>
    [...tags, free.trim()].filter(Boolean).join(" · ");

  const toggleTag = (tag: string) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onChange(buildValue(next, freeText));
  };

  return (
    <div className="space-y-3 text-left">
      <div className="flex flex-wrap gap-1.5 justify-center">
        {DIFFERENT_TAGS.map((tag) => {
          const isSel = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                isSel
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-white border hover:border-amber-500"
              }`}
              style={!isSel ? { borderColor: C.border, color: C.brown } : undefined}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <Textarea
        value={freeText}
        onChange={(e) => onChange(buildValue(selectedTags, e.target.value))}
        rows={2}
        placeholder="Opcional: añade tu propia frase..."
        className="bg-white text-sm"
      />
    </div>
  );
};

/** Botón flotante "cambiar foto de portada" sobre el hero */
const HeroImagePicker = ({
  companyId,
  currentUrl,
  onChange,
}: {
  companyId: string;
  currentUrl: string;
  onChange: (url: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/70"
      >
        <Camera size={13} />
        Cambiar portada
      </button>
      {open && (
        <div className="absolute inset-3 z-30 rounded-xl bg-card/95 backdrop-blur-md p-4 shadow-2xl border" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold" style={{ color: C.brown }}>Foto de portada</p>
            <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
          <ImageUpload
            bucket="company-files"
            folder={`${companyId}/cover`}
            currentImage={currentUrl}
            onImageUploaded={(url) => {
              onChange(url);
              setOpen(false);
            }}
            aspectRatio="video"
          />
        </div>
      )}
    </>
  );
};

/** Mini-overlay sobre el logo para reemplazarlo */
const LogoImagePicker = ({
  companyId,
  currentUrl,
  onChange,
}: {
  companyId: string;
  currentUrl: string;
  onChange: (url: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/40 text-transparent hover:text-white transition-all rounded-xl"
        aria-label="Cambiar logo"
      >
        <Camera size={20} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-xl p-5 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold" style={{ color: C.brown }}>Logo de la empresa</p>
              <button onClick={() => setOpen(false)} className="opacity-60 hover:opacity-100">
                <X size={16} />
              </button>
            </div>
            <ImageUpload
              bucket="company-files"
              folder={`${companyId}/logo`}
              currentImage={currentUrl}
              onImageUploaded={(url) => {
                onChange(url);
                setOpen(false);
              }}
              aspectRatio="square"
            />
          </div>
        </div>
      )}
    </>
  );
};

/** Editor de galería: muestra imágenes existentes con botón X + slot para añadir */
const GalleryEditor = ({
  companyId,
  urls,
  onAdd,
  onRemove,
}: {
  companyId: string;
  urls: string[];
  onAdd: (url: string) => void;
  onRemove: (index: number) => void;
}) => {
  const [showUploader, setShowUploader] = useState(false);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {urls.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border group"
            style={{ borderColor: C.border, backgroundColor: "#F4EBDD" }}
          >
            <img src={image} alt={`Galería ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Eliminar foto"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {urls.length < 8 && (
          <button
            type="button"
            onClick={() => setShowUploader(true)}
            className="aspect-[4/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1.5 hover:border-amber-500 hover:bg-amber-50/30 transition-colors"
            style={{ borderColor: C.border, color: C.brownSoft }}
          >
            <Plus size={20} />
            <span className="text-[11px] font-semibold">Añadir foto</span>
          </button>
        )}
      </div>
      {showUploader && (
        <div className="rounded-xl border p-4 bg-amber-50/40" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold flex items-center gap-2" style={{ color: C.brown }}>
              <ImageIcon size={15} /> Nueva foto de galería
            </p>
            <button onClick={() => setShowUploader(false)} className="opacity-60 hover:opacity-100">
              <X size={16} />
            </button>
          </div>
          <ImageUpload
            bucket="company-files"
            folder={`${companyId}/gallery`}
            onImageUploaded={(url) => {
              onAdd(url);
              setShowUploader(false);
            }}
            aspectRatio="video"
          />
        </div>
      )}
      <p className="text-[11px]" style={{ color: C.brownSoft }}>
        Máximo 8 fotos. Recomendado 16:9, archivo &lt; 5MB.
      </p>
    </div>
  );
};

export default BusinessDetail;
