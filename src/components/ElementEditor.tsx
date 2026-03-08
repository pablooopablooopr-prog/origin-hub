import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PackElement {
  id: string;
  element_type: string;
  content: any;
  position: number;
  styles: any;
}

interface ElementEditorProps {
  element: PackElement;
  onUpdate: (updates: Partial<PackElement>) => void;
  onClose: () => void;
}

export default function ElementEditor({ element, onUpdate, onClose }: ElementEditorProps) {
  const [content, setContent] = useState(element.content);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setContent(element.content);
  }, [element]);

  const handleContentUpdate = (newContent: any) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  const uploadFile = async (file: File, type: 'image' | 'video' | 'file') => {
    if (!file) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated');

      // Get company ID
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!company) throw new Error('Company not found');

      const fileExt = file.name.split('.').pop();
      const fileName = `${company.id}/${type}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('company-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-files')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error: any) {
      toast.error(error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'file') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, type);
    if (url) {
      if (type === 'image') {
        handleContentUpdate({
          ...content,
          url,
          alt: content.alt || file.name
        });
      } else if (type === 'file') {
        handleContentUpdate({
          ...content,
          url,
          name: content.name || file.name,
          type: file.type
        });
      }
    }
  };

  const renderEditor = () => {
    switch (element.element_type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Tipo de texto</Label>
              <Select
                value={content.tag || 'p'}
                onValueChange={(value) => handleContentUpdate({ ...content, tag: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Título Principal</SelectItem>
                  <SelectItem value="h2">Título Secundario</SelectItem>
                  <SelectItem value="h3">Subtítulo</SelectItem>
                  <SelectItem value="p">Párrafo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Contenido</Label>
              <Textarea
                value={content.text || ''}
                onChange={(e) => handleContentUpdate({ ...content, text: e.target.value })}
                rows={6}
                placeholder="Escribe tu texto aquí..."
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Imagen</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'image')}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Subiendo...' : 'Subir Imagen'}
                  </Button>
                </label>
              </div>
              {content.url && (
                <img src={content.url} alt={content.alt} className="mt-2 max-w-full h-32 object-cover rounded" />
              )}
            </div>
            <div>
              <Label>Texto alternativo</Label>
              <Input
                value={content.alt || ''}
                onChange={(e) => handleContentUpdate({ ...content, alt: e.target.value })}
                placeholder="Describe la imagen"
              />
            </div>
            <div>
              <Label>Pie de foto</Label>
              <Input
                value={content.caption || ''}
                onChange={(e) => handleContentUpdate({ ...content, caption: e.target.value })}
                placeholder="Pie de foto opcional"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL del vídeo</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => handleContentUpdate({ ...content, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label>Título</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ ...content, title: e.target.value })}
                placeholder="Título del vídeo"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleContentUpdate({ ...content, description: e.target.value })}
                placeholder="Descripción del vídeo"
              />
            </div>
          </div>
        );

      case 'price':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Precio</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={content.amount || ''}
                  onChange={(e) => handleContentUpdate({ ...content, amount: e.target.value })}
                  placeholder="29.99"
                />
              </div>
              <div>
                <Label>Moneda</Label>
                <Select
                  value={content.currency || '€'}
                  onValueChange={(value) => handleContentUpdate({ ...content, currency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="€">Euro (€)</SelectItem>
                    <SelectItem value="$">Dólar ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Descripción</Label>
              <Input
                value={content.description || ''}
                onChange={(e) => handleContentUpdate({ ...content, description: e.target.value })}
                placeholder="IVA incluido, gastos de envío aparte"
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Texto del botón</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => handleContentUpdate({ ...content, text: e.target.value })}
                placeholder="Comprar ahora"
              />
            </div>
            <div>
              <Label>URL de destino</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => handleContentUpdate({ ...content, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Estilo</Label>
              <Select
                value={content.style || 'primary'}
                onValueChange={(value) => handleContentUpdate({ ...content, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Principal</SelectItem>
                  <SelectItem value="secondary">Secundario</SelectItem>
                  <SelectItem value="outline">Contorno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'file':
        return (
          <div className="space-y-4">
            <div>
              <Label>Archivo</Label>
              <div className="mt-2">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={(e) => handleFileUpload(e, 'file')}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" disabled={uploading}>
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                  </Button>
                </label>
              </div>
            </div>
            <div>
              <Label>Nombre del archivo</Label>
              <Input
                value={content.name || ''}
                onChange={(e) => handleContentUpdate({ ...content, name: e.target.value })}
                placeholder="Ficha técnica"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleContentUpdate({ ...content, description: e.target.value })}
                placeholder="Descripción del archivo"
              />
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título de la sección</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ ...content, title: e.target.value })}
                placeholder="Lo que dicen nuestros clientes"
              />
            </div>
            <div>
              <Label>Valoraciones</Label>
              <div className="space-y-2">
                {(content.reviews || []).map((review: any, index: number) => (
                  <div key={index} className="border rounded p-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        value={review.name || ''}
                        onChange={(e) => {
                          const newReviews = [...content.reviews];
                          newReviews[index] = { ...review, name: e.target.value };
                          handleContentUpdate({ ...content, reviews: newReviews });
                        }}
                        placeholder="Nombre del cliente"
                      />
                      <Select
                        value={review.rating?.toString() || '5'}
                        onValueChange={(value) => {
                          const newReviews = [...content.reviews];
                          newReviews[index] = { ...review, rating: parseInt(value) };
                          handleContentUpdate({ ...content, reviews: newReviews });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 estrellas</SelectItem>
                          <SelectItem value="4">4 estrellas</SelectItem>
                          <SelectItem value="3">3 estrellas</SelectItem>
                          <SelectItem value="2">2 estrellas</SelectItem>
                          <SelectItem value="1">1 estrella</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      value={review.comment || ''}
                      onChange={(e) => {
                        const newReviews = [...content.reviews];
                        newReviews[index] = { ...review, comment: e.target.value };
                        handleContentUpdate({ ...content, reviews: newReviews });
                      }}
                      placeholder="Comentario del cliente"
                      rows={2}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const newReviews = content.reviews.filter((_: any, i: number) => i !== index);
                        handleContentUpdate({ ...content, reviews: newReviews });
                      }}
                      className="mt-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newReviews = [...(content.reviews || []), { name: '', rating: 5, comment: '' }];
                    handleContentUpdate({ ...content, reviews: newReviews });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir valoración
                </Button>
              </div>
            </div>
          </div>
        );

      case 'tags':
        return (
          <div className="space-y-4">
            <div>
              <Label>Título</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleContentUpdate({ ...content, title: e.target.value })}
                placeholder="Características"
              />
            </div>
            <div>
              <Label>Etiquetas</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {(content.tags || []).map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0"
                        onClick={() => {
                          const newTags = content.tags.filter((_: string, i: number) => i !== index);
                          handleContentUpdate({ ...content, tags: newTags });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        const newTag = input.value.trim();
                        if (newTag && !content.tags?.includes(newTag)) {
                          handleContentUpdate({ 
                            ...content, 
                            tags: [...(content.tags || []), newTag] 
                          });
                          input.value = '';
                        }
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Presiona Enter para añadir una etiqueta
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Editor no disponible para este tipo de elemento.</div>;
    }
  };

  return (
    <div className="w-80 border-l bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Editar {element.element_type}
          </h3>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4 h-[calc(100vh-200px)] overflow-y-auto">
        {renderEditor()}
      </div>
    </div>
  );
}