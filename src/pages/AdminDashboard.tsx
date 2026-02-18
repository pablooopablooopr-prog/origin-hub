import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Shield, Building2, Package, Users, Search, 
  CheckCircle, XCircle, Eye, Loader2, BarChart3,
  Route, ShieldCheck, AlertTriangle
} from "lucide-react";

interface Company {
  id: string;
  business_name: string;
  email: string;
  contact_person: string;
  status: string | null;
  created_at: string;
  region?: { name: string } | null;
}

interface Pack {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  moderation_status: string;
  price: number | null;
  created_at: string;
  company?: { business_name: string } | null;
}

interface DbRoute {
  id: string;
  title: string;
  slug: string;
  moderation_status: string;
  is_public: boolean | null;
  created_at: string;
  duration: string | null;
  difficulty: string | null;
  total_stops: number | null;
}

interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [dbRoutes, setDbRoutes] = useState<DbRoute[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalCompanies: 0,
    pendingCompanies: 0,
    totalPacks: 0,
    publishedPacks: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingModeration: 0,
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/");
      return;
    }

    // Use RPC function for secure server-side role check
    const { data: isAdmin, error } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'admin'
    });

    if (error || !isAdmin) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos de administrador",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadData();
  };

  const loadData = async () => {
    try {
      // Load companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('id, business_name, email, contact_person, status, created_at, region:regions(name)')
        .order('created_at', { ascending: false });

      setCompanies(companiesData || []);

      // Load packs
      const { data: packsData } = await supabase
        .from('company_packs')
        .select('id, title, slug, status, moderation_status, price, created_at, company:companies(business_name)')
        .order('created_at', { ascending: false });

      setPacks(packsData || []);

      // Load routes
      const { data: routesData } = await supabase
        .from('routes')
        .select('id, title, slug, moderation_status, is_public, created_at, duration, difficulty, total_stops')
        .order('created_at', { ascending: false });

      setDbRoutes(routesData || []);

      // Load customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('id, full_name, email, phone, created_at')
        .order('created_at', { ascending: false });

      setCustomers(customersData || []);

      // Load stats
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const pendingPacks = packsData?.filter(p => p.moderation_status === 'pending_review').length || 0;
      const pendingRoutes = routesData?.filter(r => r.moderation_status === 'pending_review').length || 0;

      setStats({
        totalCompanies: companiesData?.length || 0,
        pendingCompanies: companiesData?.filter(c => c.status === 'pending').length || 0,
        totalPacks: packsData?.length || 0,
        publishedPacks: packsData?.filter(p => p.status === 'published').length || 0,
        totalCustomers: customersData?.length || 0,
        totalOrders: ordersCount || 0,
        pendingModeration: pendingPacks + pendingRoutes,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyStatus = async (companyId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ status })
        .eq('id', companyId);

      if (error) throw error;

      setCompanies(companies.map(c => 
        c.id === companyId ? { ...c, status } : c
      ));

      toast({
        title: "Estado actualizado",
        description: `La empresa ha sido ${status === 'approved' ? 'aprobada' : 'actualizada'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updatePackStatus = async (packId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('company_packs')
        .update({ status })
        .eq('id', packId);

      if (error) throw error;

      setPacks(packs.map(p => 
        p.id === packId ? { ...p, status } : p
      ));

      toast({
        title: "Estado actualizado",
        description: `El pack ha sido ${status === 'published' ? 'publicado' : 'actualizado'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateModerationStatus = async (table: 'routes' | 'company_packs', id: string, moderation_status: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ moderation_status })
        .eq('id', id);

      if (error) throw error;

      if (table === 'routes') {
        setDbRoutes(dbRoutes.map(r => r.id === id ? { ...r, moderation_status } : r));
      } else {
        setPacks(packs.map(p => p.id === id ? { ...p, moderation_status } : p));
      }

      const label = moderation_status === 'approved' ? 'aprobado' : moderation_status === 'rejected' ? 'rechazado' : 'actualizado';
      toast({
        title: "Moderación actualizada",
        description: `El contenido ha sido ${label}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getModerationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 text-white">Aprobado</Badge>;
      case 'pending_review':
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white">Rechazado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
      case 'published':
        return <Badge className="bg-green-500">Aprobado</Badge>;
      case 'pending':
      case 'pending_review':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'rejected':
      case 'archived':
        return <Badge className="bg-red-500">Rechazado</Badge>;
      case 'draft':
        return <Badge variant="secondary">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status || 'Sin estado'}</Badge>;
    }
  };

  const pendingRoutes = dbRoutes.filter(r => r.moderation_status === 'pending_review');
  const pendingPacks = packs.filter(p => p.moderation_status === 'pending_review');

  const filteredCompanies = companies.filter(c => 
    c.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPacks = packs.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.company?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(c => 
    c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <section className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Panel de Administración</h1>
              <p className="text-white/70">Gestiona empresas, packs y usuarios</p>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalCompanies}</p>
                  <p className="text-xs text-muted-foreground">Empresas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingCompanies}</p>
                  <p className="text-xs text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalPacks}</p>
                  <p className="text-xs text-muted-foreground">Packs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.publishedPacks}</p>
                  <p className="text-xs text-muted-foreground">Publicados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                  <p className="text-xs text-muted-foreground">Clientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Pedidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={stats.pendingModeration > 0 ? "border-yellow-500" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${stats.pendingModeration > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingModeration}</p>
                  <p className="text-xs text-muted-foreground">Por moderar</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="moderation" className="space-y-6">
          <TabsList>
            <TabsTrigger value="moderation">
              <ShieldCheck className="w-4 h-4 mr-2" />
              Moderación {stats.pendingModeration > 0 && <Badge className="ml-1 bg-yellow-500 text-white text-xs px-1.5">{stats.pendingModeration}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Building2 className="w-4 h-4 mr-2" />
              Empresas ({companies.length})
            </TabsTrigger>
            <TabsTrigger value="packs">
              <Package className="w-4 h-4 mr-2" />
              Packs ({packs.length})
            </TabsTrigger>
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Clientes ({customers.length})
            </TabsTrigger>
          </TabsList>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <div className="space-y-6">
              {/* Pending Routes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Rutas pendientes de revisión ({pendingRoutes.length})
                  </CardTitle>
                  <CardDescription>Revisa y aprueba o rechaza las rutas creadas por los usuarios</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingRoutes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay rutas pendientes de revisión</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ruta</TableHead>
                          <TableHead>Duración</TableHead>
                          <TableHead>Dificultad</TableHead>
                          <TableHead>Paradas</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingRoutes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell className="font-medium">{route.title}</TableCell>
                            <TableCell>{route.duration || '-'}</TableCell>
                            <TableCell>{route.difficulty || '-'}</TableCell>
                            <TableCell>{route.total_stops || 0}</TableCell>
                            <TableCell>{getModerationBadge(route.moderation_status)}</TableCell>
                            <TableCell>{new Date(route.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => updateModerationStatus('routes', route.id, 'approved')}>
                                  <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => updateModerationStatus('routes', route.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-1" /> Rechazar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* Pending Packs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Packs pendientes de revisión ({pendingPacks.length})
                  </CardTitle>
                  <CardDescription>Revisa y aprueba o rechaza los packs creados por las empresas</CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingPacks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No hay packs pendientes de revisión</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pack</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Precio</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingPacks.map((pack) => (
                          <TableRow key={pack.id}>
                            <TableCell className="font-medium">{pack.title}</TableCell>
                            <TableCell>{pack.company?.business_name || '-'}</TableCell>
                            <TableCell>{pack.price ? `${pack.price}€` : '-'}</TableCell>
                            <TableCell>{getModerationBadge(pack.moderation_status)}</TableCell>
                            <TableCell>{new Date(pack.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => updateModerationStatus('company_packs', pack.id, 'approved')}>
                                  <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => updateModerationStatus('company_packs', pack.id, 'rejected')}>
                                  <XCircle className="w-4 h-4 mr-1" /> Rechazar
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              {/* All moderation history */}
              <Card>
                <CardHeader>
                  <CardTitle>Historial de moderación</CardTitle>
                  <CardDescription>Todas las rutas y packs con su estado de moderación</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Moderación</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dbRoutes.filter(r => r.moderation_status !== 'pending_review').map((route) => (
                        <TableRow key={`route-${route.id}`}>
                          <TableCell><Badge variant="outline">Ruta</Badge></TableCell>
                          <TableCell className="font-medium">{route.title}</TableCell>
                          <TableCell>{getModerationBadge(route.moderation_status)}</TableCell>
                          <TableCell>{new Date(route.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select value={route.moderation_status} onValueChange={(v) => updateModerationStatus('routes', route.id, v)}>
                              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending_review">Pendiente</SelectItem>
                                <SelectItem value="approved">Aprobar</SelectItem>
                                <SelectItem value="rejected">Rechazar</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {packs.filter(p => p.moderation_status !== 'pending_review').map((pack) => (
                        <TableRow key={`pack-${pack.id}`}>
                          <TableCell><Badge variant="outline">Pack</Badge></TableCell>
                          <TableCell className="font-medium">{pack.title}</TableCell>
                          <TableCell>{getModerationBadge(pack.moderation_status)}</TableCell>
                          <TableCell>{new Date(pack.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Select value={pack.moderation_status} onValueChange={(v) => updateModerationStatus('company_packs', pack.id, v)}>
                              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending_review">Pendiente</SelectItem>
                                <SelectItem value="approved">Aprobar</SelectItem>
                                <SelectItem value="rejected">Rechazar</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Empresas</CardTitle>
                <CardDescription>Aprobar, rechazar o gestionar empresas registradas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Región</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{company.business_name}</p>
                            <p className="text-sm text-muted-foreground">{company.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{company.contact_person}</TableCell>
                        <TableCell>{company.region?.name || '-'}</TableCell>
                        <TableCell>{getStatusBadge(company.status)}</TableCell>
                        <TableCell>{new Date(company.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            value={company.status || ''}
                            onValueChange={(value) => updateCompanyStatus(company.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Cambiar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="approved">Aprobar</SelectItem>
                              <SelectItem value="rejected">Rechazar</SelectItem>
                              <SelectItem value="suspended">Suspender</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packs Tab */}
          <TabsContent value="packs">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Packs</CardTitle>
                <CardDescription>Revisar y publicar packs de empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pack</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPacks.map((pack) => (
                      <TableRow key={pack.id}>
                        <TableCell>
                          <p className="font-medium">{pack.title}</p>
                        </TableCell>
                        <TableCell>{pack.company?.business_name || '-'}</TableCell>
                        <TableCell>{pack.price ? `${pack.price}€` : '-'}</TableCell>
                        <TableCell>{getStatusBadge(pack.status)}</TableCell>
                        <TableCell>{new Date(pack.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select
                            value={pack.status || ''}
                            onValueChange={(value) => updatePackStatus(pack.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Cambiar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Borrador</SelectItem>
                              <SelectItem value="pending_review">Pendiente</SelectItem>
                              <SelectItem value="published">Publicar</SelectItem>
                              <SelectItem value="archived">Archivar</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Clientes</CardTitle>
                <CardDescription>Ver información de clientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Teléfono</TableHead>
                      <TableHead>Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.full_name}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.phone || '-'}</TableCell>
                        <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
