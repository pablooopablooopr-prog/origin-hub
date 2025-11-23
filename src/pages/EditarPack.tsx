import { useState } from "react";
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
import { MapPin, Package, Star, Truck, Clock, Users, ShoppingCart, Share2, Award, Leaf, Gift, Plus, X, Save, Trash2, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
  id: number;
  name: string;
  description: string;
  company: string;
  origin: string;
  attributes: string[];
}

const EditarPack = () => {
  const { toast } = useToast();
  
  // Pack basic info
  const [packName, setPackName] = useState("");
  const [packType, setPackType] = useState("raiz");
  const [province, setProvince] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("draft");
  const [description, setDescription] = useState("");
  const [expandedDescription, setExpandedDescription] = useState("");
  
  // Pack features
  const [seasonal, setSeasonal] = useState(false);
  const [fastShipping, setFastShipping] = useState(false);
  const [sustainablePackaging, setSustainablePackaging] = useState(false);
  const [qualitySeal, setQualitySeal] = useState(false);
  const [featured, setFeatured] = useState("");
  
  // Products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "",
      description: "",
      company: "",
      origin: "",
      attributes: []
    }
  ]);

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'hsl(40, 43%, 93%)';
      case 'esencia':
        return 'hsl(93, 36%, 91%)';
      case 'gourmet':
        return 'hsl(23, 34%, 77%)';
      default:
        return 'hsl(var(--background))';
    }
  };

  const getMiniHeroColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'hsl(30, 25%, 70%)';
      case 'esencia':
        return 'hsl(100, 35%, 75%)';
      case 'gourmet':
        return 'hsl(23, 34%, 65%)';
      default:
        return '#C6B08C';
    }
  };

  const getPackTypeName = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'Pack Raíz';
      case 'esencia':
        return 'Pack Esencia';
      case 'gourmet':
        return 'Pack Gourmet';
      default:
        return '';
    }
  };

  const addProduct = () => {
    if (products.length >= 8) {
      toast({
        title: "Límite alcanzado",
        description: "Máximo 8 productos por pack",
        variant: "destructive",
      });
      return;
    }
    setProducts([...products, {
      id: Date.now(),
      name: "",
      description: "",
      company: "",
      origin: "",
      attributes: []
    }]);
  };

  const removeProduct = (id: number) => {
    if (products.length === 1) {
      toast({
        title: "Mínimo requerido",
        description: "Debe haber al menos un producto",
        variant: "destructive",
      });
      return;
    }
    setProducts(products.filter(p => p.id !== id));
  };

  const handlePublish = () => {
    if (!packName || !price || products.some(p => !p.name)) {
      toast({
        title: "Campos incompletos",
        description: "Completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Pack publicado",
      description: "Tu pack ha sido publicado correctamente.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Guardado como borrador",
      description: "El pack se ha guardado como borrador.",
    });
  };

  const handleDelete = () => {
    toast({
      title: "Pack eliminado",
      description: "El pack ha sido eliminado correctamente.",
      variant: "destructive",
    });
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        
        {/* Breadcrumb Navigation - Mini-hero con color por tipo de pack */}
        <section style={{ backgroundColor: getMiniHeroColor(packType) }} className="border-b">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-sm font-medium">Editar Pack</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.history.back()}
                className="bg-white/90 hover:bg-white border-white/20"
                style={{ color: getMiniHeroColor(packType) }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </section>
        
        {/* Hero Section - Tarjeta principal con color por categoría */}
        <section className="w-full" style={{ backgroundColor: getPackTypeColor(packType) }}>
          <div className="container mx-auto px-6 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Pack Info - Editable */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div>
                    <Label className="text-xs mb-1 block">Tipo de Pack *</Label>
                    <Select value={packType} onValueChange={setPackType}>
                      <SelectTrigger className="w-40 bg-[#8B6F47] text-white border-[#8B6F47]/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raiz">Pack Raíz</SelectItem>
                        <SelectItem value="esencia">Pack Esencia</SelectItem>
                        <SelectItem value="gourmet">Pack Gourmet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2 items-end">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={seasonal} 
                        onChange={(e) => setSeasonal(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Temporada</span>
                    </label>
                    
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={qualitySeal} 
                        onChange={(e) => setQualitySeal(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs">Sello Origen</span>
                    </label>
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

                <div className="space-y-2">
                  <Label>Provincia / Región</Label>
                  <Input 
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Ej: León"
                    className="text-xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio (€) *</Label>
                    <Input 
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="45.90"
                      className="text-3xl font-bold"
                    />
                    <p className="text-xs text-muted-foreground">(envío incluido)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Borrador</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm">
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

                <div className="space-y-2">
                  <Label>Destacado</Label>
                  <Select value={featured} onValueChange={setFeatured}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ninguno" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      <SelectItem value="recommended">Recomendado</SelectItem>
                      <SelectItem value="bestseller">Más vendido</SelectItem>
                      <SelectItem value="new">Novedad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pack Image - Editable */}
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

            {/* Pack Description - Editable */}
            <Card className="mt-4">
              <CardHeader className="pb-3 pt-3">
                <CardTitle className="text-lg">Descripción del Pack</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-1 space-y-3">
                <div>
                  <Label className="text-sm">Descripción breve</Label>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción corta que aparecerá en las tarjetas..."
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-sm">Descripción ampliada</Label>
                  <Textarea 
                    value={expandedDescription}
                    onChange={(e) => setExpandedDescription(e.target.value)}
                    placeholder="Descripción detallada del pack, su historia, qué lo hace especial..."
                    rows={4}
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Products Included - Editable */}
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
                  <div className="space-y-5">
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                          <div className="relative cursor-pointer">
                            <div className="w-full h-32 md:h-full bg-muted border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors">
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 mx-auto mb-1 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Imagen</p>
                              </div>
                            </div>
                          </div>
                          <div className="md:col-span-3 p-5 space-y-3">
                            <div>
                              <Label className="text-sm">Nombre del Producto *</Label>
                              <Input 
                                value={product.name}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].name = e.target.value;
                                  setProducts(newProducts);
                                }}
                                placeholder="Ej: Queso Curado de Oveja"
                                className="font-semibold"
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Descripción *</Label>
                              <Textarea 
                                value={product.description}
                                onChange={(e) => {
                                  const newProducts = [...products];
                                  newProducts[index].description = e.target.value;
                                  setProducts(newProducts);
                                }}
                                placeholder="Describe el producto..."
                                rows={2}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-sm">Empresa/Productor</Label>
                                <Input 
                                  value={product.company}
                                  onChange={(e) => {
                                    const newProducts = [...products];
                                    newProducts[index].company = e.target.value;
                                    setProducts(newProducts);
                                  }}
                                  placeholder="Nombre del productor"
                                />
                              </div>
                              <div>
                                <Label className="text-sm">Origen</Label>
                                <Input 
                                  value={product.origin}
                                  onChange={(e) => {
                                    const newProducts = [...products];
                                    newProducts[index].origin = e.target.value;
                                    setProducts(newProducts);
                                  }}
                                  placeholder="Ciudad, región"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm">Atributos (km0, artesanal, etc.)</Label>
                              <Input 
                                placeholder="Separados por comas"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sustainability Info */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5" />
                    Información de Sostenibilidad
                  </CardTitle>
                  <CardDescription>Opcional - Explica tu compromiso con el medio ambiente</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Describe las prácticas sostenibles, empaque ecológico, km0, etc."
                    rows={3}
                  />
                </CardContent>
              </Card>

              {/* Shipping Policy */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Política de Envío
                  </CardTitle>
                  <CardDescription>Opcional - Información sobre tiempos y condiciones de envío</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    placeholder="Tiempos de entrega, condiciones especiales, zonas de envío..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Preview & Actions */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Preview Card */}
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Vista Previa</CardTitle>
                  <CardDescription className="text-xs">Así verán tu pack los clientes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">{getPackTypeName(packType)}</Badge>
                    <h3 className="font-bold text-lg line-clamp-2">{packName || "Nombre del pack"}</h3>
                    <p className="text-sm text-muted-foreground">{province || "Región"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{price ? `${price}€` : "0€"}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gray-300" />
                      <span className="text-sm">0 valoraciones</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Package className="w-3 h-3 inline mr-1" />
                    {products.length} productos incluidos
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-2">
                  <Button className="w-full" onClick={handlePublish}>
                    <Save className="w-4 h-4 mr-2" />
                    {status === 'published' ? 'Guardar Cambios' : 'Publicar Pack'}
                  </Button>
                  <Button className="w-full" variant="outline" onClick={handleSaveDraft}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Borrador
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Eliminar Pack
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar pack?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El pack será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              {/* Help Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">💡 Consejos</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
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