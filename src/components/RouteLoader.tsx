import { Loader2 } from "lucide-react";

/**
 * Loader de pantalla completa para route guards (CompanyGate, AdminGate).
 * Sustituye al `return null` que causaba "flash blanco" al recargar
 * rutas protegidas mientras se verificaba la sesión.
 */
const RouteLoader = ({ label = "Verificando acceso..." }: { label?: string }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default RouteLoader;
