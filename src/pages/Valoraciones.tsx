import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageCircle, User, Calendar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  title: string | null;
  created_at: string;
  company: {
    business_name: string;
    address: string | null;
  } | null;
}

const Valoraciones = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("company_reviews")
        .select(`
          id,
          customer_name,
          rating,
          comment,
          title,
          created_at,
          company:companies(business_name, address)
        `)
        .eq("is_approved", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching reviews:", error);
      } else {
        setReviews((data || []).map((r: any) => ({
          ...r,
          company: Array.isArray(r.company) ? r.company[0] ?? null : r.company
        })));
      }
      setLoading(false);
    };

    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    fetchReviews();
    checkAuth();
  }, []);

  const handleWriteReview = () => {
    if (isAuthenticated) {
      navigate('/escribir-valoracion');
    } else {
      navigate('/customer-auth');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-12">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 flex items-center justify-center">
              <span>Val</span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>raciones Humanas</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
              Experiencias reales de personas como tú. Cada valoración cuenta una historia auténtica 
              sobre negocios que mantienen viva nuestra tradición gastronómica.
            </p>
            <Button size="lg" className="shadow-earth" onClick={handleWriteReview}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Escribir valoración
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Empty State */}
          {!loading && reviews.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aún no hay valoraciones. ¡Sé el primero en compartir tu experiencia!
              </p>
            </div>
          )}

          {/* Ratings Grid */}
          {!loading && reviews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="shadow-soft hover:shadow-earth transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-primary">{review.customer_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {review.company?.address || "España"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          {review.company?.business_name || review.title || "Negocio"}
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          "{review.comment || "Sin comentario"}"
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(review.created_at)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action Section */}
          <div className="text-center mt-16 p-8 bg-gradient-earth rounded-lg enso-watermark">
            <h3 className="text-2xl font-bold text-primary mb-4">
              Comparte tu experiencia
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              ¿Has visitado algún negocio auténtico? Tu valoración puede ayudar a otros 
              a descubrir lugares especiales y apoyar a empresas con alma.
            </p>
            <Button size="lg" className="shadow-earth" onClick={handleWriteReview}>
              <MessageCircle className="w-5 h-5 mr-2" />
              Escribir tu valoración
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Valoraciones;
