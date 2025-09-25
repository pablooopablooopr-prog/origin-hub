import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Clock, MapPin, Thermometer, Package, Info, Share2, Printer, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { ProductPack } from "@/data/products";

interface PackPracticalInfoProps {
  pack: ProductPack;
  onShare: () => void;
}

const difficultyMap = {
  'leon': 'Fácil',
  'granada': 'Moderada', 
  'galicia': 'Fácil',
  'cazador': 'Fácil',
  'tribu': 'Fácil',
  'sabio': 'Moderada',
  'quesos': 'Fácil'
};

const durationMap = {
  'leon': 'Día completo (8-10 horas)',
  'granada': 'Día completo (10-12 horas)',
  'galicia': 'Día completo (8-10 horas)', 
  'cazador': 'Medio día (4-6 horas)',
  'tribu': 'Día completo (6-8 horas)',
  'sabio': 'Fin de semana (2 días)',
  'quesos': 'Medio día (4-6 horas)'
};

const recommendations = {
  'leon': [
    'Comienza temprano (9:00) en Cecinas Pablo para ver el proceso de elaboración matutino',
    'Llega a la quesería entre 11:00-12:00 para ver el queso recién desmoldado',
    'Reserva mesa en Casa Pepe para almorzar el botillo caliente (13:30h ideal)',
    'Lleva una cesta térmica para conservar los productos comprados'
  ],
  'granada': [
    'Visita el olivar al amanecer para la mejor experiencia fotográfica',
    'Reserva la visita a Trevélez con antelación (temporada alta muy demandada)',
    'Lleva ropa cómoda y abrigo (las cuevas están a 8°C)',
    'Pregunta por descuentos grupales en compras superiores a €150'
  ],
  'galicia': [
    'Consulta las mareas para la mejor experiencia en las conserveras',
    'Reserva con antelación en temporada alta (julio-agosto)',
    'Lleva chubasquero (el clima gallego es impredecible)',
    'Pregunta por catas guiadas del licor de hierbas'
  ],
  'cazador': [
    'Pack ideal para principiantes en productos artesanos',
    'Perfecto para regalar o autoregalo de iniciación',
    'Productos con maridajes sugeridos incluidos'
  ],
  'tribu': [
    'Cantidad perfecta para familias de 3-4 personas',
    'Incluye guía de maridajes y recetas tradicionales',
    'Opción de personalización disponible'
  ],
  'sabio': [
    'Productos de máxima calidad para paladares expertos',
    'Incluye certificados de autenticidad y trazabilidad',
    'Consulta por visitas exclusivas a productores'
  ],
  'quesos': [
    'Temperatura de conservación ideal: 4-8°C',
    'Saca los quesos 30 minutos antes de consumir',
    'Maridajes recomendados incluidos en el pack'
  ]
};

const PackPracticalInfo = ({ pack, onShare }: PackPracticalInfoProps) => {
  const difficulty = difficultyMap[pack.id as keyof typeof difficultyMap] || 'Fácil';
  const duration = durationMap[pack.id as keyof typeof durationMap] || 'Día completo';
  const localTips = recommendations[pack.id as keyof typeof recommendations] || [];

  return (
    <div className="space-y-6">
      {/* Practical Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Práctica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Dificultad:</span>
              <div className="mt-1">
                <Badge 
                  variant="outline" 
                  className={
                    difficulty === 'Fácil' ? 'text-green-600 border-green-600' :
                    difficulty === 'Moderada' ? 'text-yellow-600 border-yellow-600' :
                    'text-red-600 border-red-600'
                  }
                >
                  {difficulty}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Duración:</span>
              <p className="text-sm mt-1">{duration}</p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Consejos locales:
            </h4>
            <ul className="space-y-2">
              {localTips.map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Compartir Ruta
        </Button>
        <Button variant="outline" className="w-full">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir Ruta
        </Button>
        <Button className="w-full">
          <Phone className="w-4 h-4 mr-2" />
          Personalizar Ruta
        </Button>
      </div>
    </div>
  );
};

export default PackPracticalInfo;