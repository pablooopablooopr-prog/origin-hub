import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Leaf, UtensilsCrossed, Loader2, Users, Compass } from "lucide-react";
import { Input } from "@/components/ui/input";
import GoogleMap from "./GoogleMap";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "@/data/businesses";

export interface MapItem extends Business {
  itemType: "company" | "route-stop" | "pack";
  routeId?: string;
  routeTitle?: string;
  companyType?: "productor" | "cooperativa" | "restaurante";
}

// Category slugs that map to each filter
const RESTAURANTE_SLUGS = ["restaurante", "cafeteria-especialidad", "sidreria"];
const COOPERATIVA_SLUGS = ["mercado-local", "granja-ecologica"];

const InteractiveMap = ({ showTitle = true }: { showTitle?: boolean }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<MapItem[]>([]);
  const [routeStopItems, setRouteStopItems] = useState<MapItem[]>([]);
  const [routes, setRoutes] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [companiesRes, categoriesRes, routesRes, stopsRes] = await Promise.all([
          supabase
            .from("companies_public")
            .select("id, business_name, description, address, latitude, longitude, avg_rating, category_id, slug"),
          supabase.from("categories").select("id, slug, name").eq("is_active", true),
          supabase.from("routes_public").select("id, title, slug").eq("is_active", true),
          supabase.from("route_stops").select("id, name, description, address, latitude, longitude, route_id, position"),
        ]);

        // Build category id → slug map
        const catMap: Record<string, string> = {};
        const catNameMap: Record<string, string> = {};
        if (categoriesRes.data) {
          for (const c of categoriesRes.data) {
            catMap[c.id] = c.slug;
            catNameMap[c.id] = c.name;
          }
        }
        setCategoryMap(catMap);

        const items: MapItem[] = [];

        if (companiesRes.data) {
          for (const c of companiesRes.data) {
            if (!c.latitude || !c.longitude) continue;
            const province = extractProvince(c.address);
            const catSlug = c.category_id ? catMap[c.category_id] : null;

            let companyType: "productor" | "cooperativa" | "restaurante" = "productor";
            if (catSlug && RESTAURANTE_SLUGS.includes(catSlug)) {
              companyType = "restaurante";
            } else if (catSlug && COOPERATIVA_SLUGS.includes(catSlug)) {
              companyType = "cooperativa";
            }

            items.push({
              id: c.id!,
              name: c.business_name || "",
              category: companyType === "restaurante" ? "Restaurantes" : companyType === "cooperativa" ? "Cooperativas" : "Productores",
              description: c.description || "",
              address: c.address || "",
              city: "",
              province,
              coordinates: [c.longitude as number, c.latitude as number],
              rating: (c.avg_rating as number) || 0,
              tags: [],
              itemType: "company",
              companyType,
            });
          }
        }

        setAllItems(items);
      } catch (err) {
        console.error("Error fetching map data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  function extractProvince(address: string | null): string {
    if (!address) return "Desconocida";
    const parts = address.split(",").map((p) => p.trim());
    if (parts.length >= 2) return parts[parts.length - 1];
    return parts[0] || "Desconocida";
  }

  // Unique provinces
  const provinces = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((item) => {
      if (item.province && item.province !== "Desconocida") set.add(item.province);
    });
    return Array.from(set).sort();
  }, [allItems]);

  // Items grouped by type
  const productores = useMemo(() => allItems.filter((i) => i.companyType === "productor"), [allItems]);
  const cooperativas = useMemo(() => allItems.filter((i) => i.companyType === "cooperativa"), [allItems]);
  const restaurantes = useMemo(() => allItems.filter((i) => i.companyType === "restaurante"), [allItems]);

  // Sub-items for each filter
  const subItemsMap = useMemo<Record<string, { id: string; name: string }[]>>(() => ({
    Provincias: provinces.map((p) => ({ id: p, name: p })),
    Productores: productores.map((i) => ({ id: i.id, name: i.name })),
    Cooperativas: cooperativas.map((i) => ({ id: i.id, name: i.name })),
    Restaurantes: restaurantes.map((i) => ({ id: i.id, name: i.name })),
  }), [provinces, productores, cooperativas, restaurantes]);

  // Filtered items
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedSubItem) {
      if (expandedFilter === "Provincias") {
        filtered = filtered.filter((i) => i.province === selectedSubItem);
      } else {
        filtered = filtered.filter((i) => i.id === selectedSubItem);
      }
    } else if (selectedFilter) {
      if (selectedFilter === "Productores") {
        filtered = filtered.filter((i) => i.companyType === "productor");
      } else if (selectedFilter === "Cooperativas") {
        filtered = filtered.filter((i) => i.companyType === "cooperativa");
      } else if (selectedFilter === "Restaurantes") {
        filtered = filtered.filter((i) => i.companyType === "restaurante");
      }
      // Provincias with no sub-item selected shows all
    }

    return filtered;
  }, [allItems, searchQuery, selectedFilter, selectedSubItem, expandedFilter]);

  const filterChips = useMemo(() => [
    { name: "Provincias", icon: MapPin, count: provinces.length, color: "bg-primary" },
    { name: "Productores", icon: Leaf, count: productores.length, color: "bg-secondary" },
    { name: "Cooperativas", icon: Users, count: cooperativas.length, color: "bg-secondary" },
    { name: "Restaurantes", icon: UtensilsCrossed, count: restaurantes.length, color: "bg-secondary" },
  ], [provinces, productores, cooperativas, restaurantes]);

  const handleFilterClick = (filterName: string) => {
    if (expandedFilter === filterName) {
      // Collapse
      setExpandedFilter(null);
      setSelectedFilter(null);
      setSelectedSubItem(null);
    } else {
      setExpandedFilter(filterName);
      setSelectedFilter(filterName);
      setSelectedSubItem(null);
    }
  };

  const handleSubItemClick = (subId: string) => {
    if (selectedSubItem === subId) {
      setSelectedSubItem(null);
    } else {
      setSelectedSubItem(subId);
    }
  };

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
    <section className="pt-8 pb-20 enso-watermark" id="mapa">
      <div className="container mx-auto px-6">
        {showTitle && (
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-2">
              Explora el territorio
            </h2>
            <p className="text-lg text-muted-foreground">
              Filtra por provincia, tipo de negocio o experiencia y recorre España a través de su red gastronómica.
            </p>
          </div>
        )}

        <div className="max-w-4xl mx-auto mb-8">
          {/* Search bar */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Escribe ciudad, provincia, productor o restaurante..."
                className="pl-11 py-3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Main filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {filterChips.map((chip) => {
              const IconComponent = chip.icon;
              const isSelected = expandedFilter === chip.name;
              return (
                <Badge
                  key={chip.name}
                  variant={isSelected ? "default" : "secondary"}
                  className={`px-3 py-1.5 text-sm hover:shadow-soft transition-all cursor-pointer ${
                    isSelected ? "shadow-md" : ""
                  }`}
                  onClick={() => handleFilterClick(chip.name)}
                >
                  <IconComponent className="w-4 h-4 mr-1.5" />
                  {chip.name} ({chip.count})
                </Badge>
              );
            })}
          </div>

          {/* Sub-item chips */}
          {expandedFilter && subItemsMap[expandedFilter] && subItemsMap[expandedFilter].length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {subItemsMap[expandedFilter].map((sub) => (
                <Badge
                  key={sub.id}
                  variant={selectedSubItem === sub.id ? "default" : "outline"}
                  className="px-2.5 py-1 text-xs cursor-pointer hover:shadow-soft transition-all"
                  onClick={() => handleSubItemClick(sub.id)}
                >
                  {expandedFilter === "Provincias" && <MapPin className="w-3 h-3 mr-1" />}
                  {expandedFilter === "Productores" && <Leaf className="w-3 h-3 mr-1" />}
                  {expandedFilter === "Cooperativas" && <Users className="w-3 h-3 mr-1" />}
                  {expandedFilter === "Restaurantes" && <UtensilsCrossed className="w-3 h-3 mr-1" />}
                  {sub.name}
                </Badge>
              ))}
            </div>
          )}

          {expandedFilter && subItemsMap[expandedFilter] && subItemsMap[expandedFilter].length === 0 && (
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground italic">
                No hay {expandedFilter.toLowerCase()} registrados aún
              </p>
            </div>
          )}

          {/* Status text */}
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredItems.length} puntos en el mapa
              {searchQuery && ` para "${searchQuery}"`}
              {selectedFilter && !selectedSubItem && ` · ${selectedFilter}`}
              {selectedSubItem && ` · ${subItemsMap[expandedFilter!]?.find(s => s.id === selectedSubItem)?.name || selectedSubItem}`}
            </p>
            {(searchQuery || selectedFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter(null);
                  setExpandedFilter(null);
                  setSelectedSubItem(null);
                }}
                className="mt-1"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-earth">
            <CardContent className="p-0">
              <GoogleMap
                filteredBusinesses={filteredItems}
                searchQuery={searchQuery}
                selectedCategory={selectedFilter}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMap;
