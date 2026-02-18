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
import { MapPin, Package, Star, Truck, Clock, Users, ShoppingCart, Share2, Award, Leaf, Gift, Plus, X, Save, Trash2, Image as ImageIcon, CheckCircle, Check, Box, Euro, Calendar, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ImageUpload } from "@/components/ImageUpload";

const toTitleCase = (str: string) => {
  return str.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
};

interface Product {
  id: number;
  name: string;
  description: string;
  company: string;
  attributes: string[];
}

const availableAttributes = [
  "Artesanal",
  "Km 0",
  "Producción local",
  "Ecológico",
  "Vegano",
  "Sin gluten",
  "Denominación de origen",
  "Temporada",
  "Edición limitada",
  "Tradicional"
];

const packTypeMaxPrices: { [key: string]: number } = {
  raiz: 35,
  esencia: 60,
  gourmet: 90
};

const EditarPack = () => {
  const { toast } = useToast();
  
  // Pack basic info
  const [packName, setPackName] = useState("");
  const [packType, setPackType] = useState("raiz");
  const [province, setProvince] = useState("");
  const [price, setPrice] = useState(packTypeMaxPrices["raiz"].toString());
  const [description, setDescription] = useState("");
  const [sustainabilityInfo, setSustainabilityInfo] = useState("");
  const [packImageUrl, setPackImageUrl] = useState("");
  
  // Pack features
  const [classification, setClassification] = useState("");
  const [fastShipping, setFastShipping] = useState(false);
  const [sustainablePackaging, setSustainablePackaging] = useState(false);
  const [productCount, setProductCount] = useState("");
  
  // Technical details
  const [packagingType, setPackagingType] = useState("Caja de cartón reciclado");
  const [estimatedShipping, setEstimatedShipping] = useState("2-3 días laborables");
  const [packOrigin, setPackOrigin] = useState("León");
  
  // Products
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "",
      description: "",
      company: "",
      attributes: []
    }
  ]);

  // Handle pack type change - update max price
  const handlePackTypeChange = (newType: string) => {
    setPackType(newType);
    setPrice(packTypeMaxPrices[newType].toString());
  };

  // Validate price doesn't exceed max for pack type
  const handlePriceChange = (newPrice: string) => {
    const numPrice = parseFloat(newPrice);
    const maxPrice = packTypeMaxPrices[packType];
    if (!isNaN(numPrice) && numPrice <= maxPrice) {
      setPrice(newPrice);
    } else if (newPrice === "") {
      setPrice("");
    }
  };

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
                <div className="flex flex-wrap items-end gap-3 mb-4">
                  <div>
                    <Label className="text-xs mb-1 block">Tipo de Pack *</Label>
                    <Select value={packType} onValueChange={handlePackTypeChange}>
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
                    
                  <div>
                    <Label className="text-xs mb-1 block">Provincia</Label>
                    <Input 
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="León"
                      className="w-32 h-8 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs mb-1 block">Clasificación</Label>
                    <Select value={classification} onValueChange={setClassification}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Sin clasificar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sin-clasificar">Sin clasificar</SelectItem>
                        <SelectItem value="mas-vendido">Más vendido</SelectItem>
                        <SelectItem value="nuevo">Nuevo</SelectItem>
                        <SelectItem value="recomendado">Recomendado</SelectItem>
                        <SelectItem value="edicion-limitada">Edición limitada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Nombre del Pack *</Label>
                  <Input 
                    value={packName}
                    onChange={(e) => setPackName(toTitleCase(e.target.value))}
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
                
                <div className="space-y-2">
                  <Label>Precio (€) * - Máximo {packTypeMaxPrices[packType]}€</Label>
                  <Input 
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    max={packTypeMaxPrices[packType]}
                    placeholder={packTypeMaxPrices[packType].toString()}
                    className="text-3xl font-bold"
                  />
                  <p className="text-xs text-muted-foreground">(envío incluido - Solo puedes bajar el precio desde {packTypeMaxPrices[packType]}€)</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Package className="w-4 h-4 text-primary" />
                    <Label className="text-xs">Productos:</Label>
                    <Input 
                      type="number"
                      value={productCount}
                      onChange={(e) => setProductCount(e.target.value)}
                      placeholder="8"
                      className="w-16 h-7 text-xs"
                    />
                  </div>
                  
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

              {/* Pack Image - Editable */}
              <div className="relative">
                <ImageUpload
                  bucket="pack-images"
                  currentImage={packImageUrl}
                  onImageUploaded={setPackImageUrl}
                  onImageRemoved={() => setPackImageUrl("")}
                  aspectRatio="square"
                  className="w-full max-h-72"
                />
              </div>
            </div>

            {/* Pack Description - Editable */}
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
                                  value={product.attributes[0] || ""}
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

              {/* Valor Añadido */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Valor Añadido
                  </CardTitle>
                  <CardDescription>
                    Describe prácticas sostenibles, empaque ecológico, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={sustainabilityInfo}
                    onChange={(e) => setSustainabilityInfo(e.target.value)}
                    placeholder="Ej: Empaque 100% reciclable&#10;Productos de km0&#10;Sin plásticos..."
                    rows={6}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">Cada línea será un punto separado en la tarjeta</p>
                </CardContent>
              </Card>
            </div>


            {/* Right Sidebar - Technical Details & Actions */}
            <div className="space-y-6">

              {/* Technical Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Detalles Técnicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-xs">Productos incluidos:</span>
                    <Input 
                      type="number"
                      value={productCount}
                      onChange={(e) => setProductCount(e.target.value)}
                      className="w-16 h-7 text-xs ml-auto"
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Euro className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-xs">Precio total:</span>
                    <span className="font-medium ml-auto">{price}€</span>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <Box className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
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
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs mb-1">Envío estimado:</p>
                      <Select value={estimatedShipping} onValueChange={setEstimatedShipping}>
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 días laborables">1-2 días laborables</SelectItem>
                          <SelectItem value="2-3 días laborables">2-3 días laborables</SelectItem>
                          <SelectItem value="3-5 días laborables">3-5 días laborables</SelectItem>
                          <SelectItem value="5-7 días laborables">5-7 días laborables</SelectItem>
                          <SelectItem value="Envío express 24h">Envío express 24h</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-muted-foreground text-xs">Origen:</span>
                    <Input 
                      value={packOrigin}
                      onChange={(e) => setPackOrigin(e.target.value)}
                      className="w-24 h-7 text-xs ml-auto"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Acciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={handlePublish} className="w-full flex items-center justify-center gap-2 bg-[#8B6F47] hover:bg-[#8B6F47]/90">
                    <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>Guardar Cambios</span>
                  </Button>
                  <Button onClick={handlePublish} variant="default" className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700">
                    <Bookmark className="w-4 h-4" />
                    <span>Publicar Pack</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar Pack</span>
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
                </CardContent>
              </Card>

              {/* Help Card */}
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