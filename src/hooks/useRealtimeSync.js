import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useRealtimeSync(user, callbacks = {}) {
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastRealtimeEvent, setLastRealtimeEvent] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase.channel(`parentio-realtime-${user.id}`);

    channel.on("postgres_changes",{event:"*",schema:"public",table:"coparents"},payload=>{
      setLastRealtimeEvent({type:"coparents",at:new Date().toISOString(),payload});
      callbacks.onCoparentsChange?.(payload);
    });

    channel.subscribe((status)=>{
      setRealtimeConnected(status==="SUBSCRIBED");
    });

    return ()=> {
      supabase.removeChannel(channel);
      setRealtimeConnected(false);
    };
  }, [user?.id]);

  return {
    realtimeConnected,
    lastRealtimeEvent
  };
}
