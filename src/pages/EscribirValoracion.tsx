import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Heart, Star, Loader2, LogIn, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Company {
  id: string;
  business_name: string;
  address: string | null;
}

const EscribirValoracion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    companyId: "",
    userName: "",
    rating: 0,
    title: "",
    comment: ""
  });

  useEffect(() => {
    const initialize = async () => {
      // Fetch approved companies
      const { data: companiesData } = await supabase
        .from("companies")
        .select("id, business_name, address")
        .eq("status", "approved")
        .order("business_name");

      if (companiesData) {
        setCompanies(companiesData);
      }

      // Check if user is logged in and get customer_id
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        const { data: customer } = await supabase
          .from("customers")
          .select("id, full_name")
          .eq("user_id", user.id)
          .single();
        
        if (customer) {
          setCustomerId(customer.id);
          setFormData(prev => ({ ...prev, userName: customer.full_name }));
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initialize();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyId || !formData.userName || formData.rating === 0 || !formData.comment) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, selecciona un negocio, tu nombre, puntuación y comentario.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("company_reviews")
      .insert({
        company_id: formData.companyId,
        customer_id: customerId,
        customer_name: formData.userName,
        rating: formData.rating,
        title: formData.title || null,
        comment: formData.comment,
        is_approved: true // Auto-approve for now
      });

    setSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "No se pudo enviar la valoración. Inténtalo de nuevo.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "¡Valoración enviada!",
      description: "Gracias por compartir tu experiencia auténtica.",
    });
    
    setTimeout(() => {
      navigate('/valoraciones');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-6 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center justify-center">
              <span>Escribe tu Val</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>ración</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Comparte tu experiencia auténtica y ayuda a otros a descubrir negocios 
              que mantienen viva nuestra tradición gastronómica.
            </p>
          </div>

          {/* Authentication Required Message */}
          {!isAuthenticated ? (
            <Card className="shadow-soft text-center py-12">
              <CardContent className="space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    Inicia sesión para escribir una valoración
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Para garantizar la autenticidad de las valoraciones, necesitas tener una cuenta activa.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={() => navigate('/customer-auth')} size="lg">
                    <LogIn className="w-4 h-4 mr-2" />
                    Iniciar sesión
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/valoraciones')} size="lg">
                    Ver valoraciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
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
                {/* Company Selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Negocio *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el negocio" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.business_name} {company.address && `- ${company.address}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                {/* Star Rating */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Puntuación *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= formData.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title (optional) */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Título (opcional)
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Ej: Productos excepcionales"
                  />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-sm font-medium">
                    Tu comentario *
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
                  <Button type="submit" size="lg" className="shadow-earth" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 mr-2" />
                    )}
                    {submitting ? "Enviando..." : "Publicar valoración"}
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EscribirValoracion;
