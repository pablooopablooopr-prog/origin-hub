import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface PackRouteMapProps {
  region: string;
}

const PackRouteMap = ({ region }: PackRouteMapProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Mapa de la Ruta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative bg-muted/20 h-80 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-lg font-medium text-muted-foreground">
                Mapa interactivo con todas las paradas
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Próximamente: navegación paso a paso
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PackRouteMap;