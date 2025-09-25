import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package, Star, Truck, Shield, Clock, Users, ShoppingCart, Heart, Share2, Award, Leaf, Gift } from "lucide-react";
import { getPackById } from "@/data/companyPacks";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const PackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  if (!id) {
    return <Navigate to="/packs" replace />;
  }

  const pack = getPackById(id);

  if (!pack) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Pack no encontrado</h1>
            <p className="text-muted-foreground mb-6">El pack que buscas no existe.</p>
            <Button onClick={() => window.history.back()}>Volver a Packs</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    const shareData = {
      title: pack.name,
      text: pack.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Enlace copiado",
          description: "El enlace ha sido copiado al portapapeles",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Añadido al carrito",
      description: `${pack.name} ha sido añadido a tu carrito`,
    });
  };

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'esencia':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'gourmet':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getFeaturedBadge = (featured: string | undefined) => {
    switch (featured) {
      case 'recommended':
        return <Badge className="bg-green-100 text-green-700 border-green-200">⭐ Recomendado por Origen</Badge>;
      case 'bestseller':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">📈 Más vendido</Badge>;
      case 'new':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">🆕 Novedad</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90 z-10" />
        <img 
          src={pack.image} 
          alt={pack.name}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className={getPackTypeColor(pack.type)}>
                  {pack.name}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {pack.region}
                </Badge>
                {getFeaturedBadge(pack.featured)}
                {pack.qualitySeal && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    <Award className="w-3 h-3 mr-1" />
                    Sello Origen
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {pack.name}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {pack.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {pack.products.length} productos
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {pack.rating} ({pack.reviews} valoraciones)
                </span>
                {pack.fastShipping && (
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4 text-green-600" />
                    Envío rápido
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={pack.company.logo} 
                    alt={pack.company.name}
                    className="w-12 h-12 object-contain rounded-lg border"
                  />
                  <div>
                    <h2 className="text-xl">{pack.company.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pack.company.location}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {pack.expandedDescription}
                </p>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle>Productos incluidos</CardTitle>
                <CardDescription>
                  Todos los productos están incluidos en el precio final de {pack.price}€
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {pack.products.map((product, index) => (
                    <div key={`${product.name}-${index}`} className="space-y-4">
                      <Card className="overflow-hidden border-l-4 border-l-primary/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                          {/* Product Image */}
                          <div className="relative">
                            <img 
                              src={product.companyLogo} 
                              alt={product.name}
                              className="w-full h-32 md:h-full object-cover bg-muted"
                            />
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="text-xs bg-background/90">
                                {product.company}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="md:col-span-3 p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-primary mb-1">
                                  {product.name}
                                </h4>
                                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                                  {product.description}
                                </p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <img 
                                    src={product.companyLogo} 
                                    alt={product.company}
                                    className="w-4 h-4 object-contain mr-2"
                                  />
                                  Producido por {product.company}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Added Value */}
            {pack.addedValue && pack.addedValue.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    Valor añadido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pack.addedValue.map((value, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Resumen del Pack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {pack.price}€
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Envío incluido
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Productos incluidos:</span>
                      <span className="font-medium">{pack.products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Región:</span>
                      <span className="font-medium">{pack.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Categoría:</span>
                      <span className="font-medium">{pack.category}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full"
                    size="lg"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Añadir al carrito
                  </Button>
                  
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir pack
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quality Features */}
            <Card>
              <CardHeader>
                <CardTitle>Garantías de calidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pack.qualitySeal && (
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="w-5 h-5 text-primary" />
                      <span>Sello Origen verificado</span>
                    </div>
                  )}
                  {pack.fastShipping && (
                    <div className="flex items-center gap-3 text-sm">
                      <Truck className="w-5 h-5 text-green-600" />
                      <span>Envío rápido garantizado</span>
                    </div>
                  )}
                  {pack.sustainablePackaging && (
                    <div className="flex items-center gap-3 text-sm">
                      <Leaf className="w-5 h-5 text-green-600" />
                      <span>Embalaje sostenible</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span>{pack.rating}/5 basado en {pack.reviews} valoraciones</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Loyalty Program */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">🎯 Programa de Fidelización</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <p className="text-muted-foreground">
                    Gana <strong>{Math.round(pack.price * 0.1)} puntos</strong> con esta compra
                  </p>
                  <div className="space-y-1">
                    <div>🚚 1000 puntos = Envío gratis</div>
                    <div>🧴 1500 puntos = Producto regalo</div>
                    <div>💸 2000 puntos = 10% descuento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PackDetail;