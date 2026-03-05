import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, Eye, ArrowLeft, Trash2, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import PackBuilderSidebar from "@/components/PackBuilderSidebar";
import ElementEditor from "@/components/ElementEditor";
import PackPreview from "@/components/PackPreview";

interface PackElement {
  id: string;
  element_type: string;
  content: any;
  position: number;
  styles: any;
}

interface PackTemplate {
  id: string;
  name: string;
  type: string;
  color: string;
  requirements: any;
}

// Fixed prices per pack type
const FIXED_PRICES: Record<string, number> = {
  raiz: 35,
  esencia: 60,
  gourmet: 90,
};

const TEMPLATE_DEFAULTS: Record<string, { name: string; color: string }> = {
  raiz: { name: "Pack Raíz", color: "#b45309" },
  esencia: { name: "Pack Esencia", color: "#c2410c" },
  gourmet: { name: "Pack Gourmet", color: "#7c3aed" },
};

export default function PackBuilder() {
  const { packId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [packData, setPackData] = useState({
    title: "",
    price: "",
    shipping_policy: "",
    sustainability_info: "",
    tags: [] as string[],
    status: "draft"
  });
  
  const [template, setTemplate] = useState<PackTemplate | null>(null);
  const [elements, setElements] = useState<PackElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [companyCoverImage, setCompanyCoverImage] = useState<string | null>(null);

  useEffect(() => {
    initializeBuilder();
  }, [packId, searchParams]);

  const initializeBuilder = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/company-auth');
        return;
      }

      const { data: company } = await supabase
        .from('companies')
        .select('id, cover_image_url')
        .eq('user_id', session.user.id)
        .eq('status', 'approved')
        .single();

      if (!company) {
        toast.error('No tienes permisos para acceder');
        navigate('/company-dashboard');
        return;
      }

      setCompanyId(company.id);
      setCompanyCoverImage(company.cover_image_url || null);

      if (packId) {
        await loadExistingPack(packId, company.id);
      } else {
        const templateType = searchParams.get('template');
        if (templateType) {
          await loadTemplate(templateType);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      navigate('/company-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadExistingPack = async (id: string, cId: string) => {
    const { data: pack, error } = await supabase
      .from('company_packs')
      .select(`
        *,
        template:pack_templates(*),
        elements:pack_elements(*)
      `)
      .eq('id', id)
      .eq('company_id', cId)
      .single();

    if (error) throw error;

    setPackData({
      title: pack.title,
      price: pack.price?.toString() || "",
      shipping_policy: pack.shipping_policy || "",
      sustainability_info: pack.sustainability_info || "",
      tags: pack.tags || [],
      status: pack.status
    });

    setTemplate(pack.template);
    setElements(pack.elements?.sort((a: any, b: any) => a.position - b.position) || []);
  };

  const loadTemplate = async (templateType: string) => {
    // Try to load from DB first
    const { data: templateData } = await supabase
      .from('pack_templates')
      .select('*')
      .eq('type', templateType)
      .maybeSingle();

    const fixedPrice = FIXED_PRICES[templateType] || 35;

    if (templateData) {
      setTemplate(templateData);
      setPackData(prev => ({
        ...prev,
        title: `Mi ${templateData.name}`,
        price: fixedPrice.toString()
      }));
    } else {
      // Use local defaults if template doesn't exist in DB
      const defaults = TEMPLATE_DEFAULTS[templateType] || TEMPLATE_DEFAULTS.raiz;
      const localTemplate: PackTemplate = {
        id: `local-${templateType}`,
        name: defaults.name,
        type: templateType,
        color: defaults.color,
        requirements: []
      };
      setTemplate(localTemplate);
      setPackData(prev => ({
        ...prev,
        title: `Mi ${defaults.name}`,
        price: fixedPrice.toString()
      }));
    }
  };

  const savePack = async () => {
    if (!template || !companyId) return;

    setSaving(true);
    try {
      // Resolve template_id (only if it's a real DB template)
      const templateId = template.id.startsWith('local-') ? null : template.id;
      
      // If no DB template, try to find or create one
      let finalTemplateId = templateId;
      if (!finalTemplateId) {
        const { data: existingTemplate } = await supabase
          .from('pack_templates')
          .select('id')
          .eq('type', template.type)
          .maybeSingle();
        
        if (existingTemplate) {
          finalTemplateId = existingTemplate.id;
        }
      }

      let currentPackId = packId;

      if (!currentPackId) {
        const { data: newPack, error: createError } = await supabase
          .from('company_packs')
          .insert({
            company_id: companyId,
            template_id: finalTemplateId,
            title: packData.title,
            slug: packData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now(),
            price: packData.price ? parseFloat(packData.price) : null,
            shipping_policy: packData.shipping_policy,
            sustainability_info: packData.sustainability_info,
            tags: packData.tags,
            status: packData.status
          })
          .select()
          .single();

        if (createError) throw createError;
        currentPackId = newPack.id;
      } else {
        const { error: updateError } = await supabase
          .from('company_packs')
          .update({
            title: packData.title,
            price: packData.price ? parseFloat(packData.price) : null,
            shipping_policy: packData.shipping_policy,
            sustainability_info: packData.sustainability_info,
            tags: packData.tags,
            status: packData.status
          })
          .eq('id', currentPackId);

        if (updateError) throw updateError;
      }

      // Save elements
      if (currentPackId) {
        await supabase
          .from('pack_elements')
          .delete()
          .eq('pack_id', currentPackId);

        if (elements.length > 0) {
          const elementsToInsert = elements.map((element, index) => ({
            pack_id: currentPackId,
            element_type: element.element_type,
            content: element.content,
            position: index,
            styles: element.styles
          }));

          const { error: elementsError } = await supabase
            .from('pack_elements')
            .insert(elementsToInsert);

          if (elementsError) throw elementsError;
        }
      }

      toast.success('Pack guardado exitosamente');
      
      if (!packId && currentPackId) {
        navigate(`/pack-builder/${currentPackId}`);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addElement = (elementType: string) => {
    const newElement: PackElement = {
      id: `temp-${Date.now()}`,
      element_type: elementType,
      content: getDefaultContent(elementType),
      position: elements.length,
      styles: {}
    };

    setElements([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const getDefaultContent = (elementType: string) => {
    switch (elementType) {
      case 'text':
        return { text: 'Escribe tu texto aquí...', tag: 'p' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'video':
        return { url: '', title: '', description: '' };
      case 'price':
        return { amount: '', currency: '€', description: '' };
      case 'button':
        return { text: 'Click aquí', url: '', style: 'primary' };
      case 'file':
        return { url: '', name: '', description: '', type: 'pdf' };
      case 'reviews':
        return { title: 'Lo que dicen nuestros clientes', reviews: [] };
      case 'tags':
        return { title: 'Características', tags: [] };
      default:
        return {};
    }
  };

  const updateElement = (elementId: string, updates: Partial<PackElement>) => {
    setElements(elements.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (elementId: string) => {
    setElements(elements.filter(el => el.id !== elementId));
    if (selectedElement === elementId) {
      setSelectedElement(null);
    }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setElements(items);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando constructor...</p>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <PackPreview
        packData={packData}
        template={template}
        elements={elements}
        onClose={() => setPreviewMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Company cover as background */}
      {companyCoverImage && (
        <div 
          className="absolute inset-0 h-64 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: `url(${companyCoverImage})` }}
        />
      )}

      {/* Header */}
      <div className="border-b bg-card relative z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/company-dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {packId ? 'Editar Pack' : 'Crear Pack'}
              </h1>
              {template && (
                <Badge 
                  variant="secondary" 
                  style={{ backgroundColor: `${template.color}20`, color: template.color }}
                >
                  {template.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPreviewMode(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Vista Previa
            </Button>
            <Button 
              onClick={savePack} 
              disabled={saving || !packData.title}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)] relative z-10">
        {/* Sidebar */}
        <PackBuilderSidebar onAddElement={addElement} />

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Pack Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Configuración del Pack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Título del Pack *</Label>
                      <Input
                        id="title"
                        value={packData.title}
                        onChange={(e) => setPackData({...packData, title: e.target.value})}
                        placeholder="Ej: Pack Gourmet Asturiano"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Precio (€)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={packData.price}
                        readOnly
                        className="bg-muted/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Precio fijo según tipo de pack
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="shipping">Política de Envío</Label>
                    <Textarea
                      id="shipping"
                      value={packData.shipping_policy}
                      onChange={(e) => setPackData({...packData, shipping_policy: e.target.value})}
                      placeholder="Envío gratuito a partir de 50€..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Elements */}
              <Card>
                <CardHeader>
                  <CardTitle>Contenido del Pack</CardTitle>
                  <CardDescription>
                    Arrastra los elementos para reordenarlos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {elements.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">
                        No hay elementos en tu pack. Usa la barra lateral para añadir contenido.
                      </p>
                    </div>
                  ) : (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="elements">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                          >
                            {elements.map((element, index) => (
                              <Draggable
                                key={element.id}
                                draggableId={element.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`border rounded-lg p-4 bg-card hover:shadow-md transition-shadow ${
                                      selectedElement === element.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                    onClick={() => setSelectedElement(element.id)}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <div {...provided.dragHandleProps}>
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Badge variant="outline">
                                          {element.element_type}
                                        </Badge>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteElement(element.id);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {JSON.stringify(element.content).slice(0, 100)}...
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Element Editor */}
          {selectedElement && (
            <ElementEditor
              element={elements.find(el => el.id === selectedElement)!}
              onUpdate={(updates) => updateElement(selectedElement, updates)}
              onClose={() => setSelectedElement(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
