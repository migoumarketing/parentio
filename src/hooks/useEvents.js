// src/hooks/useEvents.js

import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useEvents(user) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);
  const [coparentPermissions, setCoparentPermissions] = useState({});

  async function getAcceptedCoparentAccess() {
    if (!user?.id) {
      return {
        allowedUserIds: [],
        permissions: {}
      };
    }

    const { data, error } = await supabase
      .from("coparents")
      .select("owner_id, coparent_id, permission, status")
      .eq("status", "accepted")
      .or(`owner_id.eq.${user.id},coparent_id.eq.${user.id}`);

    if (error) throw error;

    const allowedUserIds = [user.id];
    const permissions = {};

    (data || []).forEach((relation) => {
      const ownerId = relation.owner_id;
      const coparentId = relation.coparent_id;
      const permission = relation.permission || "read";

      if (!ownerId || !coparentId) return;

      // Parent A connecté
      if (ownerId === user.id) {
        allowedUserIds.push(coparentId);
        permissions[coparentId] = "write";
      }

      // Parent B connecté
      if (coparentId === user.id) {
        allowedUserIds.push(ownerId);
        permissions[ownerId] = permission;
      }
    });

    return {
      allowedUserIds: [...new Set(allowedUserIds)],
      permissions
    };
  }

  function canEditEvent(event) {
    if (!event) return false;

    if (event.user_id === user?.id) {
      return true;
    }

    return coparentPermissions[event.user_id] === "write";
  }

  async function reloadEvents() {
    if (!user?.id) {
      setEvents([]);
      setCoparentPermissions({});
      return [];
    }

    try {
      setLoadingEvents(true);
      setEventsError(null);

      const { allowedUserIds, permissions } =
        await getAcceptedCoparentAccess();

      setCoparentPermissions(permissions);

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
      setCoparentPermissions({});

      return [];
    } finally {
      setLoadingEvents(false);
    }
  }

  useEffect(() => {
    reloadEvents();
  }, [user?.id]);

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
  }, [user?.id]);

  async function addEvent(eventData) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté.");
    }

    const targetOwnerId =
      eventData.owner_id ||
      eventData.user_id ||
      user.id;

    // Vérifie permissions
    if (targetOwnerId !== user.id) {
      const permission = coparentPermissions[targetOwnerId];

      if (permission !== "write") {
        throw new Error("Permission refusée : lecture seule.");
      }
    }

    const payload = {
      title: eventData.title || eventData.titre || "",
      type: eventData.type || "rdv",
      parent: eventData.parent || "",
      event_date: eventData.event_date || eventData.date,
      status: eventData.status || "planned",
      heure: eventData.heure || eventData.time || "",
      shared: eventData.shared ?? true,
      user_id: targetOwnerId
    };

    if (!payload.title.trim()) {
      throw new Error("Titre manquant.");
    }

    if (!payload.event_date) {
      throw new Error("Date manquante.");
    }

    const { data, error } = await supabase
      .from("events")
      .insert([payload])
      .select();

    if (error) throw error;

    await reloadEvents();

    return data || [];
  }

  async function removeEvent(id) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté.");
    }

    if (!id) {
      throw new Error("ID événement manquant.");
    }

    const existing = events.find((event) => event.id === id);

    if (!existing) {
      throw new Error("Événement introuvable.");
    }

    if (!canEditEvent(existing)) {
      throw new Error("Permission refusée : lecture seule.");
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) throw error;

    await reloadEvents();

    return true;
  }

  async function editEvent(id, updates) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté.");
    }

    if (!id) {
      throw new Error("ID événement manquant.");
    }

    const existing = events.find((event) => event.id === id);

    if (!existing) {
      throw new Error("Événement introuvable.");
    }

    if (!canEditEvent(existing)) {
      throw new Error("Permission refusée : lecture seule.");
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
      if (
        payload[key] === undefined ||
        payload[key] === null
      ) {
        delete payload[key];
      }
    });

    const { data, error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", id)
      .select();

    if (error) throw error;

    await reloadEvents();

    return data || [];
  }

  return {
    events,
    loadingEvents,
    eventsError,
    coparentPermissions,
    reloadEvents,
    addEvent,
    removeEvent,
    editEvent,
    canEditEvent
  };
}
