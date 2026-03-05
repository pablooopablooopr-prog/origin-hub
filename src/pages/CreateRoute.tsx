import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateRoute = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");

  const handleCreate = async () => {
    if (!routeName.trim()) {
      toast({ title: "Nombre obligatorio", description: "Escribe un nombre para tu ruta", variant: "destructive" });
      return;
    }

    setCreating(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/customer-auth');
        return;
      }

      const slug = routeName
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now();

      const { data: newRoute, error } = await supabase
        .from('routes')
        .insert({
          title: routeName.trim(),
          slug,
          description: routeDescription.trim() || null,
          creator_id: user.id,
          is_public: false,
          is_active: true,
          total_stops: 0,
        })
        .select()
        .single();

      if (error) throw error;

      toast({ title: "Ruta creada", description: "Ahora puedes editarla con todos los detalles" });
      navigate(`/editar-ruta/${newRoute.slug}`);
    } catch (error: any) {
      console.error('Error creating route:', error);
      toast({ title: "Error", description: error.message || "No se pudo crear la ruta", variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 flex items-center justify-center">
              <span>Crear mi </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>uta</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comparte tu ruta gastronómica favorita con la comunidad ORIGEN
            </p>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-secondary" />
                  Nueva Ruta
                </CardTitle>
                <CardDescription>
                  Dale nombre y descripción. Después podrás añadir paradas, fotos y toda la información.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre de la ruta *</Label>
                  <Input 
                    id="name"
                    placeholder="Ej: Ruta del Queso y el Vino en Malasaña"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="desc">Descripción breve</Label>
                  <Textarea 
                    id="desc"
                    placeholder="Cuenta la historia de tu ruta..."
                    rows={3}
                    value={routeDescription}
                    onChange={(e) => setRouteDescription(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleCreate} 
                  disabled={creating || !routeName.trim()} 
                  className="w-full"
                  size="lg"
                >
                  {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Route className="w-5 h-5 mr-2" />}
                  Crear y editar ruta
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Se creará como privada. Podrás publicarla cuando esté lista.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateRoute;
