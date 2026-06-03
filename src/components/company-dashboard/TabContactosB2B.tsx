import { useEffect, useMemo, useRef, useState } from "react";
import {
  Edit3,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ArrowLeft,
  CheckCheck,
  Loader2,
  Building2,
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
import CompanyPlanGate from "@/components/CompanyPlanGate";
import { useB2BChat, type B2BConversation } from "@/hooks/useB2BChat";
import B2BMiniMap, { type B2BMapCompany } from "./B2BMiniMap";

/**
 * PESTAÑA 4 (rediseño LIVE): Contactos B2B.
 *
 * Tres modos coordinados:
 *   1. "discover"  - mapa interactivo de empresas verificadas con filtros y
 *                    panel de detalle al seleccionar.
 *   2. "chat"      - conversación activa estilo WhatsApp con auto-scroll y
 *                    realtime (subscripción a inserts de b2b_messages).
 *   3. La lista de conversaciones de la izquierda siempre está visible (en
 *      desktop) y permite saltar a cualquiera; en móvil sustituye al detalle.
 *
 * Backend: tablas b2b_conversations / b2b_messages + RPCs
 *   b2b_get_or_create_conversation, b2b_mark_conversation_read.
 */

interface B2BCompanyRow {
  id: string;
  business_name: string;
  business_type: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  slug: string | null;
  status: string | null;
  locality: string | null;
  latitude: number | null;
  longitude: number | null;
}

const COMPANY_TYPES = [
  "Todos",
  "Restaurante",
  "Productor",
  "Quesos y Lácteos",
  "Carnes y Embutidos",
  "Vinos y Bodegas",
  "Caza y Monterías",
  "Miel y Apicultura",
  "Cooperativas y Aceite",
  "Alojamiento Rural",
  "Tienda",
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
  "Sevilla",
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const formatTime = (iso: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const sameDay =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  if (sameDay) {
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();
  if (isYesterday) return "Ayer";
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
};

const TabContactosB2BInner = () => {
  const {
    myCompanyId,
    conversations,
    activeConversationId,
    activeMessages,
    loadingConversations,
    loadingMessages,
    totalUnread,
    setActiveConversationId,
    openConversationWith,
    sendMessage,
  } = useB2BChat();

  const [companies, setCompanies] = useState<B2BCompanyRow[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const [conversationSearch, setConversationSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [provinceFilter, setProvinceFilter] = useState("Todas");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carga empresas reales aprobadas (otras, no la mía)
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoadingCompanies(true);
      const { data, error } = await supabase
        .from("companies")
        .select(
          "id, business_name, business_type, address, description, logo_url, slug, status, locality, latitude, longitude"
        )
        .eq("status", "approved")
        .order("business_name", { ascending: true })
        .limit(120);

      if (!alive) return;
      if (error) {
        console.warn("companies error:", error.message);
        setCompanies([]);
      } else {
        const list = ((data ?? []) as B2BCompanyRow[]).filter(
          (c) => c.id !== myCompanyId
        );
        setCompanies(list);
      }
      setLoadingCompanies(false);
    })();
    return () => {
      alive = false;
    };
  }, [myCompanyId]);

  // Auto-scroll cuando llega mensaje nuevo
  useEffect(() => {
    if (activeConversationId && activeMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeMessages, activeConversationId]);

  const filteredConversations = useMemo(() => {
    const q = conversationSearch.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => {
      const name = c.other?.business_name ?? "";
      const last = c.last_message ?? "";
      return `${name} ${last}`.toLowerCase().includes(q);
    });
  }, [conversations, conversationSearch]);

  const filteredCompanies = useMemo(() => {
    const q = companySearch.trim().toLowerCase();
    return companies.filter((c) => {
      const haystack = `${c.business_name} ${c.business_type ?? ""} ${
        c.address ?? ""
      } ${c.description ?? ""} ${c.locality ?? ""}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (typeFilter !== "Todos" && c.business_type !== typeFilter) return false;
      if (
        provinceFilter !== "Todas" &&
        !`${c.address ?? ""} ${c.locality ?? ""}`
          .toLowerCase()
          .includes(provinceFilter.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [companies, companySearch, typeFilter, provinceFilter]);

  const selectedCompany = useMemo(
    () => filteredCompanies.find((c) => c.id === selectedCompanyId) ?? null,
    [filteredCompanies, selectedCompanyId]
  );

  const activeConv: B2BConversation | undefined = conversations.find(
    (c) => c.id === activeConversationId
  );

  const handleStartChat = async (companyId: string) => {
    const convId = await openConversationWith(companyId);
    if (convId) {
      toast.success("Conversación lista");
    }
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    await sendMessage(text);
  };

  const mapCompanies: B2BMapCompany[] = filteredCompanies.map((c) => ({
    id: c.id,
    business_name: c.business_name,
    business_type: c.business_type,
    locality: c.locality,
    logo_url: c.logo_url,
    latitude: c.latitude,
    longitude: c.longitude,
  }));

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2
          className="text-3xl font-semibold tracking-tight text-[#1f140c]"
          style={{
            fontFamily:
              "'Playfair Display', 'Cormorant Garamond', 'Georgia', serif",
          }}
        >
          Contactos B2B
        </h2>
        <p className="text-sm text-muted-foreground">
          Conecta de forma privada con restaurantes, tiendas, productores y
          negocios verificados dentro de RitmOrigen.
          {totalUnread > 0 && (
            <span className="ml-2 inline-flex items-center gap-1 text-primary font-medium">
              <MessageCircle className="w-3.5 h-3.5" />
              {totalUnread} mensaje{totalUnread === 1 ? "" : "s"} sin leer
            </span>
          )}
        </p>
      </div>

      <Card className="overflow-hidden bg-[#fffaf2]/80">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-[340px,1fr] min-h-[640px]">
          {/* ============ COLUMNA IZQUIERDA: CONVERSACIONES ============ */}
          <aside
            className={`border-b border-border bg-[#fffaf2]/70 lg:border-b-0 lg:border-r flex flex-col ${
              activeConversationId ? "hidden lg:flex" : "flex"
            }`}
          >
            <div className="flex items-center justify-between gap-3 p-5">
              <h3 className="font-semibold">Conversaciones</h3>
              <Button
                size="icon"
                variant="outline"
                aria-label="Nueva conversación"
                onClick={() => {
                  setActiveConversationId(null);
                  setSelectedCompanyId(null);
                }}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </div>
            <div className="px-5 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={conversationSearch}
                  onChange={(e) => setConversationSearch(e.target.value)}
                  placeholder="Buscar conversaciones..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto border-t border-border">
              {loadingConversations ? (
                <div className="p-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando conversaciones...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  {conversations.length === 0
                    ? "Aún no tienes conversaciones abiertas. Busca una empresa en el mapa para iniciar el primer contacto."
                    : "Ninguna conversación coincide con la búsqueda."}
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const name = conv.other?.business_name ?? "Empresa";
                  const isActive = conv.id === activeConversationId;
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setActiveConversationId(conv.id)}
                      className={`flex w-full items-center gap-3 border-b border-border/70 p-4 text-left transition-colors hover:bg-[#f4eadc] ${
                        isActive ? "bg-[#efe4d3]" : ""
                      }`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={conv.other?.logo_url ?? undefined} alt="" />
                        <AvatarFallback className="bg-[#e9dece] text-[#4f6f3f]">
                          {initials(name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <strong className="truncate text-sm">{name}</strong>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTime(conv.last_message_at)}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-sm text-muted-foreground">
                          {conv.last_message ?? "Conversación iniciada"}
                        </span>
                      </span>
                      {conv.unread_for_me > 0 && (
                        <Badge className="h-6 min-w-6 justify-center rounded-full bg-[#7b572d] px-2">
                          {conv.unread_for_me}
                        </Badge>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          {/* ============ COLUMNA DERECHA ============ */}
          <section className="flex flex-col">
            {activeConv ? (
              <ChatPanel
                conv={activeConv}
                messages={activeMessages}
                loading={loadingMessages}
                draft={draft}
                onDraftChange={setDraft}
                onSend={handleSend}
                onBack={() => setActiveConversationId(null)}
                myCompanyId={myCompanyId}
                messagesEndRef={messagesEndRef}
              />
            ) : (
              <DiscoverPanel
                companies={filteredCompanies}
                mapCompanies={mapCompanies}
                loading={loadingCompanies}
                companySearch={companySearch}
                setCompanySearch={setCompanySearch}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                provinceFilter={provinceFilter}
                setProvinceFilter={setProvinceFilter}
                selectedCompany={selectedCompany}
                setSelectedCompanyId={setSelectedCompanyId}
                onStartChat={handleStartChat}
              />
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// ChatPanel — vista WhatsApp-style
// ============================================================================
interface ChatPanelProps {
  conv: B2BConversation;
  messages: ReturnType<typeof useB2BChat>["activeMessages"];
  loading: boolean;
  draft: string;
  onDraftChange: (v: string) => void;
  onSend: () => void;
  onBack: () => void;
  myCompanyId: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatPanel = ({
  conv,
  messages,
  loading,
  draft,
  onDraftChange,
  onSend,
  onBack,
  myCompanyId,
  messagesEndRef,
}: ChatPanelProps) => {
  const otherName = conv.other?.business_name ?? "Empresa";
  const otherType = conv.other?.business_type ?? "Empresa verificada";
  const otherLocality = conv.other?.locality ?? "—";

  return (
    <>
      {/* Header del chat */}
      <header className="flex items-center gap-3 p-4 border-b border-border bg-[#fffaf2]">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="lg:hidden"
          aria-label="Volver"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Avatar className="h-11 w-11">
          <AvatarImage src={conv.other?.logo_url ?? undefined} alt="" />
          <AvatarFallback className="bg-[#e9dece] text-[#4f6f3f]">
            {initials(otherName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{otherName}</h4>
          <p className="text-xs text-muted-foreground truncate">
            {otherType} · {otherLocality}
          </p>
        </div>
        <Badge variant="outline" className="gap-1 text-[10px]">
          <Lock className="w-3 h-3" />
          Privado
        </Badge>
      </header>

      {/* Hilo de mensajes */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#fdf6e7]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, #f6ead4 0 1px, transparent 1px), radial-gradient(circle at 70% 60%, #f6ead4 0 1px, transparent 1px)",
          backgroundSize: "40px 40px, 60px 60px",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground italic">
              Aún no hay mensajes. Saluda para empezar.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.sender_company_id === myCompanyId;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 shadow-sm ${
                    mine
                      ? "bg-[#dcf8c6] text-[#1f140c] rounded-br-sm"
                      : "bg-white text-[#1f140c] rounded-bl-sm border border-border/40"
                  }`}
                >
                  <p className="text-sm leading-snug whitespace-pre-wrap break-words">
                    {m.body}
                  </p>
                  <p
                    className={`flex items-center justify-end gap-1 text-[10px] mt-0.5 ${
                      mine ? "text-[#5a6b3a]" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(m.created_at).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {mine && (
                      <CheckCheck
                        className={`w-3 h-3 ${
                          m.read_at ? "text-sky-600" : "text-muted-foreground/60"
                        }`}
                      />
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-[#fffaf2] flex gap-2 items-end">
        <Input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-white"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button
          onClick={onSend}
          disabled={!draft.trim()}
          className="gap-1.5 bg-[#4f6f3f] hover:bg-[#425f34]"
        >
          <Send className="w-4 h-4" />
          Enviar
        </Button>
      </div>
    </>
  );
};

// ============================================================================
// DiscoverPanel — mapa + filtros + detalle
// ============================================================================
interface DiscoverPanelProps {
  companies: B2BCompanyRow[];
  mapCompanies: B2BMapCompany[];
  loading: boolean;
  companySearch: string;
  setCompanySearch: (v: string) => void;
  typeFilter: string;
  setTypeFilter: (v: string) => void;
  provinceFilter: string;
  setProvinceFilter: (v: string) => void;
  selectedCompany: B2BCompanyRow | null;
  setSelectedCompanyId: (id: string | null) => void;
  onStartChat: (companyId: string) => void;
}

const DiscoverPanel = ({
  companies,
  mapCompanies,
  loading,
  companySearch,
  setCompanySearch,
  typeFilter,
  setTypeFilter,
  provinceFilter,
  setProvinceFilter,
  selectedCompany,
  setSelectedCompanyId,
  onStartChat,
}: DiscoverPanelProps) => {
  return (
    <div className="p-5 space-y-4">
      <div>
        <h3 className="font-semibold">Descubre empresas</h3>
        <p className="text-sm text-muted-foreground">
          Busca y conecta con restaurantes, tiendas y productores en toda
          España.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
            placeholder="Buscar empresas..."
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de empresa" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t === "Todos" ? "Tipo de empresa" : t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={provinceFilter} onValueChange={setProvinceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Provincia" />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p} value={p}>
                {p === "Todas" ? "Provincia" : p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <Card className="h-[420px] flex items-center justify-center">
          <CardContent>
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : (
        <B2BMiniMap
          companies={mapCompanies}
          selectedId={selectedCompany?.id ?? null}
          onSelectCompany={(c) => setSelectedCompanyId(c.id)}
          height="420px"
        />
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Haz clic en una empresa para ver sus detalles e iniciar una
            conversación privada.
          </p>
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#4f6f3f]" />
            Privacidad por diseño: tu identidad solo se comparte cuando ambas
            partes aceptan continuar el acuerdo.
          </p>
        </div>

        <Card className="bg-[#fffaf2]/82">
          <CardContent className="p-4">
            {selectedCompany ? (
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
                      {selectedCompany.locality ??
                        selectedCompany.address ??
                        "Ubicación no indicada"}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Building2 className="w-3 h-3" />
                  {selectedCompany.business_type ?? "Empresa verificada"}
                </Badge>
                {selectedCompany.description && (
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {selectedCompany.description}
                  </p>
                )}
                <Button
                  className="w-full gap-2 bg-[#4f6f3f] hover:bg-[#425f34]"
                  onClick={() => onStartChat(selectedCompany.id)}
                >
                  <MessageCircle className="h-4 w-4" />
                  Iniciar conversación privada
                </Button>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Selecciona una empresa en el mapa para ver sus detalles e
                  iniciar el primer contacto.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TabContactosB2B = () => (
  <CompanyPlanGate
    required="standard"
    upgradeMessage="Los contactos B2B con restaurantes están disponibles a partir del plan Intermedio. Mejora tu plan para enviar y recibir mensajes."
  >
    <TabContactosB2BInner />
  </CompanyPlanGate>
);

export default TabContactosB2B;
