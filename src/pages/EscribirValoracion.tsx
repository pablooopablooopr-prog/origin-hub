import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Heart, MapPin, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EscribirValoracion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    businessName: "",
    location: "",
    category: "",
    userName: "",
    selectedRating: "",
    comment: ""
  });

  const ratingTypes = [
    "Auténtico de verdad",
    "Lo recomendaría a mi abuela", 
    "Me hizo reconectar con mi alimentación",
    "Un lugar para volver"
  ];

  const categories = [
    "Lácteos", "Panadería", "Frutas", "Conservas", "Embutidos", 
    "Aceites", "Vinos", "Miel", "Pescado", "Carne", "Otros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessName || !formData.location || !formData.userName || !formData.selectedRating || !formData.comment) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    // For now, just show success message and redirect
    toast({
      title: "¡Valoración enviada!",
      description: "Gracias por compartir tu experiencia auténtica.",
    });
    
    // Redirect to valoraciones page after 2 seconds
    setTimeout(() => {
      navigate('/valoraciones');
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 md:w-10 md:h-10 mr-3 text-secondary" />
              <span>Escribe tu Valoraci</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>n</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comparte tu experiencia auténtica y ayuda a otros a descubrir negocios 
              que mantienen viva nuestra tradición gastronómica.
            </p>
          </div>

          {/* Form */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Heart className="w-6 h-6 mr-2 text-secondary" />
                Cuéntanos tu experiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Nombre del negocio *
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="Ej: Quesería La Antigua"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Ubicación *
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Ej: Casar de Cáceres"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Categoría</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={formData.category === category ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/10 transition-colors"
                        onClick={() => setFormData({...formData, category})}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Your Name */}
                <div className="space-y-2">
                  <Label htmlFor="userName" className="text-sm font-medium">
                    Tu nombre *
                  </Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({...formData, userName: e.target.value})}
                    placeholder="Ej: María J."
                    required
                  />
                </div>

                {/* Rating Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    ¿Cómo definirías tu experiencia? *
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ratingTypes.map((rating) => (
                      <div
                        key={rating}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.selectedRating === rating
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setFormData({...formData, selectedRating: rating})}
                      >
                        <div className="flex items-center space-x-2">
                          <Heart className={`w-4 h-4 ${
                            formData.selectedRating === rating ? "text-primary" : "text-muted-foreground"
                          }`} />
                          <span className={`text-sm font-medium ${
                            formData.selectedRating === rating ? "text-primary" : "text-foreground"
                          }`}>
                            {rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Cuéntanos más sobre tu experiencia *
                  </Label>
                  <Textarea
                    id="comment"
                    value={formData.comment}
                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    placeholder="Describe qué te llamó la atención, cómo fue el trato, la calidad del producto, etc."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-6">
                  <Button type="submit" size="lg" className="shadow-earth">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Publicar valoración
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <div className="mt-12 p-6 bg-gradient-moss/10 rounded-lg border border-secondary/20">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Consejos para una buena valoración
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sé específico sobre lo que más te gustó del negocio</li>
              <li>• Menciona detalles sobre la calidad, el trato o la autenticidad</li>
              <li>• Ayuda a otros explicando qué hace especial a este lugar</li>
              <li>• Mantén un tono respetuoso y constructivo</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EscribirValoracion;