import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Mapa = lazy(() => import("./pages/Mapa"));
const Packs = lazy(() => import("./pages/Packs"));
const PacksBuscar = lazy(() => import("./pages/PacksBuscar"));
const PackDetail = lazy(() => import("./pages/PackDetail"));
const Rutas = lazy(() => import("./pages/Rutas"));
const RutaDetalle = lazy(() => import("./pages/RutaDetalle"));
const ComprarRuta = lazy(() => import("./pages/ComprarRuta"));
const MisRutas = lazy(() => import("./pages/MisRutas"));
const Contacto = lazy(() => import("./pages/Contacto"));
const SoyCliente = lazy(() => import("./pages/SoyCliente"));
const SoyEmpresa = lazy(() => import("./pages/SoyEmpresa"));
const SobreOrigen = lazy(() => import("./pages/SobreOrigen"));
const EditarPack = lazy(() => import("./pages/EditarPack"));
const EditarRuta = lazy(() => import("./pages/EditarRuta"));
const BusinessDetail = lazy(() => import("./pages/BusinessDetail"));
const CreateRoute = lazy(() => import("./pages/CreateRoute"));
const Cart = lazy(() => import("./pages/Cart"));
const MisCarritos = lazy(() => import("./pages/MisCarritos"));
const Valoraciones = lazy(() => import("./pages/Valoraciones"));
const EscribirValoracion = lazy(() => import("./pages/EscribirValoracion"));
const CompanyAuth = lazy(() => import("./pages/CompanyAuth"));
const CompanyDashboard = lazy(() => import("./pages/CompanyDashboard"));
const CompanyPending = lazy(() => import("./pages/CompanyPending"));
const CompanyRejected = lazy(() => import("./pages/CompanyRejected"));
const PackBuilder = lazy(() => import("./pages/PackBuilder"));
const CustomerAuth = lazy(() => import("./pages/CustomerAuth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const CustomerDashboard = lazy(() => import("./pages/CustomerDashboard"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FAQ = lazy(() => import("./pages/FAQ"));
const TerminosCondiciones = lazy(() => import("./pages/TerminosCondiciones"));
const PoliticaPrivacidad = lazy(() => import("./pages/PoliticaPrivacidad"));
const PoliticaCookies = lazy(() => import("./pages/PoliticaCookies"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminCompanies = lazy(() => import("./pages/AdminCompanies"));
const AdminReferrals = lazy(() => import("./pages/AdminReferrals"));

// Gate components (small, keep eager)
import CompanyGate from "./components/CompanyGate";
import AdminGate from "./components/AdminGate";

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/packs" element={<Packs />} />
            <Route path="/packs/buscar" element={<PacksBuscar />} />
            <Route path="/packs/:id" element={<PackDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/mis-carritos" element={<MisCarritos />} />
            <Route path="/rutas" element={<Rutas />} />
            <Route path="/rutas/:id" element={<RutaDetalle />} />
            <Route path="/comprar-ruta/:slug" element={<ComprarRuta />} />
            <Route path="/mis-rutas" element={<MisRutas />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/soy-cliente" element={<SoyCliente />} />
            <Route path="/soy-empresa" element={<SoyEmpresa />} />
            <Route path="/sobre-origen" element={<SobreOrigen />} />
            <Route path="/editar-pack" element={<EditarPack />} />
            <Route path="/editar-pack/:packId" element={<EditarPack />} />
            <Route path="/editar-ruta/:slug" element={<EditarRuta />} />
            <Route path="/valoraciones" element={<Valoraciones />} />
            <Route path="/escribir-valoracion" element={<EscribirValoracion />} />
            <Route path="/negocio/:id" element={<BusinessDetail />} />
            <Route path="/crear-ruta" element={<CreateRoute />} />
            <Route path="/company-auth" element={<CompanyAuth />} />
            <Route path="/company-pending" element={<CompanyPending />} />
            <Route path="/company-rejected" element={<CompanyRejected />} />
            <Route path="/company-dashboard" element={<CompanyGate><CompanyDashboard /></CompanyGate>} />
            <Route path="/pack-builder" element={<PackBuilder />} />
            <Route path="/pack-builder/:packId" element={<PackBuilder />} />
            <Route path="/customer-auth" element={<CustomerAuth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/mi-cuenta" element={<CustomerDashboard />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
            <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="/politica-cookies" element={<PoliticaCookies />} />
            <Route path="/admin" element={<Navigate to="/admin/companies" replace />} />
            <Route path="/admin/companies" element={<AdminGate><AdminCompanies /></AdminGate>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
