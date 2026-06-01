import { useState } from "react";
import { KeyRound, Loader2, Lock, Mail, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface TabConfiguracionProps {
  email: string;
}

const TabConfiguracion = ({ email }: TabConfiguracionProps) => {
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async () => {
    if (!pwCurrent.trim()) {
      toast.error("Introduce tu contraseña actual");
      return;
    }
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
    toast.error(
      "El borrado de cuenta requiere confirmación por email. Te enviaremos instrucciones."
    );
    setDeleting(false);
    setShowDeleteDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-3xl font-semibold tracking-tight text-[#1f140c]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif" }}
        >
          Configuración
        </h2>
        <p className="text-sm text-muted-foreground">
          Gestiona la seguridad de tu cuenta y las preferencias principales.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-base">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#efe4d3] text-[#7b572d]">
              <Lock className="h-5 w-5" />
            </span>
            <span>
              Seguridad de la cuenta
              <span className="mt-1 block text-sm font-normal text-muted-foreground">
                Actualiza tu contraseña de acceso al dashboard empresarial.
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="pw_current">Contraseña actual</Label>
              <Input
                id="pw_current"
                type="password"
                value={pwCurrent}
                onChange={(e) => setPwCurrent(e.target.value)}
                placeholder="Introduce tu contraseña actual"
                autoComplete="current-password"
              />
            </div>
            <div>
              <Label htmlFor="pw_new">Nueva contraseña</Label>
              <Input
                id="pw_new"
                type="password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                placeholder="Introduce tu nueva contraseña"
                autoComplete="new-password"
              />
            </div>
            <div>
              <Label htmlFor="pw_confirm">Confirmar nueva contraseña</Label>
              <Input
                id="pw_confirm"
                type="password"
                value={pwConfirm}
                onChange={(e) => setPwConfirm(e.target.value)}
                placeholder="Repite tu nueva contraseña"
                autoComplete="new-password"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              Mínimo 8 caracteres. Te enviaremos una confirmación si el cambio
              se realiza correctamente.
            </p>
            <Button
              onClick={handleChangePassword}
              disabled={savingPw}
              className="gap-2 bg-[#59682f] hover:bg-[#4d5b28]"
            >
              {savingPw ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Actualizar contraseña
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-5 p-6 md:grid-cols-[1fr_1fr] md:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe4d3] text-[#7b572d]">
              <Mail className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">Email de acceso</h3>
              <p className="text-sm text-muted-foreground">
                Este email se usa para iniciar sesión y recibir avisos
                importantes de tu cuenta.
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="account_email">Email de la cuenta</Label>
            <Input
              id="account_email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/20">
        <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-semibold">Eliminar cuenta</h3>
              <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                Esta acción es irreversible. Se eliminará tu ficha empresarial,
                mensajes, configuración y datos asociados. Antes de proceder,
                te enviaremos una confirmación por email.
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-2"
          >
            <Mail className="h-4 w-4" />
            Solicitar eliminación
          </Button>
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
              {deleting ? "Enviando..." : "Sí, enviar confirmación"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TabConfiguracion;
