import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import CrearRuta from "./pages/CrearRuta";
import BusinessDetail from "./pages/BusinessDetail";
import CreateRoute from "./pages/CreateRoute";
import PackDetail from "./pages/PackDetail";
import Cart from "./pages/Cart";
import Valoraciones from "./pages/Valoraciones";
import EscribirValoracion from "./pages/EscribirValoracion";
import CompanyAuth from "./pages/CompanyAuth";
import CompanyDashboard from "./pages/CompanyDashboard";
import PackBuilder from "./pages/PackBuilder";
import CustomerAuth from "./pages/CustomerAuth";
import CustomerDashboard from "./pages/CustomerDashboard";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PoliticaCookies from "./pages/PoliticaCookies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mapa" element={<Mapa />} />
          <Route path="/packs" element={<Packs />} />
          <Route path="/packs/buscar" element={<PacksBuscar />} />
          <Route path="/packs/:id" element={<PackDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/rutas/:id" element={<RutaDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/soy-cliente" element={<SoyCliente />} />
          <Route path="/soy-empresa" element={<SoyEmpresa />} />
          <Route path="/sobre-origen" element={<SobreOrigen />} />
          <Route path="/editar-pack" element={<EditarPack />} />
          <Route path="/editar-pack/:packId" element={<EditarPack />} />
          <Route path="/crear-ruta" element={<CrearRuta />} />
          <Route path="/valoraciones" element={<Valoraciones />} />
          <Route path="/escribir-valoracion" element={<EscribirValoracion />} />
          <Route path="/negocio/:id" element={<BusinessDetail />} />
          <Route path="/crear-ruta" element={<CreateRoute />} />
          <Route path="/company-auth" element={<CompanyAuth />} />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />
          <Route path="/pack-builder" element={<PackBuilder />} />
          <Route path="/pack-builder/:packId" element={<PackBuilder />} />
          <Route path="/customer-auth" element={<CustomerAuth />} />
          <Route path="/soy-cliente" element={<CustomerDashboard />} />
          <Route path="/mi-cuenta" element={<CustomerDashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terminos-condiciones" element={<TerminosCondiciones />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/politica-cookies" element={<PoliticaCookies />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
