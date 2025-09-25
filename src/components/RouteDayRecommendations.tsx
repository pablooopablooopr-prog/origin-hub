import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface RouteDayRecommendationsProps {
  recommendations: string[];
}

const RouteDayRecommendations = ({ recommendations }: RouteDayRecommendationsProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Recomendaciones del Día
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-foreground text-sm font-bold">{index + 1}</span>
            </div>
            <p className="text-muted-foreground pt-1 leading-relaxed">{recommendation}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RouteDayRecommendations;