import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Building, Loader2, CheckCircle2, Mail } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import AddressAutocompleteInput, { AddressComponents } from "@/components/AddressAutocompleteInput";
import { postLoginRedirect } from "@/lib/auth/postLoginRedirect";
import PasswordInput from "@/components/PasswordInput";

const withPhonePrefix = (value: string) => {
  const raw = value.replace(/^\s+/, "");
  if (!raw) return "+34 ";

  if (raw.startsWith("+34")) return raw;

  const withoutPrefix = raw.replace(/^\+?34\s*/, "");
  return `+34 ${withoutPrefix}`;
};

const toE164ES = (value: string) => {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("34") ? digits.slice(2) : digits;
  if (!local) return "";
  return `+34${local}`;
};

const toTitleCase = (value: string) =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

type CompanyRow = {
  id: string;
  user_id: string | null;
  business_name: string;
  contact_person: string;
  email: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  authenticity_story: string | null;
  status: "pending" | "approved" | "rejected" | string;
};

type CompanyApprovalStatusRow = {
  company_id: string;
  business_name: string;
  status: "pending" | "approved" | "rejected" | string;
};

export default function CompanyAuth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = useMemo(
    () => (searchParams.get("tab") === "signup" ? "signup" : "signin"),
    [searchParams]
  );

  const [user, setUser] = useState<User | null>(null);
  const [existingCompany, setExistingCompany] = useState<CompanyRow | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyData, setCompanyData] = useState({
    business_name: "",
    business_type: "",
    contact_person: "",
    phone: "+34 ",
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

  const emailRedirectTo = useMemo(
    // CAMBIO emailRedirectTo
    () => `${window.location.origin}/auth/callback?redirect_to=/company-dashboard`,
    []
  );

  const handleAddressSelect = useCallback((a: AddressComponents) => {
    setCompanyData(prev => ({
      ...prev,
      address: a.address_line1,
      city: a.city,
      province: a.province,
      postal_code: a.postal_code,
      country: a.country || "España",
      latitude: a.latitude,
      longitude: a.longitude
    }));
  }, []);

  const checkCompanyStatus = useCallback(async (userId: string) => {
    const { data: companyRows, error } = await supabase
      .from("companies")
      .select("id, business_name, status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("checkCompanyStatus error:", error);
      setExistingCompany(null);
      return;
    }

    const firstRow = companyRows?.[0] ?? null;
    const row: CompanyApprovalStatusRow | null = firstRow
      ? { company_id: firstRow.id, business_name: firstRow.business_name, status: firstRow.status ?? "pending" }
      : null;

    if (row) {
      const normalizedStatus = String(row.status).trim().toUpperCase();

      setExistingCompany({
        id: row.company_id,
        user_id: userId,
        business_name: row.business_name,
        contact_person: "",
        email: user?.email || "",
        phone: null,
        address: null,
        latitude: null,
        longitude: null,
        description: null,
        authenticity_story: null,
        status: normalizedStatus,
      });

      if (normalizedStatus === "APPROVED") {
        navigate("/company-dashboard");
      } else if (normalizedStatus === "REJECTED") {
        navigate("/company-rejected");
      } else {
        navigate("/company-pending");
      }
    } else {
      setExistingCompany(null);
    }
  }, [navigate, user?.email]);

  const checkAdminAndRedirect = useCallback(async (userId: string): Promise<boolean> => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (data) {
      navigate("/admin/companies", { replace: true });
      return true;
    }
    return false;
  }, [navigate]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        const isAdmin = await checkAdminAndRedirect(session.user.id);
        if (!isAdmin) await checkCompanyStatus(session.user.id);
      } else {
        setUser(null);
        setExistingCompany(null);
      }
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const isAdmin = await checkAdminAndRedirect(session.user.id);
        if (!isAdmin) await checkCompanyStatus(session.user.id);
      } else {
        setUser(null);
        setExistingCompany(null);
      }
      setCheckingAuth(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkCompanyStatus]);

  const handleResendVerification = async () => {
    if (!email) {
      toast.error("Escribe tu email primero.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          // CAMBIO emailRedirectTo
          emailRedirectTo,
        },
      });
      if (error) throw error;
      toast.success("Email reenviado. Revisa spam/promociones también.");
    } catch (e: any) {
      toast.error(e.message ?? "No se pudo reenviar el email.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // CAMBIO normalización de phone (E.164)
    const phoneE164 = toE164ES(companyData.phone);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone: phoneE164 || undefined,
        options: {
          emailRedirectTo,
          data: {
            full_name: companyData.contact_person || companyData.business_name || null,
            company_name: companyData.business_name || null,
            phone: phoneE164 || null,
            user_type: "company",
          },
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("registered")) {
          toast.error("Ya existe una cuenta con este email. Inicia sesión en su lugar.");
          return;
        }
        throw error;
      }

      // Supabase returns empty identities when the user already exists
      if (data?.user && data.user.identities && data.user.identities.length === 0) {
        toast.error("Ya existe una cuenta con este email. Inicia sesión o recupera tu contraseña.");
        return;
      }

      toast.success("Revisa tu email para confirmar tu cuenta.");
    } catch (err: any) {
      toast.error(err.message ?? "Error en el registro.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await postLoginRedirect(navigate, "/company-dashboard");
      return;
    } catch (err: any) {
      const msg = (err?.message || "").toLowerCase();
      const isInvalidCredentials = msg.includes("invalid login credentials") || msg.includes("invalid");
      toast.error(isInvalidCredentials
        ? "Email o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo."
        : (err.message ?? "Error al iniciar sesión."));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const targetEmail = (resetEmail || email).trim();

    if (!targetEmail) {
      toast.error("Escribe tu email para enviar el enlace de recuperación.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Enlace enviado. Revisa tu correo.");
      setShowResetPassword(false);
    } catch (e: any) {
      toast.error(e?.message ?? "No se pudo enviar el enlace.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!companyData.business_name || !companyData.contact_person) {
      toast.error("Completa los campos obligatorios.");
      return;
    }

    setLoading(true);

    try {
      // Si ya existe empresa, no insertes otra
      const { data: statusRows, error: exErr } = await supabase
        .from("companies")
        .select("id, business_name, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (exErr) throw exErr;
      const existingRow = statusRows?.[0] ?? null;
      const existing: CompanyApprovalStatusRow | null = existingRow
        ? { company_id: existingRow.id, business_name: existingRow.business_name, status: existingRow.status ?? "pending" }
        : null;
      if (existing?.company_id) {
        toast.success("Ya tienes una solicitud creada. Te llevamos al estado.");
        await checkCompanyStatus(user.id);
        return;
      }

      const descriptionWithType =
        companyData.description
          ? `${companyData.business_type ? `[${companyData.business_type}] ` : ""}${companyData.description}`
          : (companyData.business_type || null);

      const fullAddress = [
        companyData.address,
        companyData.city,
        companyData.province,
        companyData.postal_code,
        companyData.country
      ].filter(Boolean).join(", ");

      const { error } = await supabase.from("companies").insert({
        user_id: user.id,
        email: user.email!,
        business_name: companyData.business_name,
        contact_person: companyData.contact_person,
        phone: companyData.phone || null,
        address: fullAddress || null,
        latitude: companyData.latitude,
        longitude: companyData.longitude,
        description: descriptionWithType,
        authenticity_story: companyData.authenticity_story || null,
        status: "pending"
      });

      if (error) throw error;

      toast.success("¡Solicitud enviada! Te notificaremos cuando sea aprobada.");
      await checkCompanyStatus(user.id);
    } catch (err: any) {
      toast.error(err.message ?? "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  // -------- UI STATES --------
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

  // Usuario logueado y ya tiene empresa creada (pending/rejected)
  if (user && existingCompany) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-16">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              {existingCompany.status === "PENDING" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  </div>
                  <CardTitle className="text-xl">Solicitud en revisión</CardTitle>
                  <CardDescription className="mt-2">
                    Tu solicitud para <strong>{existingCompany.business_name}</strong> está siendo revisada.
                    Te notificaremos por email.
                  </CardDescription>
                </>
              ) : existingCompany.status === "APPROVED" ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Empresa aprobada</CardTitle>
                  <CardDescription className="mt-2">
                    Ya puedes acceder a tu panel.
                  </CardDescription>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-destructive" />
                  </div>
                  <CardTitle className="text-xl">Solicitud rechazada</CardTitle>
                  <CardDescription className="mt-2">
                    Contacta con soporte para más información.
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="text-center space-y-3">
              {existingCompany.status === "APPROVED" && (
                <Button onClick={() => navigate("/company-dashboard")} className="w-full">
                  Ir al panel
                </Button>
              )}
              <Button variant="outline" onClick={async () => {
                await supabase.auth.signOut();
                navigate("/");
              }} className="w-full">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Usuario logueado pero sin empresa creada: formulario
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
                      required
                      value={companyData.business_name}
                      onChange={(e) => setCompanyData({ ...companyData, business_name: toTitleCase(e.target.value) })}
                      placeholder="Ej: Quesería La Dehesa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type">Tipo de negocio *</Label>
                    <Input
                      id="business_type"
                      required
                      value={companyData.business_type}
                      onChange={(e) => setCompanyData({ ...companyData, business_type: toTitleCase(e.target.value) })}
                      placeholder="Ej: Ganadería ecológica"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person">Persona de contacto *</Label>
                    <Input
                      id="contact_person"
                      required
                      value={companyData.contact_person}
                      onChange={(e) => setCompanyData({ ...companyData, contact_person: toTitleCase(e.target.value) })}
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={companyData.phone}
                      onFocus={() => {
                        if (!companyData.phone.trim()) {
                          setCompanyData({ ...companyData, phone: "+34 " });
                        }
                      }}
                      onChange={(e) => setCompanyData({ ...companyData, phone: withPhonePrefix(e.target.value) })}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <AddressAutocompleteInput
                    id="address"
                    placeholder="Empieza a escribir tu dirección..."
                    onAddressSelect={handleAddressSelect}
                    countryRestriction="es"
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
                    onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
                    placeholder="Historia, productos, métodos tradicionales..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authenticity_story">¿Por qué es auténtico tu negocio?</Label>
                  <Textarea
                    id="authenticity_story"
                    rows={3}
                    value={companyData.authenticity_story}
                    onChange={(e) => setCompanyData({ ...companyData, authenticity_story: e.target.value })}
                    placeholder="Qué te hace diferente, tradiciones, compromiso..."
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Revisaremos tu solicitud y te notificaremos por email cuando esté aprobada.
                  </p>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Building className="w-5 h-5 mr-2" />
                      Enviar solicitud
                    </>
                  )}
                </Button>

                <p className="text-[11px] text-secondary font-medium text-center mt-2">
                  * Los campos con asterisco son obligatorios.
                </p>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // No logueado: signin/signup
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
            <p className="text-muted-foreground">Accede o regístrate para unirte</p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Acceso Empresas</CardTitle>
              <CardDescription>
                Inicia sesión o crea una cuenta para acceder a tu panel
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue={initialTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Iniciar Sesión</TabsTrigger>
                  <TabsTrigger value="signup">Registrarse</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <PasswordInput id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline"
                      onClick={() => {
                        setResetEmail(email);
                        setShowResetPassword(true);
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                    {showResetPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="tu@email.com"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          disabled={loading}
                          onClick={handlePasswordReset}
                        >
                          Enviar enlace
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setShowResetPassword(false)}
                        >
                          Volver
                        </Button>
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Iniciando...</>) : "Iniciar Sesión"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Nombre de contacto *</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        required
                        placeholder="Tu nombre y apellidos"
                        value={companyData.contact_person}
                        onChange={(e) => setCompanyData({ ...companyData, contact_person: toTitleCase(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email *</Label>
                      <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">Teléfono *</Label>
                      <Input
                        id="signup-phone"
                        type="tel"
                        required
                        placeholder="+34 600 000 000"
                        value={companyData.phone}
                        onFocus={() => {
                          if (!companyData.phone.trim()) setCompanyData({ ...companyData, phone: "+34 " });
                        }}
                        onChange={(e) => setCompanyData({ ...companyData, phone: withPhonePrefix(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Contraseña *</Label>
                      <PasswordInput id="signup-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <p className="text-xs text-muted-foreground">Recomendado mínimo 8 caracteres.</p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creando cuenta...</>) : "Crear cuenta"}
                    </Button>

                    <Button type="button" variant="outline" className="w-full" onClick={handleResendVerification} disabled={loading}>
                      <Mail className="w-4 h-4 mr-2" />
                      Reenviar email de verificación
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Te llegará un email de confirmación para activar tu cuenta.
                    </p>

                    <p className="text-[11px] text-secondary font-medium text-center mt-2">
                      * Los campos con asterisco son obligatorios.
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
