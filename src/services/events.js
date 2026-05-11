// src/services/events.js

import { supabase } from "./supabase";

// Récupérer les événements utilisateur
export async function getEvents(userId) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("user_id", userId)
    .order("event_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}

// Ajouter un événement
export async function createEvent(event) {
  const { data, error } = await supabase
    .from("events")
    .insert([event])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

// Supprimer un événement
export async function deleteEvent(id) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
// Modifier un événement
export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    throw error;
  }

  return data;
}
