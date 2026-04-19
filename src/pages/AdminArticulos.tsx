import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArticuloForm } from "@/components/ArticuloForm";
import { ArticuloPreview } from "@/components/ArticuloPreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Edit2 } from "lucide-react";

interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: string;
  categoria_color: string;
  fecha_publicacion: string;
  tiempo_lectura: number;
  autor: string;
  parrafos: string[];
  secciones?: any;
  parrafos_cierre?: string[];
  referencias?: string[];
  destacado: boolean;
}

const AdminArticulos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load articles
  const loadArticulos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("articulos")
      .select("*")
      .order("fecha_publicacion", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los artículos",
        variant: "destructive",
      });
    } else {
      setArticulos(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadArticulos();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("articulos")
      .delete()
      .eq("id", deleteId);

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setDeleteId(null);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el artículo",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Éxito",
        description: "Artículo eliminado",
      });
      loadArticulos();
    }
  };

  const getArticleColor = (colorClass: string) => {
    if (colorClass.includes("green")) return "bg-green-100 text-green-800";
    if (colorClass.includes("amber")) return "bg-amber-100 text-amber-800";
    if (colorClass.includes("blue")) return "bg-blue-100 text-blue-800";
    if (colorClass.includes("red")) return "bg-red-100 text-red-800";
    return "bg-earth-light text-primary";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Gestor de Artículos
          </h1>
          <p className="text-muted-foreground">
            Crea, edita y gestiona los artículos de la sección Actualidad
          </p>
        </div>

        <Tabs defaultValue="crear" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="crear">Crear nuevo</TabsTrigger>
            <TabsTrigger value="gestionar">Gestionar ({articulos.length})</TabsTrigger>
          </TabsList>

          {/* TAB: CREAR NUEVO */}
          <TabsContent value="crear" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulario */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Nuevo artículo</h2>
                <ArticuloForm
                  onSuccess={() => {
                    loadArticulos();
                    toast({
                      title: "Éxito",
                      description:
                        "El artículo se ha creado y estará disponible en la sección Actualidad",
                    });
                  }}
                />
              </div>

              {/* Preview */}
              <div className="hidden lg:block">
                <h2 className="text-2xl font-bold mb-6">Vista previa</h2>
                <div className="bg-card border border-border rounded-lg overflow-hidden h-full max-h-[800px]">
                  <ArticuloPreview
                    titulo="Título del artículo"
                    extracto="Extracto del artículo..."
                    categoria="Categoría"
                    categoriaColor="bg-earth-light text-primary"
                    fechaPublicacion="dd de mes de yyyy"
                    tiempoLectura={8}
                    autor="Equipo ORIGEN"
                    parrafos={[]}
                    referencias={[]}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB: GESTIONAR */}
          <TabsContent value="gestionar" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : articulos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay artículos aún. Crea uno en la pestaña "Crear nuevo"
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Lectura</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articulos.map((art) => (
                      <TableRow key={art.id}>
                        <TableCell className="font-medium max-w-xs truncate">
                          {art.titulo}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getArticleColor(
                              art.categoria_color
                            )}`}
                          >
                            {art.categoria}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {art.fecha_publicacion}
                        </TableCell>
                        <TableCell className="text-sm">
                          {art.tiempo_lectura} min
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(art.id)}
                            className="gap-1"
                          >
                            <Edit2 className="w-3 h-3" /> Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setDeleteId(art.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive hover:bg-destructive/10 gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      {/* DIALOG: EDITAR ARTÍCULO */}
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar artículo</DialogTitle>
            <DialogDescription>
              Modifica los campos y guarda los cambios
            </DialogDescription>
          </DialogHeader>
          {editingId && (
            <ArticuloForm
              articleId={editingId}
              onSuccess={() => {
                setEditingId(null);
                loadArticulos();
                toast({
                  title: "Éxito",
                  description: "El artículo se ha actualizado",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG: CONFIRMAR ELIMINAR */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar artículo?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. El artículo se eliminará permanentemente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminArticulos;
