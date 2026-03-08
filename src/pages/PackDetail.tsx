import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MapPin, Package, Star, Truck, Clock, Users, ShoppingCart, Share2, Award, Leaf, Gift, ChevronRight, ArrowLeft, MessageCircle, Eye, Heart, User, Calendar, CheckCircle, Loader2 } from "lucide-react";
import { getPackById, companyPacks } from "@/data/companyPacks";
import { useToast } from "@/hooks/use-toast";
import { usePackFavorites } from "@/hooks/usePackFavorites";
import { usePackAnalytics } from "@/hooks/usePackAnalytics";
import { usePackReviews } from "@/hooks/usePackReviews";
import { useProducerCarts, type Company } from "@/hooks/useProducerCarts";
import ProducerConflictModal from "@/components/ProducerConflictModal";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const PackDetail = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const param = slug ?? id ?? '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const [relatedPacksIndex, setRelatedPacksIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [pack, setPack] = useState<any | null>(null);
  const [packLoading, setPackLoading] = useState(true);
  
  // Producer conflict modal state
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState<{
    currentCompany: Company | null;
    newCompany: Company | null;
    packId: string;
  }>({ currentCompany: null, newCompany: null, packId: "" });
  
  // Hooks for Supabase integration
  const { isFavorite, loading: favoriteLoading, toggleFavorite } = usePackFavorites(param);
  const { trackClick } = usePackAnalytics(param);
  const { reviews, loading: reviewsLoading, averageRating, submitReview } = usePackReviews(param);
  const { addToCart, isLoggedIn } = useProducerCarts();

  useEffect(() => {
    const loadPack = async () => {
      if (!param) {
        setPackLoading(false);
        return;
      }

      try {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isUuid = uuidRegex.test(param);

        let query = supabase
          .from("company_packs")
          .select(`
            id,
            slug,
            title,
            price,
            tags,
            template_id,
            status,
            is_active,
            is_published,
            shipping_policy,
            sustainability_info,
            company_id,
            companies:companies(business_name, address, logo_url)
          `)
          .eq("status", "published")
          .eq("is_active", true)
          .eq("is_published", true);

        query = isUuid ? query.eq("id", param) : query.eq("slug", param);

        const { data, error } = await query.maybeSingle();

        if (error || !data) {
          setPack(null);
          return;
        }

        const inferredType = (() => {
          const title = (data.title || "").toLowerCase();
          if (title.includes("microselección") || title.includes("microseleccion") || title.includes("micro")) return "micro";
          if (title.includes("raíz") || title.includes("raiz")) return "raiz";
          if (title.includes("gourmet")) return "gourmet";
          if (title.includes("esencia")) return "esencia";
          return "esencia";
        })();

        const fallbackByType = companyPacks.find((p) => p.type === inferredType) || companyPacks[0];

        setPack({
          ...fallbackByType,
          id: data.id,
          name: data.title || fallbackByType.name,
          description: fallbackByType.description,
          expandedDescription: fallbackByType.expandedDescription,
          price: data.price ?? fallbackByType.price,
          type: inferredType,
          company: {
            ...fallbackByType.company,
            name: (data.companies as any)?.business_name || fallbackByType.company.name,
            location: (data.companies as any)?.address || fallbackByType.company.location,
            logo: (data.companies as any)?.logo_url || fallbackByType.company.logo,
          },
          addedValue: data.tags || fallbackByType.addedValue,
        });
      } catch {
        setPack(null);
      } finally {
        setPackLoading(false);
      }
    };

    loadPack();
  }, [param]);

  
  if (!param) {
    return <Navigate to="/packs" replace />;
  }

  if (packLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

  const handleShare = async (platform?: 'whatsapp' | 'twitter' | 'facebook' | 'email') => {
    trackClick();
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${pack.name} - ${pack.description}`);
    
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent(pack.name)}&body=${text}%20${url}`;
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: pack.name,
          text: pack.description,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to WhatsApp
      window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
    }
  };

  const handleFavorite = () => {
    if (!isLoggedIn) {
      navigate('/customer-auth');
      return;
    }
    toggleFavorite();
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate('/customer-auth');
      return;
    }
    
    setAddingToCart(true);
    trackClick();
    
    // Get pack UUID from slug
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const isUuid = uuidRegex.test(param);

    let addToCartQuery = supabase
      .from("company_packs")
      .select("id")
      .eq("status", "published")
      .eq("is_active", true)
      .eq("is_published", true);

    addToCartQuery = isUuid ? addToCartQuery.eq("id", param) : addToCartQuery.eq("slug", param);

    const { data: packData } = await addToCartQuery.maybeSingle();
    
    if (packData) {
      const result = await addToCart(packData.id);
      
      if (result.success) {
        toast({
          title: "Añadido al carrito",
          description: `${pack.name} ha sido añadido a tu carrito`,
        });
      } else if (result.conflict) {
        // Show conflict modal
        setConflictData({
          currentCompany: result.conflict.currentCompany,
          newCompany: result.conflict.newCompany,
          packId: packData.id
        });
        setShowConflictModal(true);
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo añadir al carrito",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Pack no encontrado",
        variant: "destructive"
      });
    }
    
    setAddingToCart(false);
  };

  const handleCreateNewCart = async () => {
    setShowConflictModal(false);
    if (conflictData.packId) {
      const result = await addToCart(conflictData.packId, undefined, 1, true);
      if (result.success) {
        toast({
          title: "Añadido al carrito",
          description: `${pack.name} ha sido añadido a un nuevo carrito`,
        });
      }
    }
  };

  const handleKeepCurrent = () => {
    setShowConflictModal(false);
    toast({
      title: "Carrito mantenido",
      description: `Puedes seguir comprando a ${conflictData.currentCompany?.business_name}`,
    });
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.name || reviewForm.rating === 0 || !reviewForm.comment) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa tu nombre, puntuación y comentario",
        variant: "destructive"
      });
      return;
    }

    setSubmittingReview(true);
    const success = await submitReview(reviewForm.name, reviewForm.rating, reviewForm.comment);
    setSubmittingReview(false);

    if (success) {
      setReviewForm({ name: "", rating: 0, comment: "" });
      setShowReviewForm(false);
    }
  };

  const formatReviewDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'micro':
        return 'bg-pack-micro';
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
      case 'micro':
        return 'hsl(220, 15%, 93%)';
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
      case 'micro':
        return 'hsl(220, 15%, 70%)';
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
      case 'micro':
        return 'Microselección';
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

  // Combine real reviews with fallback if no reviews exist
  const displayReviews = reviews.length > 0 ? reviews : [];
  const displayRating = averageRating > 0 ? averageRating : pack.rating;

  const relatedPacks = companyPacks.filter(p => 
    p.id !== pack.id && 
    (p.autonomousCommunity === pack.autonomousCommunity || p.type === pack.type)
  );

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
                    onClick={() => handleShare('whatsapp')}
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
                    className={`backdrop-blur ${isFavorite ? 'bg-red-50 border-red-200' : 'bg-background/80'}`}
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
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

              {/* Producer Information - Matches mini-hero color */}
              <Card className="overflow-hidden" style={{ backgroundColor: getMiniHeroColor(pack.type) }}>
                <CardContent className="p-5">
                  {/* Title at top */}
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-white" />
                    <h3 className="text-base font-semibold text-white">Información del Productor</h3>
                  </div>

                  {/* Company name and location - directly below title */}
                  <div className="flex items-center gap-3 mb-4">
                    <Link 
                      to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:underline"
                    >
                      <h4 className="text-lg font-bold text-white">{pack.company.name}</h4>
                    </Link>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-white/90" />
                      <span className="text-sm font-medium text-white/90">{pack.company.location}</span>
                    </div>
                  </div>

                  {/* Image and quote side by side */}
                  <div className="flex gap-4 mb-4">
                    {/* Company Image */}
                    <Link 
                      to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:opacity-90 transition-opacity flex-shrink-0"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/40 shadow-lg">
                        <img 
                          src={pack.company.logo} 
                          alt={pack.company.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                    
                    {/* Quote with decorative border */}
                    <div className="relative flex-1">
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white/80 shadow-sm"
                        style={{
                          clipPath: 'polygon(0 0, 100% 2%, 100% 98%, 0 100%)',
                          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                        }}
                      />
                      <blockquote className="pl-4 py-2 bg-white/20 backdrop-blur-sm rounded-r border-r border-white/30 h-full flex items-center">
                        <p className="text-sm text-white leading-relaxed italic">
                          "Elaboramos estos productos con el mismo mimo que pusieron nuestros abuelos. 
                          Cada elaboración conserva la esencia tradicional de {pack.region}."
                        </p>
                      </blockquote>
                    </div>
                  </div>

                  {/* Button */}
                  <Button asChild variant="secondary" size="sm" className="w-full bg-white/90 hover:bg-white font-semibold" style={{ color: getMiniHeroColor(pack.type) }}>
                    <Link to={`/negocio/${pack.company.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Ver todos sus packs
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Customer Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <MessageCircle className="w-6 h-6" />
                    Opiniones de otros clientes
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < Math.floor(displayRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{displayRating}/5</span>
                      <span className="text-muted-foreground">
                        ({displayReviews.length || pack.reviews} valoraciones)
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        if (!isLoggedIn) {
                          navigate('/customer-auth');
                          return;
                        }
                        setShowReviewForm(!showReviewForm);
                      }}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Escribir valoración
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Review Form */}
                    {showReviewForm && (
                      <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardContent className="pt-4 space-y-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tu nombre</label>
                            <Input 
                              value={reviewForm.name}
                              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                              placeholder="Ej: María G."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Puntuación</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`w-7 h-7 transition-colors ${
                                      star <= reviewForm.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 hover:text-yellow-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Tu comentario</label>
                            <Textarea 
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                              placeholder="Cuéntanos qué te pareció este pack..."
                              className="min-h-[80px]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleSubmitReview} disabled={submittingReview}>
                              {submittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Enviar valoración
                            </Button>
                            <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                              Cancelar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Loading Reviews */}
                    {reviewsLoading && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      </div>
                    )}

                    {/* Reviews List */}
                    {!reviewsLoading && displayReviews.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                        <p>Aún no hay valoraciones. ¡Sé el primero en compartir tu experiencia!</p>
                      </div>
                    )}

                    {displayReviews.map((review) => (
                      <div key={review.id} className="border-l-4 border-l-primary/20 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">{review.customer_name}</span>
                              {review.customer_id && (
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
                              {formatReviewDate(review.created_at)}
                            </span>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
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

              {/* Added Value - Moved to sidebar */}
              {pack.addedValue && pack.addedValue.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Valor Añadido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pack.addedValue.map((value, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                          <span className="text-sm font-medium leading-snug">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

          {/* Related Packs with Navigation */}
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
                  <div className="relative px-16">
                    <div className="overflow-hidden">
                      <div 
                        className="flex gap-6 transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${relatedPacksIndex * (100 / 3)}%)` }}
                      >
                        {relatedPacks.map((relatedPack) => {
                          const lighterColor = relatedPack.type === 'raiz' 
                            ? 'bg-[#D4C5A0]' 
                            : relatedPack.type === 'esencia' 
                            ? 'bg-[#C8D9B8]' 
                            : 'bg-[#D9B89A]';
                          
                          return (
                            <Link
                              key={relatedPack.id}
                              to={`/packs/${relatedPack.id}`}
                              className="min-w-[calc(33.333%-1rem)] flex-shrink-0"
                            >
                              <Card className="hover:shadow-xl transition-all duration-300 h-full">
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
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Navigation Arrows - Outside cards, always visible */}
                    <>
                      <Button
                        variant="default"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 shadow-2xl rounded-full w-14 h-14 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-10 border-4 border-background"
                        onClick={() => setRelatedPacksIndex(Math.max(0, relatedPacksIndex - 1))}
                        disabled={relatedPacksIndex === 0}
                      >
                        <ChevronRight className="w-7 h-7 text-white rotate-180" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 shadow-2xl rounded-full w-14 h-14 disabled:opacity-20 disabled:cursor-not-allowed transition-all z-10 border-4 border-background"
                        onClick={() => setRelatedPacksIndex(Math.min(relatedPacks.length - 3, relatedPacksIndex + 1))}
                        disabled={relatedPacksIndex >= relatedPacks.length - 3}
                      >
                        <ChevronRight className="w-7 h-7 text-white" />
                      </Button>
                    </>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </main>
        
        {/* Producer Conflict Modal */}
        <ProducerConflictModal
          open={showConflictModal}
          onOpenChange={setShowConflictModal}
          currentCompany={conflictData.currentCompany}
          newCompany={conflictData.newCompany}
          onCreateNewCart={handleCreateNewCart}
          onKeepCurrent={handleKeepCurrent}
        />
        
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default PackDetail;