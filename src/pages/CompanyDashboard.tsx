import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Eye, Edit, Copy, BarChart3, Package, Settings } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface Company {
  id: string;
  business_name: string;
  status: string;
}

interface CompanyPack {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  created_at: string;
  template: {
    name: string;
    type: string;
    color: string;
  };
  analytics?: {
    views: number;
    clicks: number;
  };
}

export default function CompanyDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [packs, setPacks] = useState<CompanyPack[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadCompanyData(session.user.id);
      } else {
        navigate('/company-auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadCompanyData(session.user.id);
      } else {
        navigate('/company-auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadCompanyData = async (userId: string) => {
    try {
      // Load company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (companyError) throw companyError;

      if (!companyData) {
        navigate('/company-auth');
        return;
      }

      if (companyData.status !== 'approved') {
        toast.error('Tu empresa aún no ha sido aprobada');
        navigate('/company-auth');
        return;
      }

      setCompany(companyData);

      // Load packs
      const { data: packsData, error: packsError } = await supabase
        .from('company_packs')
        .select(`
          *,
          template:pack_templates(name, type, color)
        `)
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });

      if (packsError) throw packsError;

      // Load analytics for each pack
      const packsWithAnalytics = await Promise.all(
        (packsData || []).map(async (pack) => {
          const { data: analyticsData } = await supabase
            .from('pack_analytics')
            .select('views, clicks')
            .eq('pack_id', pack.id)
            .eq('date', new Date().toISOString().split('T')[0])
            .maybeSingle();

          return {
            ...pack,
            analytics: analyticsData || { views: 0, clicks: 0 }
          };
        })
      );

      setPacks(packsWithAnalytics);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewPack = (templateType: string) => {
    navigate(`/pack-builder?template=${templateType}&company=${company?.id}`);
  };

  const duplicatePack = async (packId: string) => {
    if (!company) return;

    try {
      // Get original pack
      const { data: originalPack, error: fetchError } = await supabase
        .from('company_packs')
        .select('*')
        .eq('id', packId)
        .single();

      if (fetchError) throw fetchError;

      // Create duplicate
      const { data: newPack, error: createError } = await supabase
        .from('company_packs')
        .insert({
          company_id: company.id,
          template_id: originalPack.template_id,
          title: `${originalPack.title} (Copia)`,
          slug: `${originalPack.slug}-copy-${Date.now()}`,
          price: originalPack.price,
          shipping_policy: originalPack.shipping_policy,
          sustainability_info: originalPack.sustainability_info,
          tags: originalPack.tags
        })
        .select()
        .single();

      if (createError) throw createError;

      // Copy elements
      const { data: elements, error: elementsError } = await supabase
        .from('pack_elements')
        .select('*')
        .eq('pack_id', packId);

      if (elementsError) throw elementsError;

      if (elements && elements.length > 0) {
        const newElements = elements.map(element => ({
          pack_id: newPack.id,
          element_type: element.element_type,
          content: element.content,
          position: element.position,
          styles: element.styles
        }));

        const { error: insertElementsError } = await supabase
          .from('pack_elements')
          .insert(newElements);

        if (insertElementsError) throw insertElementsError;
      }

      toast.success('Pack duplicado exitosamente');
      loadCompanyData(user!.id);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Empresarial</h1>
            <p className="text-muted-foreground mt-1">
              Bienvenido, {company?.business_name}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              Ver Sitio
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <Tabs defaultValue="packs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="packs" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Mis Packs
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packs">
            {/* Create New Pack Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {['raiz', 'esencia', 'gourmet'].map((type) => (
                <Card key={type} className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => createNewPack(type)}>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      type === 'raiz' ? 'bg-amber-100 text-amber-700' :
                      type === 'esencia' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      <Plus className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      Crear Pack {type === 'raiz' ? 'Raíz' : type === 'esencia' ? 'Esencia' : 'Gourmet'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type === 'raiz' ? 'Productos locales básicos' :
                       type === 'esencia' ? 'Experiencia premium' :
                       'Productos exclusivos'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Existing Packs */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Tus Packs</h2>
              {packs.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No tienes packs creados</h3>
                    <p className="text-muted-foreground mb-6">
                      Comienza creando tu primer pack usando una de las plantillas de arriba
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packs.map((pack) => (
                    <Card key={pack.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{pack.title}</CardTitle>
                            <CardDescription>{pack.template.name}</CardDescription>
                          </div>
                          <Badge
                            variant={pack.status === 'published' ? 'default' : pack.status === 'draft' ? 'secondary' : 'destructive'}
                          >
                            {pack.status === 'published' ? 'Publicado' : pack.status === 'draft' ? 'Borrador' : 'Rechazado'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Precio:</span>
                            <span className="font-semibold">{pack.price ? `€${pack.price}` : 'No definido'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Vistas:</span>
                            <span>{pack.analytics?.views || 0}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Clicks:</span>
                            <span>{pack.analytics?.clicks || 0}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={() => navigate(`/pack-builder/${pack.id}`)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => duplicatePack(pack.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            {pack.status === 'published' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(`/pack/${pack.slug}`, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Generales</CardTitle>
                <CardDescription>
                  Resumen del rendimiento de tus packs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{packs.length}</div>
                    <div className="text-sm text-muted-foreground">Packs Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {packs.filter(p => p.status === 'published').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Packs Publicados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {packs.reduce((sum, pack) => sum + (pack.analytics?.views || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Vistas Totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Empresa</CardTitle>
                <CardDescription>
                  Gestiona los datos de tu empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configuración de empresa próximamente...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
