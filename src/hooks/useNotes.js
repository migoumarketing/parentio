// src/hooks/useNotes.js

import { useEffect, useState } from "react";
import { getNotes, saveNote } from "../services/notes";

export function useNotes(user) {
  const [cloudNotes, setCloudNotes] = useState([]);

  useEffect(() => {
    if (!user) {
      setCloudNotes([]);
      return;
    }

    async function loadNotes() {
      try {
        const data = await getNotes(user.id);
        setCloudNotes(data || []);
      } catch (error) {
        console.error("LOAD NOTES ERROR:", error);
      }
    }

    loadNotes();
  }, [user]);

  async function saveCloudNote(noteData) {
    const payload = {
      ...noteData,
      user_id: user.id,
    };

    const saved = await saveNote(payload);
    setCloudNotes((prev) => [
      ...prev.filter((n) => n.note_date !== noteData.note_date),
      ...saved,
    ]);

    return saved;
  }

  return {
    cloudNotes,
    saveCloudNote,
  };
}
