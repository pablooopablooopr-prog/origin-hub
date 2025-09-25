import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, Target, Crown } from "lucide-react";

interface ConsumptionStyleSelectorProps {
  onStyleChange: (style: 'cazador' | 'tribu' | 'sabio') => void;
  currentStyle?: 'cazador' | 'tribu' | 'sabio';
}

const styles = [
  {
    id: 'cazador' as const,
    name: 'Cazador',
    description: 'Descubre España paso a paso',
    icon: Target,
    color: 'bg-green-100 text-green-700 border-green-200',
    priceRange: '€25-30',
    characteristics: ['Productos de iniciación', 'Calidad garantizada', 'Precio accesible']
  },
  {
    id: 'tribu' as const,
    name: 'Tribu',
    description: 'Comparte experiencias únicas',
    icon: Users,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    priceRange: '€45-50',
    characteristics: ['Ideal para familias', 'Productos premium', 'Experiencia compartida']
  },
  {
    id: 'sabio' as const,
    name: 'Sabio',
    description: 'Los mejores productos artesanos',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    priceRange: '€85-100',
    characteristics: ['Máxima calidad', 'Productos exclusivos', 'Para expertos']
  }
];

const ConsumptionStyleSelector = ({ onStyleChange, currentStyle }: ConsumptionStyleSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elige tu Estilo de Consumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {styles.map(style => {
          const Icon = style.icon;
          const isSelected = currentStyle === style.id;
          
          return (
            <div
              key={style.id}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-primary/30'
              }`}
              onClick={() => onStyleChange(style.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${style.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">{style.name}</h4>
                    <Badge variant="outline">{style.priceRange}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {style.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {style.characteristics.map(char => (
                      <Badge key={char} variant="secondary" className="text-xs">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ConsumptionStyleSelector;