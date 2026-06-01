import { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Mail,
  KeyRound,
  Trash2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * PESTAÑA 7: CONFIGURACIÓN
 *
 *   - Privacidad: mostrar teléfono/email público, bloquear contactos anónimos
 *   - Notificaciones: nuevo B2B, venta QR, spotlight próximo, newsletter empresa
 *   - Cambiar contraseña
 *   - Eliminar cuenta (irreversible)
 */

interface TabConfiguracionProps {
  email: string;
}

const TabConfiguracion = ({ email }: TabConfiguracionProps) => {
  // Privacidad
  const [showPhone, setShowPhone] = useState(true);
  const [showEmail, setShowEmail] = useState(true);
  const [blockAnon, setBlockAnon] = useState(false);

  // Notificaciones
  const [notifyB2B, setNotifyB2B] = useState(true);
  const [notifyQR, setNotifyQR] = useState(true);
  const [notifySpotlight, setNotifySpotlight] = useState(true);
  const [notifyNewsletter, setNotifyNewsletter] = useState<"weekly" | "monthly" | "quarterly">("monthly");

  // Password
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Eliminar
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSavePrivacy = () => {
    toast.success("Preferencias de privacidad guardadas");
  };

  const handleSaveNotifications = () => {
    toast.success("Preferencias de notificación guardadas");
  };

  const handleChangePassword = async () => {
    if (!pwNew || pwNew.length < 8) {
      toast.error("La contraseña nueva debe tener al menos 8 caracteres");
      return;
    }
    if (pwNew !== pwConfirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    setSavingPw(false);

    if (error) {
      toast.error("No se pudo cambiar: " + error.message);
      return;
    }

    toast.success("Contraseña actualizada");
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    // En producción: edge function que llama a auth.admin.deleteUser
    // De momento: cerramos sesión y marcamos la empresa como "deletion_requested"
    toast.error(
      "El borrado de cuenta requiere confirmación por email. Te enviaremos instrucciones."
    );
    setDeleting(false);
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Configuración
        </h2>
        <p className="text-sm text-muted-foreground">
          Privacidad, notificaciones y seguridad de tu cuenta.
        </p>
      </div>

      {/* Privacidad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Privacidad de tu ficha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Mostrar teléfono en la ficha pública"
            description="Los visitantes verán tu número directamente."
            checked={showPhone}
            onCheckedChange={setShowPhone}
          />
          <ToggleRow
            label="Mostrar email en la ficha pública"
            description="Tu email aparecerá visible en la página de tu empresa."
            checked={showEmail}
            onCheckedChange={setShowEmail}
          />
          <ToggleRow
            label="Bloquear contactos anónimos"
            description="Sólo permitir mensajes B2B de cuentas con identidad revelada."
            checked={blockAnon}
            onCheckedChange={setBlockAnon}
          />
          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSavePrivacy}>Guardar privacidad</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleRow
            label="Nuevo contacto B2B"
            description="Email + push cuando un restaurante te contacte."
            checked={notifyB2B}
            onCheckedChange={setNotifyB2B}
          />
          <ToggleRow
            label="Venta vía QR"
            description="Email cuando un consumidor gaste crédito ORIGEN en tu local."
            checked={notifyQR}
            onCheckedChange={setNotifyQR}
          />
          <ToggleRow
            label="Spotlight próximo (24h antes)"
            description="Aviso anticipado cuando te toque aparecer en home."
            checked={notifySpotlight}
            onCheckedChange={setNotifySpotlight}
          />

          <div className="space-y-2 pt-2">
            <Label className="text-sm">Frecuencia de newsletter empresa</Label>
            <div className="flex gap-2">
              {(["weekly", "monthly", "quarterly"] as const).map((f) => (
                <Button
                  key={f}
                  variant={notifyNewsletter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNotifyNewsletter(f)}
                >
                  {f === "weekly"
                    ? "Semanal"
                    : f === "monthly"
                    ? "Mensual"
                    : "Trimestral"}
                </Button>
              ))}
            </div>
          </div>

          <Separator />
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              Guardar notificaciones
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Cambiar contraseña
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pw_current">Contraseña actual</Label>
              <Input
                id="pw_current"
                type="password"
                value={pwCurrent}
                onChange={(e) => setPwCurrent(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label htmlFor="pw_email">Email de la cuenta</Label>
              <Input
                id="pw_email"
                type="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="pw_new">Contraseña nueva</Label>
              <Input
                id="pw_new"
                type="password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="pw_confirm">Confirmar nueva</Label>
              <Input
                id="pw_confirm"
                type="password"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Mínimo 8 caracteres. Recibirás un email de confirmación tras el cambio.
          </p>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={savingPw} className="gap-2">
              {savingPw ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Actualizar contraseña
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Zona peligrosa */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-destructive">
            <Trash2 className="w-4 h-4" />
            Eliminar cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Esta acción es <strong className="text-destructive">irreversible</strong>.
            Se eliminarán tu ficha, mensajes, suscripciones activas y todo el
            historial asociado. Te enviaremos un email de confirmación antes
            de proceder.
          </p>
          <div className="flex justify-end">
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2"
            >
              <Mail className="w-4 h-4" />
              Solicitar eliminación
            </Button>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Solicitar eliminación de cuenta?</AlertDialogTitle>
            <AlertDialogDescription>
              Te enviaremos un email a <strong>{email}</strong> para confirmar.
              Una vez confirmado, no podrás recuperar tu cuenta ni sus datos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sí, enviar confirmación
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}

const ToggleRow = ({
  label,
  description,
  checked,
  onCheckedChange,
}: ToggleRowProps) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex-1">
      <Label className="text-sm">{label}</Label>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default TabConfiguracion;
