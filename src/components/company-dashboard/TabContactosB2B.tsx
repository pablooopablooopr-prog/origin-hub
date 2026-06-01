import { useMemo, useState } from "react";
import {
  MessageCircle,
  Send,
  MapPin,
  TrendingUp,
  Inbox,
  Building2,
  Hotel,
  Utensils,
  Store,
  Filter,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Search,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import CompanyPlanGate from "@/components/CompanyPlanGate";
import { toast } from "sonner";

/**
 * PESTAÑA 4: CONTACTOS B2B (gated por plan Intermedio o superior).
 *
 * Bloque visual completo:
 *   1. Mini-mapa con pins de restaurantes/hoteles/catering verificados
 *   2. Filtros laterales: tipo · provincia · volumen · distancia · búsqueda
 *   3. Click en pin → side-sheet con ficha + CTA "Iniciar chat anónimo"
 *   4. Bandeja de chats (mock) con anonimato hasta revelado mutuo
 *   5. Demandas agregadas (sin nombres)
 *
 * El backend real de chat se conectará en una fase siguiente (tabla
 * b2b_conversations + b2b_messages + RLS). De momento, datos mock coherentes.
 */

type ContactoTipo = "Restaurante" | "Hotel" | "Catering" | "Tienda" | "Cooperativa";

interface Contacto {
  id: string;
  nombre: string;
  tipo: ContactoTipo;
  provincia: string;
  localidad: string;
  capacidad: string;
  demanda: string;
  rating: number;
  volumen: "Pequeño" | "Mediano" | "Grande";
  distancia_km: number;
  /** Pos relativa sobre el mini-mapa SVG (0-100) */
  x: number;
  y: number;
}

const MOCK_CONTACTOS: Contacto[] = [
  {
    id: "c1",
    nombre: "Restaurante El Retablo",
    tipo: "Restaurante",
    provincia: "Ciudad Real",
    localidad: "Piedrabuena",
    capacidad: "~80 cubiertos",
    demanda: "Buscan queso curado y cordero manchego",
    rating: 4.8,
    volumen: "Mediano",
    distancia_km: 18,
    x: 32,
    y: 58,
  },
  {
    id: "c2",
    nombre: "Hotel Bodega La Encina",
    tipo: "Hotel",
    provincia: "Toledo",
    localidad: "Yepes",
    capacidad: "32 habitaciones · restaurante 60",
    demanda: "AOVE de cosecha temprana, miel artesana",
    rating: 4.6,
    volumen: "Grande",
    distancia_km: 84,
    x: 56,
    y: 32,
  },
  {
    id: "c3",
    nombre: "Catering Mesta",
    tipo: "Catering",
    provincia: "Madrid",
    localidad: "Aranjuez",
    capacidad: "Eventos 50-400 pax",
    demanda: "Embutido ibérico, quesos D.O.",
    rating: 4.7,
    volumen: "Grande",
    distancia_km: 142,
    x: 64,
    y: 18,
  },
  {
    id: "c4",
    nombre: "Tienda Sabor de la Tierra",
    tipo: "Tienda",
    provincia: "Cuenca",
    localidad: "Belmonte",
    capacidad: "Tienda gourmet",
    demanda: "Productos D.O. La Mancha",
    rating: 4.5,
    volumen: "Pequeño",
    distancia_km: 95,
    x: 78,
    y: 48,
  },
  {
    id: "c5",
    nombre: "Cooperativa San Isidro",
    tipo: "Cooperativa",
    provincia: "Ciudad Real",
    localidad: "Almagro",
    capacidad: "Cooperativa de 120 socios",
    demanda: "Acuerdos marco con productores artesanos",
    rating: 4.9,
    volumen: "Grande",
    distancia_km: 36,
    x: 44,
    y: 68,
  },
];

const TIPO_ICON: Record<ContactoTipo, React.ReactNode> = {
  Restaurante: <Utensils className="w-3.5 h-3.5" />,
  Hotel: <Hotel className="w-3.5 h-3.5" />,
  Catering: <Building2 className="w-3.5 h-3.5" />,
  Tienda: <Store className="w-3.5 h-3.5" />,
  Cooperativa: <Building2 className="w-3.5 h-3.5" />,
};

const TIPO_COLOR: Record<ContactoTipo, string> = {
  Restaurante: "fill-emerald-500",
  Hotel: "fill-sky-500",
  Catering: "fill-amber-500",
  Tienda: "fill-pink-500",
  Cooperativa: "fill-indigo-500",
};

interface ChatMock {
  id: string;
  contacto_anon: string;
  region: string;
  ultimo_mensaje: string;
  fecha: string;
  no_leidos: number;
  identidad_revelada: boolean;
  contacto_real?: string;
  mensajes: { from: "yo" | "ellos"; text: string; ts: string }[];
}

const MOCK_CHATS: ChatMock[] = [
  {
    id: "ch1",
    contacto_anon: "Restaurante anónimo",
    region: "Provincia de Toledo",
    ultimo_mensaje: "¿Cuál es tu precio por kilo?",
    fecha: "Ayer · 16:15",
    no_leidos: 2,
    identidad_revelada: false,
    mensajes: [
      {
        from: "ellos",
        text: "Hola, busco queso manchego curado, 50kg/mes, precio máx 12€/kg",
        ts: "Ayer 14:02",
      },
      {
        from: "yo",
        text: "Hola, tenemos D.O. Manchego de 18 meses. Te puedo mandar ficha técnica.",
        ts: "Ayer 14:30",
      },
      {
        from: "ellos",
        text: "¿Cuál es tu precio por kilo?",
        ts: "Ayer 16:15",
      },
    ],
  },
  {
    id: "ch2",
    contacto_anon: "Hotel anónimo",
    region: "Provincia de Madrid",
    ultimo_mensaje: "Perfecto, te paso datos por aquí.",
    fecha: "12 may · 11:08",
    no_leidos: 0,
    identidad_revelada: true,
    contacto_real: "Hotel Bodega La Encina · contacto@laencina.es",
    mensajes: [
      {
        from: "ellos",
        text: "Estamos interesados en vuestro AOVE para temporada alta.",
        ts: "10 may 09:11",
      },
      {
        from: "yo",
        text: "Genial, ¿qué volumen estimáis al mes?",
        ts: "10 may 09:45",
      },
      {
        from: "ellos",
        text: "Unos 60L/mes en temporada. ¿Os interesa intercambiar identidad?",
        ts: "12 may 10:50",
      },
      {
        from: "yo",
        text: "Sí, acepto revelar identidad.",
        ts: "12 may 11:00",
      },
      {
        from: "ellos",
        text: "Perfecto, te paso datos por aquí.",
        ts: "12 may 11:08",
      },
    ],
  },
];

const DEMO_DEMANDS = [
  {
    id: "d1",
    text: "Este mes, 3 restaurantes buscan queso manchego (50 kg/mes)",
    region: "Toledo · Madrid",
  },
  {
    id: "d2",
    text: "Este mes, 2 hoteles buscan AOVE cosecha temprana",
    region: "Ciudad Real",
  },
  {
    id: "d3",
    text: "Este mes, 4 caterings buscan miel artesana y embutidos",
    region: "Madrid · Barcelona",
  },
];

const TIPOS: ContactoTipo[] = [
  "Restaurante",
  "Hotel",
  "Catering",
  "Tienda",
  "Cooperativa",
];

const PROVINCIAS = ["Todas", "Ciudad Real", "Toledo", "Madrid", "Cuenca", "Guadalajara"];
const VOLUMENES = ["Cualquiera", "Pequeño", "Mediano", "Grande"];

const TabContactosB2BInner = () => {
  const [activeSubTab, setActiveSubTab] = useState("mapa");
  const [filterTipos, setFilterTipos] = useState<ContactoTipo[]>(TIPOS);
  const [filterProvincia, setFilterProvincia] = useState("Todas");
  const [filterVolumen, setFilterVolumen] = useState("Cualquiera");
  const [filterDistancia, setFilterDistancia] = useState(200);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contacto | null>(null);
  const [chatDraft, setChatDraft] = useState("");
  const [activeChat, setActiveChat] = useState<ChatMock | null>(MOCK_CHATS[0] ?? null);

  const filtered = useMemo(() => {
    return MOCK_CONTACTOS.filter((c) => {
      if (!filterTipos.includes(c.tipo)) return false;
      if (filterProvincia !== "Todas" && c.provincia !== filterProvincia)
        return false;
      if (filterVolumen !== "Cualquiera" && c.volumen !== filterVolumen)
        return false;
      if (c.distancia_km > filterDistancia) return false;
      if (search && !`${c.nombre} ${c.localidad}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [filterTipos, filterProvincia, filterVolumen, filterDistancia, search]);

  const toggleTipo = (t: ContactoTipo) => {
    setFilterTipos((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleSendDraft = () => {
    if (!chatDraft.trim() || !activeChat) return;
    toast.success("Mensaje enviado (modo demostración)");
    setChatDraft("");
  };

  const handleStartChat = (c: Contacto) => {
    toast.success(`Solicitud de chat anónimo enviada a ${c.tipo} en ${c.provincia}`);
    setSelected(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Contactos B2B</h2>
        <p className="text-sm text-muted-foreground">
          Conecta con restaurantes, hoteles y caterings verificados. Tu nombre
          permanece oculto hasta que ambos aceptáis revelar identidad.
        </p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid grid-cols-3 max-w-xl">
          <TabsTrigger value="mapa" className="gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            Mapa
          </TabsTrigger>
          <TabsTrigger value="mensajes" className="gap-1.5">
            <Inbox className="w-3.5 h-3.5" />
            Mensajes
            {MOCK_CHATS.some((c) => c.no_leidos > 0) && (
              <Badge className="h-4 px-1.5 ml-1 text-[10px] bg-primary text-primary-foreground">
                {MOCK_CHATS.reduce((s, c) => s + c.no_leidos, 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="demandas" className="gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Demandas
          </TabsTrigger>
        </TabsList>

        {/* SUB-TAB MAPA */}
        <TabsContent value="mapa" className="mt-6">
          <div className="grid lg:grid-cols-[280px,1fr] gap-4">
            {/* Filtros */}
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Buscar</Label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nombre o localidad"
                      className="pl-8 h-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Tipo de contacto</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {TIPOS.map((t) => (
                      <Badge
                        key={t}
                        variant={filterTipos.includes(t) ? "default" : "outline"}
                        className="cursor-pointer text-[10px] gap-1"
                        onClick={() => toggleTipo(t)}
                      >
                        {TIPO_ICON[t]}
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Provincia</Label>
                  <Select
                    value={filterProvincia}
                    onValueChange={setFilterProvincia}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCIAS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Volumen estimado</Label>
                  <Select value={filterVolumen} onValueChange={setFilterVolumen}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {VOLUMENES.map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="text-xs">Distancia máxima</Label>
                    <span className="text-xs text-muted-foreground">
                      {filterDistancia} km
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={300}
                    step={10}
                    value={filterDistancia}
                    onChange={(e) => setFilterDistancia(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <Separator />

                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">{filtered.length}</strong>{" "}
                  contacto{filtered.length === 1 ? "" : "s"} encontrado
                  {filtered.length === 1 ? "" : "s"}
                </p>
              </CardContent>
            </Card>

            {/* Mini-mapa SVG */}
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-emerald-50 via-amber-50/30 to-sky-50 border-b border-border overflow-hidden">
                  {/* Fondo decorativo tipo mapa */}
                  <svg
                    viewBox="0 0 100 62.5"
                    className="absolute inset-0 w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Contornos decorativos */}
                    <path
                      d="M5,40 Q20,25 35,32 T70,28 T95,38 L95,55 L5,55 Z"
                      fill="hsl(100 25% 70% / 0.15)"
                    />
                    <path
                      d="M10,20 Q30,15 50,22 T90,18"
                      fill="none"
                      stroke="hsl(25 35% 35% / 0.1)"
                      strokeWidth="0.3"
                      strokeDasharray="1,1"
                    />
                    <path
                      d="M15,45 Q40,38 65,42 T95,40"
                      fill="none"
                      stroke="hsl(25 35% 35% / 0.1)"
                      strokeWidth="0.3"
                      strokeDasharray="1,1"
                    />

                    {/* Pin "yo" en el centro */}
                    <circle cx="50" cy="50" r="1.6" fill="hsl(25 35% 35%)" />
                    <circle
                      cx="50"
                      cy="50"
                      r="3"
                      fill="hsl(25 35% 35% / 0.2)"
                      className="animate-pulse"
                    />

                    {/* Pins de contactos */}
                    {filtered.map((c) => (
                      <g
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className="cursor-pointer"
                        style={{ transition: "all 0.2s" }}
                      >
                        <circle
                          cx={c.x}
                          cy={c.y * 0.625}
                          r="2.5"
                          className={`${TIPO_COLOR[c.tipo]} stroke-white`}
                          strokeWidth="0.4"
                        />
                        <circle
                          cx={c.x}
                          cy={c.y * 0.625}
                          r="4.5"
                          className={`${TIPO_COLOR[c.tipo]} opacity-20`}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Leyenda */}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="w-2 h-2 rounded-full bg-[hsl(25,35%,35%)]" />
                      Tú
                    </div>
                    {TIPOS.map((t) => (
                      <div
                        key={t}
                        className="flex items-center gap-1.5 text-[10px]"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${TIPO_COLOR[t].replace("fill-", "bg-")}`}
                        />
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista debajo del mapa */}
                <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
                  {filtered.length === 0 && (
                    <p className="text-sm text-muted-foreground italic text-center py-6">
                      Ningún contacto coincide con los filtros.
                    </p>
                  )}
                  {filtered.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${TIPO_COLOR[c.tipo].replace("fill-", "bg-").replace("-500", "-100")} ${TIPO_COLOR[c.tipo].replace("fill-", "text-").replace("-500", "-700")}`}
                        >
                          {TIPO_ICON[c.tipo]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {c.tipo} verificado
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.localidad}, {c.provincia} · {c.distancia_km} km ·{" "}
                            {c.volumen}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side-sheet del contacto */}
          <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
            <SheetContent className="overflow-y-auto">
              {selected && (
                <>
                  <SheetHeader>
                    <Badge variant="outline" className="w-fit gap-1 text-[10px]">
                      {TIPO_ICON[selected.tipo]}
                      {selected.tipo} verificado
                    </Badge>
                    <SheetTitle className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                      Contacto anónimo
                    </SheetTitle>
                    <SheetDescription>
                      Verás el nombre y los datos de contacto reales sólo si
                      ambos aceptáis revelar identidad.
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <FichaRow label="Provincia" value={selected.provincia} />
                      <FichaRow label="Localidad" value={selected.localidad} />
                      <FichaRow label="Capacidad" value={selected.capacidad} />
                      <FichaRow label="Volumen estimado" value={selected.volumen} />
                      <FichaRow
                        label="Distancia"
                        value={`${selected.distancia_km} km`}
                      />
                      <FichaRow
                        label="Rating en red"
                        value={`${selected.rating} / 5`}
                      />
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
                        Qué busca
                      </p>
                      <p className="text-sm leading-relaxed">{selected.demanda}</p>
                    </div>

                    <Separator />

                    <div className="bg-muted/40 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Privacidad:</strong>{" "}
                      tu nombre y tus datos seguirán ocultos. El otro lado sólo
                      verá tu nicho y provincia hasta que ambos pulséis
                      "Revelar identidad" en la conversación.
                    </div>

                    <Button
                      className="w-full gap-2"
                      onClick={() => handleStartChat(selected)}
                    >
                      <Send className="w-4 h-4" />
                      Iniciar chat anónimo
                    </Button>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </TabsContent>

        {/* SUB-TAB MENSAJES */}
        <TabsContent value="mensajes" className="mt-6">
          <div className="grid lg:grid-cols-[300px,1fr] gap-4 min-h-[500px]">
            {/* Bandeja */}
            <Card className="overflow-hidden">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  Conversaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {MOCK_CHATS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveChat(c)}
                    className={`w-full text-left p-3 hover:bg-muted/40 transition-colors ${
                      activeChat?.id === c.id ? "bg-muted/60" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium truncate flex items-center gap-1">
                        {c.identidad_revelada ? (
                          <Eye className="w-3 h-3 text-emerald-700" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-muted-foreground" />
                        )}
                        {c.identidad_revelada
                          ? c.contacto_real?.split(" · ")[0]
                          : c.contacto_anon}
                      </span>
                      {c.no_leidos > 0 && (
                        <Badge className="h-4 px-1.5 text-[10px]">
                          {c.no_leidos}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.ultimo_mensaje}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {c.fecha} · {c.region}
                    </p>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Conversación activa */}
            <Card className="flex flex-col">
              {activeChat ? (
                <>
                  <CardHeader className="py-3 border-b border-border">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm flex items-center gap-2">
                          {activeChat.identidad_revelada ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              {activeChat.contacto_real}
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4 text-muted-foreground" />
                              {activeChat.contacto_anon}
                            </>
                          )}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activeChat.region}
                        </p>
                      </div>
                      {!activeChat.identidad_revelada && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() =>
                            toast.info(
                              "Solicitud de revelar identidad enviada. La otra parte debe aceptar."
                            )
                          }
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Revelar identidad
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[400px]">
                    {activeChat.mensajes.map((m, i) => (
                      <div
                        key={i}
                        className={`flex ${m.from === "yo" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                            m.from === "yo"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm leading-snug">{m.text}</p>
                          <p
                            className={`text-[10px] mt-1 ${
                              m.from === "yo"
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {m.ts}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  <div className="p-3 border-t border-border flex gap-2">
                    <Input
                      value={chatDraft}
                      onChange={(e) => setChatDraft(e.target.value)}
                      placeholder="Escribe tu mensaje..."
                      className="flex-1"
                      onKeyDown={(e) => e.key === "Enter" && handleSendDraft()}
                    />
                    <Button onClick={handleSendDraft} className="gap-1.5">
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </Button>
                  </div>
                </>
              ) : (
                <CardContent className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground italic">
                    Selecciona una conversación para empezar.
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          <Card className="mt-4 bg-muted/40">
            <CardContent className="p-4 flex items-start gap-3">
              <Lock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Privacidad por diseño:</strong>{" "}
                tu identidad permanece oculta al otro lado hasta que ambos
                acepten "Revelar identidad". Cuando ambos lo aceptáis, se
                intercambian nombre y datos de contacto.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUB-TAB DEMANDAS */}
        <TabsContent value="demandas" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Pedidos agregados de la red este mes. No verás nombres hasta que
            envíes mensaje y acepten contacto.
          </p>
          {DEMO_DEMANDS.map((d) => (
            <Card key={d.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{d.text}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {d.region}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  Activa
                </Badge>
              </CardContent>
            </Card>
          ))}
          <p className="text-xs text-muted-foreground italic pt-2">
            Datos agregados, sin nombres. Cuando una demanda coincide con tu
            categoría, también te llega como notificación.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const FichaRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-3 text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const TabContactosB2B = () => (
  <CompanyPlanGate
    required="standard"
    upgradeMessage="Los contactos B2B con restaurantes están disponibles a partir del plan Intermedio. Mejora tu plan para enviar y recibir mensajes."
  >
    <TabContactosB2BInner />
  </CompanyPlanGate>
);

export default TabContactosB2B;
