import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Package, Star, Truck, Shield, Clock, Users, ShoppingCart, Heart, Share2 } from "lucide-react";
import { getPackById, Product } from "@/data/products";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PackRouteMap from "@/components/PackRouteMap";
import RegionalProductFilters from "@/components/RegionalProductFilters";
import ConsumptionStyleSelector from "@/components/ConsumptionStyleSelector";
import PackPracticalInfo from "@/components/PackPracticalInfo";

const PackDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [consumptionStyle, setConsumptionStyle] = useState<'cazador' | 'tribu' | 'sabio' | undefined>();
  const [additionalProducts, setAdditionalProducts] = useState<Product[]>([]);
  
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

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const getTotalPrice = () => {
    const baseProducts = pack.products.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + (product.price * quantity);
    }, 0);
    
    const additionalPrice = additionalProducts.reduce((total, product) => {
      const quantity = quantities[product.id] || 1;
      return total + (product.price * quantity);
    }, 0);
    
    return baseProducts + additionalPrice;
  };

  const handleAddProduct = (product: Product) => {
    setAdditionalProducts(prev => [...prev, product]);
    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al pack`,
    });
  };

  const allProducts = [...pack.products, ...additionalProducts];

  const handleShare = async () => {
    const shareData = {
      title: pack.title,
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
      description: `${pack.title} ha sido añadido a tu carrito`,
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90 z-10" />
        <img 
          src={pack.image} 
          alt={pack.title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {pack.category === 'regional' ? pack.region : 
                   pack.category === 'budget' ? `Hasta €${pack.priceRange.max}` :
                   'Temático'}
                </Badge>
                {pack.highlighted && (
                  <Badge variant="default" className="bg-secondary text-secondary-foreground">
                    ⭐ Destacado
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                {pack.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {pack.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {pack.totalProducts} productos
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-4 h-4" />
                  {pack.estimatedDelivery}
                </span>
                {pack.freeShippingFrom && (
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Envío gratis desde €{pack.freeShippingFrom}
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
          
          {/* Left Content - Experience */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Route Map */}
            <PackRouteMap region={pack.region} />
            
            {/* Experience Description */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  La Experiencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {pack.region === 'León' && 
                    "León es tierra de montaña y tradición, donde cada producto cuenta una historia centenaria. En esta ruta descubrirás los sabores que han alimentado a generaciones de leoneses: desde la cecina ahumada en las antiguas secaderos hasta el queso azul que madura en las cuevas de los Picos de Europa. Una experiencia que conecta directamente con los maestros artesanos que mantienen vivo el patrimonio gastronómico de Castilla y León."
                  }
                  {pack.region === 'Granada' && 
                    "Granada combina la herencia andalusí con la tradición artesana de montaña. Desde los olivares centenarios que producen el mejor AOVE Picual hasta las alturas de Trevélez donde el jamón se cura de forma natural. La Alpujarra aporta la dulzura de sus mieles de montaña, completando una experiencia gastronómica única entre el Mediterráneo y Sierra Nevada."
                  }
                  {pack.region === 'Galicia' && 
                    "Galicia es mar y tierra, donde las conservas artesanas conviven con quesos ahumados únicos y licores de hierbas que guardan secretos centenarios. Una experiencia que va del Atlántico a los valles interiores, descubriendo productores que mantienen vivas las tradiciones más auténticas del noroeste peninsular."
                  }
                  {pack.category === 'budget' &&
                    `El Pack ${pack.title} está diseñado para ${pack.budgetType === 'cazador' ? 'descubrir' : pack.budgetType === 'tribu' ? 'compartir' : 'disfrutar al máximo'} la gastronomía artesana española. ${pack.description}`
                  }
                  {pack.category === 'theme' &&
                    `Una selección especializada para los verdaderos amantes ${pack.themeType === 'quesos' ? 'del queso' : 'de la tradición'}. ${pack.description}`
                  }
                </p>

                {/* Consumption Style Selector for budget and theme packs */}
                {(pack.category === 'budget' || pack.category === 'theme') && (
                  <ConsumptionStyleSelector 
                    onStyleChange={setConsumptionStyle}
                    currentStyle={consumptionStyle}
                  />
                )}
              </CardContent>
            </Card>

            {/* Route Stops / Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">
                  {pack.category === 'regional' ? 'Paradas de la Ruta' : 'Productos incluidos'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {pack.category === 'regional' 
                    ? 'Cada parada ha sido seleccionada por su valor gastronómico y cultural único.'
                    : 'Cada producto ha sido cuidadosamente seleccionado por su calidad y autenticidad.'
                  }
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {allProducts.map((product, index) => (
                    <div key={product.id} className="space-y-4">
                      {pack.category === 'regional' && (
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <h3 className="text-xl font-semibold text-primary">{product.producer.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {product.category === 'carnes' ? 'Carnicería' : 
                               product.category === 'queso' ? 'Quesería' : 
                               product.category === 'conservas' ? 'Conservera' :
                               product.category === 'aceites' ? 'Almazara' :
                               'Productor'}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <Card className="overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                          {/* Product Image */}
                          <div className="relative">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-48 md:h-full object-cover"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                              {product.badges.map((badge) => (
                                <Badge 
                                  key={badge} 
                                  variant="secondary" 
                                  className="text-xs bg-background/90 text-foreground"
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="md:col-span-2 p-6">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-lg font-semibold text-primary mb-1">
                                  {product.name}
                                </h4>
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {product.producer.name} - {product.producer.location}
                                  {product.producer.distance && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      {product.producer.distance}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-primary">
                                  €{product.price.toFixed(2)}
                                </div>
                                {product.originalPrice && (
                                  <div className="text-sm text-muted-foreground line-through">
                                    €{product.originalPrice.toFixed(2)}
                                  </div>
                                )}
                                {product.weight && (
                                  <div className="text-xs text-muted-foreground">
                                    {product.weight}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                              {product.description}
                            </p>

                            {pack.category === 'regional' && (
                              <div className="mb-4">
                                <h5 className="font-medium mb-2">Qué puedes hacer:</h5>
                                <div className="grid grid-cols-2 gap-2">
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    • Degustación de {product.category === 'carnes' ? 'cecina recién cortada' : product.category === 'queso' ? 'queso recién curado' : 'productos selectos'}
                                  </span>
                                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                                    • Visita al {product.category === 'carnes' ? 'secadero' : product.category === 'queso' ? 'proceso de maduración' : 'taller artesano'}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {product.available ? (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    ✓ Disponible
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-red-600 border-red-600">
                                    ✗ Agotado
                                  </Badge>
                                )}
                                {product.stock && product.stock < 10 && (
                                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    ¡Últimas {product.stock} unidades!
                                  </Badge>
                                )}
                              </div>
                              
                              {pack.customizable && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">Cantidad:</span>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-8 h-8 p-0"
                                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) - 1)}
                                    >
                                      -
                                    </Button>
                                    <span className="w-8 text-center text-sm">
                                      {quantities[product.id] || 1}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-8 h-8 p-0"
                                      onClick={() => handleQuantityChange(product.id, (quantities[product.id] || 1) + 1)}
                                    >
                                      +
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Regional Product Filters - Only for regional packs */}
            {pack.category === 'regional' && (
              <RegionalProductFilters 
                region={pack.region}
                currentProducts={allProducts}
                onAddProduct={handleAddProduct}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Daily Recommendations - Only for regional packs */}
            {pack.category === 'regional' && (
              <Card>
                <CardHeader>
                  <CardTitle>Recomendaciones del Día</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {pack.region === 'León' ? 'Comienza temprano (9:00) en Cecinas Pablo para ver el proceso de elaboración matutino' :
                         pack.region === 'Granada' ? 'Visita el olivar al amanecer para la mejor experiencia fotográfica' :
                         'Consulta las mareas para la mejor experiencia en las conserveras'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {pack.region === 'León' ? 'Llega a la quesería entre 11:00-12:00 para ver el queso recién desmoldado' :
                         pack.region === 'Granada' ? 'Reserva la visita a Trevélez con antelación (temporada alta muy demandada)' :
                         'Reserva con antelación en temporada alta (julio-agosto)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {pack.region === 'León' ? 'Reserva mesa en Casa Pepe para almorzar el botillo caliente (13:30h ideal)' :
                         pack.region === 'Granada' ? 'Lleva ropa cómoda y abrigo (las cuevas están a 8°C)' :
                         'Lleva chubasquero (el clima gallego es impredecible)'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        {pack.region === 'León' ? 'Lleva una cesta térmica para conservar los productos comprados' :
                         pack.region === 'Granada' ? 'Pregunta por descuentos grupales en compras superiores a €150' :
                         'Pregunta por catas guiadas del licor de hierbas'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Practical Information */}
            <PackPracticalInfo pack={pack} onShare={handleShare} />

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Resumen del Pack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allProducts.map((product) => (
                    <div key={product.id} className="flex justify-between text-sm">
                      <span className="flex-1 truncate">
                        {product.name} 
                        {pack.customizable && quantities[product.id] > 1 && (
                          <span className="text-muted-foreground"> x{quantities[product.id] || 1}</span>
                        )}
                      </span>
                      <span className="font-medium">
                        €{(product.price * (quantities[product.id] || 1)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  {pack.freeShippingFrom && getTotalPrice() >= pack.freeShippingFrom && (
                    <div className="text-green-600 text-sm flex items-center gap-1">
                      <Truck className="w-4 h-4" />
                      ¡Envío gratuito incluido!
                    </div>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Añadir al Carrito
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-1" />
                      Favoritos
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-1" />
                      Compartir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Producer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Nuestros Productores</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground mb-3">
                  Trabajamos directamente con artesanos locales para garantizar la máxima calidad y autenticidad.
                </p>
                {allProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 p-2 bg-muted/20 rounded">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div>
                      <div className="font-medium">{product.producer.name}</div>
                      <div className="text-muted-foreground">{product.producer.location}</div>
                    </div>
                  </div>
                ))}
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