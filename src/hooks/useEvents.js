// src/hooks/useEvents.js

import { useEffect, useState } from "react";
import {
  getEvents,
  createEvent,
  deleteEvent,
  updateEvent,
} from "../services/events";

export function useEvents(user) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  async function reloadEvents() {
    if (!user?.id) {
      setEvents([]);
      return [];
    }

    try {
      setLoadingEvents(true);
      setEventsError(null);

      const data = await getEvents(user.id);
      const safeData = Array.isArray(data) ? data : [];

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
  }, [user?.id]);

  async function addEvent(eventData) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté : impossible de sauvegarder l'événement dans Supabase.");
    }

    try {
      setEventsError(null);

      const payload = {
        title: eventData.title || eventData.titre || "",
        type: eventData.type || "rdv",
        parent: eventData.parent || "",
        event_date: eventData.event_date || eventData.date,
        status: eventData.status || "planned",
        user_id: user.id,
      };

      if (!payload.title.trim()) {
        throw new Error("Titre d'événement manquant.");
      }

      if (!payload.event_date) {
        throw new Error("Date d'événement manquante.");
      }

      const created = await createEvent(payload);
      const safeCreated = Array.isArray(created) ? created : [created].filter(Boolean);

      setEvents((prev) => [...prev, ...safeCreated]);

      return safeCreated;
    } catch (error) {
      console.error("ADD EVENT ERROR:", error);
      setEventsError(error);
      throw error;
    }
  }

  async function removeEvent(id) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté : impossible de supprimer l'événement dans Supabase.");
    }

    if (!id) {
      throw new Error("ID événement manquant.");
    }

    try {
      setEventsError(null);

      await deleteEvent(id);

      setEvents((prev) => prev.filter((event) => event.id !== id));

      return true;
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);
      setEventsError(error);
      throw error;
    }
  }

  async function editEvent(id, updates) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté : impossible de modifier l'événement dans Supabase.");
    }

    if (!id) {
      throw new Error("ID événement manquant.");
    }

    try {
      setEventsError(null);

      const payload = {
        title: updates.title || updates.titre || "",
        type: updates.type || "rdv",
        parent: updates.parent || "",
        event_date: updates.event_date || updates.date,
        status: updates.status || "planned",
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined || payload[key] === null) {
          delete payload[key];
        }
      });

      const updated = await updateEvent(id, payload);
      const updatedRow = Array.isArray(updated) ? updated[0] : updated;

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updatedRow } : event
        )
      );

      return Array.isArray(updated) ? updated : [updatedRow].filter(Boolean);
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);
      setEventsError(error);
      throw error;
    }
  }

  return {
    events,
    loadingEvents,
    eventsError,
    reloadEvents,
    addEvent,
    removeEvent,
    editEvent,
  };
}
