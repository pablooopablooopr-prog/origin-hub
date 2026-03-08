import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Leaf, Heart, UtensilsCrossed, Loader2, Package, Route } from "lucide-react";
import { Input } from "@/components/ui/input";
import GoogleMap from "./GoogleMap";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "@/data/businesses";

// Extended marker item for map display
export interface MapItem extends Business {
  itemType: "company" | "route-stop" | "pack";
  routeId?: string;
  routeTitle?: string;
}

const InteractiveMap = ({
  showTitle = true,
}: {
  showTitle?: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [allItems, setAllItems] = useState<MapItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [companiesRes, routeStopsRes] = await Promise.all([
          supabase
            .from("companies_public")
            .select("id, business_name, description, address, latitude, longitude, avg_rating, category_id, slug"),
          supabase
            .from("route_stops")
            .select(`
              id, name, description, address, latitude, longitude, type,
              route_id,
              routes!inner(id, title, slug, is_active, is_public)
            `)
            .not("latitude", "is", null)
            .not("longitude", "is", null),
        ]);

        const items: MapItem[] = [];

        // --- Companies (Productores) ---
        if (companiesRes.data) {
          for (const c of companiesRes.data) {
            if (!c.latitude || !c.longitude) continue;
            const province = extractProvince(c.address);
            items.push({
              id: c.id!,
              name: c.business_name || "",
              category: "Productores",
              description: c.description || "",
              address: c.address || "",
              city: "",
              province,
              coordinates: [c.longitude as number, c.latitude as number],
              rating: (c.avg_rating as number) || 0,
              tags: [],
              itemType: "company",
            });
          }
        }

        // --- Route stops (Experiencias) ---
        if (routeStopsRes.data) {
          for (const s of routeStopsRes.data as any[]) {
            const route = s.routes;
            if (!route || !route.is_active || !route.is_public) continue;
            const province = extractProvince(s.address);
            items.push({
              id: s.id,
              name: s.name,
              category: "Experiencias",
              description: s.description || "",
              address: s.address || "",
              city: "",
              province,
              coordinates: [s.longitude, s.latitude],
              rating: 0,
              tags: s.type ? [s.type] : [],
              itemType: "route-stop",
              routeId: route.id,
              routeTitle: route.title,
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

  // Extract province from address string (last part usually)
  function extractProvince(address: string | null): string {
    if (!address) return "Desconocida";
    const parts = address.split(",").map((p) => p.trim());
    // Try to find a known province-like segment (last or second-to-last)
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

  // Filtered items
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    // Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.province.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          (item as MapItem).routeTitle?.toLowerCase().includes(q)
      );
    }

    // Filter buttons
    if (selectedFilter) {
      if (selectedFilter === "Productores") {
        filtered = filtered.filter((i) => (i as MapItem).itemType === "company");
      } else if (selectedFilter === "Experiencias") {
        filtered = filtered.filter((i) => (i as MapItem).itemType === "route-stop");
      } else {
        // It's a province name
        filtered = filtered.filter((i) => i.province === selectedFilter);
      }
    }

    return filtered;
  }, [allItems, searchQuery, selectedFilter]);

  // Category filter chips
  const filterChips = useMemo(() => {
    const companiesCount = allItems.filter((i) => i.itemType === "company").length;
    const experienciasCount = allItems.filter((i) => i.itemType === "route-stop").length;

    const chips: { name: string; icon: any; count: number; color: string }[] = [
      { name: "Provincias", icon: MapPin, count: provinces.length, color: "bg-primary" },
      { name: "Productores", icon: Leaf, count: companiesCount, color: "bg-secondary" },
      { name: "Experiencias", icon: Route, count: experienciasCount, color: "bg-moss-dark" },
    ];

    return chips;
  }, [allItems, provinces]);

  const [showProvinces, setShowProvinces] = useState(false);

  const handleFilterClick = (filterName: string) => {
    if (filterName === "Provincias") {
      setShowProvinces(!showProvinces);
      if (selectedFilter && provinces.includes(selectedFilter)) {
        setSelectedFilter(null);
      }
      return;
    }
    setShowProvinces(false);
    if (selectedFilter === filterName) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(filterName);
    }
  };

  const handleProvinceClick = (province: string) => {
    if (selectedFilter === province) {
      setSelectedFilter(null);
    } else {
      setSelectedFilter(province);
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
                placeholder="Escribe ciudad, provincia, producto o ruta..."
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
              const isSelected =
                chip.name === "Provincias"
                  ? showProvinces || (selectedFilter !== null && provinces.includes(selectedFilter))
                  : selectedFilter === chip.name;
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

          {/* Province sub-chips */}
          {showProvinces && provinces.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {provinces.map((province) => (
                <Badge
                  key={province}
                  variant={selectedFilter === province ? "default" : "outline"}
                  className="px-2.5 py-1 text-xs cursor-pointer hover:shadow-soft transition-all"
                  onClick={() => handleProvinceClick(province)}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {province}
                </Badge>
              ))}
            </div>
          )}

          {/* Status text */}
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredItems.length} puntos en el mapa
              {searchQuery && ` para "${searchQuery}"`}
              {selectedFilter && ` · filtro: "${selectedFilter}"`}
            </p>
            {(searchQuery || selectedFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter(null);
                  setShowProvinces(false);
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
