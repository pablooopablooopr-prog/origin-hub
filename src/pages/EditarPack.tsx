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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Package, Image as ImageIcon, Plus, X, Save, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EditarPack = () => {
  const { toast } = useToast();
  const [packName, setPackName] = useState("Pack de Quesos Artesanales");
  const [category, setCategory] = useState("gourmet");
  const [province, setProvince] = useState("asturias");
  const [price, setPrice] = useState("89.90");
  const [status, setStatus] = useState("activo");
  const [description, setDescription] = useState("Una selección de los mejores quesos artesanales de Asturias...");
  
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Queso Cabrales DOP",
      description: "Queso azul artesanal",
      producer: "Quesería Los Picos",
      origin: "Asturias",
      attributes: ["km0", "artesanal"]
    }
  ]);

  const addProduct = () => {
    setProducts([...products, {
      id: Date.now(),
      name: "",
      description: "",
      producer: "",
      origin: "",
      attributes: []
    }]);
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = () => {
    toast({
      title: "Pack actualizado",
      description: "Los cambios se han guardado correctamente.",
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-6">
            <h1 className="text-4xl font-serif text-primary mb-2">Editar Pack</h1>
            <p className="text-muted-foreground">Actualiza la información de tu pack</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Datos Generales */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Datos Generales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Pack</Label>
                    <Input 
                      id="name" 
                      value={packName}
                      onChange={(e) => setPackName(e.target.value)}
                      placeholder="Ej: Pack de Quesos Artesanales"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="raiz">Raíz</SelectItem>
                          <SelectItem value="esencia">Esencia</SelectItem>
                          <SelectItem value="gourmet">Gourmet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Provincia</Label>
                      <Select value={province} onValueChange={setProvince}>
                        <SelectTrigger id="province">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asturias">Asturias</SelectItem>
                          <SelectItem value="galicia">Galicia</SelectItem>
                          <SelectItem value="cantabria">Cantabria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (€)</Label>
                      <Input 
                        id="price" 
                        type="number" 
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="borrador">Borrador</SelectItem>
                          <SelectItem value="pausado">Pausado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Descripción */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Descripción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tu pack en detalle..."
                    rows={6}
                  />
                </CardContent>
              </Card>

              {/* Imágenes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Imágenes del Pack
                  </CardTitle>
                  <CardDescription>Sube entre 3 y 5 imágenes de alta calidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Subir imagen</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Productos Incluidos */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Productos Incluidos</CardTitle>
                      <CardDescription>Lista de productos que forman parte del pack</CardDescription>
                    </div>
                    <Button onClick={addProduct} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Añadir Producto
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {products.map((product, index) => (
                    <Card key={product.id} className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeProduct(product.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <CardContent className="pt-6 space-y-3">
                        <div className="space-y-2">
                          <Label>Nombre del Producto</Label>
                          <Input 
                            value={product.name}
                            placeholder="Ej: Queso Cabrales DOP"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Descripción</Label>
                          <Input 
                            value={product.description}
                            placeholder="Breve descripción"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Productor</Label>
                            <Input 
                              value={product.producer}
                              placeholder="Nombre del productor"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Origen</Label>
                            <Input 
                              value={product.origin}
                              placeholder="Región/Ciudad"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">km0</Badge>
                          <Badge variant="secondary">artesanal</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Detalles Técnicos */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalles Técnicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="packaging">Tipo de Empaque</Label>
                    <Input 
                      id="packaging" 
                      placeholder="Ej: Caja de madera reutilizable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping">Envío Estimado</Label>
                    <Input 
                      id="shipping" 
                      placeholder="Ej: 3-5 días laborables"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sustainability">Información de Sostenibilidad</Label>
                    <Textarea 
                      id="sustainability" 
                      placeholder="Describe las prácticas sostenibles del pack..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vista Previa */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vista Previa</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{packName || "Nombre del pack"}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="capitalize">{category}</Badge>
                      <Badge variant={status === "activo" ? "default" : "secondary"} className="capitalize">
                        {status}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary mb-2">{price ? `${price}€` : "—"}</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {description || "Sin descripción"}
                    </p>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button className="w-full" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Guardar Cambios
                  </Button>
                  <Button className="w-full" variant="outline" onClick={handleSaveDraft}>
                    <FileText className="w-4 h-4 mr-2" />
                    Guardar como Borrador
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-full" variant="destructive">
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
                        <AlertDialogAction onClick={handleDelete}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditarPack;