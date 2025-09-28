import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { X, Star, Download, ExternalLink } from "lucide-react";

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
}

interface PackPreviewProps {
  packData: {
    title: string;
    price: string;
    shipping_policy: string;
    sustainability_info: string;
    tags: string[];
    status: string;
  };
  template: PackTemplate | null;
  elements: PackElement[];
  onClose: () => void;
}

export default function PackPreview({ packData, template, elements, onClose }: PackPreviewProps) {
  const renderElement = (element: PackElement) => {
    const { content } = element;

    switch (element.element_type) {
      case 'text':
        const Tag = content.tag || 'p';
        return (
          <div className="mb-6">
            <Tag className={`${
              content.tag === 'h1' ? 'text-4xl font-bold' :
              content.tag === 'h2' ? 'text-3xl font-bold' :
              content.tag === 'h3' ? 'text-2xl font-semibold' :
              'text-base'
            } leading-relaxed`}>
              {content.text}
            </Tag>
          </div>
        );

      case 'image':
        return (
          <div className="mb-6">
            {content.url && (
              <div>
                <img 
                  src={content.url} 
                  alt={content.alt} 
                  className="w-full rounded-lg shadow-md"
                />
                {content.caption && (
                  <p className="text-sm text-muted-foreground mt-2 text-center italic">
                    {content.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="mb-6">
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-medium mb-2">{content.title}</div>
                <div className="text-sm text-muted-foreground mb-4">{content.description}</div>
                {content.url && (
                  <Button variant="outline" asChild>
                    <a href={content.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver vídeo
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'price':
        return (
          <Card className="mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {content.amount} {content.currency}
              </div>
              {content.description && (
                <p className="text-sm text-muted-foreground">{content.description}</p>
              )}
            </CardContent>
          </Card>
        );

      case 'button':
        return (
          <div className="mb-6 text-center">
            <Button
              size="lg"
              variant={content.style === 'outline' ? 'outline' : content.style === 'secondary' ? 'secondary' : 'default'}
              asChild
            >
              <a href={content.url} target="_blank" rel="noopener noreferrer">
                {content.text}
              </a>
            </Button>
          </div>
        );

      case 'file':
        return (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="w-8 h-8 text-primary" />
                <div className="flex-1">
                  <div className="font-medium">{content.name}</div>
                  <div className="text-sm text-muted-foreground">{content.description}</div>
                </div>
                {content.url && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={content.url} target="_blank" rel="noopener noreferrer">
                      Descargar
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'reviews':
        return (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-6">{content.title}</h3>
            <div className="grid gap-4">
              {(content.reviews || []).map((review: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.name}</span>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'tags':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{content.title}</h3>
            <div className="flex flex-wrap gap-2">
              {(content.tags || []).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">Vista Previa</h1>
            {template && (
              <Badge 
                variant="secondary" 
                style={{ backgroundColor: `${template.color}20`, color: template.color }}
              >
                {template.name}
              </Badge>
            )}
            <Badge variant={packData.status === 'published' ? 'default' : 'secondary'}>
              {packData.status === 'published' ? 'Publicado' : 'Borrador'}
            </Badge>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cerrar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Pack Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">{packData.title}</h1>
          {template && (
            <div className="text-lg text-muted-foreground mb-4">
              {template.name}
            </div>
          )}
          {packData.tags.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2">
              {packData.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Elements */}
        <div className="space-y-2">
          {elements
            .sort((a, b) => a.position - b.position)
            .map((element) => (
              <div key={element.id}>
                {renderElement(element)}
              </div>
            ))}
        </div>

        {/* Pack Info */}
        {(packData.shipping_policy || packData.sustainability_info) && (
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {packData.shipping_policy && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Política de Envío</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {packData.shipping_policy}
                  </p>
                </CardContent>
              </Card>
            )}
            {packData.sustainability_info && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Sostenibilidad</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {packData.sustainability_info}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>Creado con Origen - Plataforma de productos auténticos</p>
        </div>
      </div>
    </div>
  );
}