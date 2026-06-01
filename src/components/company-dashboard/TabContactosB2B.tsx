import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Filter,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface B2BCompany {
  id: string;
  business_name: string;
  business_type: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  slug: string | null;
  status: string | null;
  latitude: number | null;
  longitude: number | null;
}

interface ConversationPreview {
  id: string;
  name: string;
  message: string;
  time: string;
  unread?: number;
  logo?: string;
}

const DEMO_CONVERSATIONS: ConversationPreview[] = [
  {
    id: "verde-campo",
    name: "Verde Campo S.L.",
    message: "Hola, estamos interesados en tu aceite...",
    time: "11:42",
    unread: 2,
  },
  {
    id: "despensa-chef",
    name: "La Despensa del Chef",
    message: "Gracias por la información, ¿tenéis...",
    time: "10:15",
    unread: 1,
  },
  {
    id: "del-mar",
    name: "Del Mar a la Mesa",
    message: "Perfecto, quedamos a la espera.",
    time: "Ayer",
  },
  {
    id: "sabor-rural",
    name: "Sabor Rural",
    message: "¿Podrías enviarnos tu catálogo?",
    time: "Ayer",
  },
  {
    id: "hortus",
    name: "Hortus Productos",
    message: "Muchas gracias, hablaremos pronto.",
    time: "2 jun",
  },
  {
    id: "tierra-viva",
    name: "Tierra Viva Eco",
    message: "Hola, nos interesa tu producción.",
    time: "1 jun",
  },
];

const COMPANY_TYPES = [
  "Todos",
  "Restaurante",
  "Productor",
  "Tienda",
  "Cooperativa",
  "Alojamiento Rural",
  "Otro",
];

const PROVINCES = [
  "Todas",
  "Ciudad Real",
  "Toledo",
  "Madrid",
  "Cuenca",
  "Guadalajara",
  "Barcelona",
  "Valencia",
];

const CATEGORIES = [
  "Todas",
  "Quesos",
  "Aceite",
  "Vino",
  "Miel",
  "Carne",
  "Restaurante",
  "Gourmet",
];

