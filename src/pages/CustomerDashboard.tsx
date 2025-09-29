import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, Heart, MapPin, Mail, Phone, LogOut, Truck } from "lucide-react";

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  order_date: string;
  tracking_number?: string;
  estimated_delivery?: string;
  company_packs?: {
    title: string;
  };
}

interface Favorite {
  id: string;
  company_packs?: {
    id: string;
    title: string;
    price: number;
  };
}

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
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

      // Load orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          company_packs(title)
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mi Zona</h1>
            <p className="text-muted-foreground">Bienvenido, {customer?.full_name}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Heart className="w-4 h-4 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Datos Personales</CardTitle>
                <CardDescription>
                  Información de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-4 h-4 mr-2" />
                      Nombre
                    </div>
                    <p className="font-medium">{customer?.full_name}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </div>
                    <p className="font-medium">{customer?.email}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      Teléfono
                    </div>
                    <p className="font-medium">{customer?.phone || "No especificado"}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      Dirección
                    </div>
                    <p className="font-medium">{customer?.address || "No especificada"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No tienes pedidos aún</p>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            {order.company_packs?.title || "Pack"}
                          </CardTitle>
                          <CardDescription>
                            Pedido realizado el {new Date(order.order_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-bold">{order.total_amount}€</p>
                        </div>
                        {order.tracking_number && (
                          <div>
                            <p className="text-sm text-muted-foreground">Número de seguimiento</p>
                            <p className="font-medium flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              {order.tracking_number}
                            </p>
                          </div>
                        )}
                        {order.estimated_delivery && (
                          <div>
                            <p className="text-sm text-muted-foreground">Entrega estimada</p>
                            <p className="font-medium">
                              {new Date(order.estimated_delivery).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.length === 0 ? (
                <Card className="col-span-full">
                  <CardContent className="py-8 text-center">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No tienes favoritos aún</p>
                  </CardContent>
                </Card>
              ) : (
                favorites.map((favorite) => (
                  <Card key={favorite.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {favorite.company_packs?.title}
                      </CardTitle>
                      <CardDescription>
                        {favorite.company_packs?.price}€
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/packs/${favorite.company_packs?.id}`)}
                      >
                        Ver Pack
                      </Button>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => removeFavorite(favorite.id)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Eliminar
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerDashboard;
