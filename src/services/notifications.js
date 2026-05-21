import { supabase } from "./supabase";

export async function getNotificationSettings(userId) {
  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function saveNotificationSettings(userId, settings) {
  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(
      [
        {
          user_id: userId,
          enabled: settings.enabled,
          reminder_hour: settings.reminder_hour,
          notify_events: settings.notify_events,
          notify_custody_changes: settings.notify_custody_changes,
          notify_vacations: settings.notify_vacations,
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
