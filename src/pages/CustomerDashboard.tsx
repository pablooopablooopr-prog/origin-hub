import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PasswordInput from "@/components/PasswordInput";
import { User, Package, Heart, MapPin, Mail, Phone, LogOut, Truck, Download, RepeatIcon, Settings, Bell, Lock, Bookmark, Route, Store, Calendar, FileText, Camera, Trash2 } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  company_packs?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  products?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  order_date: string;
  tracking_number?: string;
  estimated_delivery?: string;
  shipping_address?: string;
  payment_status?: string;
  order_items?: OrderItem[];
}

interface Favorite {
  id: string;
  pack_id: string;
  company_packs?: {
    id: string;
    title: string;
    price: number;
  };
}

interface SavedRoute {
  id: string;
  route_id: string;
  notes: string | null;
  route?: {
    id: string;
    title: string;
    slug: string;
    duration: string | null;
    total_stops: number | null;
    region?: {
      name: string;
    } | null;
  } | null;
}

interface CreatedRoute {
  id: string;
  title: string;
  slug: string;
  duration: string | null;
  total_stops: number | null;
  is_public: boolean | null;
  is_active: boolean | null;
  created_at: string;
  image_url: string | null;
}

interface FavoriteCompany {
  id: string;
  company_id: string;
  company?: {
    id: string;
    business_name: string;
    slug: string | null;
    logo_url: string | null;
    description: string | null;
  } | null;
}

