import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Video, 
  Type, 
  Euro, 
  MousePointer, 
  FileText, 
  Star, 
  Tag,
  Plus
} from "lucide-react";

interface PackBuilderSidebarProps {
  onAddElement: (elementType: string) => void;
}

const elements = [
  {
    type: 'text',
    name: 'Texto',
    icon: Type,
    description: 'Añade descripciones, historias y contenido'
  },
  {
    type: 'image',
    name: 'Imagen',
    icon: Image,
    description: 'Sube fotos de productos y lugares'
  },
  {
    type: 'video',
    name: 'Vídeo',
    icon: Video,
    description: 'Embed vídeos de YouTube o Vimeo'
  },
  {
    type: 'price',
    name: 'Precio',
    icon: Euro,
    description: 'Muestra el precio del pack'
  },
  {
    type: 'button',
    name: 'Botón',
    icon: MousePointer,
    description: 'Botón de compra o acción'
  },
  {
    type: 'file',
    name: 'Archivo',
    icon: FileText,
    description: 'PDFs, fichas técnicas, certificados'
  },
  {
    type: 'reviews',
    name: 'Valoraciones',
    icon: Star,
    description: 'Testimonios de clientes'
  },
  {
    type: 'tags',
    name: 'Etiquetas',
    icon: Tag,
    description: 'Tags como "vegano", "artesano", etc.'
  }
];

const tips = [
  "Empieza con una imagen atractiva del producto",
  "Cuenta la historia de tu producto en la descripción",
  "Incluye certificaciones y sellos de calidad",
  "Añade testimonios reales de clientes",
  "Especifica claramente la política de envío"
];

export default function PackBuilderSidebar({ onAddElement }: PackBuilderSidebarProps) {
  return (
    <div className="w-80 border-r bg-muted/30 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Elementos</CardTitle>
            <CardDescription>
              Arrastra elementos al canvas para construir tu pack
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {elements.map((element) => {
              const Icon = element.icon;
              return (
                <Button
                  key={element.type}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 hover:bg-accent"
                  onClick={() => onAddElement(element.type)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{element.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {element.description}
                      </div>
                    </div>
                    <Plus className="h-4 w-4 ml-auto opacity-60" />
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consejos</CardTitle>
            <CardDescription>
              Para crear un pack exitoso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 min-w-fit">
                  {index + 1}
                </Badge>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sello Origen</CardTitle>
            <CardDescription>
              Requisitos para obtener certificación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Historia del productor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Certificaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Trazabilidad</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Completa todos los requisitos para que tu pack sea elegible para el Sello Origen
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}