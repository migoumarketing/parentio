// src/hooks/useEvents.js

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useEvents(user) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  async function getAcceptedSharedOwnerIds() {
    if (!user?.email) return [];

    const { data, error } = await supabase
      .from("coparents")
      .select("owner_id, permission, status")
      .eq("coparent_email", user.email.toLowerCase())
      .eq("status", "accepted");

    if (error) throw error;

    return (data || [])
      .map((item) => item.owner_id)
      .filter(Boolean);
  }

  async function reloadEvents() {
    if (!user?.id) {
      setEvents([]);
      return [];
    }

    try {
      setLoadingEvents(true);
      setEventsError(null);

      const sharedOwnerIds = await getAcceptedSharedOwnerIds();
      const allowedUserIds = [user.id, ...sharedOwnerIds];

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .in("user_id", allowedUserIds)
        .order("event_date", { ascending: true });

      if (error) throw error;

      const safeData = (data || []).filter((event) => {
        if (event.user_id === user.id) return true;
        return event.shared === true;
      });

      setEvents(safeData);
      return safeData;
    } catch (error) {
      console.error("LOAD EVENTS ERROR:", error);
      setEventsError(error);
      setEvents([]);
      return [];
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    reloadEvents();
  }, [user?.id, user?.email]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("parentio-events-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "events"
        },
        async () => {
          await reloadEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, user?.email]);

  async function addEvent(eventData) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté.");
    }

    const payload = {
      title: eventData.title || eventData.titre || "",
      type: eventData.type || "rdv",
      parent: eventData.parent || "",
      event_date: eventData.event_date || eventData.date,
      status: eventData.status || "planned",
      heure: eventData.heure || eventData.time || "",
      shared: eventData.shared ?? true,
      user_id: user.id
    };

    if (!payload.title.trim()) throw new Error("Titre manquant.");
    if (!payload.event_date) throw new Error("Date manquante.");

    const { data, error } = await supabase
      .from("events")
      .insert([payload])
      .select();

    if (error) throw error;

    await reloadEvents();
    return data || [];
  }

  async function removeEvent(id) {
    if (!user?.id) throw new Error("Utilisateur non connecté.");
    if (!id) throw new Error("ID événement manquant.");

    const existing = events.find((event) => event.id === id);

    if (existing && existing.user_id !== user.id) {
      throw new Error("Vous ne pouvez pas supprimer un événement partagé par un autre parent.");
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    await reloadEvents();
    return true;
  }

  async function editEvent(id, updates) {
    if (!user?.id) throw new Error("Utilisateur non connecté.");
    if (!id) throw new Error("ID événement manquant.");

    const existing = events.find((event) => event.id === id);

    if (existing && existing.user_id !== user.id) {
      throw new Error("Vous ne pouvez pas modifier un événement partagé par un autre parent.");
    }

    const payload = {
      title: updates.title || updates.titre || "",
      type: updates.type || "rdv",
      parent: updates.parent || "",
      event_date: updates.event_date || updates.date,
      status: updates.status || "planned",
      heure: updates.heure || updates.time || "",
      shared: updates.shared ?? true
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key];
      }
    });

    const { data, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) throw error;

    await reloadEvents();
    return data || [];
  }

  return {
    events,
    loadingEvents,
    eventsError,
    reloadEvents,
    addEvent,
    removeEvent,
    editEvent
  };
}
