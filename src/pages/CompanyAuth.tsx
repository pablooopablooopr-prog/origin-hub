import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Building } from "lucide-react";

export default function CompanyAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Company registration form
  const [companyData, setCompanyData] = useState({
    business_name: "",
    contact_person: "",
    phone: "",
    address: "",
    description: "",
    authenticity_story: ""
  });

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkCompanyStatus(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkCompanyStatus(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkCompanyStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (data) {
      if (data.status === 'approved') {
        navigate('/company-dashboard');
      } else if (data.status === 'pending') {
        toast.info('Tu solicitud está pendiente de aprobación');
      } else if (data.status === 'rejected') {
        toast.error('Tu solicitud ha sido rechazada. Contacta con soporte.');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/company-auth`
        }
      });

      if (error) throw error;
      toast.success('Revisa tu email para confirmar tu cuenta');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          email: user.email!,
          ...companyData
        });

      if (error) throw error;
      
      toast.success('Solicitud enviada. Serás notificado cuando sea aprobada.');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (user && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Registro de Empresa</CardTitle>
            <CardDescription>
              Completa los datos de tu empresa para acceder a la zona privada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCompanyRegistration} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Nombre de la Empresa *</Label>
                  <Input
                    id="business_name"
                    required
                    value={companyData.business_name}
                    onChange={(e) => setCompanyData({...companyData, business_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_person">Persona de Contacto *</Label>
                  <Input
                    id="contact_person"
                    required
                    value={companyData.contact_person}
                    onChange={(e) => setCompanyData({...companyData, contact_person: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={companyData.address}
                    onChange={(e) => setCompanyData({...companyData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción de la Empresa</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={companyData.description}
                  onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                  placeholder="Describe tu empresa y los productos que ofreces..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authenticity_story">Historia de Autenticidad</Label>
                <Textarea
                  id="authenticity_story"
                  rows={4}
                  value={companyData.authenticity_story}
                  onChange={(e) => setCompanyData({...companyData, authenticity_story: e.target.value})}
                  placeholder="Cuenta la historia de tu producto, su origen, tradición y lo que lo hace auténtico..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
            </form>
          </CardContent>
        </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "hsl(var(--secondary))" }}>
              <Building className="w-8 h-8" style={{ color: "hsl(var(--secondary-foreground))" }} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Zona de Empresa</h1>
            <p className="text-muted-foreground">Accede a tu cuenta o regístrate</p>
          </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Acceso Empresas</CardTitle>
          <CardDescription>
            Inicia sesión o regístrate para acceder a tu zona privada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
              <TabsTrigger value="signup">Registrarse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Contraseña</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}