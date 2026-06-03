import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Hook para gestionar el chat B2B persistente.
 *
 * - Carga conversaciones de la empresa actual
 * - Resuelve metadata (otro lado: nombre, logo, business_type, locality)
 * - Cuenta unread por conversación (campo unread_a/unread_b en la tabla)
 * - Carga mensajes de la conversación activa
 * - Envía mensajes (trigger en DB actualiza last_message / unread del receptor)
 * - Suscripción realtime a inserts en b2b_messages y updates en b2b_conversations
 *
 * Backend: migración 20260603_000001_b2b_messaging.sql
 */

export interface B2BConversation {
  id: string;
  company_a_id: string;
  company_b_id: string;
  last_message: string | null;
  last_message_at: string | null;
  last_sender_company_id: string | null;
  unread_a: number;
  unread_b: number;
  updated_at: string;
  /** Empresa del "otro lado" enriquecida desde companies */
  other: {
    id: string;
    business_name: string;
    business_type: string | null;
    locality: string | null;
    logo_url: string | null;
    slug: string | null;
  } | null;
  /** Mensajes no leídos para esta empresa */
  unread_for_me: number;
}

export interface B2BMessage {
  id: string;
  conversation_id: string;
  sender_company_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

interface UseB2BChatResult {
  /** ID de la empresa del usuario actual (null mientras carga) */
  myCompanyId: string | null;
  conversations: B2BConversation[];
  activeConversationId: string | null;
  activeMessages: B2BMessage[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  /** Total de mensajes sin leer (suma de todas las conversaciones) */
  totalUnread: number;
  setActiveConversationId: (id: string | null) => void;
  /** Abre/crea conversación con la empresa pasada y la activa */
  openConversationWith: (otherCompanyId: string) => Promise<string | null>;
  /** Envía un mensaje a la conversación activa */
  sendMessage: (body: string) => Promise<void>;
  /** Recarga manualmente conversaciones (tras nueva) */
  refresh: () => Promise<void>;
}

export function useB2BChat(): UseB2BChatResult {
  const [myCompanyId, setMyCompanyId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<B2BConversation[]>([]);
  const [activeConversationId, setActiveConversationIdInner] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<B2BMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const myCompanyIdRef = useRef<string | null>(null);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    myCompanyIdRef.current = myCompanyId;
  }, [myCompanyId]);

  useEffect(() => {
    activeIdRef.current = activeConversationId;
  }, [activeConversationId]);

