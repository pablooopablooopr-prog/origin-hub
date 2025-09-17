import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, Share2, Download, Star, ExternalLink, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import InteractiveMap from "@/components/InteractiveMap";
import { getPackById } from "@/data/packs";

const PackDetail = () => {
  const { id } = useParams();
  const pack = getPackById(id!);

  if (!pack) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-4">Pack no encontrado</h1>
            <Link to="/packs">
              <Button>Volver a Packs</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    const icons = {
      'quesería': '🧀',
      'carnicería': '🥩', 
      'bodega': '🍷',
      'bar-tapas': '🍺',
      'panadería': '🥖',
      'restaurante': '🍽'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const shareContent = () => {
    const url = window.location.href;
    const text = `¡Descubre ${pack.title}! ${pack.shortDescription}`;
    
    if (navigator.share) {
      navigator.share({ title: pack.title, text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      // You would add a toast notification here
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-warm py-12">
          <div className="absolute inset-0 opacity-10">
            <img 
              src={pack.image} 
              alt={pack.region}
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/packs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Packs
                </Button>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold text-primary">
                  {pack.title}
                </h1>
                {pack.highlighted && (
                  <Badge variant="secondary" className="px-3 py-1">Destacado</Badge>
                )}
              </div>
              
              <p className="text-xl text-muted-foreground mb-6">
                {pack.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {pack.practicalInfo.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {pack.practicalInfo.recommendedPeople}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {pack.businesses} negocios locales
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Narrative */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-4">La Experiencia</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {pack.narrative}
                </p>
              </section>

              {/* Stops */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">Paradas de la Ruta</h2>
                <div className="space-y-8">
                  {pack.stops.map((stop, index) => (
                    <Card key={stop.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <span className="text-2xl">{getTypeIcon(stop.type)}</span>
                                {stop.name}
                              </CardTitle>
                              <CardDescription className="capitalize">
                                {stop.type.replace('-', ' ')}
                              </CardDescription>
                            </div>
                          </div>
                          {stop.website && (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={stop.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{stop.description}</p>
                        
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold mb-2">Qué puedes hacer:</h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm text-muted-foreground">
                            {stop.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-secondary">•</span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Address & Schedule */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h5 className="font-medium flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4" />
                              Dirección
                            </h5>
                            <p className="text-sm text-muted-foreground">{stop.address}</p>
                          </div>
                          <div>
                            <h5 className="font-medium flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4" />
                              Horarios
                            </h5>
                            <p className="text-sm text-muted-foreground">{stop.schedule}</p>
                          </div>
                        </div>

                        {/* Reviews */}
                        {stop.reviews && stop.reviews.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-3">Reseñas destacadas:</h5>
                            {stop.reviews.map((review, idx) => (
                              <div key={idx} className="border-l-4 border-secondary pl-4 mb-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating 
                                            ? 'fill-yellow-400 text-yellow-400' 
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm font-medium">{review.author}</span>
                                </div>
                                <p className="text-sm text-muted-foreground italic">
                                  "{review.text}"
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Interactive Map */}
              <section>
                <h2 className="text-2xl font-bold text-primary mb-6">Mapa de la Ruta</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="h-96 bg-muted/30 rounded-lg flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <MapPin className="w-12 h-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">
                          Mapa interactivo con todas las paradas
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Próximamente: navegación paso a paso
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Daily Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recomendaciones del Día</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pack.dailyRecommendations.map((rec, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-6 h-6 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Practical Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Práctica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Dificultad:</span>
                      <Badge 
                        variant={pack.practicalInfo.difficulty === 'Fácil' ? 'secondary' : 
                               pack.practicalInfo.difficulty === 'Moderado' ? 'default' : 'destructive'}
                        className="ml-2"
                      >
                        {pack.practicalInfo.difficulty}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Duración:</span>
                      <p className="text-muted-foreground">{pack.practicalInfo.duration}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h5 className="font-medium mb-2">Consejos locales:</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {pack.practicalInfo.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-secondary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={shareContent}
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartir Ruta
                </Button>
                
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Imprimir Ruta
                </Button>

                <Link to="/contacto" className="block">
                  <Button className="w-full" variant="secondary">
                    <Phone className="w-4 h-4 mr-2" />
                    Personalizar Ruta
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PackDetail;