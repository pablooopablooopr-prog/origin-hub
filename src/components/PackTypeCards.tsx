import { Card, CardContent } from "@/components/ui/card";

const PackTypeCards = () => {
  const packTypes = [
    {
      emoji: "🌱",
      name: "Pack Raíz",
      price: "35€",
      products: "3 productos aprox.",
      level: "Nivel básico / Intro",
      description: "Ideal para una primera aproximación a los sabores locales.",
      gradient: "bg-gradient-to-br from-amber-50 to-amber-100"
    },
    {
      emoji: "🌿", 
      name: "Pack Esencia",
      price: "60€",
      products: "4 productos aprox.",
      level: "Selección media / equilibrada",
      description: "Perfecto para quienes quieren conocer la esencia gastronómica de una zona.",
      gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100"
    },
    {
      emoji: "👑",
      name: "Pack Gourmet", 
      price: "90€",
      products: "5 productos aprox.",
      level: "Premium / Degustación",
      description: "Para los paladares más exigentes que buscan lo mejor del producto local.",
      gradient: "bg-gradient-to-br from-purple-50 to-purple-100"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {packTypes.map((pack) => (
        <Card key={pack.name} className={`${pack.gradient} border-0 shadow-md`}>
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-3">{pack.emoji}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{pack.name}</h3>
            <div className="text-2xl font-bold text-primary mb-2">
              {pack.price}
              <span className="text-sm font-normal text-muted-foreground ml-1">(envío incluido)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{pack.products}</p>
            <p className="text-sm font-medium text-gray-700 mb-3">{pack.level}</p>
            <p className="text-sm text-gray-600">{pack.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PackTypeCards;