const clusterPositions = [
  { left: "22%", top: "20%" },
  { left: "38%", top: "42%" },
  { left: "51%", top: "60%" },
  { left: "78%", top: "44%" },
  { left: "64%", top: "78%" },
  { left: "84%", top: "70%" },
  { left: "56%", top: "18%" },
  { left: "34%", top: "74%" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const TabContactosB2B = () => {
  const [companies, setCompanies] = useState<B2BCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationSearch, setConversationSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [provinceFilter, setProvinceFilter] = useState("Todas");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    const loadCompanies = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select(
          "id, business_name, business_type, address, description, logo_url, slug, status, latitude, longitude"
        )
        .eq("status", "approved")
        .order("business_name", { ascending: true })
        .limit(80);

      if (!alive) return;

      if (error) {
        console.warn("b2b companies error:", error.message);
        toast.error("No se pudieron cargar las empresas aprobadas");
        setCompanies([]);
      } else {
        setCompanies((data ?? []) as B2BCompany[]);
      }
      setLoading(false);
    };

    void loadCompanies();

    return () => {
      alive = false;
    };
  }, []);

  const conversations = useMemo(() => {
    const query = conversationSearch.trim().toLowerCase();
    if (!query) return DEMO_CONVERSATIONS;
    return DEMO_CONVERSATIONS.filter((conversation) =>
      `${conversation.name} ${conversation.message}`.toLowerCase().includes(query)
    );
  }, [conversationSearch]);

  const filteredCompanies = useMemo(() => {
    const query = companySearch.trim().toLowerCase();
    return companies.filter((company) => {
      const haystack = `${company.business_name} ${company.business_type ?? ""} ${
        company.address ?? ""
      } ${company.description ?? ""}`.toLowerCase();

      if (query && !haystack.includes(query)) return false;
      if (typeFilter !== "Todos" && company.business_type !== typeFilter) return false;
      if (
        provinceFilter !== "Todas" &&
        !(company.address ?? "").toLowerCase().includes(provinceFilter.toLowerCase())
      ) {
        return false;
      }
      if (
        categoryFilter !== "Todas" &&
        !haystack.includes(categoryFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [companies, companySearch, typeFilter, provinceFilter, categoryFilter]);

  const selectedCompany =
    filteredCompanies.find((company) => company.id === selectedCompanyId) ??
    filteredCompanies[0] ??
    null;

  const handleStartConversation = (company: B2BCompany) => {
    setSelectedCompanyId(company.id);
    toast.success(`Conversación privada preparada con ${company.business_name}`);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-3xl font-semibold tracking-tight text-[#1f140c]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif" }}
        >
          Contactos B2B
        </h2>
        <p className="text-sm text-muted-foreground">
          Conecta de forma privada con restaurantes, tiendas, productores y
          negocios verificados dentro de RitmOrigen.
        </p>
      </div>

      <Card className="overflow-hidden bg-[#fffaf2]/80">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[340px,1fr]">
          <aside className="border-b border-border bg-[#fffaf2]/70 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3 p-5">
              <h3 className="font-semibold">Conversaciones</h3>
              <Button size="icon" variant="outline" aria-label="Nueva conversación">
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-5 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={conversationSearch}
                  onChange={(event) => setConversationSearch(event.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="max-h-[560px] overflow-y-auto border-t border-border">
              {conversations.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  Aún no tienes conversaciones abiertas. Busca una empresa en
                  el mapa para iniciar el primer contacto.
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    className="flex w-full items-center gap-3 border-b border-border/70 p-4 text-left transition-colors hover:bg-[#f4eadc]"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.logo} alt="" />
                      <AvatarFallback className="bg-[#e9dece] text-[#4f6f3f]">
                        {initials(conversation.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <strong className="truncate text-sm">
                          {conversation.name}
                        </strong>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-sm text-muted-foreground">
                        {conversation.message}
                      </span>
                    </span>
                    {conversation.unread ? (
                      <Badge className="h-6 min-w-6 justify-center rounded-full bg-[#7b572d] px-2">
                        {conversation.unread}
                      </Badge>
                    ) : null}
                  </button>
                ))
              )}
            </div>
          </aside>

          <section className="p-5">
            <div className="mb-5">
              <h3 className="font-semibold">Descubre empresas</h3>
              <p className="text-sm text-muted-foreground">
                Busca y conecta con restaurantes, tiendas y productores en toda
                España.
              </p>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_auto]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={companySearch}
                  onChange={(event) => setCompanySearch(event.target.value)}
                  placeholder="Buscar empresas..."
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de empresa" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "Todos" ? "Tipo de empresa" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Provincia" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province === "Todas" ? "Provincia" : province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoría / Producto" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "Todas" ? "Categoría / Producto" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Más filtros
              </Button>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-md border border-border bg-[#e8f2f3]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_48%,#fbf4e8_0_22%,transparent_23%),radial-gradient(circle_at_58%_58%,#f5ead8_0_18%,transparent_19%),radial-gradient(circle_at_70%_42%,#fbf4e8_0_20%,transparent_21%),linear-gradient(135deg,#d9eef6,#f7eddf_45%,#cfe8f2)]" />
              <div className="absolute left-[18%] top-[18%] h-[68%] w-[62%] rounded-[45%_35%_42%_30%] border border-[#cdbb9c]/60 bg-[#fbf4e8]/80 shadow-inner" />
              <div className="absolute left-[38%] top-[43%] text-sm text-[#8d7d6d]">
                Madrid
              </div>
              <div className="absolute left-[48%] top-[60%] text-sm text-[#8d7d6d]">
                Castilla-La Mancha
              </div>
              <div className="absolute left-[70%] top-[36%] text-sm text-[#8d7d6d]">
                Aragón
              </div>
              <div className="absolute left-[20%] top-[40%] text-sm text-[#8d7d6d]">
                Castilla y León
              </div>

              {filteredCompanies.length > 0 ? (
                filteredCompanies.slice(0, 12).map((company, index) => {
                  const position = clusterPositions[index % clusterPositions.length];
                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => handleStartConversation(company)}
                      className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#d7c4a3] text-sm font-bold text-[#3c2b1d] shadow-[0_4px_16px_rgba(76,51,25,0.22)] ring-4 ring-[#fffaf2]/70"
                      style={{ left: position.left, top: position.top }}
                      title={company.business_name}
                    >
                      {index + 1}
                    </button>
                  );
                })
              ) : (
                <div className="absolute inset-x-6 bottom-6 rounded-md border border-border bg-[#fffaf2]/88 p-4 text-sm text-muted-foreground shadow-sm">
                  No hay empresas aprobadas que coincidan con los filtros.
                </div>
              )}

              <div className="absolute bottom-4 right-4 overflow-hidden rounded-md border border-border bg-white/90 shadow-sm">
                <button className="block h-9 w-9 border-b border-border text-xl">+</button>
                <button className="block h-9 w-9 text-xl">-</button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="text-sm text-muted-foreground">
                  Haz clic en una empresa para ver sus detalles e iniciar una
                  conversación privada.
                </p>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#4f6f3f]" />
                  Privacidad por diseño: tus datos directos solo se comparten
                  cuando ambas partes aceptan continuar el acuerdo.
                </p>
              </div>

              <Card className="bg-[#fffaf2]/82">
                <CardContent className="p-4">
                  {loading ? (
                    <p className="text-sm text-muted-foreground">
                      Cargando empresas aprobadas...
                    </p>
                  ) : selectedCompany ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedCompany.logo_url ?? undefined} alt="" />
                          <AvatarFallback className="bg-[#e9dece] text-[#4f6f3f]">
                            {initials(selectedCompany.business_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <h4 className="truncate font-semibold">
                            {selectedCompany.business_name}
                          </h4>
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {selectedCompany.address ?? "Ubicación no indicada"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {selectedCompany.business_type ?? "Empresa verificada"}
                      </Badge>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {selectedCompany.description ??
                          "Empresa aprobada dentro de RitmOrigen."}
                      </p>
                      <Button
                        className="w-full gap-2 bg-[#4f6f3f] hover:bg-[#425f34]"
                        onClick={() => handleStartConversation(selectedCompany)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Iniciar conversación privada
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <SlidersHorizontal className="h-5 w-5 text-[#7b572d]" />
                      <p>
                        No hay empresas aprobadas que coincidan con los filtros.
                        Ajusta la búsqueda para iniciar el primer contacto.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabContactosB2B;
