import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PackTypeCards = () => {
  const packTypes = [
    {
      name: "Pack Raíz",
      price: "35€",
      products: "3 productos aprox.",
      level: "Nivel básico / Intro",
      description: "Ideal para una primera aproximación a los sabores locales.",
      bgColor: "bg-pack-raiz",
      filterType: "raiz"
    },
    {
      name: "Pack Esencia",
      price: "60€",
      products: "4 productos aprox.",
      level: "Selección media / equilibrada",
      description: "Perfecto para quienes quieren conocer la esencia gastronómica de una zona.",
      bgColor: "bg-pack-esencia",
      filterType: "esencia"
    },
    {
      name: "Pack Gourmet", 
      price: "90€",
      products: "5 productos aprox.",
      level: "Premium / Degustación",
      description: "Para los paladares más exigentes que buscan lo mejor del producto local.",
      bgColor: "bg-pack-gourmet",
      filterType: "gourmet"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {packTypes.map((pack) => (
        <Card key={pack.name} className={`${pack.bgColor} border-0 shadow-md`}>
          <CardContent className="p-6 text-center">
            <Link to={`/packs?packType=${pack.filterType}`}>
              <h3 className="text-xl font-bold text-primary mb-4 cursor-pointer hover:underline transition-all">
                {pack.name}
              </h3>
            </Link>
            <div className="text-2xl font-bold text-primary mb-2">
              {pack.price}
              <span className="text-sm font-normal text-muted-foreground ml-1">(envío incluido)</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{pack.products}</p>
            <p className="text-sm font-medium text-foreground mb-3">{pack.level}</p>
            <p className="text-sm text-muted-foreground">{pack.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PackTypeCards;