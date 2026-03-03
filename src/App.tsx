import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index";
import Mapa from "./pages/Mapa";
import Packs from "./pages/Packs";
import PacksBuscar from "./pages/PacksBuscar";
import Rutas from "./pages/Rutas";
import RutaDetalle from "./pages/RutaDetalle";
import Contacto from "./pages/Contacto";
import SoyCliente from "./pages/SoyCliente";
import SoyEmpresa from "./pages/SoyEmpresa";
import SobreOrigen from "./pages/SobreOrigen";
import EditarPack from "./pages/EditarPack";
import EditarRuta from "./pages/EditarRuta";
import ComprarRuta from "./pages/ComprarRuta";
import MisRutas from "./pages/MisRutas";
import BusinessDetail from "./pages/BusinessDetail";
import CreateRoute from "./pages/CreateRoute";
import PackDetail from "./pages/PackDetail";
import Cart from "./pages/Cart";
import MisCarritos from "./pages/MisCarritos";
import Valoraciones from "./pages/Valoraciones";
import EscribirValoracion from "./pages/EscribirValoracion";
import CompanyAuth from "./pages/CompanyAuth";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyGate from "./components/CompanyGate";
import AdminGate from "./components/AdminGate";
import CompanyPending from "./pages/CompanyPending";
import CompanyRejected from "./pages/CompanyRejected";
import PackBuilder from "./pages/PackBuilder";
import CustomerAuth from "./pages/CustomerAuth";
import AuthCallback from "./pages/AuthCallback";
import CustomerDashboard from "./pages/CustomerDashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCompanies from "./pages/AdminCompanies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
