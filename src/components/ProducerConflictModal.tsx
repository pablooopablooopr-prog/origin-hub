import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Store, ArrowRight, Info } from "lucide-react";
import type { Company } from "@/hooks/useProducerCarts";
import { PAYMENT_MESSAGES } from "@/lib/paymentRules";

interface ProducerConflictModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCompany: Company | null;
  newCompany: Company | null;
  onCreateNewCart: () => void;
  onKeepCurrent: () => void;
}

const ProducerConflictModal = ({
  open,
  onOpenChange,
  currentCompany,
  newCompany,
  onCreateNewCart,
  onKeepCurrent
}: ProducerConflictModalProps) => {
  if (!currentCompany || !newCompany) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-primary" />
            Cambio de productor
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Estás comprando a <span className="font-semibold text-foreground">{currentCompany.business_name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Rule explanation */}
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              {PAYMENT_MESSAGES.ERRORS.MIXED_PRODUCERS}
            </AlertDescription>
          </Alert>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Este pack pertenece a <span className="font-semibold text-foreground">{newCompany.business_name}</span>.
            </p>
            <p className="text-sm text-muted-foreground">
              Cada productor gestiona sus pedidos de forma independiente y recibe el pago directamente.
            </p>
          </div>

          {/* Current producer info */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            {currentCompany.logo_url ? (
              <img 
                src={currentCompany.logo_url} 
                alt={currentCompany.business_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{currentCompany.business_name}</p>
              <p className="text-xs text-muted-foreground">Carrito activo</p>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
          </div>

          {/* New producer info */}
          <div className="flex items-center gap-3 p-3 border rounded-lg border-dashed">
            {newCompany.logo_url ? (
              <img 
                src={newCompany.logo_url} 
                alt={newCompany.business_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-secondary" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{newCompany.business_name}</p>
              <p className="text-xs text-muted-foreground">Nuevo productor</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={onCreateNewCart}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Crear nuevo carrito para {newCompany.business_name}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onKeepCurrent}
            className="w-full"
          >
            Seguir comprando a {currentCompany.business_name}
          </Button>

          <Button 
            variant="ghost" 
            asChild
            className="w-full"
          >
            <Link to="/mis-carritos">
              Ver mis carritos
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProducerConflictModal;
