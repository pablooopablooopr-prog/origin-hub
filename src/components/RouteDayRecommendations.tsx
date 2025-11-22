import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, MapPin, Coffee, Utensils, Camera } from "lucide-react";

interface RouteDayRecommendationsProps {
  recommendations: string[];
}

const RouteDayRecommendations = ({ recommendations }: RouteDayRecommendationsProps) => {
  const icons = [Clock, MapPin, Coffee, Utensils, Camera];
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-foreground">
          Recomendaciones del Día
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {recommendations.map((recommendation, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={index} className="flex items-start space-x-2.5">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-foreground text-xs font-bold">{index + 1}</span>
              </div>
              <Icon className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              <p className="text-muted-foreground text-sm leading-snug">{recommendation}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RouteDayRecommendations;