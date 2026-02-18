import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { Building, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import AddressAutocompleteInput, { AddressComponents } from "@/components/AddressAutocompleteInput";

/** Capitalizes first letter of each word, lowercases the rest */
const capitalizeName = (name: string) =>
  name
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

export default function CompanyAuth() {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [existingCompany, setExistingCompany] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  
  const initialTab = searchParams.get('tab') === 'signup' ? 'signup' : 'signin';

  const [companyData, setCompanyData] = useState({
    business_name: "",
    business_type: "",
    contact_person: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "España",
    latitude: null as number | null,
    longitude: null as number | null,
    description: "",
    authenticity_story: ""
  });

  const handleAddressSelect = useCallback((addressComponents: AddressComponents) => {
    setCompanyData(prev => ({
      ...prev,
      address: addressComponents.address_line1,
      city: addressComponents.city,
      province: addressComponents.province,
      postal_code: addressComponents.postal_code,
      country: addressComponents.country || "España",
      latitude: addressComponents.latitude,
      longitude: addressComponents.longitude
    }));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkCompanyStatus(session.user.id);
      } else {
        setCheckingAuth(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkCompanyStatus(session.user.id);
      } else {
        setUser(null);
        setExistingCompany(null);
        setCheckingAuth(false);
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

    setCheckingAuth(false);

    if (data) {
      setExistingCompany(data);
      if (data.status === 'approved') {
        navigate('/company-dashboard');
      }
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      toast.error("Nombre, teléfono, email y contraseña son obligatorios.");
      return;
    }
    setLoading(true);

    const formattedName = capitalizeName(fullName);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/company-auth`,
          data: {
            full_name: formattedName,
            phone: phone,
          }
        }
      });

      if (error) {
        if (error.message?.toLowerCase().includes('already registered') || error.message?.toLowerCase().includes('already been registered')) {
          toast.error('Ya existe una cuenta con este email. Por favor, inicia sesión.');
          return;
        }
        throw error;
      }

      // Supabase returns user with empty identities if already exists
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        toast.error('Ya existe una cuenta con este email. Por favor, inicia sesión.');
        return;
      }

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

    if (!companyData.business_name || !companyData.contact_person) {
      toast.error("Por favor, completa los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const descriptionWithType = companyData.description 
        ? `${companyData.business_type ? `[${companyData.business_type}] ` : ''}${companyData.description}` 
        : companyData.business_type || null;

      const fullAddress = [
        companyData.address,
        companyData.city,
        companyData.province,
        companyData.postal_code,
        companyData.country
      ].filter(Boolean).join(', ');

      const { error } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          email: user.email!,
          business_name: companyData.business_name,
          contact_person: capitalizeName(companyData.contact_person),
          phone: companyData.phone || null,
          address: fullAddress || null,
          latitude: companyData.latitude,
          longitude: companyData.longitude,
          description: descriptionWithType,
          authenticity_story: companyData.authenticity_story || null,
          status: 'pending'
        });

      if (error) throw error;
      
      toast.success('¡Solicitud enviada! Te notificaremos cuando sea aprobada.');
      checkCompanyStatus(user.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (user && existingCompany) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              {existingCompany.status === 'pending' ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  </div>
                  <CardTitle className="text-xl">Solicitud en revisión</CardTitle>
                  <CardDescription className="mt-2">
                    Tu solicitud para <strong>{existingCompany.business_name}</strong> está siendo revisada. 
                    Te notificaremos por email en menos de 48 horas.
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-destructive" />
                  </div>
                  <CardTitle className="text-xl">Solicitud rechazada</CardTitle>
                  <CardDescription className="mt-2">
                    Lo sentimos, tu solicitud ha sido rechazada. 
                    Contacta con soporte para más información.
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" onClick={() => navigate('/')}>
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (user && !existingCompany) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader className="text-center border-b pb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Completa tu perfil de empresa</CardTitle>
              <CardDescription className="text-base mt-2">
                Cuéntanos sobre tu negocio para unirte a ORIGEN
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleCompanyRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Nombre del negocio *</Label>
                    <Input
                      id="business_name"
                      placeholder="Ej: Panadería El Horno"
                      required
                      value={companyData.business_name}
                      onChange={(e) => setCompanyData({...companyData, business_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business_type">Tipo de negocio</Label>
                    <Input
                      id="business_type"
                      placeholder="Ej: Panadería artesana"
                      value={companyData.business_type}
                      onChange={(e) => setCompanyData({...companyData, business_type: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Persona de contacto *</Label>
                    <Input
                      id="contact_person"
                      placeholder="Ej: María García López"
                      required
                      value={companyData.contact_person}
                      onChange={(e) => setCompanyData({...companyData, contact_person: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+34 600 000 000"
                      value={companyData.phone}
                      onChange={(e) => setCompanyData({...companyData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <AddressAutocompleteInput
                    onAddressSelect={handleAddressSelect}
                    countryRestriction="es"
                    placeholder="Empieza a escribir tu dirección..."
                  />
                  {companyData.latitude && companyData.longitude && (
                    <p className="text-xs text-muted-foreground">
                      📍 {companyData.address}, {companyData.city}, {companyData.province} {companyData.postal_code}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Cuéntanos sobre tu negocio</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={companyData.description}
                    onChange={(e) => setCompanyData({...companyData, description: e.target.value})}
                    placeholder="Historia, productos, métodos tradicionales, años de experiencia..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authenticity_story">¿Por qué es auténtico tu negocio?</Label>
                  <Textarea
                    id="authenticity_story"
                    rows={3}
                    value={companyData.authenticity_story}
                    onChange={(e) => setCompanyData({...companyData, authenticity_story: e.target.value})}
                    placeholder="Qué te hace diferente, tradiciones que mantienes, compromiso con la calidad..."
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Revisaremos tu solicitud en menos de 48 horas y te notificaremos por email cuando esté aprobada.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5 mr-2" />
                      Enviar solicitud
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Not logged in - show login/register tabs
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
            <p className="text-muted-foreground">Accede a tu cuenta o regístrate para unirte</p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Acceso Empresas</CardTitle>
              <CardDescription>
                Inicia sesión o crea una cuenta para acceder a tu panel de empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={initialTab === 'signup' ? 'signup' : 'signin'} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="signup">Registrarse</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contacto@tunegocio.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Iniciando...
                        </>
                      ) : (
                        'Iniciar Sesión'
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nombre y Apellidos *</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Ej: María García López"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="contacto@tunegocio.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Teléfono *</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+34 600 000 000"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Contraseña *</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creando cuenta...
                        </>
                      ) : (
                        'Crear cuenta'
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Recibirás un email de confirmación para activar tu cuenta
                    </p>
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
