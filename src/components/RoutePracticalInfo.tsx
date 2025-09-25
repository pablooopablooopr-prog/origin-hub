import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Share2, Printer, Phone } from "lucide-react";

interface PracticalInfo {
  level: string;
  duration: string;
  recommendedPeople: string;
  localTips: string[];
}

interface RoutePracticalInfoProps {
  practicalInfo: PracticalInfo;
  difficulty: string;
  onShare?: () => void;
  onPrint?: () => void;
}

const RoutePracticalInfo = ({ practicalInfo, difficulty, onShare, onPrint }: RoutePracticalInfoProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'fácil':
        return 'bg-green-100 text-green-800';
      case 'moderado':
        return 'bg-amber-100 text-amber-800';
      case 'difícil':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Información Práctica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-foreground">Dificultad:</span>
              <Badge 
                variant="secondary" 
                className={`${getDifficultyColor(difficulty)} border-0`}
              >
                {difficulty}
              </Badge>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-foreground">Duración:</span>
              <span className="text-muted-foreground">{practicalInfo.duration}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-foreground mb-3">Consejos locales:</h4>
          <div className="space-y-2">
            {practicalInfo.localTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t">
          {onShare && (
            <button 
              onClick={onShare}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir Ruta</span>
            </button>
          )}
          
          {onPrint && (
            <button 
              onClick={onPrint}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Ruta</span>
            </button>
          )}
          
          <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Phone className="w-4 h-4" />
            <span>Personalizar Ruta</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutePracticalInfo;