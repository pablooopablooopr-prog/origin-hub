import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ParrafosEditor } from "@/components/ParrafosEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ArticuloFormProps {
  onSuccess?: () => void;
  articleId?: string;
}

const COLORES = [
  { label: "Marrón", value: "bg-earth-light text-primary" },
  { label: "Verde", value: "bg-green-100 text-green-800" },
  { label: "Ámbar", value: "bg-amber-100 text-amber-800" },
  { label: "Azul", value: "bg-blue-100 text-blue-800" },
  { label: "Rojo", value: "bg-red-100 text-red-800" },
];

const CATEGORIAS = [
  "Política Agraria",
  "Salud y Alimentación",
  "Cadena Alimentaria",
  "Sostenibilidad",
  "Innovación",
  "Testimonios",
];

export const ArticuloForm = ({ onSuccess, articleId }: ArticuloFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!articleId);

  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [extracto, setExtracto] = useState("");
  const [categoria, setCategoria] = useState("Política Agraria");
  const [categoriaColor, setCategoriaColor] = useState(
    "bg-earth-light text-primary"
  );
  const [fechaPublicacion, setFechaPublicacion] = useState("");
  const [tiempoLectura, setTiempoLectura] = useState("8");
  const [autor, setAutor] = useState("Equipo ORIGEN");
  const [parrafos, setParrafos] = useState<string[]>([]);
  const [referencias, setReferencias] = useState<string[]>([]);
  const [destacado, setDestacado] = useState(false);

  // Generate slug from titulo
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTituloChange = (value: string) => {
    setTitulo(value);
    if (!slug || slug === generateSlug(titulo)) {
      setSlug(generateSlug(value));
    }
  };

  // Load article if editing
  useEffect(() => {
    if (!articleId) return;

    const loadArticle = async () => {
      const { data, error } = await supabase
        .from("articulos")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el artículo",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setTitulo(data.titulo);
      setSlug(data.slug);
      setExtracto(data.extracto);
      setCategoria(data.categoria);
      setCategoriaColor(data.categoria_color || "bg-earth-light text-primary");
      setFechaPublicacion(data.fecha_publicacion);
      setTiempoLectura(data.tiempo_lectura.toString());
      setAutor(data.autor);
      setParrafos(data.parrafos || []);
      setReferencias(data.referencias || []);
      setDestacado(data.destacado || false);
      setIsLoading(false);
    };

    loadArticle();
  }, [articleId, toast]);

  const validateForm = () => {
    if (!titulo.trim()) {
      toast({
        title: "Error",
        description: "El título es requerido",
        variant: "destructive",
      });
      return false;
    }
    if (!slug.trim()) {
      toast({
        title: "Error",
        description: "El slug es requerido",
        variant: "destructive",
      });
      return false;
    }
    if (!extracto.trim()) {
      toast({
        title: "Error",
        description: "El extracto es requerido",
        variant: "destructive",
      });
      return false;
    }
    if (!categoria) {
      toast({
        title: "Error",
        description: "La categoría es requerida",
        variant: "destructive",
      });
      return false;
    }
    if (!fechaPublicacion) {
      toast({
        title: "Error",
        description: "La fecha de publicación es requerida",
        variant: "destructive",
      });
      return false;
    }
    if (parrafos.length === 0 || !parrafos.some((p) => p.trim())) {
      toast({
        title: "Error",
        description: "Debe haber al menos un párrafo",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Check slug uniqueness if creating new
      if (!articleId) {
        const { data: existing } = await supabase
          .from("articulos")
          .select("id")
          .eq("slug", slug)
          .single();

        if (existing) {
          toast({
            title: "Error",
            description: "El slug ya existe. Usa uno diferente.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      const articleData = {
        titulo,
        slug,
        extracto,
        categoria,
        categoria_color: categoriaColor,
        fecha_publicacion: fechaPublicacion,
        tiempo_lectura: parseInt(tiempoLectura),
        autor,
        parrafos: parrafos.filter((p) => p.trim()),
        referencias: referencias.filter((r) => r.trim()),
        destacado,
      };

      if (articleId) {
        // Update
        const { error } = await supabase
          .from("articulos")
          .update(articleData)
          .eq("id", articleId);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Artículo actualizado correctamente",
        });
      } else {
        // Create
        const { error } = await supabase
          .from("articulos")
          .insert([articleData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Artículo creado correctamente",
        });

        // Reset form
        setTitulo("");
        setSlug("");
        setExtracto("");
        setCategoria("Política Agraria");
        setFechaPublicacion("");
        setTiempoLectura("8");
        setParrafos([]);
        setReferencias([]);
        setDestacado(false);
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Algo salió mal. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div>
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          value={titulo}
          onChange={(e) => handleTituloChange(e.target.value)}
          placeholder="Título completo del artículo"
          className="mt-2"
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug">Slug (URL-friendly) *</Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="mi-articulo-slug"
          className="mt-2 font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Se genera automáticamente desde el título
        </p>
      </div>

      {/* Extracto */}
      <div>
        <Label htmlFor="extracto">Extracto (resumen) *</Label>
        <Textarea
          id="extracto"
          value={extracto}
          onChange={(e) => setExtracto(e.target.value)}
          placeholder="Breve resumen de 2-3 líneas"
          className="mt-2 min-h-20"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {extracto.length} / 250 caracteres
        </p>
      </div>

      {/* Categoría + Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="categoria">Categoría *</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIAS.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Color del badge</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {COLORES.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setCategoriaColor(color.value)}
                className={`p-2 rounded text-xs font-medium ${color.value} ${
                  categoriaColor === color.value ? "ring-2 ring-foreground" : ""
                }`}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fecha + Tiempo lectura */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fecha">Fecha de publicación *</Label>
          <Input
            id="fecha"
            value={fechaPublicacion}
            onChange={(e) => setFechaPublicacion(e.target.value)}
            placeholder="14 de abril de 2025"
            className="mt-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="tiempo">Tiempo de lectura (min) *</Label>
          <Input
            id="tiempo"
            type="number"
            value={tiempoLectura}
            onChange={(e) => setTiempoLectura(e.target.value)}
            placeholder="8"
            className="mt-2"
            min="1"
            max="60"
          />
        </div>
      </div>

      {/* Autor */}
      <div>
        <Label htmlFor="autor">Autor</Label>
        <Input
          id="autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Equipo ORIGEN"
          className="mt-2"
        />
      </div>

      {/* Párrafos */}
      <ParrafosEditor parrafos={parrafos} onChange={setParrafos} />

      {/* Referencias */}
      <div>
        <label className="text-sm font-semibold text-foreground block mb-2">
          Referencias bibliográficas
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {referencias.map((ref, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={ref}
                onChange={(e) => {
                  const newRefs = [...referencias];
                  newRefs[index] = e.target.value;
                  setReferencias(newRefs);
                }}
                placeholder="Autor (Año). Título de la referencia."
                className="min-h-12 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  setReferencias(referencias.filter((_, i) => i !== index))
                }
                className="px-2 text-destructive hover:bg-destructive/10 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => setReferencias([...referencias, ""])}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          + Añadir referencia
        </Button>
      </div>

      {/* Destacado */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="destacado"
          checked={destacado}
          onCheckedChange={(checked) => setDestacado(checked as boolean)}
        />
        <Label
          htmlFor="destacado"
          className="font-normal cursor-pointer"
        >
          Marcar como destacado (aparecerá en la tarjeta grande)
        </Label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2"
        size="lg"
      >
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {articleId ? "Actualizar artículo" : "Crear artículo"}
      </Button>
    </form>
  );
};
