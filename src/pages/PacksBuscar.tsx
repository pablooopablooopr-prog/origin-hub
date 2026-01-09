import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackSearchFilters from "@/components/PackSearchFilters";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Leaf, PackageX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { companyPacks, filterPacks } from "@/data/companyPacks";
import type { CompanyPack } from "@/data/companyPacks";

interface SearchFilters {
  location: string;
  categories: string[];
  packType: string;
  addedValue: string[];
  priceRange: string;
}

interface SupabasePack {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  tags: string[] | null;
  status: string | null;
  shipping_policy: string | null;
  sustainability_info: string | null;
  company?: {
    business_name: string;
    logo_url: string | null;
    region?: { name: string } | null;
  } | null;
  template?: { type: string; name: string } | null;
}

const PacksBuscar = () => {
  const navigate = useNavigate();
  const [supabasePacks, setSupabasePacks] = useState<SupabasePack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<CompanyPack[]>(companyPacks);
  const [loading, setLoading] = useState(true);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({
    location: "",
    categories: [],
    packType: "",
    addedValue: [],
    priceRange: ""
  });

  useEffect(() => {
    loadPacks();
  }, []);

  const loadPacks = async () => {
    try {
      const { data, error } = await supabase
        .from('company_packs')
        .select(`
          id, title, slug, price, tags, status, shipping_policy, sustainability_info,
          company:companies(business_name, logo_url, region:regions(name)),
          template:pack_templates(type, name)
        `)
        .eq('status', 'published');

      if (error) throw error;
      setSupabasePacks(data || []);
    } catch (error) {
      console.error('Error loading packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setCurrentFilters(filters);
    
    // Filter Supabase packs
    let filtered = supabasePacks.filter(pack => {
      if (filters.location && pack.company?.region?.name !== filters.location) {
        return false;
      }
      if (filters.packType && pack.template?.type !== filters.packType) {
        return false;
      }
      if (filters.categories.length > 0 && pack.tags) {
        const hasCategory = filters.categories.some(cat => 
          pack.tags?.some(tag => tag.toLowerCase().includes(cat.toLowerCase()))
        );
        if (!hasCategory) return false;
      }
      return true;
    });

    // Also filter fallback packs
    const filteredFallback = filterPacks(companyPacks, filters);
    setFilteredPacks(filteredFallback);
  };

  const handleClearFilters = () => {
    const emptyFilters: SearchFilters = {
      location: "",
      categories: [],
      packType: "",
      addedValue: [],
      priceRange: ""
    };
    handleFiltersChange(emptyFilters);
    // Force re-render of filters component
    window.location.reload();
  };

  const getPackTypeColor = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'bg-pack-raiz border-pack-raiz-alt';
      case 'esencia':
        return 'bg-pack-esencia border-pack-esencia-alt';
      case 'gourmet':
        return 'bg-pack-gourmet border-pack-gourmet-alt';
      default:
        return 'bg-card border-border';
    }
  };

  const getPackTypeName = (type: string) => {
    switch (type) {
      case 'raiz':
        return 'Pack Raíz';
      case 'esencia':
        return 'Pack Esencia';
      case 'gourmet':
        return 'Pack Gourmet';
      default:
        return '';
    }
  };

  const getPackSpecificName = (fullName: string) => {
    return fullName.replace(/^Pack (Raíz|Esencia|Gourmet) - /, '');
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Results */}
          {!loading && (supabasePacks.length > 0 || filteredPacks.length > 0) && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {supabasePacks.length + filteredPacks.length} packs encontrados
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && supabasePacks.length === 0 && filteredPacks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <PackageX className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground text-center mb-6 max-w-md">
                No hemos encontrado packs con estos filtros. Prueba a cambiar la región o la categoría.
              </p>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Limpiar filtros
              </Button>
            </div>
          )}

          {/* Supabase Packs Grid */}
          {!loading && supabasePacks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {supabasePacks.map((pack) => (
                <Card key={pack.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${getPackTypeColor(pack.template?.type || 'raiz')}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-primary mb-1">{pack.template?.name || 'Pack'}</div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                          {pack.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pack.company?.business_name} • {pack.company?.region?.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{pack.price}€</p>
                        <p className="text-xs text-muted-foreground">envío incluido</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {pack.tags && pack.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {pack.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{pack.shipping_policy || "Envío estándar"}</span>
                      </div>
                      {pack.sustainability_info && (
                        <div className="flex items-center gap-1">
                          <Leaf className="w-3 h-3 text-green-600" />
                          <span>Sostenible</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => navigate(`/packs/${pack.slug}`)}
                    >
                      Ver más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Fallback Pack Results Grid */}
          {!loading && filteredPacks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPacks.map((pack) => (
                <Card key={pack.id} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${getPackTypeColor(pack.type)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-primary mb-1">{getPackTypeName(pack.type)}</div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                          {getPackSpecificName(pack.name)}
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

                    <Button 
                      className="w-full" 
                      size="sm"
                      onClick={() => navigate(`/packs/${pack.id}`)}
                    >
                      Ver más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PacksBuscar;