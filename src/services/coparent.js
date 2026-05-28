import { supabase } from "./supabase";

export async function listCoparentInvitations(userEmail) {
  if (!userEmail) return [];

  const email = userEmail.toLowerCase();

  const { data, error } = await supabase
    .from("coparents")
    .select("*")
    .or(`owner_email.eq.${email},coparent_email.eq.${email}`)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function inviteCoparent({
  ownerId,
  ownerEmail,
  coparentEmail,
  permission = "read"
}) {
  if (!ownerId) {
    throw new Error("Utilisateur non connecté.");
  }

  if (!ownerEmail) {
    throw new Error("Email utilisateur manquant.");
  }

  if (!coparentEmail) {
    throw new Error("Email co-parent manquant.");
  }

  const normalizedOwnerEmail = ownerEmail.trim().toLowerCase();
  const normalizedCoparentEmail = coparentEmail.trim().toLowerCase();

  const { data, error } = await supabase
    .from("coparents")
    .insert([
      {
        owner_id: ownerId,
        owner_email: normalizedOwnerEmail,
        coparent_email: normalizedCoparentEmail,
        permission,
        status: "pending"
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

export async function updateCoparentInvitation(id, status, user = null) {
  if (!id) {
    throw new Error("ID invitation manquant.");
  }

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

  if (error) {
    throw error;
  }

  return data?.[0] || null;
}

export async function deleteCoparentInvitation(id) {
  if (!id) {
    throw new Error("ID invitation manquant.");
  }

  const { error } = await supabase
    .from("coparents")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }

  return true;
}