  // 1. Resolver empresa del usuario actual
  useEffect(() => {
    let alive = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (alive) setMyCompanyId(null);
        return;
      }
      const { data } = await supabase
        .from("companies")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (alive) setMyCompanyId(data?.id ?? null);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 2. Cargar conversaciones (con enriquecido del other side)
  const loadConversations = useCallback(async () => {
    const me = myCompanyIdRef.current;
    if (!me) return;
    setLoadingConversations(true);

    const { data, error } = await supabase
      .from("b2b_conversations")
      .select("*")
      .order("last_message_at", { ascending: false, nullsFirst: false });

    if (error) {
      console.warn("loadConversations:", error.message);
      setConversations([]);
      setLoadingConversations(false);
      return;
    }

    const rawConvs = (data ?? []) as Omit<B2BConversation, "other" | "unread_for_me">[];
    const otherIds = Array.from(
      new Set(
        rawConvs.map((c) =>
          c.company_a_id === me ? c.company_b_id : c.company_a_id
        )
      )
    );

    let othersById: Record<string, B2BConversation["other"]> = {};
    if (otherIds.length > 0) {
      const { data: others } = await supabase
        .from("companies")
        .select("id, business_name, business_type, locality, logo_url, slug")
        .in("id", otherIds);
      for (const o of others ?? []) {
        othersById[o.id] = o as B2BConversation["other"];
      }
    }

    const enriched: B2BConversation[] = rawConvs.map((c) => {
      const otherId = c.company_a_id === me ? c.company_b_id : c.company_a_id;
      const unread_for_me = c.company_a_id === me ? c.unread_a : c.unread_b;
      return {
        ...c,
        other: othersById[otherId] ?? null,
        unread_for_me,
      };
    });

    setConversations(enriched);
    setLoadingConversations(false);
  }, []);

  useEffect(() => {
    if (myCompanyId) void loadConversations();
  }, [myCompanyId, loadConversations]);

  // 3. Cargar mensajes de la conversación activa + marcar leída
  useEffect(() => {
    if (!activeConversationId || !myCompanyId) {
      setActiveMessages([]);
      return;
    }
    let alive = true;
    (async () => {
      setLoadingMessages(true);
      const { data, error } = await supabase
        .from("b2b_messages")
        .select("*")
        .eq("conversation_id", activeConversationId)
        .order("created_at", { ascending: true });

      if (!alive) return;

      if (error) {
        console.warn("loadMessages:", error.message);
        setActiveMessages([]);
      } else {
        setActiveMessages((data ?? []) as B2BMessage[]);
      }
      setLoadingMessages(false);

      // Marcar como leída (RPC)
      await supabase.rpc("b2b_mark_conversation_read", {
        conv_id: activeConversationId,
      });
      // Refrescar conversaciones para que el badge unread baje a 0
      void loadConversations();
    })();
    return () => {
      alive = false;
    };
  }, [activeConversationId, myCompanyId, loadConversations]);

  // 4. Realtime: nuevos mensajes y actualizaciones de conversación
  useEffect(() => {
    if (!myCompanyId) return;

    const channel = supabase
      .channel(`b2b-${myCompanyId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "b2b_messages",
        },
        (payload) => {
          const msg = payload.new as B2BMessage;
          // ¿Es de la conversación activa? Append directo.
          if (msg.conversation_id === activeIdRef.current) {
            setActiveMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
            );
            // Y marcar como leída
            void supabase.rpc("b2b_mark_conversation_read", {
              conv_id: msg.conversation_id,
            });
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "b2b_conversations",
        },
        () => {
          void loadConversations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [myCompanyId, loadConversations]);

  const setActiveConversationId = useCallback((id: string | null) => {
    setActiveConversationIdInner(id);
  }, []);

  const openConversationWith = useCallback(
    async (otherCompanyId: string): Promise<string | null> => {
      if (!myCompanyIdRef.current) {
        toast.error("No tienes empresa asociada");
        return null;
      }
      if (otherCompanyId === myCompanyIdRef.current) {
        toast.error("No puedes iniciar conversación contigo mismo");
        return null;
      }
      const { data, error } = await supabase.rpc(
        "b2b_get_or_create_conversation",
        { other_company_id: otherCompanyId }
      );
      if (error) {
        toast.error("No se pudo abrir la conversación: " + error.message);
        return null;
      }
      const convId = data as string;
      await loadConversations();
      setActiveConversationIdInner(convId);
      return convId;
    },
    [loadConversations]
  );

  const sendMessage = useCallback(
    async (body: string) => {
      const trimmed = body.trim();
      if (!trimmed) return;
      const convId = activeIdRef.current;
      const me = myCompanyIdRef.current;
      if (!convId || !me) return;

      // Insert optimista
      const optimistic: B2BMessage = {
        id: `optimistic-${Date.now()}`,
        conversation_id: convId,
        sender_company_id: me,
        body: trimmed,
        read_at: null,
        created_at: new Date().toISOString(),
      };
      setActiveMessages((prev) => [...prev, optimistic]);

      const { data, error } = await supabase
        .from("b2b_messages")
        .insert({
          conversation_id: convId,
          sender_company_id: me,
          body: trimmed,
        })
        .select()
        .single();

      if (error) {
        toast.error("No se pudo enviar: " + error.message);
        setActiveMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        return;
      }

      // Reemplazar optimista por real
      setActiveMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? (data as B2BMessage) : m))
      );
    },
    []
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unread_for_me ?? 0),
    0
  );

  return {
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
    refresh: loadConversations,
  };
}
