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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, Heart, MapPin, Mail, Phone, LogOut, Truck, Download, RepeatIcon, Settings, Bell, Lock, Bookmark, Route, Store, Calendar, FileText } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
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

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  
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
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/customer-auth");
      return;
    }

    loadCustomerData(session.user.id);
  };

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
      setOrders(ordersData || []);

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
      setSavedRoutes(savedRoutesData || []);
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
        description: "El pack se ha eliminado de tus favoritos",
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
              <Avatar className="h-16 w-16 border-4 border-white/20">
                <AvatarImage src="" alt={customer?.full_name} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {customer?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
              Mis Rutas
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
                  Packs Guardados
                </CardTitle>
                <CardDescription>
                  Tus packs favoritos guardados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tienes packs favoritos aún</p>
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
                  Rutas Guardadas
                </CardTitle>
                <CardDescription>
                  Rutas que has marcado como favoritas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedRoutes.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tienes rutas guardadas</p>
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
                <div className="text-center py-8">
                  <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground">Próximamente podrás seguir a tus productores favoritos</p>
                </div>
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
                      Explorar Packs
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
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-[#8B7355]" />
                  Rutas Creadas
                </CardTitle>
                <CardDescription>
                  Rutas que has diseñado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Route className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                  <p className="text-muted-foreground text-lg mb-4">No has creado ninguna ruta aún</p>
                  <Button 
                    onClick={() => navigate('/crear-ruta')}
                    className="bg-[#8B7355] hover:bg-[#7A6449]"
                  >
                    Crear Mi Primera Ruta
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#8B7355]" />
                  Rutas Guardadas
                </CardTitle>
                <CardDescription>
                  Rutas de otros usuarios que te interesan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedRoutes.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground">No tienes rutas guardadas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedRoutes.map((savedRoute) => (
                      <Card key={savedRoute.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center justify-between">
                            {savedRoute.route?.title || "Ruta"}
                            <Badge variant="outline" className="border-[#8B7355] text-[#8B7355]">
                              {savedRoute.route?.region?.name || "España"}
                            </Badge>
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
                            variant="default"
                            className="w-full bg-[#8B7355] hover:bg-[#7A6449]"
                            size="sm"
                            onClick={() => navigate(`/rutas/${savedRoute.route?.slug || savedRoute.route_id}`)}
                          >
                            Ver Ruta Completa
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
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
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
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
                    onCheckedChange={(checked) => setNotifications({ ...notifications, offers: checked })}
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
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
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
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
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
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
