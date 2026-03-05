import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AddressAutocompleteInput, AddressComponents } from "@/components/AddressAutocompleteInput";
import {
  MapPin, Star, Phone, Globe, Mail, Package, Edit, Plus,
  Building2, Award, History, ChevronRight,
  Clock, Instagram, Facebook, Twitter, ExternalLink, Route, Users, Leaf,
  Camera, Save, X, Loader2
} from "lucide-react";

interface Company {
  id: string;
  business_name: string;
  description: string | null;
  authenticity_story: string | null;
  address: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  avg_rating: number | null;
  total_reviews: number | null;
  social_media: any;
  slug: string | null;
  latitude: number | null;
  longitude: number | null;
  email?: string | null;
  phone?: string | null;
}

interface CompanyPack {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  tags: string[] | null;
  status: string | null;
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

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const param = id;
  const navigate = useNavigate();
  const { toast } = useToast();

  const [company, setCompany] = useState<Company | null>(null);
  const [packs, setPacks] = useState<CompanyPack[]>([]);
  const [routes, setRoutes] = useState<CompanyRoute[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  // Inline editing state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    business_name: "",
    description: "",
    authenticity_story: "",
    address: "",
    website: "",
    email: "",
    phone: "",
    social_instagram: "",
    social_facebook: "",
    social_twitter: "",
  });
  const [editLatLng, setEditLatLng] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) loadCompanyData();
  }, [id]);

  const loadCompanyData = async () => {
    try {
      if (!param) return;

      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      const isUuid = uuidRegex.test(param);

      let companyQuery = supabase.from('companies_public').select('*');
      companyQuery = isUuid ? companyQuery.eq('id', param) : companyQuery.eq('slug', param);

      const { data: companyData, error: companyError } = await companyQuery.single();
      if (companyError) throw companyError;

      const companyResult = companyData as any;
      setCompany(companyResult as Company);
      const companyId = companyResult.id;

      // Check ownership
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: ownerCheck } = await supabase
          .from('companies')
          .select('user_id, email, phone')
          .eq('id', companyId)
          .eq('user_id', session.user.id)
          .single();
        if (ownerCheck) {
          setIsOwner(true);
          const sm = (companyResult.social_media as any) || {};
          setEditForm({
            business_name: companyResult.business_name || "",
            description: companyResult.description || "",
            authenticity_story: companyResult.authenticity_story || "",
            address: companyResult.address || "",
            website: companyResult.website || "",
            email: (ownerCheck as any).email || "",
            phone: (ownerCheck as any).phone || "",
            social_instagram: sm.instagram || "",
            social_facebook: sm.facebook || "",
            social_twitter: sm.twitter || "",
          });
          // Store email/phone on company for display
          setCompany(prev => prev ? { ...prev, email: (ownerCheck as any).email, phone: (ownerCheck as any).phone } : prev);
        }
      }

      // Load packs, routes, and reviews in parallel
      const [packsRes, routesRes, reviewsRes] = await Promise.all([
        supabase
          .from('company_packs')
          .select('id, title, slug, price, tags, status')
          .eq('company_id', companyId)
          .eq('status', 'published')
          .limit(9),
        supabase
          .from('route_stops')
          .select('route_id, routes!inner(id, title, slug, description, duration, difficulty, image_url, is_public, is_active)')
          .eq('company_id', companyId)
          .limit(20),
        supabase
          .from('company_reviews')
          .select('*')
          .eq('company_id', companyId)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(6),
      ]);

      setPacks(packsRes.data || []);

      const routeMap = new Map<string, CompanyRoute>();
      (routesRes.data || []).forEach((stop: any) => {
        const r = stop.routes;
        if (r && r.is_public && r.is_active && !routeMap.has(r.id)) {
          routeMap.set(r.id, r);
        }
      });
      setRoutes(Array.from(routeMap.values()));
      setReviews(reviewsRes.data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'cover' | 'logo') => {
    if (!company) return;
    const setUploading = type === 'cover' ? setUploadingCover : setUploadingLogo;
    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/${type}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('company-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-files')
        .getPublicUrl(fileName);

      const updateField = type === 'cover' ? 'cover_image_url' : 'logo_url';
      const { error: updateError } = await supabase
        .from('companies')
        .update({ [updateField]: publicUrl })
        .eq('id', company.id);

      if (updateError) throw updateError;

      setCompany({ ...company, [updateField]: publicUrl });
      toast({ title: "Imagen actualizada", description: `${type === 'cover' ? 'Portada' : 'Logo'} actualizado correctamente` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const saveProfile = async () => {
    if (!company) return;
    setSaving(true);

    try {
      const socialMedia: any = {};
      if (editForm.social_instagram) socialMedia.instagram = editForm.social_instagram;
      if (editForm.social_facebook) socialMedia.facebook = editForm.social_facebook;
      if (editForm.social_twitter) socialMedia.twitter = editForm.social_twitter;

      const updateData: any = {
        business_name: editForm.business_name,
        description: editForm.description || null,
        authenticity_story: editForm.authenticity_story || null,
        address: editForm.address || null,
        website: editForm.website || null,
        email: editForm.email || null,
        phone: editForm.phone || null,
        social_media: socialMedia,
      };
      if (editLatLng.lat !== null && editLatLng.lng !== null) {
        updateData.latitude = editLatLng.lat;
        updateData.longitude = editLatLng.lng;
      }

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', company.id);

      if (error) throw error;

      setCompany({
        ...company,
        business_name: editForm.business_name,
        description: editForm.description || null,
        authenticity_story: editForm.authenticity_story || null,
        address: editForm.address || null,
        website: editForm.website || null,
        email: editForm.email || null,
        phone: editForm.phone || null,
        social_media: socialMedia,
      });

      setEditing(false);
      toast({ title: "Perfil actualizado", description: "Los cambios se han guardado correctamente" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setEditing(false);
    const sm = company?.social_media || {};
    setEditForm({
      business_name: company?.business_name || "",
      description: company?.description || "",
      authenticity_story: company?.authenticity_story || "",
      address: company?.address || "",
      website: company?.website || "",
      email: company?.email || "",
      phone: company?.phone || "",
      social_instagram: sm.instagram || "",
      social_facebook: sm.facebook || "",
      social_twitter: sm.twitter || "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Empresa no encontrada</h1>
            <Button onClick={() => navigate('/mapa')}>Volver al mapa</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const avgRating = company.avg_rating || (reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 0);

  const socialMedia = company.social_media || {};

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hidden file inputs for image uploads */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, 'cover');
          e.target.value = '';
        }}
      />
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, 'logo');
          e.target.value = '';
        }}
      />

      {/* Hero / Cover */}
      <section className="relative">
        {company.cover_image_url ? (
          <div className="h-64 md:h-80 w-full overflow-hidden">
            <img
              src={company.cover_image_url}
              alt={company.business_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          </div>
        ) : (
          <div className="h-64 md:h-80 w-full bg-gradient-to-br from-primary/80 to-primary-foreground/20" />
        )}

        {/* Owner: cover image upload button - always visible for owners */}
        {isOwner && (
          <button
            onClick={() => coverInputRef.current?.click()}
            disabled={uploadingCover}
            className="absolute top-4 left-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors disabled:opacity-50"
            title="Cambiar imagen de portada"
          >
            {uploadingCover ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
          </button>
        )}

        {/* Owner action buttons - top right */}
        {isOwner && (
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            {editing ? (
              <>
                <Button
                  onClick={saveProfile}
                  disabled={saving}
                  size="sm"
                  className="shadow-lg"
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar cambios
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background shadow-lg"
                  onClick={cancelEditing}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  className="shadow-lg"
                  onClick={() => setEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar datos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-background shadow-lg"
                  onClick={() => navigate('/company-dashboard')}
                >
                  <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                  Volver
                </Button>
              </>
            )}
          </div>
        )}

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="container mx-auto px-6 pb-8 max-w-6xl">
            <div className="flex items-end gap-5">
              {/* Logo */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center overflow-hidden -mb-4 group">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.business_name} className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-12 h-12 text-muted-foreground" />
                )}
                {isOwner && (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:opacity-50"
                    title="Cambiar logo"
                  >
                    {uploadingLogo ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  </button>
                )}
              </div>
              <div className="flex-1 pb-1">
                {editing ? (
                  <Input
                    value={editForm.business_name}
                    onChange={(e) => setEditForm({ ...editForm, business_name: e.target.value })}
                    className="text-3xl md:text-4xl font-bold bg-white/20 text-white border-white/40 placeholder:text-white/50"
                    placeholder="Nombre del negocio"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    {company.business_name}
                  </h1>
                )}
                {editing ? (
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-white/80 flex-shrink-0" />
                    <AddressAutocompleteInput
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      onAddressSelect={(addr: AddressComponents) => {
                        setEditForm(prev => ({ ...prev, address: addr.formatted_address }));
                        setEditLatLng({ lat: addr.latitude, lng: addr.longitude });
                      }}
                      className="bg-white/20 text-white border-white/40 placeholder:text-white/50 text-sm"
                      placeholder="Busca tu dirección o nombre de empresa..."
                    />
                  </div>
                ) : (
                  company.address && (
                    <p className="text-white/90 flex items-center gap-1.5 mt-1 text-sm md:text-base drop-shadow">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      {company.address}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-6 max-w-6xl py-4">
          <div className="flex flex-wrap items-center gap-4 ml-0 md:ml-36">
            {avgRating > 0 && (
              <Badge variant="secondary" className="px-3 py-1.5 text-sm">
                <Star className="w-4 h-4 mr-1 fill-yellow-500 text-yellow-500" />
                {avgRating.toFixed(1)} ({company.total_reviews || reviews.length} valoraciones)
              </Badge>
            )}
            {packs.length > 0 && (
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                <Package className="w-4 h-4 mr-1" />
                {packs.length} packs
              </Badge>
            )}
            {routes.length > 0 && (
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                <Route className="w-4 h-4 mr-1" />
                {routes.length} rutas
              </Badge>
            )}

            {/* Website & Social - editable only in edit mode */}
            {isOwner && editing ? (
              <>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <Input
                    value={editForm.website}
                    onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    className="h-8 text-sm w-56"
                    placeholder="https://www.tuempresa.com"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Instagram className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editForm.social_instagram}
                      onChange={(e) => setEditForm({ ...editForm, social_instagram: e.target.value })}
                      className="h-8 text-sm w-40"
                      placeholder="URL Instagram"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Facebook className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editForm.social_facebook}
                      onChange={(e) => setEditForm({ ...editForm, social_facebook: e.target.value })}
                      className="h-8 text-sm w-40"
                      placeholder="URL Facebook"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                    <Input
                      value={editForm.social_twitter}
                      onChange={(e) => setEditForm({ ...editForm, social_twitter: e.target.value })}
                      className="h-8 text-sm w-40"
                      placeholder="URL Twitter"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    <Globe className="w-4 h-4" />
                    Sitio web
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Story - first */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Nuestra historia
              </h2>
              {isOwner ? (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="p-6">
                    <Textarea
                      value={editing ? editForm.authenticity_story : (company.authenticity_story || "")}
                      onChange={(e) => setEditForm({ ...editForm, authenticity_story: e.target.value })}
                      readOnly={!editing}
                      rows={5}
                      placeholder="Cuenta la historia de tu empresa, tu tradición familiar, valores..."
                      className={`italic text-base leading-relaxed ${!editing ? 'cursor-default focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0' : ''}`}
                    />
                  </CardContent>
                </Card>
              ) : company.authenticity_story ? (
                <Card className="bg-muted/30 border-dashed">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed italic whitespace-pre-line">
                      {company.authenticity_story}
                    </p>
                  </CardContent>
                </Card>
              ) : null}
            </section>

            {/* About - second */}
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-primary" />
                Sobre nosotros
              </h2>
              {isOwner ? (
                <Textarea
                  value={editing ? editForm.description : (company.description || "")}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  readOnly={!editing}
                  rows={6}
                  placeholder="Describe tu empresa, qué productos ofreces y qué te hace único..."
                  className={`text-base leading-relaxed ${!editing ? 'cursor-default focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0' : ''}`}
                />
              ) : company.description ? (
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {company.description}
                </p>
              ) : null}
            </section>

            {/* Packs */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Package className="w-6 h-6 text-primary" />
                  Packs que ofrece
                </h2>
              </div>

              {packs.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">
                      {isOwner ? "Aún no tienes packs publicados" : "Esta empresa aún no tiene packs publicados"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packs.map((pack) => (
                    <Card
                      key={pack.id}
                      className="hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => navigate(`/packs/${pack.slug || pack.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base group-hover:text-primary transition-colors">{pack.title}</CardTitle>
                        {pack.price && (
                          <p className="text-xl font-bold text-primary">{pack.price}€</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        {pack.tags && pack.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {pack.tags.slice(0, 3).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Routes */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Route className="w-6 h-6 text-primary" />
                Rutas donde aparece
              </h2>

              {routes.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Route className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Esta empresa aún no forma parte de ninguna ruta</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {routes.map((route) => (
                    <Card
                      key={route.id}
                      className="hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => navigate(`/rutas/${route.slug || route.id}`)}
                    >
                      <CardContent className="p-4 flex gap-4 items-center">
                        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                          {route.image_url ? (
                            <img src={route.image_url} alt={route.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Route className="w-8 h-8 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{route.title}</h3>
                          {route.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{route.description}</p>
                          )}
                          <div className="flex gap-3 mt-2">
                            {route.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {route.duration}
                              </span>
                            )}
                            {route.difficulty && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="w-3 h-3" /> {route.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                Valoraciones
                {avgRating > 0 && (
                  <span className="text-base font-normal text-muted-foreground ml-2">
                    {avgRating.toFixed(1)}/5
                  </span>
                )}
              </h2>

              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center">
                    <Star className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p className="text-muted-foreground">Aún no hay valoraciones</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm">{review.customer_name}</CardTitle>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/30"}`} />
                            ))}
                          </div>
                        </div>
                        <CardDescription className="text-xs">
                          {new Date(review.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </CardDescription>
                      </CardHeader>
                      {(review.title || review.comment) && (
                        <CardContent className="pt-0">
                          {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                          {review.comment && <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>}
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Owner: always show email/phone fields, editable only in edit mode */}
                {isOwner ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <Input
                        value={company.email || ""}
                        readOnly
                        className="h-9 text-sm border-transparent bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-default"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <Input
                        value={editing ? editForm.phone : (company.phone || "")}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        readOnly={!editing}
                        className={`h-9 text-sm ${!editing ? 'border-transparent bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0' : ''}`}
                        placeholder="Teléfono de contacto"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {company.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{company.email}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{company.phone}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Web</p>
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline truncate block max-w-[200px]">
                            {company.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      </div>
                    )}
                    {(socialMedia.instagram || socialMedia.facebook || socialMedia.twitter) && (
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {socialMedia.instagram && (
                          <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {socialMedia.facebook && (
                          <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Facebook className="w-5 h-5" />
                          </a>
                        )}
                        {socialMedia.twitter && (
                          <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                            <Twitter className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    )}
                  </>
                )}

                <Separator />

                <Button
                  className="w-full"
                  onClick={() => navigate('/contacto')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar empresa
                </Button>
              </CardContent>
            </Card>

            {/* Map preview if coordinates available */}
            {company.latitude && company.longitude && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Ubicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={`https://www.google.com/maps?q=${company.latitude},${company.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="h-48 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors cursor-pointer">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-sm text-primary font-medium">Ver en Google Maps</p>
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessDetail;
