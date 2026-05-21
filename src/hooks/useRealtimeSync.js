import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useRealtimeSync(user, {
  onEventsChange = () => {},
  onNotesChange = () => {},
  onCoparentsChange = () => {}
} = {}) {
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setRealtimeConnected(false);
      return;
    }

    const channel = supabase.channel(`parentio-realtime-${user.id}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events"
        },
        (payload) => {
          setLastRealtimeEvent({
            type: "events",
            at: new Date().toISOString(),
            payload
          });

          onEventsChange(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notes"
        },
        (payload) => {
          setLastRealtimeEvent({
            type: "notes",
            at: new Date().toISOString(),
            payload
          });

          onNotesChange(payload);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "coparents"
        },
        (payload) => {
          setLastRealtimeEvent({
            type: "coparents",
            at: new Date().toISOString(),
            payload
          });

          onCoparentsChange(payload);
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
      setRealtimeConnected(false);
    };
  }, [user?.id]);

  return {
    realtimeConnected,
    lastRealtimeEvent
  };
}
