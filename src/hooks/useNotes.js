// src/hooks/useNotes.js

import { useEffect, useState } from "react";
import { getNotes, saveNote, deleteNoteByDate } from "../services/notes";

export function useNotes(user) {
  const [cloudNotes, setCloudNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [notesError, setNotesError] = useState(null);

  async function reloadNotes() {
    if (!user?.id) {
      setCloudNotes([]);
      return [];
    }

    try {
      setLoadingNotes(true);
      setNotesError(null);

      const data = await getNotes(user.id);
      const safeData = Array.isArray(data) ? data : [];

      setCloudNotes(safeData);
      return safeData;
    } catch (error) {
      console.error("LOAD NOTES ERROR:", error);
      setNotesError(error);
      setCloudNotes([]);
      return [];
    } finally {
      setLoadingNotes(false);
    }
  }

  useEffect(() => {
    reloadNotes();
  }, [user?.id]);

  async function saveCloudNote(noteData) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté : impossible de sauvegarder la note dans Supabase.");
    }

    if (!noteData?.note_date) {
      throw new Error("Date de note manquante.");
    }

    try {
      setNotesError(null);

      const payload = {
        note_date: noteData.note_date,
        content: noteData.content || "",
        user_id: user.id,
      };

      const saved = await saveNote(payload);
      const safeSaved = Array.isArray(saved) ? saved : [saved].filter(Boolean);

      setCloudNotes((prev) => [
        ...prev.filter((note) => note.note_date !== noteData.note_date),
        ...safeSaved,
      ]);

      return safeSaved;
    } catch (error) {
      console.error("SAVE NOTE ERROR:", error);
      setNotesError(error);
      throw error;
    }
  }

  async function removeCloudNoteByDate(noteDate) {
    if (!user?.id) {
      throw new Error("Utilisateur non connecté : impossible de supprimer la note dans Supabase.");
    }

    if (!noteDate) {
      throw new Error("Date de note manquante.");
    }

    try {
      setNotesError(null);

      await deleteNoteByDate(user.id, noteDate);

      setCloudNotes((prev) =>
        prev.filter((note) => note.note_date !== noteDate)
      );

      return true;
    } catch (error) {
      console.error("DELETE NOTE ERROR:", error);
      setNotesError(error);
      throw error;
    }
  }

  return {
    cloudNotes,
    loadingNotes,
    notesError,
    reloadNotes,
    saveCloudNote,
    removeCloudNoteByDate,
  };
}
