import { useState, useEffect } from "react";
import { Save, Eye, X, MapPin, Star, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SEASONS } from "@/lib/season";

/**
 * PESTAÑA 1: MI FICHA
 * Es la ficha que se muestra en la página pública y en las tarjetas de
 * directorio/home.
 *
 * Conecta con tabla `companies` (campos extendidos en migración 20260424_000002).
 */

const NICHO_OPTIONS = [
  "Quesos y Lácteos",
  "Carnes y Embutidos",
  "Vinos y Bodegas",
  "Caza y Monterías",
  "Miel y Apicultura",
  "Cooperativas y Aceite",
  "Restaurante",
  "Alojamiento Rural",
  "Otro",
] as const;

interface TabMiFichaProps {
  companyId: string;
  /** Llamado tras un guardado correcto para refrescar el padre */
  onSaved?: () => void;
}

interface FichaForm {
  // Información básica
  business_name: string;
  business_type: string;
  locality: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  // Sobre la empresa
  description: string;
  what_makes_us_different: string;
  star_product: string;
  main_season: string; // queso|caza|vino|miel|""
  // Visitas
  accepts_visits: boolean;
  visit_schedule: string;
  // Venta online
  sells_online: boolean;
  online_shop_url: string;
  // Fotos (URLs por ahora — Storage en fase futura)
  hero_image_url: string;
  logo_url: string;
  gallery_image_urls: string[];
  // Participación
  participates_in_routes: boolean;
  accepts_b2b: boolean;
}

const EMPTY_FORM: FichaForm = {
  business_name: "",
  business_type: "",
  locality: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  instagram: "",
  description: "",
  what_makes_us_different: "",
  star_product: "",
  main_season: "",
  accepts_visits: false,
  visit_schedule: "",
  sells_online: false,
  online_shop_url: "",
  hero_image_url: "",
  logo_url: "",
  gallery_image_urls: [],
  participates_in_routes: true,
  accepts_b2b: false,
};

