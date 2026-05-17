// src/services/notes.js

import { supabase } from "./supabase";

export async function getNotes(userId) {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("note_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function saveNote(note) {
  const { data, error } = await supabase
    .from("notes")
    .upsert([note], { onConflict: "user_id,note_date" })
    .select();

  if (error) throw error;
  return data || [];
}

export async function deleteNote(id) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteNoteByDate(userId, noteDate) {
  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("user_id", userId)
    .eq("note_date", noteDate);

  if (error) throw error;
  return true;
}
