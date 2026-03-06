import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MapPin, Package, Truck, Leaf, Gift, Plus, X, Save, Trash2, Image as ImageIcon, Check, Box, Euro, Clock, Bookmark, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/ImageUpload";

interface Product {
  id: number;
  name: string;
  description: string;
  company: string;
  attributes: string[];
  image_url?: string;
  db_id?: string; // supabase product id
}

const availableAttributes = [
  "Artesanal", "Km 0", "Producción local", "Ecológico", "Vegano",
  "Sin gluten", "Denominación de origen", "Temporada", "Edición limitada", "Tradicional"
];

const SUSTAINABILITY_OPTIONS = [
  "Empaque 100% reciclable",
  "Productos de km 0",
  "Sin plásticos de un solo uso",
  "Materiales biodegradables",
  "Producción con energía renovable",
  "Agricultura ecológica certificada",
  "Comercio justo",
  "Huella de carbono compensada",
  "Envases reutilizables",
  "Tintas vegetales en etiquetado",
  "Producción artesanal sin residuos",
  "Ingredientes de temporada",
  "Apoyo a economía rural local",
  "Reducción de desperdicio alimentario",
  "Cultivo sin pesticidas",
  "Bienestar animal garantizado",
  "Transporte en frío sostenible",
  "Colaboración con cooperativas locales",
];

const TAG_PRESETS = [
  "Artesano", "Vegano", "Ecológico", "Sin gluten", "Km 0",
  "Gourmet", "Tradicional", "Bio", "Denominación de origen", "Premium",
  "Temporada", "Edición limitada", "Apto celíacos", "Sin lactosa",
  "Producción local", "Maridaje", "Regalo", "Navidad", "Para compartir",
  "Selección", "Degustación", "Sabor intenso", "Ahumado", "Curado",
  "Dulce", "Salado", "Picante", "Mediterráneo", "Ibérico",
  "Montaña", "Costa", "Rural", "Familiar", "Sorpresa",
];

const SHIPPING_PRESETS = [
  "Envío gratuito en Península",
  "Envío en 24-48h",
  "Envío refrigerado incluido",
  "Gastos de envío: 4,95€",
  "Envío gratis a partir de 50€",
  "Recogida en tienda disponible",
  "No se envía a Canarias, Ceuta o Melilla",
  "Envío asegurado contra roturas",
  "Embalaje especial para productos frágiles",
  "Seguimiento del pedido por email",
];

const FIXED_PRICES: Record<string, number> = {
  raiz: 35,
  esencia: 60,
  gourmet: 90
};

