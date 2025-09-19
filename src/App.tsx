import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Mapa from "./pages/Mapa";
import Packs from "./pages/Packs";
import Rutas from "./pages/Rutas";
import RutaDetalle from "./pages/RutaDetalle";
import Contacto from "./pages/Contacto";
import MiZona from "./pages/MiZona";
import SoyEmpresa from "./pages/SoyEmpresa";
import BusinessDetail from "./pages/BusinessDetail";
import CreateRoute from "./pages/CreateRoute";
import PackDetail from "./pages/PackDetail";
import Valoraciones from "./pages/Valoraciones";
import NotFound from "./pages/NotFound";

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
          <Route path="/packs/:id" element={<PackDetail />} />
          <Route path="/rutas" element={<Rutas />} />
          <Route path="/rutas/:id" element={<RutaDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/mi-zona" element={<MiZona />} />
          <Route path="/soy-empresa" element={<SoyEmpresa />} />
          <Route path="/valoraciones" element={<Valoraciones />} />
          <Route path="/negocio/:id" element={<BusinessDetail />} />
          <Route path="/crear-ruta" element={<CreateRoute />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
