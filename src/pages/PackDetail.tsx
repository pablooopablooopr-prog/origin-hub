import { useParams, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
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

  // Auto scroll to top when pack changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  
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

  const handleShare = () => {
    window.location.href = '/mi-cuenta';
  };

  const handleFavorite = () => {
    window.location.href = '/mi-cuenta';
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
        return 'bg-pack-raiz';
      case 'esencia':
        return 'bg-pack-esencia';
      case 'gourmet':
        return 'bg-pack-gourmet';
      default:
        return 'bg-background';
    }
  };

  const getPackTypeDarkColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'hsl(40, 43%, 93%)'; // Pack Raíz - arena suave (color original de tarjeta)
      case 'esencia':
        return 'hsl(93, 36%, 91%)'; // Pack Esencia - verde suave natural (color original de tarjeta)
      case 'gourmet':
        return 'hsl(23, 34%, 77%)'; // Pack Gourmet - arcilla profunda natural (color original de tarjeta)
      default:
        return 'hsl(var(--background))';
    }
  };

  const getMiniHeroColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'hsl(30, 25%, 70%)'; // Pack Raíz - marrón tierra más oscuro para mini-hero
      case 'esencia':
        return 'hsl(100, 35%, 75%)'; // Pack Esencia - verde más intenso para mini-hero
      case 'gourmet':
        return 'hsl(23, 34%, 65%)'; // Pack Gourmet - arcilla más oscura para mini-hero
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

  const getPackSpecificName = (fullName: string) => {
    return fullName.replace(/^Pack (Raíz|Esencia|Gourmet) - /, '');
  };

  const getFeaturedBadge = (featured: string | undefined) => {
    switch (featured) {
      case 'recommended':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Recomendado por Origen</Badge>;
      case 'bestseller':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Más vendido</Badge>;
      case 'new':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Novedad</Badge>;
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
      <div className="min-h-screen bg-[#FAF6F0]">
        <Header />
        
        {/* Breadcrumb Navigation - Mini-hero con altura reducida y color por tipo de pack */}
        <section style={{ backgroundColor: getMiniHeroColor(pack.type) }} className="border-b">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList className="text-white">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="text-white hover:text-white/80">Inicio</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/70" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/packs" className="text-white hover:text-white/80">Packs</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/70" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/packs" className="text-white hover:text-white/80">{pack.autonomousCommunity}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/70" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white">{getPackTypeName(pack.type)} - {getPackSpecificName(pack.name)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.history.back()}
                className="bg-white/90 hover:bg-white border-white/20"
                style={{ color: getMiniHeroColor(pack.type) }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </section>
        
        {/* Hero Section - Tarjeta principal con color por categoría */}
        <section className="w-full" style={{ backgroundColor: getPackTypeDarkColor(pack.type) }}>
          <div className="container mx-auto px-6 py-6 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Pack Info */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Link to={`/packs?packType=${pack.type}`}>
                    <Badge variant="secondary" className="bg-[#8B6F47] text-white border-[#8B6F47]/30 cursor-pointer hover:brightness-110 transition-all">
                      {getPackTypeName(pack.type)}
                    </Badge>
                  </Link>
                  {pack.seasonal && (
                    <Badge variant="outline" className="bg-[#8B6F47] text-white border-[#8B6F47]/30">
                      Temporada
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs bg-[#8B6F47] text-white border-[#8B6F47]/30">
                    {pack.region}
                  </Badge>
                  {getFeaturedBadge(pack.featured)}
                  {pack.qualitySeal && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-[#8B6F47] text-white border-[#8B6F47]/30">
                          Sello Origen
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Este pack ha sido verificado por el equipo de Origen por su calidad, sostenibilidad y buena valoración</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
                
                <Link to={`/packs?packType=${pack.type}`}>
                  <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 cursor-pointer hover:underline transition-all">
                    {getPackTypeName(pack.type)}
                  </h1>
                </Link>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">
                  <Link 
                    to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="hover:underline hover:text-primary transition-colors"
                  >
                    {getPackSpecificName(pack.name)}
                  </Link>
                  {' – '}
                  <span className="text-2xl md:text-3xl font-normal text-muted-foreground">{pack.autonomousCommunity}</span>
                </h2>
                
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
                    <Link to="/valoraciones" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      ({pack.reviews} valoraciones)
                    </Link>
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
                    className="py-6 border-2"
                    style={{ borderColor: '#8B6F47' }}
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Compartir
                  </Button>
                </div>

              </div>

              {/* Pack Image - Reduced height for better fit */}
              <div className="relative">
                <img 
                  src={pack.company.logo} 
                  alt={pack.name}
                  className="w-full h-72 object-cover rounded-xl shadow-2xl"
                />
                <div className="absolute top-4 right-4">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-background/80 backdrop-blur"
                    onClick={handleFavorite}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Pack Description - Full width below hero */}
            <Card className="mt-4">
              <CardHeader className="pb-0 pt-3">
                <CardTitle className="text-lg">Descripción del Pack</CardTitle>
              </CardHeader>
              <CardContent className="pb-3 pt-1">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {pack.expandedDescription}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Content - 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Products Included - Reducido padding */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Package className="w-6 h-6" />
                    Productos Incluidos
                  </CardTitle>
                  <CardDescription>
                    Cada producto ha sido seleccionado cuidadosamente por su calidad y representatividad regional
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-5">
                  <div className="space-y-5">
                    {pack.products.map((product, index) => (
                      <Card key={`${product.name}-${index}`} className="overflow-hidden border-l-4 border-l-primary/30">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                          <Link 
                            to={`/negocio/${product.company.toLowerCase().replace(/\s+/g, '-')}`}
                            className="relative cursor-pointer hover:opacity-80 transition-opacity"
                          >
                            <img 
                              src={product.companyLogo} 
                              alt={product.name}
                              className="w-full h-32 md:h-full object-cover bg-muted"
                            />
                          </Link>
                          <div className="md:col-span-3 p-5">
                            <div className="space-y-2.5">
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
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Link 
                                      to={`/negocio/${product.company.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                      <img 
                                        src={product.companyLogo} 
                                        alt={product.company}
                                        className="w-5 h-5 object-contain rounded"
                                      />
                                    </Link>
                                    <Link 
                                      to={`/negocio/${product.company.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="font-medium hover:underline hover:text-primary transition-colors"
                                    >
                                      {product.company}
                                    </Link>
                                  </div>
                                     <Link 
                                       to={`/negocio/${product.company.toLowerCase().replace(/\s+/g, '-')}`}
                                       className="text-xs text-primary hover:underline flex items-center gap-1"
                                     >
                                       Ver todos sus packs →
                                     </Link>
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

              {/* Producer Information - Más compacto */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Información del Productor
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-start gap-4">
                    <Link 
                      to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <img 
                        src={pack.company.logo} 
                        alt={pack.company.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-primary/20"
                      />
                    </Link>
                    <div className="flex-1 space-y-2">
                      <div>
                        <Link 
                          to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="hover:underline"
                        >
                          <h3 className="text-lg font-semibold">{pack.company.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {pack.company.location}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        "Elaboramos estos productos con el mismo mimo que pusieron nuestros abuelos. 
                        Cada elaboración conserva la esencia tradicional de {pack.region}."
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          Ver todos sus packs →
                        </Link>
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
                      <Link to="/valoraciones" className="text-muted-foreground hover:text-primary transition-colors">
                        ({pack.reviews} valoraciones)
                      </Link>
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
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/valoraciones">
                        Ver todas las valoraciones
                      </Link>
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
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Gift className="w-4 h-4" />
                    Opción de Regalo
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <Button asChild variant="outline" className="w-full mb-3">
                    <Link to="/carrito">
                      <Gift className="w-4 h-4 mr-2" />
                      Regalar este pack
                    </Link>
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

          {/* Related Packs - Nombres más pequeños y hover con sombra */}
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
                    {relatedPacks.map((relatedPack) => {
                      const lighterColor = relatedPack.type === 'raiz' 
                        ? 'bg-[#D4C5A0]' 
                        : relatedPack.type === 'esencia' 
                        ? 'bg-[#C8D9B8]' 
                        : 'bg-[#D9B89A]';
                      
                      return (
                        <Card key={relatedPack.id} className="hover:shadow-xl transition-all duration-300">
                          <div className="relative">
                            <img 
                              src={relatedPack.company.logo} 
                              alt={relatedPack.name}
                              className="w-full h-32 object-cover rounded-t-lg"
                            />
                            <Badge 
                              variant="secondary" 
                              className={`absolute top-2 left-2 ${lighterColor}`}
                            >
                              {getPackTypeName(relatedPack.type)}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm mb-2">{relatedPack.name} - {relatedPack.autonomousCommunity}</h3>
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
                      );
                    })}
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