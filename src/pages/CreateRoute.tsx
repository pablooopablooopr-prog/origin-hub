import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState(false);

  useEffect(() => {
    const createAndRedirect = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/customer-auth');
          return;
        }

        const slug = 'nueva-ruta-' + Date.now();

        const { data: newRoute, error } = await supabase
          .from('routes')
          .insert({
            title: 'Nueva Ruta',
            slug,
            description: '',
            creator_id: user.id,
            is_public: false,
            is_active: true,
            total_stops: 0,
          })
          .select()
          .single();

        if (error) throw error;

        navigate(`/editar-ruta/${newRoute.slug}`, { replace: true });
      } catch (err: any) {
        console.error('Error creating route:', err);
        setError(true);
        toast({ title: "Error", description: err.message || "No se pudo crear la ruta", variant: "destructive" });
      }
    };

    createAndRedirect();
  }, [navigate, toast]);

  if (error) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-muted-foreground">No se pudo crear la ruta. Inténtalo de nuevo.</p>
          <button onClick={() => navigate(-1)} className="text-primary underline">Volver</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Creando tu ruta...</span>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRoute;
