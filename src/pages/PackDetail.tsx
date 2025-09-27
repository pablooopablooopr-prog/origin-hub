import { useParams, Navigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Package, Star, Truck, Clock, Users, ShoppingCart, Share2, Award, Leaf, Gift, ChevronRight, ArrowLeft, MessageCircle, Eye, Heart, User, Calendar, CheckCircle } from "lucide-react";
import { getPackById, companyPacks } from "@/data/companyPacks";
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

  const mockReviews = [
    {
      id: 1,
      user: "María González",
      rating: 5,
      date: "15 Nov 2024",
      comment: "Excelente pack, productos de calidad superior. La cecina estaba espectacular y el queso increíble.",
      verified: true
    },
    {
      id: 2, 
      user: "Carlos Ruiz",
      rating: 4,
      date: "10 Nov 2024",
      comment: "Muy buena selección de productos locales. El envío llegó perfecto y rápido.",
      verified: true
    }
  ];

  const relatedPacks = companyPacks.filter(p => 
    p.id !== pack.id && 
    (p.autonomousCommunity === pack.autonomousCommunity || p.type === pack.type)
  ).slice(0, 3);

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <Header />
        
        {/* Breadcrumb Navigation */}
        <section className="bg-muted/30 border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Inicio</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/packs">Packs</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/packs">{pack.autonomousCommunity}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pack.name}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </section>
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-muted/20">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Pack Info */}
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="secondary" className={getPackTypeColor(pack.type)}>
                    {pack.type === 'raiz' ? 'Pack Raíz' : pack.type === 'esencia' ? 'Pack Esencia' : 'Pack Gourmet'}
                  </Badge>
                  {pack.seasonal && (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      <Calendar className="w-3 h-3 mr-1" />
                      Temporada
                    </Badge>
                  )}
                  <Badge variant="outline">
                    <MapPin className="w-3 h-3 mr-1" />
                    {pack.region}
                  </Badge>
                  {getFeaturedBadge(pack.featured)}
                  {pack.qualitySeal && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <Award className="w-3 h-3 mr-1" />
                          Sello Origen
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Este pack ha sido verificado por el equipo de Origen por su calidad, sostenibilidad y buena valoración</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold text-primary">
                  {pack.name} – {pack.autonomousCommunity}
                </h1>
                
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-bold text-primary">
                    {pack.price}€
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      (envío incluido)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${i < Math.floor(pack.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{pack.rating}</span>
                    <span className="text-sm text-muted-foreground">({pack.reviews} valoraciones)</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    {pack.products.length} productos incluidos
                  </span>
                  {pack.fastShipping && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Truck className="w-4 h-4" />
                      Envío rápido
                    </span>
                  )}
                  {pack.sustainablePackaging && (
                    <span className="flex items-center gap-1 text-green-600">
                      <Leaf className="w-4 h-4" />
                      Empaque sostenible
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 text-lg py-6"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Añadir al carrito
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    size="lg"
                    className="py-6"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartir
                  </Button>
                </div>

              </div>

              {/* Pack Image */}
              <div className="relative">
                <img 
                  src={pack.company.logo} 
                  alt={pack.name}
                  className="w-full h-96 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          
          {/* Pack Description */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Descripción del Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {pack.expandedDescription}
                </p>
              </CardContent>
            </Card>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Products Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Package className="w-6 h-6" />
                    Productos Incluidos
                  </CardTitle>
                  <CardDescription>
                    Cada producto ha sido seleccionado cuidadosamente por su calidad y representatividad regional
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {pack.products.map((product, index) => (
                      <Card key={`${product.name}-${index}`} className="overflow-hidden border-l-4 border-l-primary/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                          <div className="relative">
                            <img 
                              src={product.companyLogo} 
                              alt={product.name}
                              className="w-full h-32 md:h-full object-cover bg-muted"
                            />
                          </div>
                          <div className="md:col-span-3 p-6">
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <h4 className="text-lg font-semibold text-primary">
                                  {product.name}
                                </h4>
                                {product.seasonal && (
                                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-xs">
                                    Temporada
                                  </Badge>
                                )}
                                {product.limitedEdition && (
                                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                                    Edición Limitada
                                  </Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground leading-relaxed">
                                {product.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                  <img 
                                    src={product.companyLogo} 
                                    alt={product.company}
                                    className="w-5 h-5 object-contain rounded"
                                  />
                                  <span className="font-medium">{product.company}</span>
                                </div>
                                <div className="flex gap-2">
                                  <Badge variant="outline" className="text-xs">Artesanal</Badge>
                                  <Badge variant="outline" className="text-xs">{pack.region}</Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Added Value */}
              {pack.addedValue && pack.addedValue.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Gift className="w-6 h-6" />
                      Valor Añadido del Pack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {pack.addedValue.map((value, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Producer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="w-6 h-6" />
                    Información del Productor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <img 
                      src={pack.company.logo} 
                      alt={pack.company.name}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-primary/20"
                    />
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold">{pack.company.name}</h3>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {pack.company.location}
                        </p>
                      </div>
                      <p className="text-muted-foreground italic leading-relaxed">
                        "Elaboramos estos productos con el mismo mimo que pusieron nuestros abuelos. 
                        Cada elaboración conserva la esencia tradicional de {pack.region}."
                      </p>
                      <Button variant="outline">
                        Ver todos sus packs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageCircle className="w-6 h-6" />
                    Opiniones de otros clientes
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(pack.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{pack.rating}/5</span>
                      <span className="text-muted-foreground">({pack.reviews} valoraciones)</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {mockReviews.map((review) => (
                      <div key={review.id} className="border-l-4 border-l-primary/20 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verificado
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Calendar className="w-3 h-3" />
                              {review.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Ver todas las valoraciones
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">

              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Detalles Técnicos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Productos incluidos:</span>
                      <span className="font-medium">{pack.products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Precio total:</span>
                      <span className="font-medium">{pack.price}€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tipo de empaque:</span>
                      <span className="font-medium">Sostenible</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío estimado:</span>
                      <span className="font-medium">2-3 días</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Origen:</span>
                      <span className="font-medium">{pack.autonomousCommunity}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Gift Option */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Gift className="w-5 h-5" />
                    Opción de Regalo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full mb-4">
                    <Gift className="w-4 h-4 mr-2" />
                    Regalar este pack
                  </Button>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Personaliza la tarjeta de regalo</p>
                    <p>• Envío a otra dirección</p>
                    <p>• Tarjeta descargable</p>
                  </div>
                </CardContent>
              </Card>


              {/* Quality Guarantees */}
              <Card>
                <CardHeader>
                  <CardTitle>Garantías de Calidad</CardTitle>
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Packs */}
          {relatedPacks.length > 0 && (
            <section className="mt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Packs Relacionados</CardTitle>
                  <CardDescription>
                    Otros packs similares que podrían interesarte
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPacks.map((relatedPack) => (
                      <Card key={relatedPack.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={relatedPack.company.logo} 
                            alt={relatedPack.name}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <Badge 
                            variant="secondary" 
                            className={`absolute top-2 left-2 ${getPackTypeColor(relatedPack.type)}`}
                          >
                            {relatedPack.name}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{relatedPack.name} - {relatedPack.autonomousCommunity}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">{relatedPack.price}€</span>
                            <Button asChild size="sm">
                              <Link to={`/packs/${relatedPack.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                Ver más
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </main>
        
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default PackDetail;