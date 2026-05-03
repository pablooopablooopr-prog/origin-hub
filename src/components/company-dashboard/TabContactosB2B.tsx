import { useState } from "react";
import { MessageCircle, Send, MapPin, TrendingUp, Inbox } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyPlanGate from "@/components/CompanyPlanGate";

/**
 * PESTAÑA 4: CONTACTOS B2B (gated por plan Standard).
 *
 * Tres sub-secciones:
 *   1. MAPA de restaurantes (placeholder hasta FASE 6)
 *   2. BANDEJA de mensajes (mock con 0 mensajes)
 *   3. DEMANDAS activas (datos agregados, sin nombres)
 *
 * El contacto entre empresa ↔ restaurante es ANÓNIMO hasta que ambos aceptan
 * (lógica completa en FASE 6).
 */

const DEMO_DEMANDS = [
  {
    id: "d1",
    text: "Este mes, 3 restaurantes buscan queso manchego (50 kg/mes)",
    region: "Toledo · Madrid",
  },
  {
    id: "d2",
    text: "Este mes, 2 bodegas buscan cordero manchego certificado",
    region: "Ciudad Real",
  },
  {
    id: "d3",
    text: "Este mes, 4 restaurantes buscan AOVE de cosecha temprana",
    region: "Madrid · Barcelona",
  },
];

const TabContactosB2BInner = () => {
  const [activeSubTab, setActiveSubTab] = useState("mapa");

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Contactos B2B</h2>
        <p className="text-sm text-muted-foreground">
          Conecta con restaurantes verificados de la red. Tu nombre permanece
          oculto hasta que ambos aceptáis el contacto.
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
          </TabsTrigger>
          <TabsTrigger value="demandas" className="gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            Demandas
          </TabsTrigger>
        </TabsList>

        {/* SUB-TAB MAPA */}
        <TabsContent value="mapa" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center space-y-3">
              <MapPin className="w-10 h-10 mx-auto text-muted-foreground/40" />
              <h3 className="text-base font-semibold">
                Mapa de restaurantes próximamente
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                En FASE 6 se activará el mapa interactivo con todos los
                restaurantes de la red, filtros por provincia, tipo de cocina,
                volumen estimado y distancia. Cada restaurante mostrará lo que
                busca y un botón para enviarle un mensaje privado.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUB-TAB MENSAJES */}
        <TabsContent value="mensajes" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Inbox className="w-4 h-4" />
                  Recibidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  No tienes mensajes aún. Cuando un restaurante te contacte
                  aparecerá aquí.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Enviados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  No has enviado mensajes aún. Usa el mapa para iniciar
                  conversaciones.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4 bg-muted/40">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Privacidad:</strong> tu nombre y datos de contacto
                permanecen ocultos al otro lado hasta que ambos aceptáis el
                contacto. Esta protección es por diseño.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SUB-TAB DEMANDAS */}
        <TabsContent value="demandas" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Estos son los pedidos agregados de los restaurantes de la red este
            mes. No verás nombres hasta que envíes mensaje y acepten.
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
                  Demo
                </Badge>
              </CardContent>
            </Card>
          ))}

          <p className="text-xs text-muted-foreground italic pt-4">
            Datos de ejemplo. En FASE 6 se conectará con demandas reales y
            podrás filtrar por región y tipo de producto.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TabContactosB2B = () => (
  <CompanyPlanGate
    required="standard"
    upgradeMessage="Los contactos B2B con restaurantes están disponibles a partir del plan Standard. Mejora tu plan para enviar y recibir mensajes."
  >
    <TabContactosB2BInner />
  </CompanyPlanGate>
);

export default TabContactosB2B;
