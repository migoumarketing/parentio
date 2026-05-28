import { supabase } from "./supabase";

export async function listCoparentInvitations(userEmail) {
  if (!userEmail) return [];

  const email = userEmail.toLowerCase();

  const { data, error } = await supabase
    .from("coparents")
    .select("*")
    .or(`owner_email.eq.${email},coparent_email.eq.${email}`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function inviteCoparent({
  ownerId,
  ownerEmail,
  coparentEmail,
  permission = "read"
}) {
  if (!ownerId) throw new Error("Utilisateur non connecté.");
  if (!ownerEmail) throw new Error("Email utilisateur manquant.");
  if (!coparentEmail) throw new Error("Email co-parent manquant.");

  const { data, error } = await supabase
    .from("coparents")
    .insert([
      {
        owner_id: ownerId,
        owner_email: ownerEmail.toLowerCase(),
        coparent_email: coparentEmail.trim().toLowerCase(),
        permission,
        status: "pending"
      }
    ])
    .select();

  if (error) throw error;
  return data?.[0] || null;
}

export async function updateCoparentInvitation(id, status, user = null) {
  const payload = {
    status,
    updated_at: new Date().toISOString()
  };

  if (status === "accepted" && user?.id) {
    payload.coparent_id = user.id;
  }

  const { data, error } = await supabase
    .from("coparents")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) throw error;
  return data?.[0] || null;
}

export async function deleteCoparentInvitation(id) {
  const { error } = await supabase
    .from("coparents")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
