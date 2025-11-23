import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Star, Phone, Globe, Mail, Package, Edit, Plus, MessageCircle, Building2, Award, History, ChevronRight } from "lucide-react";

interface Company {
  id: string;
  business_name: string;
  description: string | null;
  authenticity_story: string | null;
  address: string | null;
  phone: string | null;
  email: string;
  user_id: string | null;
}

interface CompanyPack {
  id: string;
  title: string;
  price: number | null;
  template_id: string | null;
  tags: string[] | null;
}

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const BusinessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [packs, setPacks] = useState<CompanyPack[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (id) {
      loadCompanyData();
    }
  }, [id]);

  const loadCompanyData = async () => {
    try {
      // Load company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Check if current user is owner
      const { data: { session } } = await supabase.auth.getSession();
      setIsOwner(session?.user?.id === companyData.user_id);

      // Load company packs
      const { data: packsData, error: packsError } = await supabase
        .from('company_packs')
        .select('*')
        .eq('company_id', id)
        .eq('status', 'published')
        .limit(6);

      if (packsError) throw packsError;
      setPacks(packsData || []);

      // Load reviews (from pack_reviews)
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('pack_reviews')
        .select(`
          *,
          company_packs!inner(company_id)
        `)
        .eq('company_packs.company_id', id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la empresa",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (company?.email) {
      window.location.href = `mailto:${company.email}`;
    } else {
      toast({
        title: "Email no disponible",
        description: "Esta empresa no tiene email de contacto configurado",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Cargando empresa...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Empresa no encontrada</h1>
            <Button onClick={() => navigate('/packs')}>Ver Packs</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white">
        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-12 h-12 flex-shrink-0" />
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {company.business_name}
                  </h1>
                  {company.address && (
                    <p className="text-white/90 flex items-center gap-2 text-lg">
                      <MapPin className="w-5 h-5" />
                      {company.address}
                    </p>
                  )}
                </div>
              </div>
              
              {company.description && (
                <p className="text-white/90 text-lg leading-relaxed">
                  {company.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                {reviews.length > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    {averageRating} ({reviews.length} valoraciones)
                  </Badge>
                )}
                {packs.length > 0 && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <Package className="w-4 h-4 mr-1" />
                    {packs.length} packs disponibles
                  </Badge>
                )}
              </div>
            </div>

            {/* Company Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square bg-white/10 rounded-2xl border-4 border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Building2 className="w-24 h-24 text-white/50" />
              </div>
            </div>
          </div>

          {/* Owner Actions */}
          {isOwner && (
            <div className="mt-6 flex gap-3">
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate(`/company-dashboard`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Empresa
              </Button>
              <Button 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => navigate(`/pack-builder`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Nuevo Pack
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl space-y-12">
        
        {/* Historia de la Empresa */}
        {company.authenticity_story && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <History className="w-6 h-6 text-[#8B7355]" />
                Historia de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                {company.authenticity_story}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Packs que Ofrece */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Package className="w-8 h-8 text-[#8B7355]" />
              Packs que Ofrece
            </h2>
            {packs.length > 6 && (
              <Button
                variant="outline"
                onClick={() => navigate(`/packs?company=${id}`)}
              >
                Ver todos sus packs
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {packs.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-lg">
                  Esta empresa aún no tiene packs publicados
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <Card 
                  key={pack.id} 
                  className="hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => navigate(`/packs/${pack.id}`)}
                >
                  <div className="aspect-square bg-gradient-to-br from-[#8B7355]/10 to-[#A0826D]/10 flex items-center justify-center">
                    <Package className="w-20 h-20 text-[#8B7355] group-hover:scale-110 transition-transform" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{pack.title}</CardTitle>
                    {pack.price && (
                      <CardDescription className="text-2xl font-bold text-[#8B7355]">
                        {pack.price}€
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    {pack.tags && pack.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pack.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {packs.length > 0 && packs.length <= 6 && (
            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-[#8B7355] hover:bg-[#7A6449]"
                onClick={() => navigate(`/packs?company=${id}`)}
              >
                Ver Todos los Packs
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </section>

        {/* Valoraciones */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Award className="w-8 h-8 text-[#8B7355]" />
              Valoraciones de Clientes
            </h2>
            {reviews.length > 0 && (
              <p className="text-muted-foreground mt-2">
                Valoración media: <span className="font-bold text-[#8B7355] text-lg">{averageRating}/5</span> basada en {reviews.length} opiniones
              </p>
            )}
          </div>

          {reviews.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="py-12 text-center">
                <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground text-lg">
                  Aún no hay valoraciones para esta empresa
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{review.customer_name}</CardTitle>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-[#8B7355] text-[#8B7355]"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {new Date(review.created_at).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </CardDescription>
                  </CardHeader>
                  {review.comment && (
                    <CardContent>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </section>

        <Separator />

        {/* Contact Section */}
        <section className="text-center py-8">
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <MessageCircle className="w-6 h-6 text-[#8B7355]" />
                Contacta con {company.business_name}
              </CardTitle>
              <CardDescription>
                ¿Tienes alguna pregunta? Ponte en contacto directamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {company.email && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mail className="w-5 h-5 text-[#8B7355]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{company.email}</p>
                    </div>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="w-5 h-5 text-[#8B7355]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Teléfono</p>
                      <p className="font-medium text-sm">{company.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
                onClick={handleContact}
              >
                <Mail className="w-5 h-5 mr-2" />
                Contactar Empresa
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessDetail;
