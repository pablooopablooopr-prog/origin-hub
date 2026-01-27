import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import routeMapBackground from "@/assets/route-map-background.png";

interface PackRouteMapProps {
  region: string;
  stopsCount?: number;
}

// Predefined patterns for different stop counts - positions as percentages
const getStopPositions = (count: number): { x: number; y: number }[] => {
  const patterns: Record<number, { x: number; y: number }[]> = {
    1: [{ x: 50, y: 50 }],
    2: [
      { x: 25, y: 40 },
      { x: 75, y: 60 },
    ],
    3: [
      { x: 20, y: 30 },
      { x: 55, y: 65 },
      { x: 85, y: 35 },
    ],
    4: [
      { x: 15, y: 25 },
      { x: 40, y: 70 },
      { x: 65, y: 35 },
      { x: 88, y: 65 },
    ],
    5: [
      { x: 12, y: 45 },
      { x: 30, y: 20 },
      { x: 50, y: 60 },
      { x: 72, y: 30 },
      { x: 88, y: 55 },
    ],
  };

  if (count > 5) {
    const positions: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const x = 10 + progress * 80;
      const y = 45 + Math.sin(progress * Math.PI * 2 + i * 0.5) * 25;
      positions.push({ x, y });
    }
    return positions;
  }

  return patterns[count] || patterns[1];
};

const PackRouteMap = ({ region, stopsCount = 3 }: PackRouteMapProps) => {
  const stops = useMemo(() => getStopPositions(stopsCount), [stopsCount]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Mapa de la Ruta
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-80 overflow-hidden rounded-b-lg">
          {/* Background map image */}
          <img
            src={routeMapBackground}
            alt="Mapa de ruta"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* SVG overlay for stops and connections */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Connection lines between stops */}
            {stops.length > 1 && (
              <polyline
                points={stops.map(s => `${s.x},${s.y}`).join(' ')}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2,1"
                className="opacity-80"
              />
            )}
          </svg>

          {/* Stop markers */}
          {stops.map((stop, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                left: `${stop.x}%`,
                top: `${stop.y}%`,
              }}
            >
              <div className="absolute w-10 h-10 rounded-full bg-primary/20 animate-pulse" />
              <div className="relative w-8 h-8 rounded-full bg-primary border-2 border-primary-foreground shadow-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}

          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
        </div>
      </CardContent>
    </Card>
  );
};

export default PackRouteMap;
