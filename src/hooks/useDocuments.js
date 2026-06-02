import { useEffect, useState } from "react";
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  toggleDocumentSharing,
  getDocumentSignedUrl
} from "../services/documents";

export function useDocuments(user) {
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  const [documentsError, setDocumentsError] = useState(null);

  async function reloadDocuments() {
    if (!user?.id) {
      setDocuments([]);
      return [];
    }

    try {
      setLoadingDocuments(true);
      setDocumentsError(null);

      const data = await listDocuments(user.id);
      setDocuments(Array.isArray(data) ? data : []);
      return data || [];
    } catch (error) {
      const message = error?.message || "Erreur chargement documents.";
      setDocumentsError(message);
      throw new Error(message);
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function addDocument(file, shared = false) {
    if (!user?.id) {
      const message = "Utilisateur non connecté.";
      setDocumentsError(message);
      throw new Error(message);
    }

    if (!file) {
      const message = "Fichier manquant.";
      setDocumentsError(message);
      throw new Error(message);
    }

    try {
      setLoadingDocuments(true);
      setDocumentsError(null);

      const created = await uploadDocument({
        userId: user.id,
        file,
        shared
      });

      await reloadDocuments();
      return created;
    } catch (error) {
      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur upload document.";

      setDocumentsError(message);
      throw new Error(message);
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function removeDocument(document) {
    try {
      setLoadingDocuments(true);
      setDocumentsError(null);

      await deleteDocument(document);
      await reloadDocuments();

      return true;
    } catch (error) {
      const message = error?.message || "Erreur suppression document.";
      setDocumentsError(message);
      throw new Error(message);
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function setDocumentShared(documentId, shared) {
    try {
      setLoadingDocuments(true);
      setDocumentsError(null);

      await toggleDocumentSharing(documentId, shared);
      await reloadDocuments();

      return true;
    } catch (error) {
      const message = error?.message || "Erreur partage document.";
      setDocumentsError(message);
      throw new Error(message);
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function openDocument(document) {
    try {
      setDocumentsError(null);

      const url = await getDocumentSignedUrl(document.file_url);

      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      }

      return url;
    } catch (error) {
      const message = error?.message || "Erreur ouverture document.";
      setDocumentsError(message);
      throw new Error(message);
    }
  }

  useEffect(() => {
    reloadDocuments().catch(() => {});
  }, [user?.id]);

  return {
    documents,
    loadingDocuments,
    documentsError,
    reloadDocuments,
    addDocument,
    removeDocument,
    setDocumentShared,
    openDocument
  };
}