interface PurchasedRoute {
  id: string;
  route_id: string;
  num_people: number;
  final_price: number;
  purchased_at: string;
  route?: {
    id: string;
    title: string;
    slug: string;
    duration: string | null;
    total_stops: number | null;
    image_url: string | null;
  } | null;
}

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [createdRoutes, setCreatedRoutes] = useState<CreatedRoute[]>([]);
  const [favoriteCompanies, setFavoriteCompanies] = useState<FavoriteCompany[]>([]);
  const [purchasedRoutes, setPurchasedRoutes] = useState<PurchasedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Configuration states
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ full_name: "", phone: "", address: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    offers: true,
    newsletter: true
  });
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [deleteRouteConfirm, setDeleteRouteConfirm] = useState<{ id: string; title: string } | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!user) {
        navigate("/customer-auth");
        return;
      }

      // Check admin FIRST — redirect before loading customer data
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!mounted) return;

      if (adminRole) {
        navigate("/admin/companies", { replace: true });
        return;
      }

      // Check if user is a company — redirect to company dashboard
      const { data: companyStatus } = await supabase.rpc("get_my_company_status");
      if (!mounted) return;
      const normalizedStatus = String(companyStatus ?? "").trim().toUpperCase();
      if (normalizedStatus !== "") {
        // User has a company record — send them to company flow
        if (normalizedStatus === "APPROVED") {
          navigate("/company-dashboard", { replace: true });
        } else if (normalizedStatus === "PENDING") {
          navigate("/company-pending", { replace: true });
        } else if (normalizedStatus === "REJECTED") {
          navigate("/company-rejected", { replace: true });
        } else {
          navigate("/company-auth", { replace: true });
        }
        return;
      }

      // Not admin, not company — load customer data
      loadCustomerData(user.id);
    };

    init();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const loadCustomerData = async (userId: string) => {
    try {
      // Load customer profile
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (customerError) throw customerError;
      setCustomer(customerData);
      setEditedData({
        full_name: customerData.full_name,
        phone: customerData.phone || "",
        address: customerData.address || ""
      });
      // Load notification preferences
      setNotifications({
        email: customerData.notification_email ?? true,
        sms: customerData.notification_sms ?? false,
        offers: customerData.notification_offers ?? true,
        newsletter: customerData.notification_newsletter ?? true
      });

      // Load orders with items
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          total_amount,
          order_date,
          tracking_number,
          estimated_delivery,
          shipping_address,
          payment_status,
          order_items(
            id,
            quantity,
            unit_price,
            total_price,
            company_packs(id, title, slug),
            products(id, name, slug)
          )
        `)
        .eq('customer_id', customerData.id)
        .order('order_date', { ascending: false });

      if (ordersError) throw ordersError;
      setOrders((ordersData || []) as any);

      // Load favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select(`
          *,
          company_packs(id, title, price)
        `)
        .eq('customer_id', customerData.id);

      if (favoritesError) throw favoritesError;
      setFavorites(favoritesData || []);
      
      // Load saved routes from database
      const { data: savedRoutesData, error: savedRoutesError } = await supabase
        .from('saved_routes')
        .select(`
          id,
          route_id,
          notes,
          route:routes(id, title, slug, duration, total_stops, region:regions(name))
        `)
        .eq('customer_id', customerData.id);

      if (savedRoutesError) throw savedRoutesError;
      setSavedRoutes((savedRoutesData || []).map((r: any) => {
        const routeRaw = Array.isArray(r.route) ? r.route[0] : r.route;
        const regionRaw = routeRaw ? (Array.isArray(routeRaw.region) ? routeRaw.region[0] : routeRaw.region) : null;
        return { ...r, route: routeRaw ? { ...routeRaw, region: regionRaw } : null };
      }));

      // Load routes created by the user
      const { data: createdRoutesData } = await supabase
        .from('routes')
        .select('id, title, slug, duration, total_stops, is_public, is_active, created_at, image_url')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      setCreatedRoutes((createdRoutesData || []) as CreatedRoute[]);

      // Load favorite companies
      const { data: favCompaniesData } = await supabase
        .from('favorite_companies')
        .select(`
          id,
          company_id,
          company:companies_public(id, business_name, slug, logo_url, description)
        `)
        .eq('customer_id', customerData.id);

      setFavoriteCompanies((favCompaniesData || []).map((fc: any) => ({
        ...fc,
        company: Array.isArray(fc.company) ? fc.company[0] : fc.company
      })));

      // Load purchased routes
      const { data: purchasedRoutesData } = await supabase
        .from('route_purchases')
        .select(`
          id,
          route_id,
          num_people,
          final_price,
          purchased_at,
          route:routes(id, title, slug, duration, total_stops, image_url)
        `)
        .eq('customer_id', customerData.id)
        .eq('payment_status', 'completed')
        .order('purchased_at', { ascending: false });

      setPurchasedRoutes((purchasedRoutesData || []).map((pr: any) => ({
        ...pr,
        route: Array.isArray(pr.route) ? pr.route[0] : pr.route
      })));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: "Favorito eliminado",
        description: "La selección se ha eliminado de tus favoritos",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProfile = async () => {
    if (!customer) return;
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          full_name: editedData.full_name,
          phone: editedData.phone,
          address: editedData.address
        })
        .eq('id', customer.id);

      if (error) throw error;

      setCustomer({ ...customer, ...editedData });
      setEditMode(false);
      toast({
        title: "Perfil actualizado",
        description: "Tus datos se han actualizado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.new
      });

      if (error) throw error;

      setPasswordData({ current: "", new: "", confirm: "" });
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha cambiado correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateNotificationPreference = async (key: keyof typeof notifications, value: boolean) => {
    if (!customer) return;
    
    // Optimistically update the UI
    setNotifications(prev => ({ ...prev, [key]: value }));
    
    try {
      const updateData: Record<string, boolean> = {};
      updateData[`notification_${key}`] = value;
      
      const { error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', customer.id);

      if (error) throw error;

      toast({
        title: "Preferencia guardada",
        description: value 
          ? `Recibirás notificaciones ${key === 'email' ? 'por email' : key === 'sms' ? 'por SMS' : key === 'offers' ? 'de ofertas' : 'del newsletter'}`
          : `Notificaciones ${key === 'email' ? 'por email' : key === 'sms' ? 'por SMS' : key === 'offers' ? 'de ofertas' : 'del newsletter'} desactivadas`,
      });
    } catch (error: any) {
      // Revert on error
      setNotifications(prev => ({ ...prev, [key]: !value }));
      toast({
        title: "Error",
        description: "No se pudo guardar la preferencia",
        variant: "destructive",
      });
    }
  };

  const repeatOrder = (packId: string) => {
    navigate(`/packs/${packId}`);
    toast({
      title: "Repetir compra",
      description: "Te hemos redirigido al pack para repetir la compra",
    });
  };

  const downloadInvoice = (orderId: string) => {
    toast({
      title: "Descargando factura",
      description: `Preparando factura #${orderId.substring(0, 8)}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0]">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />
      
      {/* Header pequeño con avatar y nombre */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-4 border-white/20">
                  <AvatarImage src={customer?.avatar_url || ""} alt={customer?.full_name} />
                  <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                    {customer?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 cursor-pointer hover:bg-gray-100 transition-colors shadow-md"
                >
                  <Camera className="w-3 h-3 text-[#8B7355]" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file || !customer) return;
                      
                      // Get user_id for RLS-compatible path
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) {
                        toast({
                          title: "Error",
                          description: "Debes iniciar sesión para subir imágenes",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      setUploadingAvatar(true);
                      try {
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Date.now()}.${fileExt}`;
                        // Use user.id as folder for RLS policy compliance
                        const filePath = `${user.id}/${fileName}`;
                        
                        const { error: uploadError } = await supabase.storage
                          .from('customer-avatars')
                          .upload(filePath, file, { upsert: true });
                        
                        if (uploadError) throw uploadError;
                        
                        const { data: { publicUrl } } = supabase.storage
                          .from('customer-avatars')
                          .getPublicUrl(filePath);
                        
                        const { error: updateError } = await supabase
                          .from('customers')
                          .update({ avatar_url: publicUrl })
                          .eq('id', customer.id);
                        
                        if (updateError) throw updateError;
                        
                        setCustomer({ ...customer, avatar_url: publicUrl });
                        toast({
                          title: "Foto actualizada",
                          description: "Tu foto de perfil se ha actualizado correctamente",
                        });
                      } catch (error: any) {
                        console.error("Avatar upload error:", error);
                        toast({
                          title: "Error",
                          description: error.message || "No se pudo subir la imagen",
                          variant: "destructive",
                        });
                      } finally {
                        setUploadingAvatar(false);
                      }
                    }}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{customer?.full_name}</h1>
                <p className="text-white/80 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {customer?.email}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-8 max-w-7xl">
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="favorites" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
              <Heart className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
              <Package className="w-4 h-4 mr-2" />
              Mis Compras
            </TabsTrigger>
            <TabsTrigger value="routes" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
              <Route className="w-4 h-4 mr-2" />
              Mis Experiencias
            </TabsTrigger>
            <TabsTrigger value="config" className="data-[state=active]:bg-[#8B7355] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </TabsTrigger>
          </TabsList>

          {/* A. FAVORITOS */}
          <TabsContent value="favorites" className="space-y-6">
            {/* Packs Guardados */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#8B7355]" />
                  Selecciones Guardadas
                </CardTitle>
                <CardDescription>
                  Tus selecciones favoritas guardadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tienes selecciones favoritas aún</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            {favorite.company_packs?.title}
                          </CardTitle>
                          <CardDescription className="text-lg font-bold text-[#8B7355]">
                            {favorite.company_packs?.price}€
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <Button
                            variant="default"
                            className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
                            size="sm"
                            onClick={() => navigate(`/packs/${favorite.company_packs?.id}`)}
                          >
                            Ver Pack
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            Eliminar
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rutas Guardadas */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#8B7355]" />
                  Experiencias Guardadas
                </CardTitle>
                <CardDescription>
                  Experiencias que has marcado como favoritas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedRoutes.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tienes experiencias guardadas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedRoutes.map((savedRoute) => (
                      <Card key={savedRoute.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            {savedRoute.route?.title || "Ruta"}
                            <Badge variant="outline">{savedRoute.route?.region?.name || "España"}</Badge>
                          </CardTitle>
                          <CardDescription className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {savedRoute.route?.duration || "1 día"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {savedRoute.route?.total_stops || 0} paradas
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="outline"
                            className="w-full"
                            size="sm"
                            onClick={() => navigate(`/rutas/${savedRoute.route?.slug || savedRoute.route_id}`)}
                          >
                            Ver Ruta
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Empresas Favoritas */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#8B7355]" />
                  Empresas/Productores Favoritos
                </CardTitle>
                <CardDescription>
                  Productores locales que sigues
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoriteCompanies.length === 0 ? (
                  <div className="text-center py-8">
                    <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No sigues a ningún productor aún</p>
                    <Button 
                      variant="outline"
                      className="mt-3"
                      onClick={() => navigate('/mapa')}
                    >
                      Descubrir Productores
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteCompanies.map((fc) => (
                      <Card key={fc.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            {fc.company?.logo_url ? (
                              <img src={fc.company.logo_url} alt={fc.company.business_name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Store className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <CardTitle className="text-base">{fc.company?.business_name || "Productor"}</CardTitle>
                          </div>
                          {fc.company?.description && (
                            <CardDescription className="line-clamp-2 mt-2">{fc.company.description}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <Button
                            variant="default"
                            className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
                            size="sm"
                            onClick={() => navigate(`/negocio/${fc.company?.slug || fc.company_id}`)}
                          >
                            Ver Productor
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* B. MIS COMPRAS */}
          <TabsContent value="orders">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#8B7355]" />
                  Historial de Compras
                </CardTitle>
                <CardDescription>
                  Todos tus pedidos realizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground text-lg mb-4">No tienes pedidos aún</p>
                    <Button 
                      onClick={() => navigate('/packs')}
                      className="bg-[#8B7355] hover:bg-[#7A6449]"
                    >
                      Explorar Selecciones
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const firstItem = order.order_items?.[0];
                      const firstPack = firstItem?.company_packs;
                      const firstProduct = firstItem?.products;
                      const itemCount = order.order_items?.length || 0;
                      const displayName = firstPack?.title || firstProduct?.name || "Pedido";
                      const repeatId = firstPack?.slug || firstPack?.id;
                      
                      return (
                        <Card key={order.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex gap-4">
                                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="w-10 h-10 text-muted-foreground" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg mb-1">
                                    {displayName}
                                    {itemCount > 1 && (
                                      <span className="text-sm font-normal text-muted-foreground ml-2">
                                        +{itemCount - 1} más
                                      </span>
                                    )}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(order.order_date).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric'
                                    })}
                                  </CardDescription>
                                  <p className="text-xl font-bold text-[#8B7355] mt-2">
                                    {order.total_amount}€
                                  </p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge className={getStatusColor(order.status) + " text-white"}>
                                  {getStatusText(order.status)}
                                </Badge>
                                {order.payment_status && (
                                  <Badge variant="outline" className="text-xs">
                                    {order.payment_status === 'paid' ? 'Pagado' : 
                                     order.payment_status === 'pending' ? 'Pago pendiente' : 
                                     order.payment_status}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {/* Order items summary */}
                            {order.order_items && order.order_items.length > 0 && (
                              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-2">Productos del pedido:</p>
                                <div className="space-y-1">
                                  {order.order_items.slice(0, 3).map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <span>{item.company_packs?.title || item.products?.name || 'Producto'} x{item.quantity}</span>
                                      <span className="font-medium">{item.total_price}€</span>
                                    </div>
                                  ))}
                                  {order.order_items.length > 3 && (
                                    <p className="text-xs text-muted-foreground">
                                      +{order.order_items.length - 3} productos más
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex gap-2">
                              {repeatId && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="flex-1 bg-[#8B7355] hover:bg-[#7A6449]"
                                  onClick={() => repeatOrder(repeatId)}
                                >
                                  <RepeatIcon className="w-4 h-4 mr-2" />
                                  Repetir Compra
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className={repeatId ? "flex-1" : "w-full"}
                                onClick={() => downloadInvoice(order.id)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Descargar Factura
                              </Button>
                            </div>
                            {order.tracking_number && (
                              <div className="mt-3 p-3 bg-muted rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Número de seguimiento</p>
                                <p className="font-mono text-sm font-medium flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-[#8B7355]" />
                                  {order.tracking_number}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* C. MIS RUTAS */}
          <TabsContent value="routes" className="space-y-6">
            {/* Rutas Compradas */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#8B7355]" />
                  Experiencias Compradas
                </CardTitle>
                <CardDescription>
                  Experiencias autoguiadas que has adquirido
                </CardDescription>
              </CardHeader>
              <CardContent>
                {purchasedRoutes.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No has comprado experiencias aún</p>
                    <Button 
                      variant="outline"
                      className="mt-3"
                      onClick={() => navigate('/rutas')}
                    >
                      Explorar Experiencias
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purchasedRoutes.map((pr) => (
                      <Card key={pr.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{pr.route?.title || "Ruta"}</CardTitle>
                          <CardDescription className="flex gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {pr.route?.total_stops || 0} paradas
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(pr.purchased_at).toLocaleDateString('es-ES')}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="bg-green-100 text-green-700 mb-3">
                            Acceso activo
                          </Badge>
                          <Button
                            variant="default"
                            className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
                            size="sm"
                            onClick={() => navigate(`/rutas/${pr.route?.slug || pr.route_id}`)}
                          >
                            Ver Ruta
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rutas Creadas */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#8B7355]" />
                  Experiencias Creadas
                </CardTitle>
                <CardDescription>
                  Experiencias que has diseñado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {createdRoutes.length === 0 ? (
                  <div className="text-center py-12">
                    <Route className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground text-lg mb-4">No has creado ninguna experiencia aún</p>
                    <Button 
                      onClick={() => navigate('/crear-ruta')}
                      className="bg-[#8B7355] hover:bg-[#7A6449]"
                    >
                      Crear Mi Primera Experiencia
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {createdRoutes.map((route) => (
                      <Card key={route.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                            {route.image_url ? (
                              <img src={route.image_url} alt={route.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Route className="w-6 h-6 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{route.title}</h4>
                            <div className="flex gap-3 mt-1">
                              <Badge variant={route.is_public ? "default" : "secondary"} className="text-xs">
                                {route.is_public ? "Pública" : "Privada"}
                              </Badge>
                              {route.duration && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {route.duration}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {route.total_stops || 0} paradas
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-[#8B7355] hover:bg-[#7A6449]"
                              onClick={() => navigate(`/rutas/${route.slug}`)}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteRouteConfirm({ id: route.id, title: route.title })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <div className="text-center pt-4">
                      <Button 
                        onClick={() => navigate('/crear-ruta')}
                        className="bg-[#8B7355] hover:bg-[#7A6449]"
                      >
                        Crear Nueva Ruta
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          {/* D. CONFIGURACIÓN */}
          <TabsContent value="config" className="space-y-6">
            {/* Datos Personales */}
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#8B7355]" />
                      Datos Personales
                    </CardTitle>
                    <CardDescription>
                      Actualiza tu información personal
                    </CardDescription>
                  </div>
                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditMode(false);
                          setEditedData({
                            full_name: customer?.full_name || "",
                            phone: customer?.phone || "",
                            address: customer?.address || ""
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#8B7355] hover:bg-[#7A6449]"
                        onClick={updateProfile}
                      >
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    {editMode ? (
                      <Input
                        id="name"
                        value={editedData.full_name}
                        onChange={(e) => setEditedData({ ...editedData, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium p-2 bg-muted rounded">{customer?.full_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="font-medium p-2 bg-muted rounded text-muted-foreground">{customer?.email}</p>
                    <p className="text-xs text-muted-foreground">No se puede modificar el email</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    {editMode ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={editedData.phone}
                        onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium p-2 bg-muted rounded">{customer?.phone || "No especificado"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    {editMode ? (
                      <Input
                        id="address"
                        value={editedData.address}
                        onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                      />
                    ) : (
                      <p className="font-medium p-2 bg-muted rounded">{customer?.address || "No especificada"}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notificaciones */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#8B7355]" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Gestiona cómo quieres recibir noticias
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif" className="text-base font-medium cursor-pointer">
                      Notificaciones por Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones de pedidos por email
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notifications.email}
                    onCheckedChange={(checked) => updateNotificationPreference('email', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notif" className="text-base font-medium cursor-pointer">
                      Notificaciones por SMS
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe alertas importantes por SMS
                    </p>
                  </div>
                  <Switch
                    id="sms-notif"
                    checked={notifications.sms}
                    onCheckedChange={(checked) => updateNotificationPreference('sms', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="offers-notif" className="text-base font-medium cursor-pointer">
                      Ofertas y Promociones
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe ofertas exclusivas de productores
                    </p>
                  </div>
                  <Switch
                    id="offers-notif"
                    checked={notifications.offers}
                    onCheckedChange={(checked) => updateNotificationPreference('offers', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter-notif" className="text-base font-medium cursor-pointer">
                      Newsletter
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Recibe nuestro boletín mensual
                    </p>
                  </div>
                  <Switch
                    id="newsletter-notif"
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) => updateNotificationPreference('newsletter', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contraseña */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#8B7355]" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>
                  Actualiza tu contraseña de acceso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <PasswordInput
                      id="new-password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <PasswordInput
                      id="confirm-password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      placeholder="Repite la contraseña"
                    />
                  </div>
                  <Button
                    onClick={updatePassword}
                    disabled={!passwordData.new || !passwordData.confirm}
                    className="bg-[#8B7355] hover:bg-[#7A6449]"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Actualizar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Botón Cerrar Sesión */}
            <Card className="shadow-md border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive">Cerrar Sesión</CardTitle>
                <CardDescription>
                  Sal de tu cuenta de ORIGEN
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full md:w-auto"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Confirm Delete Route Dialog */}
      <Dialog open={!!deleteRouteConfirm} onOpenChange={(open) => !open && setDeleteRouteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar ruta?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar <strong>{deleteRouteConfirm?.title}</strong>. Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRouteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={async () => {
              if (!deleteRouteConfirm) return;
              try {
                await supabase.from('route_stops').delete().eq('route_id', deleteRouteConfirm.id);
                const { error } = await supabase.from('routes').delete().eq('id', deleteRouteConfirm.id);
                if (error) throw error;
                setCreatedRoutes(createdRoutes.filter(r => r.id !== deleteRouteConfirm.id));
                toast({ title: "Ruta eliminada" });
              } catch (err: any) {
                toast({ title: "Error", description: err.message, variant: "destructive" });
              }
              setDeleteRouteConfirm(null);
            }}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
