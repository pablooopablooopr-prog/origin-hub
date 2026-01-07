import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackSearchFilters from "@/components/PackSearchFilters";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, Leaf, PackageX, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Fallback data
import { companyPacks, filterPacks } from "@/data/companyPacks";
import type { CompanyPack as FallbackPack } from "@/data/companyPacks";

interface SearchFilters {
  location: string;
  categories: string[];
  packType: string;
  addedValue: string[];
  priceRange: string;
}

interface DbPack {
  id: string;
  title: string;
  slug: string;
  price: number | null;
  status: string | null;
  tags: string[] | null;
  shipping_policy: string | null;
  sustainability_info: string | null;
  company?: {
    business_name: string;
    address: string | null;
  } | null;
}

const Packs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [packs, setPacks] = useState<(DbPack | FallbackPack)[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialFilters, setInitialFilters] = useState<SearchFilters | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const { data, error } = await supabase
          .from('company_packs')
          .select(`
            *,
            company:companies(business_name, address)
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setPacks(data);
        } else {
          // Use fallback data
          const packType = searchParams.get('packType');
          if (packType) {
            const filters: SearchFilters = {
              location: "",
              categories: [],
              packType: packType,
              addedValue: [],
              priceRange: ""
            };
            setInitialFilters(filters);
            setPacks(filterPacks(companyPacks, filters));
          } else {
            setPacks(companyPacks);
          }
        }
      } catch (err) {
        console.error('Error fetching packs:', err);
        setPacks(companyPacks);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, [searchParams]);

  const handleFiltersChange = (filters: SearchFilters) => {
    // For now, filter fallback data if using fallback
    if (packs.length > 0 && 'type' in packs[0]) {
      const filtered = filterPacks(companyPacks, filters);
      setPacks(filtered);
    }
  };

  const handleClearFilters = () => {
    setPacks(companyPacks);
    window.location.reload();
  };

  // Helper to get pack type from tags or name
  const getPackType = (pack: DbPack | FallbackPack): string => {
    if ('type' in pack) return pack.type;
    
    const title = pack.title.toLowerCase();
    if (title.includes('raíz') || title.includes('raiz')) return 'raiz';
    if (title.includes('esencia')) return 'esencia';
    if (title.includes('gourmet')) return 'gourmet';
    return 'esencia';
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
        return 'Pack';
    }
  };

  const getPackData = (pack: DbPack | FallbackPack) => {
    if ('type' in pack) {
      // Fallback pack
      return {
        id: pack.id,
        name: pack.name.replace(/^Pack (Raíz|Esencia|Gourmet) - /, ''),
        type: pack.type,
        price: pack.price,
        description: pack.description,
        rating: pack.rating,
        fastShipping: pack.fastShipping,
        sustainablePackaging: pack.sustainablePackaging,
        addedValue: pack.addedValue
      };
    }
    
    // Database pack
    return {
      id: pack.slug,
      name: pack.title,
      type: getPackType(pack),
      price: pack.price || 0,
      description: pack.company?.business_name || '',
      rating: 4.5,
      fastShipping: pack.shipping_policy?.toLowerCase().includes('rápido'),
      sustainablePackaging: !!pack.sustainability_info,
      addedValue: pack.tags
    };
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
          <PackSearchFilters onFiltersChange={handleFiltersChange} initialFilters={initialFilters} />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Results */}
              {packs.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    {packs.length} packs encontrados
                  </p>
                </div>
              )}

              {/* Empty State */}
              {packs.length === 0 && (
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

              {/* Pack Results Grid */}
              {packs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packs.map((pack) => {
                    const data = getPackData(pack);
                    return (
                      <Card 
                        key={data.id} 
                        className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${getPackTypeColor(data.type)}`}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-sm font-bold text-primary mb-1">{getPackTypeName(data.type)}</div>
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                                {data.name}
                              </h3>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-muted-foreground">{data.rating}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{data.price}€</p>
                              <p className="text-xs text-muted-foreground">envío incluido</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {data.description}
                          </p>

                          {data.addedValue && data.addedValue.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {data.addedValue.slice(0, 3).map((value, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {value}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Truck className="w-3 h-3" />
                              <span>{data.fastShipping ? "Envío rápido" : "Envío estándar"}</span>
                            </div>
                            {data.sustainablePackaging && (
                              <div className="flex items-center gap-1">
                                <Leaf className="w-3 h-3 text-green-600" />
                                <span>Sostenible</span>
                              </div>
                            )}
                          </div>

                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => navigate(`/packs/${data.id}`)}
                          >
                            Ver más
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Packs;