const EditarPack = () => {
  const { packId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyId, setCompanyId] = useState<string>("");
  const [currentPackId, setCurrentPackId] = useState<string | null>(packId || null);

  // Pack basic info
  const [packName, setPackName] = useState("");
  const [packType, setPackType] = useState("raiz");
  const [price, setPrice] = useState(FIXED_PRICES["raiz"].toString());
  const [description, setDescription] = useState("");
  const [sustainabilityInfo, setSustainabilityInfo] = useState("");
  const [shippingPolicy, setShippingPolicy] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Pack features
  const [fastShipping, setFastShipping] = useState(false);
  const [sustainablePackaging, setSustainablePackaging] = useState(false);

  // Technical details
  const [packagingType, setPackagingType] = useState("Caja de cartón reciclado");
  const [estimatedShipping, setEstimatedShipping] = useState("2-3 días laborables");
  const [packOrigin, setPackOrigin] = useState("");

  // Products
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "", description: "", company: "", attributes: [] }
  ]);

  useEffect(() => {
    initializePack();
  }, [packId, searchParams]);

  const initializePack = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate('/company-auth'); return; }

      const { data: companyList } = await supabase
        .from('companies')
        .select('id, status, address')
        .eq('user_id', session.user.id);

      const company = (companyList || []).find(
        (c: any) => String(c.status ?? '').trim().toUpperCase() === 'APPROVED'
      );

      if (!company) {
        toast({ title: "No tienes permisos", variant: "destructive" });
        navigate('/company-dashboard');
        return;
      }

      setCompanyId(company.id);
      setPackOrigin(company.address || "");

      if (packId) {
        await loadExistingPack(packId, company.id);
      } else {
        const type = searchParams.get('type') || 'raiz';
        setPackType(type);
        setPrice(FIXED_PRICES[type]?.toString() || "35");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadExistingPack = async (id: string, cId: string) => {
    const { data: pack, error } = await supabase
      .from('company_packs')
      .select('*')
      .eq('id', id)
      .eq('company_id', cId)
      .single();

    if (error || !pack) {
      toast({ title: "Pack no encontrado", variant: "destructive" });
      navigate('/company-dashboard');
      return;
    }

    // Infer type from title or template
    const inferredType = (() => {
      const title = (pack.title || "").toLowerCase();
      if (title.includes("raíz") || title.includes("raiz")) return "raiz";
      if (title.includes("gourmet")) return "gourmet";
      return "esencia";
    })();

    setPackType(inferredType);
    setPackName(pack.title || "");
    setPrice(pack.price?.toString() || FIXED_PRICES[inferredType].toString());
    setDescription(pack.shipping_policy || "");
    setSustainabilityInfo(pack.sustainability_info || "");
    setShippingPolicy(pack.shipping_policy || "");
    setTags(pack.tags || []);
    setCurrentPackId(pack.id);

    // Load products linked to this pack
    const { data: packProducts } = await supabase
      .from('pack_products')
      .select('*, products(*)')
      .eq('pack_id', id)
      .order('position');

    if (packProducts && packProducts.length > 0) {
      setProducts(packProducts.map((pp: any, idx: number) => ({
        id: idx + 1,
        name: pp.products?.name || "",
        description: pp.products?.description || "",
        company: "",
        attributes: [],
        db_id: pp.product_id,
        image_url: pp.products?.images?.[0] || undefined,
      })));
    }
  };

  const handlePackTypeChange = (newType: string) => {
    setPackType(newType);
    setPrice(FIXED_PRICES[newType].toString());
  };

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'raiz': return 'hsl(40, 43%, 93%)';
      case 'esencia': return 'hsl(93, 36%, 91%)';
      case 'gourmet': return 'hsl(23, 34%, 77%)';
      default: return 'hsl(var(--background))';
    }
  };

  const getMiniHeroColor = (type: string) => {
    switch (type) {
      case 'raiz': return 'hsl(30, 25%, 70%)';
      case 'esencia': return 'hsl(100, 35%, 75%)';
      case 'gourmet': return 'hsl(23, 34%, 65%)';
      default: return '#C6B08C';
    }
  };

  const getPackTypeName = (type: string) => {
    switch (type) {
      case 'raiz': return 'Pack Raíz';
      case 'esencia': return 'Pack Esencia';
      case 'gourmet': return 'Pack Gourmet';
      default: return '';
    }
  };

  const addProduct = () => {
    if (products.length >= 8) {
      toast({ title: "Límite alcanzado", description: "Máximo 8 productos", variant: "destructive" });
      return;
    }
    setProducts([...products, { id: Date.now(), name: "", description: "", company: "", attributes: [] }]);
  };

  const removeProduct = (id: number) => {
    if (products.length === 1) {
      toast({ title: "Mínimo requerido", description: "Debe haber al menos un producto", variant: "destructive" });
      return;
    }
    setProducts(products.filter(p => p.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const savePack = async (publish: boolean = false) => {
    if (!packName) {
      toast({ title: "El nombre del pack es obligatorio", variant: "destructive" });
      return;
    }
    if (!companyId) return;

    setSaving(true);
    try {
      const slug = packName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      const status = publish ? 'published' : 'draft';

      const packData = {
        company_id: companyId,
        title: packName,
        price: parseFloat(price) || FIXED_PRICES[packType],
        shipping_policy: shippingPolicy,
        sustainability_info: sustainabilityInfo,
        tags,
        status,
        is_published: publish,
        is_active: true,
      };

      let savedPackId = currentPackId;

      if (currentPackId) {
        // Update existing
        const { error } = await supabase
          .from('company_packs')
          .update(packData)
          .eq('id', currentPackId);
        if (error) throw error;
      } else {
        // Create new
        const { data: newPack, error } = await supabase
          .from('company_packs')
          .insert({ ...packData, slug })
          .select()
          .single();
        if (error) throw error;
        savedPackId = newPack.id;
        setCurrentPackId(newPack.id);
      }

      // Save products: create in products table and link via pack_products
      if (savedPackId) {
        // Remove old pack_products links
        await supabase.from('pack_products').delete().eq('pack_id', savedPackId);

        for (let i = 0; i < products.length; i++) {
          const p = products[i];
          if (!p.name) continue;

          let productId = p.db_id;

          if (!productId) {
            // Create the product
            const productSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now() + '-' + i;
            const { data: newProduct, error: prodError } = await supabase
              .from('products')
              .insert({
                company_id: companyId,
                name: p.name,
                slug: productSlug,
                description: p.description || null,
                is_available: true,
              })
              .select()
              .single();

            if (prodError) {
              console.error('Error creating product:', prodError);
              continue;
            }
            productId = newProduct.id;
          } else {
            // Update existing product
            await supabase.from('products').update({
              name: p.name,
              description: p.description || null,
            }).eq('id', productId);
          }

          // Link to pack
          await supabase.from('pack_products').insert({
            pack_id: savedPackId,
            product_id: productId,
            position: i,
            quantity: 1,
          });
        }
      }

      toast({
        title: publish ? "Pack publicado" : "Pack guardado",
        description: publish ? "Tu pack ha sido publicado correctamente" : "Los cambios se han guardado",
      });

      navigate('/company-dashboard');
    } catch (error: any) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!currentPackId) return;
    try {
      await supabase.from('pack_elements').delete().eq('pack_id', currentPackId);
      await supabase.from('pack_products').delete().eq('pack_id', currentPackId);
      const { error } = await supabase.from('company_packs').delete().eq('id', currentPackId);
      if (error) throw error;
      toast({ title: "Pack eliminado" });
      navigate('/company-dashboard');
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        
        {/* Top Bar - Editar / Guardar / Cancelar */}
        <section style={{ backgroundColor: getMiniHeroColor(packType) }} className="border-b sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/company-dashboard')}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <span className="text-white font-medium">
                  {currentPackId ? 'Editando Pack' : 'Crear Nuevo Pack'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/company-dashboard')}
                  className="bg-white/90 hover:bg-white"
                  style={{ color: getMiniHeroColor(packType) }}
                >
                  Cancelar
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => savePack(false)}
                  disabled={saving}
                  className="bg-white/90 hover:bg-white"
                  style={{ color: getMiniHeroColor(packType) }}
                >
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar borrador
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => savePack(true)}
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Hero Section - Same layout as PackDetail */}
        <section className="w-full" style={{ backgroundColor: getPackTypeColor(packType) }}>
          <div className="container mx-auto px-6 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Pack Info - Editable */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-end gap-3 mb-4">
                  <div>
                    <Label className="text-xs mb-1 block">Tipo de Pack *</Label>
                    <Select value={packType} onValueChange={handlePackTypeChange}>
                      <SelectTrigger className="w-40 bg-[#8B6F47] text-white border-[#8B6F47]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raiz">Pack Raíz (35€)</SelectItem>
                        <SelectItem value="esencia">Pack Esencia (60€)</SelectItem>
                        <SelectItem value="gourmet">Pack Gourmet (90€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Nombre del Pack *</Label>
                  <Input 
                    value={packName}
                    onChange={(e) => setPackName(e.target.value)}
                    placeholder="Ej: Sabores de Castilla"
                    className="text-3xl md:text-4xl font-semibold h-auto py-2"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-primary">{FIXED_PRICES[packType]}€</span>
                  <span className="text-sm text-muted-foreground">(envío incluido - precio fijo)</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {products.filter(p => p.name).length} productos incluidos
                  </span>
                  
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={fastShipping} 
                      onChange={(e) => setFastShipping(e.target.checked)}
                      className="rounded"
                    />
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-xs">Envío rápido</span>
                  </label>
                  
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={sustainablePackaging} 
                      onChange={(e) => setSustainablePackaging(e.target.checked)}
                      className="rounded"
                    />
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-xs">Empaque sostenible</span>
                  </label>
                </div>
              </div>

              {/* Pack Image */}
              <div className="relative">
                <div className="w-full h-72 rounded-xl shadow-2xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors">
                  <div className="text-center">
                    <ImageIcon className="w-16 h-16 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Imagen principal del pack</p>
                    <p className="text-xs text-muted-foreground">Haz clic para subir</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pack Description */}
            <Card className="mt-4">
              <CardHeader className="pb-3 pt-3">
                <CardTitle className="text-lg">Descripción del Pack</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-1">
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descripción detallada del pack, su historia, qué lo hace especial..."
                  rows={4}
                  className="text-sm"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content - Products */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Products Included */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Package className="w-6 h-6" />
                        Productos Incluidos
                      </CardTitle>
                      <CardDescription>
                        Añade entre 1 y 8 productos que compondrán tu pack
                      </CardDescription>
                    </div>
                    <Button onClick={addProduct} size="sm" disabled={products.length >= 8}>
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir Producto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <Card key={product.id} className="overflow-hidden border-l-4 border-l-primary/30 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 z-10"
                          onClick={() => removeProduct(product.id)}
                          disabled={products.length === 1}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
                          <div className="relative cursor-pointer">
                            <div className="w-full h-24 md:h-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors">
                              <div className="text-center">
                                <ImageIcon className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Img</p>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-4 p-3 space-y-2">
                            <div>
                              <Label className="text-xs">Nombre del Producto *</Label>
                              <Input 
                                value={product.name}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].name = e.target.value;
                                  setProducts(newProducts);
                                }}
                                placeholder="Ej: Queso Curado de Oveja"
                                className="font-semibold h-8 text-sm"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Descripción *</Label>
                              <Textarea 
                                value={product.description}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].description = e.target.value;
                                  setProducts(newProducts);
                                }}
                                placeholder="Describe el producto..."
                                rows={2}
                                className="text-sm"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Empresa/Productor</Label>
                                <Input 
                                  value={product.company}
                                  onChange={(e) => {
                                    const newProducts = [...products];
                                    newProducts[index].company = e.target.value;
                                    setProducts(newProducts);
                                  }}
                                  placeholder="Ej: Quesería El Prado"
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Atributos</Label>
                                <Select
                                  value=""
                                  onValueChange={(value) => {
                                    const newProducts = [...products];
                                    if (!newProducts[index].attributes.includes(value)) {
                                      newProducts[index].attributes = [...newProducts[index].attributes, value];
                                      setProducts(newProducts);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 text-sm">
                                    <SelectValue placeholder="Seleccionar atributo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableAttributes.map((attr) => (
                                      <SelectItem key={attr} value={attr}>{attr}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            {product.attributes.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {product.attributes.map((attr, attrIndex) => (
                                  <Badge 
                                    key={attrIndex} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                    onClick={() => {
                                      const newProducts = [...products];
                                      newProducts[index].attributes = newProducts[index].attributes.filter((_, i) => i !== attrIndex);
                                      setProducts(newProducts);
                                    }}
                                  >
                                    {attr} ×
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Valor Añadido / Sustainability */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Valor Añadido y Sostenibilidad
                  </CardTitle>
                  <CardDescription>
                    Selecciona las prácticas sostenibles que aplican a tu pack
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {SUSTAINABILITY_OPTIONS.map((option) => {
                      const selected = sustainabilityInfo.split('\n').filter(Boolean).includes(option);
                      return (
                        <Badge
                          key={option}
                          variant={selected ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                            selected
                              ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                              : "hover:bg-green-50 hover:border-green-300"
                          }`}
                          onClick={() => {
                            const current = sustainabilityInfo.split('\n').filter(Boolean);
                            if (selected) {
                              setSustainabilityInfo(current.filter(i => i !== option).join('\n'));
                            } else {
                              setSustainabilityInfo([...current, option].join('\n'));
                            }
                          }}
                        >
                          {selected ? <Check className="w-3 h-3 mr-1" /> : <Leaf className="w-3 h-3 mr-1" />}
                          {option}
                        </Badge>
                      );
                    })}
                  </div>
                  {sustainabilityInfo && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-green-800 mb-1">Seleccionados ({sustainabilityInfo.split('\n').filter(Boolean).length}):</p>
                      <ul className="text-xs text-green-700 space-y-0.5">
                        {sustainabilityInfo.split('\n').filter(Boolean).map((item, i) => (
                          <li key={i}>✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags / Etiquetas */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Etiquetas</CardTitle>
                  <CardDescription>Selecciona etiquetas para mejorar la búsqueda de tu pack</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {TAG_PRESETS.map((preset) => {
                      const selected = tags.includes(preset);
                      return (
                        <Badge
                          key={preset}
                          variant={selected ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-xs px-3 py-1.5 ${
                            selected
                              ? "bg-primary hover:bg-primary/80"
                              : "hover:bg-primary/10 hover:border-primary/30"
                          }`}
                          onClick={() => {
                            if (selected) {
                              setTags(tags.filter(t => t !== preset));
                            } else {
                              setTags([...tags, preset]);
                            }
                          }}
                        >
                          {selected && <Check className="w-3 h-3 mr-1" />}
                          {preset}
                        </Badge>
                      );
                    })}
                  </div>
                  {/* Custom tag input */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="O escribe una etiqueta personalizada..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button size="sm" variant="outline" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs font-medium mb-2">Etiquetas seleccionadas ({tags.length}):</p>
                      <div className="flex flex-wrap gap-1">
                        {tags.map((tag, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground text-xs"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* Technical Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Detalles Técnicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Productos incluidos:</span>
                    <span className="font-medium">{products.filter(p => p.name).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Precio total:</span>
                    <span className="font-medium">{FIXED_PRICES[packType]}€</span>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Tipo de empaque:</p>
                    <Select value={packagingType} onValueChange={setPackagingType}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Caja de cartón reciclado">Caja de cartón reciclado</SelectItem>
                        <SelectItem value="Cesta de mimbre">Cesta de mimbre</SelectItem>
                        <SelectItem value="Bolsa de tela reutilizable">Bolsa de tela reutilizable</SelectItem>
                        <SelectItem value="Caja de madera">Caja de madera</SelectItem>
                        <SelectItem value="Envase biodegradable">Envase biodegradable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Envío estimado:</p>
                    <Select value={estimatedShipping} onValueChange={setEstimatedShipping}>
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2 días laborables">1-2 días laborables</SelectItem>
                        <SelectItem value="2-3 días laborables">2-3 días laborables</SelectItem>
                        <SelectItem value="3-5 días laborables">3-5 días laborables</SelectItem>
                        <SelectItem value="Envío express 24h">Envío express 24h</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Origen:</span>
                    <Input 
                      value={packOrigin}
                      onChange={(e) => setPackOrigin(e.target.value)}
                      className="w-28 h-7 text-xs text-right"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Policy */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Política de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {SHIPPING_PRESETS.map((preset) => {
                      const lines = shippingPolicy.split('\n').filter(Boolean);
                      const selected = lines.includes(preset);
                      return (
                        <Badge
                          key={preset}
                          variant={selected ? "default" : "outline"}
                          className={`cursor-pointer transition-all text-[10px] px-2 py-1 ${
                            selected
                              ? "bg-primary hover:bg-primary/80"
                              : "hover:bg-primary/10 hover:border-primary/30"
                          }`}
                          onClick={() => {
                            if (selected) {
                              setShippingPolicy(lines.filter(l => l !== preset).join('\n'));
                            } else {
                              setShippingPolicy([...lines, preset].join('\n'));
                            }
                          }}
                        >
                          {selected && <Check className="w-2.5 h-2.5 mr-0.5" />}
                          {preset}
                        </Badge>
                      );
                    })}
                  </div>
                  <Textarea
                    value={shippingPolicy}
                    onChange={(e) => setShippingPolicy(e.target.value)}
                    placeholder="O escribe tu propia política..."
                    rows={2}
                    className="text-sm"
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => savePack(false)} disabled={saving} className="w-full">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Guardar Borrador
                  </Button>
                  <Button onClick={() => savePack(true)} disabled={saving} className="w-full bg-green-600 hover:bg-green-700">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Publicar Pack
                  </Button>
                  {currentPackId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar Pack
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. El pack será eliminado permanentemente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </CardContent>
              </Card>

              {/* Help */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">💡 Consejos</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Usa imágenes de alta calidad</p>
                  <p>• Describe cada producto con detalle</p>
                  <p>• Destaca el origen y la autenticidad</p>
                  <p>• Incluye información de sostenibilidad</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default EditarPack;
