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
    name: 'Pack Raíz',
    description: 'Lo esencial de la tierra. Un pack sencillo, auténtico y asequible con los sabores más representativos de cada región.',
    expandedDescription: 'El Pack Raíz es la puerta de entrada a los sabores locales. Ideal para quienes quieren conocer lo básico y verdadero de cada tierra sin gastar mucho. Productos de proximidad, directos del productor, perfectos para una primera inmersión en el alma gastronómica de cada zona.',
    icon: Target,
    color: 'bg-green-100 text-green-700 border-green-200',
    priceRange: '35€',
    budgetLimit: 35,
    characteristics: ['Productos de proximidad', 'Directo del productor', 'Auténtico y asequible']
  },
  {
    id: 'tribu' as const,
    name: 'Pack Esencia',
    description: 'Selección equilibrada con carácter. Productos con personalidad que definen la esencia de una región.',
    expandedDescription: 'El Pack Esencia recoge una cuidada combinación de alimentos artesanales que representan la tradición, calidad y diversidad de cada comunidad. Para quienes quieren regalarse o regalar un viaje gastronómico más completo, sin llegar al extremo gourmet. Equilibrio entre sabor, origen y valor.',
    icon: Users,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    priceRange: '60€',
    budgetLimit: 60,
    characteristics: ['Alimentos artesanales', 'Tradición y calidad', 'Viaje gastronómico completo']
  },
  {
    id: 'sabio' as const,
    name: 'Pack Gourmet',
    description: 'Para los paladares exigentes. Alta calidad, máxima expresión del producto local.',
    expandedDescription: 'El Pack Gourmet es una experiencia sensorial completa. Incluye productos premium seleccionados, algunos de edición limitada o con D.O., pensados para sibaritas, amantes del buen comer y de lo auténtico. Una muestra exclusiva del saber hacer de cada productor. Incluye detalles únicos, sorpresas y en muchos casos, opciones de degustación o visita.',
    icon: Crown,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    priceRange: '90€',
    budgetLimit: 90,
    characteristics: ['Productos premium', 'Edición limitada D.O.', 'Experiencia sensorial completa']
  }
];

export { styles };

const ConsumptionStyleSelector = ({ onStyleChange, currentStyle }: ConsumptionStyleSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Elige tu Pack Regional</CardTitle>
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