const TabMiFicha = ({ companyId, onSaved }: TabMiFichaProps) => {
  const [form, setForm] = useState<FichaForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (!alive) return;

      if (error) {
        toast.error("No se pudo cargar tu ficha");
        setLoading(false);
        return;
      }

      setForm({
        business_name: data.business_name ?? "",
        business_type: data.business_type ?? "",
        locality: data.locality ?? "",
        address: data.address ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        website: data.website ?? "",
        instagram: data.instagram ?? "",
        description: data.description ?? "",
        what_makes_us_different: data.what_makes_us_different ?? "",
        star_product: data.star_product ?? "",
        main_season: data.main_season ?? "",
        accepts_visits: data.accepts_visits ?? false,
        visit_schedule: data.visit_schedule ?? "",
        sells_online: data.sells_online ?? false,
        online_shop_url: data.online_shop_url ?? "",
        hero_image_url: data.hero_image_url ?? "",
        logo_url: data.logo_url ?? "",
        gallery_image_urls: Array.isArray(data.gallery_image_urls)
          ? data.gallery_image_urls
          : [],
        participates_in_routes: data.participates_in_routes ?? true,
        accepts_b2b: data.accepts_b2b ?? false,
      });
      setLoading(false);
    };

    void load();
    return () => {
      alive = false;
    };
  }, [companyId]);

  const update = <K extends keyof FichaForm>(key: K, value: FichaForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addGalleryImage = () => {
    if (form.gallery_image_urls.length >= 5) {
      toast.warning("Máximo 5 imágenes en galería");
      return;
    }
    update("gallery_image_urls", [...form.gallery_image_urls, ""]);
  };

  const updateGalleryImage = (index: number, url: string) => {
    const next = [...form.gallery_image_urls];
    next[index] = url;
    update("gallery_image_urls", next);
  };

  const removeGalleryImage = (index: number) => {
    update(
      "gallery_image_urls",
      form.gallery_image_urls.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    if (!form.business_name.trim()) {
      toast.error("El nombre de la empresa es obligatorio");
      return;
    }
    if (!form.locality.trim()) {
      toast.error("La localidad es obligatoria");
      return;
    }

    setSaving(true);

    // Limpiar gallery_image_urls de strings vacías
    const cleanGallery = form.gallery_image_urls
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    const payload = {
      business_name: form.business_name.trim(),
      business_type: form.business_type || null,
      locality: form.locality.trim() || null,
      address: form.address.trim() || null,
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      instagram: form.instagram.trim().replace(/^@/, "") || null,
      description: form.description.trim() || null,
      what_makes_us_different: form.what_makes_us_different.trim() || null,
      star_product: form.star_product.trim() || null,
      main_season: form.main_season || null,
      accepts_visits: form.accepts_visits,
      visit_schedule: form.accepts_visits ? form.visit_schedule.trim() || null : null,
      sells_online: form.sells_online,
      online_shop_url: form.sells_online ? form.online_shop_url.trim() || null : null,
      hero_image_url: form.hero_image_url.trim() || null,
      logo_url: form.logo_url.trim() || null,
      gallery_image_urls: cleanGallery,
      participates_in_routes: form.participates_in_routes,
      accepts_b2b: form.accepts_b2b,
    };

    const { error } = await supabase
      .from("companies")
      .update(payload)
      .eq("id", companyId);

    setSaving(false);

    if (error) {
      console.error("saveFicha error:", error);
      toast.error("No se pudo guardar la ficha. Intenta de nuevo.");
      return;
    }

    toast.success("Ficha actualizada");
    onSaved?.();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Mi ficha</h2>
          <p className="text-sm text-muted-foreground">
            Esta información aparece en tu página pública y en el spotlight
            rotatorio de la home. Cuanto más completa esté, más confianza
            generas.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview((v) => !v)}
          className="gap-2 shrink-0"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? "Ocultar preview" : "Ver preview"}
        </Button>
      </div>

      {/* Preview de la tarjeta pública */}
      {showPreview && (
        <Card className="border-2 border-primary/40 bg-muted/30">
          <CardHeader>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Vista previa de tu tarjeta
            </p>
          </CardHeader>
          <CardContent>
            <Card className="max-w-sm border-2 border-amber-300/70">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                    {form.business_type || "Sin nicho"}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-900 border-amber-300 gap-1 text-[10px] uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-amber-700 text-amber-700" />
                    Destacada
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold">
                    {form.business_name || "Nombre de tu empresa"}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {form.locality || "Localidad, Provincia"}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {form.description ||
                    "Descripción corta de tu empresa (rellena el campo más abajo)..."}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* SECCIÓN 1: INFORMACIÓN BÁSICA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información básica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ficha_name">Nombre de la empresa *</Label>
              <Input
                id="ficha_name"
                value={form.business_name}
                onChange={(e) => update("business_name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ficha_nicho">Nicho / categoría</Label>
              <Select
                value={form.business_type || undefined}
                onValueChange={(v) => update("business_type", v)}
              >
                <SelectTrigger id="ficha_nicho">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {NICHO_OPTIONS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="ficha_locality">Localidad *</Label>
              <Input
                id="ficha_locality"
                value={form.locality}
                onChange={(e) => update("locality", e.target.value)}
                placeholder="Porzuna, Ciudad Real"
              />
            </div>
            <div>
              <Label htmlFor="ficha_address">Dirección completa</Label>
              <Input
                id="ficha_address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ficha_phone">Teléfono *</Label>
              <Input
                id="ficha_phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ficha_email">Email de contacto</Label>
              <Input
                id="ficha_email"
                type="email"
                value={form.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tu email de cuenta. No se puede cambiar aquí.
              </p>
            </div>
            <div>
              <Label htmlFor="ficha_website">Web propia</Label>
              <Input
                id="ficha_website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                placeholder="https://www.tudominio.com"
              />
            </div>
            <div>
              <Label htmlFor="ficha_instagram">Instagram</Label>
              <Input
                id="ficha_instagram"
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="tu_usuario (sin @)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: SOBRE LA EMPRESA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sobre la empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ficha_history">
              Historia
              <span className="text-xs text-muted-foreground ml-2 font-normal">
                máx. 500 caracteres
              </span>
            </Label>
            <Textarea
              id="ficha_history"
              value={form.description}
              onChange={(e) => update("description", e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Cuéntanos tu historia, cuándo empezaste, por qué lo haces..."
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {form.description.length}/500
            </p>
          </div>

          <div>
            <Label htmlFor="ficha_diff">
              Qué te hace diferente
              <span className="text-xs text-muted-foreground ml-2 font-normal">
                máx. 300 caracteres
              </span>
            </Label>
            <Textarea
              id="ficha_diff"
              value={form.what_makes_us_different}
              onChange={(e) =>
                update("what_makes_us_different", e.target.value.slice(0, 300))
              }
              rows={3}
              placeholder="¿Qué tiene tu empresa que no tiene ninguna otra?"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {form.what_makes_us_different.length}/300
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ficha_star">
                Tu producto estrella
                <span className="text-xs text-muted-foreground ml-2 font-normal">
                  máx. 100
                </span>
              </Label>
              <Input
                id="ficha_star"
                value={form.star_product}
                onChange={(e) => update("star_product", e.target.value.slice(0, 100))}
                placeholder="El producto del que más orgulloso estás"
              />
            </div>
            <div>
              <Label htmlFor="ficha_season">Temporada principal</Label>
              <Select
                value={form.main_season || undefined}
                onValueChange={(v) => update("main_season", v)}
              >
                <SelectTrigger id="ficha_season">
                  <SelectValue placeholder="Selecciona" />
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

          <Separator />

          {/* Toggles visitas y venta online */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-base">¿Aceptas visitas?</Label>
                <p className="text-xs text-muted-foreground">
                  Activa si los clientes pueden ir a tu local, finca o establecimiento.
                </p>
              </div>
              <Switch
                checked={form.accepts_visits}
                onCheckedChange={(v) => update("accepts_visits", v)}
              />
            </div>
            {form.accepts_visits && (
              <div>
                <Label htmlFor="ficha_visit_schedule">Horario de visitas</Label>
                <Input
                  id="ficha_visit_schedule"
                  value={form.visit_schedule}
                  onChange={(e) => update("visit_schedule", e.target.value)}
                  placeholder="L-V 10:00-14:00 · S 10:00-13:00 (con cita previa)"
                />
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div>
                <Label className="text-base">¿Vendes online?</Label>
                <p className="text-xs text-muted-foreground">
                  Activa si tienes tienda online propia.
                </p>
              </div>
              <Switch
                checked={form.sells_online}
                onCheckedChange={(v) => update("sells_online", v)}
              />
            </div>
            {form.sells_online && (
              <div>
                <Label htmlFor="ficha_online_url">URL de tu tienda online</Label>
                <Input
                  id="ficha_online_url"
                  value={form.online_shop_url}
                  onChange={(e) => update("online_shop_url", e.target.value)}
                  placeholder="https://tienda.tudominio.com"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: FOTOS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fotos</CardTitle>
          <p className="text-xs text-muted-foreground">
            Por ahora se introducen como URLs. Próximamente podrás subir
            archivos directamente.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ficha_hero">Foto principal de portada (16:9)</Label>
            <Input
              id="ficha_hero"
              value={form.hero_image_url}
              onChange={(e) => update("hero_image_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label htmlFor="ficha_logo">Logo de la empresa (cuadrado)</Label>
            <Input
              id="ficha_logo"
              value={form.logo_url}
              onChange={(e) => update("logo_url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Galería adicional (hasta 5 imágenes)</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addGalleryImage}
                disabled={form.gallery_image_urls.length >= 5}
              >
                Añadir
              </Button>
            </div>
            {form.gallery_image_urls.length === 0 && (
              <p className="text-xs text-muted-foreground italic">
                Sin imágenes. Pulsa "Añadir" para empezar.
              </p>
            )}
            {form.gallery_image_urls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateGalleryImage(i, e.target.value)}
                  placeholder={`Imagen ${i + 1} URL`}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeGalleryImage(i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 4: PARTICIPACIÓN */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Participación en la plataforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Label className="text-base">Quiero participar en rutas</Label>
              <p className="text-xs text-muted-foreground">
                Permites que RitmOrigen incluya tu empresa como parada en rutas curadas.
              </p>
            </div>
            <Switch
              checked={form.participates_in_routes}
              onCheckedChange={(v) => update("participates_in_routes", v)}
            />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div>
              <Label className="text-base">Activar ventas B2B a restaurantes</Label>
              <p className="text-xs text-muted-foreground">
                Restaurantes y negocios verificados podrán contactarte para
                pedidos al por mayor.
              </p>
            </div>
            <Switch
              checked={form.accepts_b2b}
              onCheckedChange={(v) => update("accepts_b2b", v)}
            />
          </div>

          <p className="text-xs text-muted-foreground italic pt-2">
            Recuerda guardar antes de cambiar de pestaña.
          </p>
        </CardContent>
      </Card>

      {/* Botón guardar */}
      <div>
        <Card className="border-2 border-primary/40 shadow-lg">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Recuerda guardar antes de cambiar de pestaña.
            </p>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar ficha
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TabMiFicha;
