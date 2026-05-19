import { supabase } from "./supabase";

export async function getSettings(userId) {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function saveSettings(userId, config) {
  const { data, error } = await supabase
    .from("settings")
    .upsert(
      [
        {
          user_id: userId,
          config,
          updated_at: new Date().toISOString()
        }
      ],
      { onConflict: "user_id" }
    )
    .select();

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}
