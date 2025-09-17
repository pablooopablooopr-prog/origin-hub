import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Clock, Phone, Globe, Share2, Heart, Camera } from "lucide-react";
import { useParams, Navigate } from "react-router-dom";

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock business data - in a real app this would come from an API
  const business = {
    id: "1",
    name: "Panadería El Horno",
    category: "🥖 Panadería tradicional",
    description: "Pan artesano con masa madre desde 1952. Tres generaciones manteniendo viva la tradición del pan auténtico.",
    fullDescription: "Fundada en 1952 por Don Antonio, esta panadería familiar ha mantenido los métodos tradicionales de elaboración durante tres generaciones. Utilizamos masa madre natural con más de 20 años de antigüedad, harina ecológica de molinos locales y horneamos en horno de leña cada madrugada. Nuestro compromiso es ofrecer pan real, sin aditivos ni conservantes, como se hacía antes.",
    address: "Calle del Pan, 15, 28001 Madrid",
    phone: "+34 91 123 45 67",
    website: "www.panaderiaelhorno.es",
    hours: "Lunes a Sábado: 7:00 - 14:00 | Domingo: 8:00 - 13:00",
    rating: "Excelente",
    stars: 4.8,
    reviews: 127,
    tags: ["Sin aditivos", "Horno de leña", "Local", "Masa madre", "Ecológico"],
    images: [
      "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
      "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
    ],
    specialties: [
      "Pan rústico de masa madre",
      "Hogaza de centeno",
      "Rosquillas tradicionales",
      "Pan de nueces"
    ],
    experiences: [
      {
        title: "Visita al obrador",
        description: "Conoce el proceso de elaboración del pan tradicional",
        duration: "30 min",
        price: "Gratuito",
        schedule: "Lunes a Viernes 9:00 - 10:00"
      },
      {
        title: "Degustación con el maestro panadero",
        description: "Prueba panes recién horneados con explicación de ingredientes",
        duration: "45 min", 
        price: "15€",
        schedule: "Sábados 11:00"
      }
    ],
    testimonials: [
      {
        author: "María González",
        text: "El mejor pan de Madrid. La diferencia se nota desde el primer bocado.",
        rating: 5
      },
      {
        author: "Carlos Ruiz",
        text: "Tradición familiar que se mantiene intacta. Un tesoro en el barrio.",
        rating: 5
      }
    ]
  };

  if (!business) {
    return <Navigate to="/mi-zona" replace />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-warm overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{business.name}</h1>
              <p className="text-xl opacity-90">{business.category}</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-secondary" />
                    Sobre este lugar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {business.fullDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle>Especialidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {business.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span className="text-muted-foreground">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experiences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-secondary" />
                    Experiencias disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.experiences.map((experience, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-primary">{experience.title}</h3>
                        <Badge variant="secondary">{experience.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{experience.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>⏱️ {experience.duration}</span>
                        <span>📅 {experience.schedule}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader>
                  <CardTitle>Reseñas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {business.testimonials.map((testimonial, index) => (
                    <div key={index} className="border-l-4 border-secondary pl-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-secondary fill-current" />
                          ))}
                        </div>
                        <span className="font-medium text-sm">{testimonial.author}</span>
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Información
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Dirección</p>
                      <p className="text-sm text-muted-foreground">{business.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Horarios</p>
                      <p className="text-sm text-muted-foreground">{business.hours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Teléfono</p>
                      <p className="text-sm text-muted-foreground">{business.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-secondary flex-shrink-0" />
                    <div>
                      <p className="font-medium">Web</p>
                      <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" 
                         className="text-sm text-secondary hover:underline">
                        {business.website}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Valoración</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-secondary fill-current" />
                        <span className="font-bold">{business.stars}</span>
                        <span className="text-sm text-muted-foreground">({business.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="font-medium mb-2">Características</p>
                    <div className="flex flex-wrap gap-1">
                      {business.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full" size="lg">
                  <MapPin className="w-4 h-4 mr-2" />
                  Cómo llegar
                </Button>
                <Button variant="secondary" className="w-full" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar ahora
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  Reservar experiencia
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessDetail;