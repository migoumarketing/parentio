import { useEffect, useState } from "react";
import {
  getSharedEvents,
  getSharedNotes,
  shareEventWithCoparent,
  shareNoteWithCoparent
} from "../services/sharedData";

export function useSharedData(user) {
  const [sharedEvents, setSharedEvents] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [loadingSharedData, setLoadingSharedData] = useState(false);
  const [sharedDataError, setSharedDataError] = useState(null);

  const userId = user?.id || "";
  const userEmail = user?.email || "";

  async function loadSharedData() {
    if (!userId || !userEmail) {
      setSharedEvents([]);
      setSharedNotes([]);
      return;
    }

    try {
      setLoadingSharedData(true);
      setSharedDataError(null);

      const [events, notes] = await Promise.all([
        getSharedEvents(userId, userEmail),
        getSharedNotes(userId, userEmail)
      ]);

      setSharedEvents(events);
      setSharedNotes(notes);
    } catch (error) {
      console.error("Erreur données partagées :", error);
      setSharedDataError(error.message || "Erreur données partagées");
    } finally {
      setLoadingSharedData(false);
    }
  }

  async function shareEvent(eventId, coparentEmail) {
    try {
      await shareEventWithCoparent(eventId, coparentEmail);
      await loadSharedData();
      return true;
    } catch (error) {
      console.error("Erreur partage événement :", error);
      setSharedDataError(error.message || "Erreur partage événement");
      return false;
    }
  }

  async function shareNote(noteId, coparentEmail) {
    try {
      await shareNoteWithCoparent(noteId, coparentEmail);
      await loadSharedData();
      return true;
    } catch (error) {
      console.error("Erreur partage note :", error);
      setSharedDataError(error.message || "Erreur partage note");
      return false;
    }
  }

  useEffect(() => {
    loadSharedData();
  }, [userId, userEmail]);

  return {
    sharedEvents,
    sharedNotes,
    loadingSharedData,
    sharedDataError,
    loadSharedData,
    shareEvent,
    shareNote
  };
}
