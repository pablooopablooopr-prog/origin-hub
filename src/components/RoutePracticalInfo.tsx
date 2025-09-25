import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PracticalInfo {
  level: string;
  duration: string;
  recommendedPeople: string;
  localTips: string[];
}

interface RoutePracticalInfoProps {
  practicalInfo: PracticalInfo;
  difficulty: string;
}

const RoutePracticalInfo = ({ practicalInfo, difficulty }: RoutePracticalInfoProps) => {
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'fácil':
        return 'bg-green-600 text-white';
      case 'moderado':
        return 'bg-amber-700 text-white';
      case 'difícil':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
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
        <div className="grid md:grid-cols-2 gap-6 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">Dificultad:</span>
              <Badge 
                variant="secondary" 
                className={`${getDifficultyColor(difficulty)} border-0 rounded-full px-3 py-1`}
              >
                {difficulty}
              </Badge>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-gray-900">Duración:</span>
              <span className="text-gray-600">{practicalInfo.duration}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Consejos locales:</h4>
          <div className="space-y-2">
            {practicalInfo.localTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default RoutePracticalInfo;