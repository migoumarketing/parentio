import { supabase } from "./supabase";

const BUCKET = "parentio-documents";

export async function listDocuments(userId) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function uploadDocument({ userId, file, shared = false }) {
  if (!userId) throw new Error("Utilisateur non connecté.");
  if (!file) throw new Error("Fichier manquant.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Erreur upload Storage.");
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      owner_id: userId,
      filename: file.name,
      file_url: path,
      file_type: file.type || "application/octet-stream",
      shared
    })
    .select("*")
    .single();

  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(error.message || "Erreur insertion document.");
  }

  return data;
}

export async function deleteDocument(document) {
  if (!document?.id) throw new Error("Document introuvable.");

  if (document.file_url) {
    await supabase.storage.from(BUCKET).remove([document.file_url]);
  }

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", document.id);

  if (error) throw error;

  return true;
}

export async function toggleDocumentSharing(documentId, shared) {
  const { data, error } = await supabase
    .from("documents")
    .update({
      shared,
      updated_at: new Date().toISOString()
    })
    .eq("id", documentId)
    .select("*")
    .single();

  if (error) throw error;

  return data;
}

export async function getDocumentSignedUrl(path) {
  if (!path) throw new Error("Chemin fichier manquant.");

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 60 * 10);

  if (error) throw error;

  return data?.signedUrl || null;
}
