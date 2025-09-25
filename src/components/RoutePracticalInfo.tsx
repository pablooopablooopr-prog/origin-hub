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
        return 'bg-green-500 hover:bg-green-600';
      case 'medio':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'difícil':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Información Práctica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="font-medium text-primary">Dificultad:</span>
              <Badge className={`${getDifficultyColor(difficulty)} text-white`}>
                {difficulty}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-primary">Duración:</span>
              <p className="text-muted-foreground mt-1">{practicalInfo.duration}</p>
            </div>
          </div>
          
          <div>
            <span className="font-medium text-primary">Grupo recomendado:</span>
            <p className="text-muted-foreground mt-1">{practicalInfo.recommendedPeople}</p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-primary mb-3">Consejos locales:</h4>
          <ul className="space-y-2">
            {practicalInfo.localTips.map((tip, index) => (
              <li key={index} className="text-muted-foreground flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutePracticalInfo;