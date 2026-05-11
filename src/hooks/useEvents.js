// src/hooks/useEvents.js

import { useEffect, useState } from "react";
import { getEvents, createEvent, deleteEvent, updateEvent } from "../services/events";

export function useEvents(user) {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      return;
    }

    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const data = await getEvents(user.id);
        setEvents(data || []);
      } catch (error) {
        console.error("LOAD EVENTS ERROR:", error);
      } finally {
        setLoadingEvents(false);
      }
    }

    loadEvents();
  }, [user]);

  async function addEvent(eventData) {
    try {
      const payload = {
        ...eventData,
        user_id: user.id,
      };

      const created = await createEvent(payload);
      setEvents((prev) => [...prev, ...created]);

      return created;
    } catch (error) {
      console.error("ADD EVENT ERROR:", error);
      throw error;
    }
  }

  async function removeEvent(id) {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (error) {
      console.error("DELETE EVENT ERROR:", error);
      throw error;
    }
  }

  async function editEvent(id, updates) {
    try {
      const updated = await updateEvent(id, updates);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === id ? { ...event, ...updated[0] } : event
        )
      );

      return updated;
    } catch (error) {
      console.error("UPDATE EVENT ERROR:", error);
      throw error;
    }
  }

  return {
    events,
    loadingEvents,
    addEvent,
    removeEvent,
    editEvent,
  };
}
