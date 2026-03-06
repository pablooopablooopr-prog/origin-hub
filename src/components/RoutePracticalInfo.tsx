import React from "react";
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

const RoutePracticalInfo = React.forwardRef<HTMLDivElement, RoutePracticalInfoProps>(({ practicalInfo, difficulty }, ref) => {
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
    <Card ref={ref} className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground">
          Información Práctica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">Dificultad:</span>
              <Badge 
                variant="secondary" 
                className={`${getDifficultyColor(difficulty)} border-0 rounded-full px-2.5 py-0.5 text-xs`}
              >
                {difficulty}
              </Badge>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900 text-sm">Duración:</span>
              <span className="text-gray-600 text-sm">{practicalInfo.duration}</span>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Consejos locales:</h4>
          <div className="space-y-1.5">
            {practicalInfo.localTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0" />
                <span className="text-sm text-gray-600 leading-snug">{tip}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
});
RoutePracticalInfo.displayName = "RoutePracticalInfo";

export default RoutePracticalInfo;