import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackSearchFilters from "@/components/PackSearchFilters";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Leaf } from "lucide-react";
import { companyPacks, filterPacks } from "@/data/companyPacks";
import type { CompanyPack } from "@/data/companyPacks";

interface SearchFilters {
  location: string;
  categories: string[];
  packType: string;
  addedValue: string[];
  priceRange: string;
}

const Packs = () => {
  const [filteredPacks, setFilteredPacks] = useState<CompanyPack[]>(companyPacks);

  const handleFiltersChange = (filters: SearchFilters) => {
    const filtered = filterPacks(companyPacks, filters);
    setFilteredPacks(filtered);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-6">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Buscar Packs Regionales
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encuentra el pack perfecto usando nuestros filtros de búsqueda
            </p>
          </div>

          {/* Search Filters */}
          <PackSearchFilters onFiltersChange={handleFiltersChange} />

          {/* Results */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredPacks.length} packs encontrados
            </p>
          </div>

          {/* Pack Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacks.map((pack) => (
              <Card key={pack.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-primary group-hover:text-primary/80 transition-colors">
                        {pack.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{pack.rating}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{pack.price}€</p>
                      <p className="text-xs text-muted-foreground">envío incluido</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {pack.description}
                  </p>

                  {pack.addedValue && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {pack.addedValue.map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{pack.fastShipping ? "Envío rápido" : "Envío estándar"}</span>
                    </div>
                    {pack.sustainablePackaging && (
                      <div className="flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-green-600" />
                        <span>Sostenible</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full" size="sm">
                    Ver más
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packs;