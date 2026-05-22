import { supabase } from "./supabase";

export async function getSharedEvents(userId, userEmail) {
  if (!userId || !userEmail) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .or(`owner_id.eq.${userId},shared_with.cs.{${userEmail.toLowerCase()}}`)
    .order("event_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getSharedNotes(userId, userEmail) {
  if (!userId || !userEmail) return [];

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .or(`owner_id.eq.${userId},shared_with.cs.{${userEmail.toLowerCase()}}`)
    .order("note_date", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function shareEventWithCoparent(eventId, coparentEmail) {
  if (!eventId || !coparentEmail) return null;

  const { data: current, error: readError } = await supabase
    .from("events")
    .select("shared_with")
    .eq("id", eventId)
    .single();

  if (readError) throw readError;

  const currentList = Array.isArray(current?.shared_with) ? current.shared_with : [];
  const nextList = Array.from(new Set([...currentList, coparentEmail.trim().toLowerCase()]));

  const { data, error } = await supabase
    .from("events")
    .update({
      shared: true,
      shared_with: nextList,
      updated_at: new Date().toISOString()
    })
    .eq("id", eventId)
    .select();

  if (error) throw error;
  return data?.[0] || null;
}

export async function shareNoteWithCoparent(noteId, coparentEmail) {
  if (!noteId || !coparentEmail) return null;

  const { data: current, error: readError } = await supabase
    .from("notes")
    .select("shared_with")
    .eq("id", noteId)
    .single();

  if (readError) throw readError;

  const currentList = Array.isArray(current?.shared_with) ? current.shared_with : [];
  const nextList = Array.from(new Set([...currentList, coparentEmail.trim().toLowerCase()]));

  const { data, error } = await supabase
    .from("notes")
    .update({
      shared: true,
      shared_with: nextList,
      updated_at: new Date().toISOString()
    })
    .eq("id", noteId)
    .select();

  if (error) throw error;
  return data?.[0] || null;
}
