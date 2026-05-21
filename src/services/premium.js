import { supabase } from "./supabase";

export async function getUserPlan(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    throw error;
  }

  return data;
}

export async function activatePremiumPlan(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_premium: true,
      updated_at: new Date().toISOString()
    })
    .eq("id", userId)
    .select();

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}
