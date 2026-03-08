import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Eye, Edit, Copy, BarChart3, Package, Settings, Trash2, ShoppingBag, Loader2, Save, X, Route, Clock, Users, ChevronRight, Globe } from "lucide-react";
import AddressAutocompleteInput, { AddressComponents } from "@/components/AddressAutocompleteInput";
import { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Company {
  id: string;
  business_name: string;
  status: string;
  slug?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  address?: string;
  authenticity_story?: string;
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

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  stock_quantity?: number;
  is_available: boolean;
  origin?: string;
  weight?: string;
}

interface CompanyRoute {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  duration: string | null;
  difficulty: string | null;
  image_url: string | null;
}

export default function CompanyDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [packs, setPacks] = useState<CompanyPack[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [companyRoutes, setCompanyRoutes] = useState<CompanyRoute[]>([]);
  const [ownCreatedRoutes, setOwnCreatedRoutes] = useState<CompanyRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    origin: "",
    weight: "",
    is_available: true
  });
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingCompany, setSavingCompany] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    business_name: "",
    contact_person: "",
    phone: "",
    website: "",
    address: "",
    description: "",
    authenticity_story: ""
  });
  const [editLatLng, setEditLatLng] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'route' | 'pack' | 'product'; id: string; title: string } | null>(null);
  const [totalViews, setTotalViews] = useState(0);
  const [packsSold, setPacksSold] = useState<{ total: number; byType: Record<string, number> }>({ total: 0, byType: {} });
  const [soldFilterType, setSoldFilterType] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    let loadedUserId: string | null = null;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (currentUser) {
        setUser(currentUser);
        loadedUserId = currentUser.id;
        loadCompanyData(currentUser.id);
      } else {
        navigate('/company-auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Only reload if user changed (avoid duplicate loads on INITIAL_SESSION)
        if (session.user.id !== loadedUserId) {
          loadedUserId = session.user.id;
          setUser(session.user);
          loadCompanyData(session.user.id);
        }
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

      if (String(companyData.status ?? '').trim().toUpperCase() !== 'APPROVED') {
        toast.error('Tu empresa aún no ha sido aprobada');
        navigate('/company-auth');
        return;
      }

      setCompany(companyData);
      setCompanyForm({
        business_name: companyData.business_name || "",
        contact_person: companyData.contact_person || "",
        phone: companyData.phone || "",
        website: companyData.website || "",
        address: companyData.address || "",
        description: companyData.description || "",
        authenticity_story: companyData.authenticity_story || ""
      });

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

      // Load analytics for all packs in a single query
      const packIds = (packsData || []).map(p => p.id);
      const today = new Date().toISOString().split('T')[0];
      
      let analyticsMap: Record<string, { views: number; clicks: number }> = {};
      if (packIds.length > 0) {
        const { data: analyticsData } = await supabase
          .from('pack_analytics')
          .select('pack_id, views, clicks')
          .in('pack_id', packIds)
          .eq('date', today);
        
        (analyticsData || []).forEach((a: any) => {
          analyticsMap[a.pack_id] = { views: a.views || 0, clicks: a.clicks || 0 };
        });
      }

      const packsWithAnalytics = (packsData || []).map(pack => ({
        ...pack,
        analytics: analyticsMap[pack.id] || { views: 0, clicks: 0 }
      }));

      setPacks(packsWithAnalytics);

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Load routes where company appears as a stop
      const { data: routeStopsData } = await supabase
        .from('route_stops')
        .select('route_id, routes!inner(id, title, slug, description, duration, difficulty, image_url, is_public, is_active)')
        .eq('company_id', companyData.id)
        .limit(50);

      const routeMap = new Map<string, CompanyRoute>();
      (routeStopsData || []).forEach((stop: any) => {
        const r = stop.routes;
        if (r && r.is_public && r.is_active && !routeMap.has(r.id)) {
          routeMap.set(r.id, r);
        }
      });
      setCompanyRoutes(Array.from(routeMap.values()));

      // Load routes created by the company user
      const { data: ownRoutesData } = await supabase
        .from('routes')
        .select('id, title, slug, description, duration, difficulty, image_url')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      setOwnCreatedRoutes((ownRoutesData || []) as CompanyRoute[]);

      // Load total views across all dates
      if (packIds.length > 0) {
        const { data: allAnalytics } = await supabase
          .from('pack_analytics')
          .select('views')
          .in('pack_id', packIds);
        const total = (allAnalytics || []).reduce((sum: number, a: any) => sum + (a.views || 0), 0);
        setTotalViews(total);
      }

      // Load orders (packs sold)
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, pack_id, status')
        .eq('company_id', companyData.id)
        .in('status', ['completed', 'shipped', 'delivered', 'confirmed', 'pending']);

      const soldByType: Record<string, number> = {};
      let totalSold = 0;
      (ordersData || []).forEach((order: any) => {
        totalSold++;
        const pack = (packsData || []).find((p: any) => p.id === order.pack_id);
        const typeName = pack?.template?.type || 'otro';
        soldByType[typeName] = (soldByType[typeName] || 0) + 1;
      });
      setPacksSold({ total: totalSold, byType: soldByType });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewPack = (templateType: string) => {
    navigate(`/editar-pack?type=${templateType}`);
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

  const deleteRoute = async (routeId: string) => {
    try {
      await supabase.from('route_stops').delete().eq('route_id', routeId);
      const { error } = await supabase.from('routes').delete().eq('id', routeId);
      if (error) throw error;
      setOwnCreatedRoutes(ownCreatedRoutes.filter(r => r.id !== routeId));
      toast.success("Ruta eliminada correctamente");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deletePack = async (packId: string) => {
    try {
      await supabase.from('pack_elements').delete().eq('pack_id', packId);
      await supabase.from('pack_products').delete().eq('pack_id', packId);
      const { error } = await supabase.from('company_packs').delete().eq('id', packId);
      if (error) throw error;
      setPacks(packs.filter(p => p.id !== packId));
      toast.success("Pack eliminado correctamente");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    if (confirmDelete.type === 'route') await deleteRoute(confirmDelete.id);
    else if (confirmDelete.type === 'pack') await deletePack(confirmDelete.id);
    else if (confirmDelete.type === 'product') await deleteProduct(confirmDelete.id);
    setConfirmDelete(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Product management functions
  const openProductDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name,
        description: product.description || "",
        price: product.price?.toString() || "",
        stock_quantity: product.stock_quantity?.toString() || "",
        origin: product.origin || "",
        weight: product.weight || "",
        is_available: product.is_available
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
        origin: "",
        weight: "",
        is_available: true
      });
    }
    setShowProductDialog(true);
  };

  const saveProduct = async () => {
    if (!company || !productForm.name) {
      toast.error("El nombre del producto es obligatorio");
      return;
    }

    setSavingProduct(true);

    try {
      const slug = productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const productData = {
        company_id: company.id,
        name: productForm.name,
        slug: editingProduct ? editingProduct.slug : `${slug}-${Date.now()}`,
        description: productForm.description || null,
        price: productForm.price ? parseFloat(productForm.price) : null,
        stock_quantity: productForm.stock_quantity ? parseInt(productForm.stock_quantity) : null,
        origin: productForm.origin || null,
        weight: productForm.weight || null,
        is_available: productForm.is_available
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success("Producto actualizado");
      } else {
        const { error } = await supabase
          .from('products')
          .insert(productData);

        if (error) throw error;
        toast.success("Producto creado");
      }

      setShowProductDialog(false);
      if (user) loadCompanyData(user.id);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast.success("Producto eliminado");
      setProducts(products.filter(p => p.id !== productId));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleProductAvailability = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_available: !product.is_available })
        .eq('id', product.id);

      if (error) throw error;
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, is_available: !p.is_available } : p
      ));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const saveCompanyProfile = async () => {
    if (!company) return;
    
    setSavingCompany(true);
    try {
      const updateData: any = {
        business_name: companyForm.business_name,
        contact_person: companyForm.contact_person,
        phone: companyForm.phone,
        website: companyForm.website,
        address: companyForm.address,
        description: companyForm.description,
        authenticity_story: companyForm.authenticity_story
      };
      if (editLatLng.lat !== null && editLatLng.lng !== null) {
        updateData.latitude = editLatLng.lat;
        updateData.longitude = editLatLng.lng;
      }

      const { error } = await supabase
        .from('companies')
        .update(updateData)
        .eq('id', company.id);

      if (error) throw error;
      
      setCompany({ ...company, ...companyForm });
      setEditingSettings(false);
      toast.success("Perfil de empresa actualizado correctamente");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSavingCompany(false);
    }
  };

  const cancelEditingSettings = () => {
    setEditingSettings(false);
    setCompanyForm({
      business_name: company?.business_name || "",
      contact_person: company?.contact_person || "",
      phone: company?.phone || "",
      website: company?.website || "",
      address: company?.address || "",
      description: company?.description || "",
      authenticity_story: company?.authenticity_story || ""
    });
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
            <Button variant="outline" onClick={handleSignOut}>
              Cerrar Sesión
            </Button>
          </div>
        </div>

        <Tabs defaultValue={['Restaurante', 'Cooperativa'].includes((company as any)?.business_type || '') ? 'routes' : 'packs'} className="space-y-6" onValueChange={(value) => {
          if (value === "mypage") {
            navigate(`/negocio/${company?.slug || company?.id}`);
          }
        }}>
          <TabsList>
            <TabsTrigger value="mypage" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Mi Página
            </TabsTrigger>
            {!['Restaurante', 'Cooperativa'].includes((company as any)?.business_type || '') && (
            <TabsTrigger value="packs" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Mis Packs
            </TabsTrigger>
            )}
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Rutas
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {['micro', 'raiz', 'esencia', 'gourmet'].map((type) => (
                <Card key={type} className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => createNewPack(type)}>
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                      type === 'micro' ? 'bg-gray-100 text-gray-600' :
                      type === 'raiz' ? 'bg-amber-100 text-amber-700' :
                      type === 'esencia' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      <Plus className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold mb-2 whitespace-nowrap">
                      {type === 'micro' ? 'Crear Microselección' :
                       type === 'raiz' ? 'Crear Pack Raíz' : 
                       type === 'esencia' ? 'Crear Pack Esencia' : 'Crear Pack Gourmet'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {type === 'micro' ? '1-2 productos únicos (15€)' :
                       type === 'raiz' ? 'Productos locales básicos' :
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
                            <CardDescription>{pack.template?.name || 'Pack'}</CardDescription>
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
                              onClick={() => navigate(`/packs/${pack.slug}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/editar-pack/${pack.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => duplicatePack(pack.id)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setConfirmDelete({ type: 'pack', id: pack.id, title: pack.title })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>



          <TabsContent value="routes">
            <div className="space-y-8">
              {/* Crear Ruta */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Crear Ruta</h2>
                <Card 
                  className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/crear-ruta')}
                >
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Crear Nueva Ruta</h3>
                    <p className="text-sm text-muted-foreground">
                      Diseña una ruta gastronómica con paradas, actividades y recomendaciones
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Mis Rutas Creadas */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Mis Rutas Creadas</h2>
                {ownCreatedRoutes.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Route className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No has creado ninguna ruta</h3>
                      <p className="text-muted-foreground">
                        Crea tu primera ruta gastronómica usando el botón de arriba
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {ownCreatedRoutes.map((route) => (
                      <Card
                        key={route.id}
                        className="hover:shadow-lg transition-all group"
                      >
                        <CardContent className="p-4 flex gap-4 items-center">
                          <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {route.image_url ? (
                              <img src={route.image_url} alt={route.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Route className="w-8 h-8 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{route.title}</h3>
                            {route.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{route.description}</p>
                            )}
                            <div className="flex gap-3 mt-2">
                              {route.duration && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {route.duration}
                                </span>
                              )}
                              {route.difficulty && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {route.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/rutas/${route.slug || route.id}`)}>
                              <Eye className="h-4 w-4 mr-1" /> Ver
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => navigate(`/editar-ruta/${route.slug}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => setConfirmDelete({ type: 'route', id: route.id, title: route.title })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Rutas donde apareces */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Rutas donde apareces</h2>
                {companyRoutes.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Route className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No apareces en ninguna ruta</h3>
                      <p className="text-muted-foreground">
                        Cuando tu empresa sea incluida en una ruta gastronómica, aparecerá aquí
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {companyRoutes.map((route) => (
                      <Card
                        key={route.id}
                        className="hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate(`/rutas/${route.slug || route.id}`)}
                      >
                        <CardContent className="p-4 flex gap-4 items-center">
                          <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {route.image_url ? (
                              <img src={route.image_url} alt={route.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Route className="w-8 h-8 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{route.title}</h3>
                            {route.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{route.description}</p>
                            )}
                            <div className="flex gap-3 mt-2">
                              {route.duration && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {route.duration}
                                </span>
                              )}
                              {route.difficulty && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="w-3 h-3" /> {route.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas Generales</CardTitle>
                <CardDescription>
                  Resumen del rendimiento de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Packs Publicados */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">
                      {packs.filter(p => p.status === 'published').length}
                    </div>
                    <div className="text-sm text-muted-foreground">Packs Publicados</div>
                  </div>

                  {/* Packs Vendidos with inline dropdown */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {soldFilterType === 'all'
                        ? packsSold.total
                        : (packsSold.byType[soldFilterType] || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground inline-flex items-center gap-1">
                      Packs Vendidos
                      <select
                        value={soldFilterType}
                        onChange={(e) => setSoldFilterType(e.target.value)}
                        className="appearance-none bg-transparent text-muted-foreground cursor-pointer pr-4 pl-0 py-0 border-none text-sm focus:outline-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center' }}
                      >
                        <option value="all">▾</option>
                        <option value="micro">Microselección</option>
                        <option value="raiz">Pack Raíz</option>
                        <option value="esencia">Pack Esencia</option>
                        <option value="gourmet">Pack Gourmet</option>
                      </select>
                    </div>
                  </div>

                  {/* Rutas donde apareces */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-foreground">
                      {companyRoutes.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Rutas donde apareces</div>
                  </div>

                  {/* Visitas Totales */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-muted-foreground">
                      {totalViews}
                    </div>
                    <div className="text-sm text-muted-foreground">Visitas Totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Datos de la Empresa
                    </CardTitle>
                    <CardDescription>
                      Los mismos datos que rellenaste en tu solicitud de verificación
                    </CardDescription>
                  </div>
                  {editingSettings ? (
                    <div className="flex gap-2">
                      <Button onClick={saveCompanyProfile} disabled={savingCompany} size="sm">
                        {savingCompany ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Guardar
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditingSettings}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => setEditingSettings(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar datos
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Email - never editable */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Correo electrónico</Label>
                      <Input
                        value={user?.email || ""}
                        readOnly
                        className="bg-muted/50 cursor-default"
                      />
                      <p className="text-xs text-muted-foreground mt-1">El correo no se puede modificar</p>
                    </div>
                    {/* Business type - never editable after registration */}
                    <div>
                      <Label>Tipo de negocio</Label>
                      <Input
                        value={(company as any)?.business_type || "Sin especificar"}
                        readOnly
                        className="bg-muted/50 cursor-default"
                      />
                      <p className="text-xs text-muted-foreground mt-1">El tipo de negocio no se puede modificar</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settings_business_name">Nombre del negocio *</Label>
                      <Input
                        id="settings_business_name"
                        value={companyForm.business_name}
                        onChange={(e) => setCompanyForm({ ...companyForm, business_name: e.target.value })}
                        placeholder="Ej: Quesería La Dehesa"
                        readOnly={!editingSettings}
                        className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings_contact_person">Persona de contacto *</Label>
                      <Input
                        id="settings_contact_person"
                        value={companyForm.contact_person}
                        onChange={(e) => setCompanyForm({ ...companyForm, contact_person: e.target.value })}
                        placeholder="Tu nombre"
                        readOnly={!editingSettings}
                        className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="settings_phone">Teléfono</Label>
                      <Input
                        id="settings_phone"
                        value={companyForm.phone}
                        onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                        placeholder="+34 600 000 000"
                        readOnly={!editingSettings}
                        className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="settings_website">Sitio Web</Label>
                      <Input
                        id="settings_website"
                        value={companyForm.website}
                        onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                        placeholder="https://www.tuempresa.com"
                        readOnly={!editingSettings}
                        className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="settings_address">Dirección</Label>
                    {editingSettings ? (
                      <AddressAutocompleteInput
                        id="settings_address"
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                        onAddressSelect={(addr: AddressComponents) => {
                          setCompanyForm(prev => ({ ...prev, address: addr.formatted_address }));
                          setEditLatLng({ lat: addr.latitude, lng: addr.longitude });
                        }}
                        placeholder="Empieza a escribir tu dirección..."
                        countryRestriction="es"
                      />
                    ) : (
                      <Input
                        value={companyForm.address}
                        readOnly
                        className="bg-muted/50 cursor-default"
                        placeholder="Sin dirección"
                      />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="settings_description">Cuéntanos sobre tu negocio</Label>
                    <Textarea
                      id="settings_description"
                      value={companyForm.description}
                      onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                      placeholder="Historia, productos, métodos tradicionales..."
                      rows={4}
                      readOnly={!editingSettings}
                      className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="settings_authenticity_story">¿Por qué es auténtico tu negocio?</Label>
                    <Textarea
                      id="settings_authenticity_story"
                      value={companyForm.authenticity_story}
                      onChange={(e) => setCompanyForm({ ...companyForm, authenticity_story: e.target.value })}
                      placeholder="Qué te hace diferente, tradiciones, compromiso..."
                      rows={4}
                      readOnly={!editingSettings}
                      className={!editingSettings ? 'bg-muted/50 cursor-default' : ''}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de la Cuenta</CardTitle>
                  <CardDescription>
                    Información sobre el estado de tu cuenta empresarial
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Estado de verificación</p>
                        <p className="text-sm text-muted-foreground">Tu empresa está verificada y aprobada</p>
                      </div>
                      <Badge variant="default" className="bg-green-500">Verificado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Plan actual</p>
                        <p className="text-sm text-muted-foreground">Plan básico gratuito</p>
                      </div>
                      <Badge variant="outline">Básico</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Product Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? "Modifica los datos del producto" : "Añade un nuevo producto a tu catálogo"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={productForm.stock_quantity}
                    onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })}
                    placeholder="Cantidad"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">Origen</Label>
                  <Input
                    id="origin"
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    placeholder="Ej: Andalucía"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Peso</Label>
                  <Input
                    id="weight"
                    value={productForm.weight}
                    onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                    placeholder="Ej: 500g"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="available"
                  checked={productForm.is_available}
                  onCheckedChange={(checked) => setProductForm({ ...productForm, is_available: checked })}
                />
                <Label htmlFor="available">Producto disponible</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={saveProduct} disabled={savingProduct}>
                {savingProduct ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {editingProduct ? "Guardar Cambios" : "Crear Producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar {confirmDelete?.type === 'route' ? 'ruta' : confirmDelete?.type === 'pack' ? 'pack' : 'producto'}?</DialogTitle>
              <DialogDescription>
                Estás a punto de eliminar <strong>{confirmDelete?.title}</strong>. Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
