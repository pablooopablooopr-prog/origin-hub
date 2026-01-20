import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Beef, Milk, Wheat, Leaf, Shirt, Heart, UtensilsCrossed, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import MapboxMap from "./MapboxMap";
import { supabase } from "@/integrations/supabase/client";

// Fallback data
import { businessesData as fallbackBusinesses, Business } from "@/data/businesses";

interface DbCompany {
  id: string;
  business_name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  avg_rating: number | null;
  category?: {
    name: string;
  } | null;
}

const InteractiveMap = ({ showTitle = true }: { showTitle?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: "Restaurantes", icon: UtensilsCrossed, count: 0, color: "bg-primary" },
    { name: "Carnes", icon: Beef, count: 0, color: "bg-secondary" },
    { name: "Lácteos", icon: Milk, count: 0, color: "bg-moss-medium" },
    { name: "Fermentos", icon: Wheat, count: 0, color: "bg-earth-medium" },
    { name: "Herbolarios", icon: Leaf, count: 0, color: "bg-accent" },
    { name: "EcoModa", icon: Shirt, count: 0, color: "bg-moss-dark" },
    { name: "Vida Natural", icon: Heart, count: 0, color: "bg-moss-light" }
  ];

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Use companies_public view for safe public access (no email/phone exposure)
        const { data, error } = await supabase
          .from('companies_public')
          .select(`
            id,
            business_name,
            description,
            address,
            latitude,
            longitude,
            avg_rating,
            category_id
          `)
          .eq('status', 'approved');

        if (error) throw error;

        if (data && data.length > 0) {
          // Transform DB data to Business format
          const transformed: Business[] = data.map((company: any) => ({
            id: company.id,
            name: company.business_name,
            category: 'Vida Natural', // Category name not available in public view
            description: company.description || '',
            address: company.address || '',
            city: '',
            province: '',
            coordinates: [company.longitude || -3.7038, company.latitude || 40.4168] as [number, number],
            rating: company.avg_rating || 4.5,
            tags: []
          }));
          setCompanies(transformed);
        } else {
          setCompanies(fallbackBusinesses);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setCompanies(fallbackBusinesses);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Filter businesses based on search and category
  const filteredBusinesses = useMemo(() => {
    let filtered = companies;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(query) ||
        business.city.toLowerCase().includes(query) ||
        business.province.toLowerCase().includes(query) ||
        business.category.toLowerCase().includes(query) ||
        business.description.toLowerCase().includes(query) ||
        business.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(business => business.category === selectedCategory);
    }

    return filtered;
  }, [companies, searchQuery, selectedCategory]);

  const handleCategoryClick = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  // Calculate category counts
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: companies.filter(b => b.category === cat.name).length
  }));

  if (loading) {
    return (
      <section className="py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 enso-watermark" id="mapa">
      <div className="container mx-auto px-6">
        {showTitle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Mapa Interactivo de Empresas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Encuentra negocios auténticos cerca de ti. Filtra por categoría, busca por ciudad o tipo de producto.
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-16">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input 
                placeholder="Buscar por ciudad, producto o negocio..." 
                className="pl-11 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros {selectedCategory && "(1)"}
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categoriesWithCounts.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <Badge 
                  key={category.name}
                  variant={isSelected ? "default" : "secondary"}
                  className={`px-4 py-2 text-sm hover:shadow-soft transition-all cursor-pointer ${
                    isSelected ? "shadow-md" : ""
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name} ({category.count})
                </Badge>
              );
            })}
          </div>

          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredBusinesses.length} negocios
              {searchQuery && ` para "${searchQuery}"`}
              {selectedCategory && ` en la categoría "${selectedCategory}"`}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="mt-2"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-earth">
            <CardContent className="p-0">
              <MapboxMap 
                filteredBusinesses={filteredBusinesses}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{companies.length}</div>
            <p className="text-sm text-muted-foreground">Empresas verificadas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary mb-2">{new Set(companies.map(b => b.city)).size || 6}</div>
            <p className="text-sm text-muted-foreground">Ciudades cubiertas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-moss-medium mb-2">{filteredBusinesses.length}</div>
            <p className="text-sm text-muted-foreground">Resultados actuales</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-earth-medium mb-2">98%</div>
            <p className="text-sm text-muted-foreground">Satisfacción usuarios</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
