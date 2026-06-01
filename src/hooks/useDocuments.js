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
      const safeData = Array.isArray(data) ? data : [];

      setDocuments(safeData);
      return safeData;
    } catch (error) {
      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        "Erreur documents";

      console.error("Erreur chargement documents :", error);
      setDocumentsError(message);
      setDocuments([]);

      return [];
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function addDocument(file, shared = false) {
    if (!user?.id) {
      setDocumentsError("Utilisateur non connecté.");
      return null;
    }

    if (!file) {
      setDocumentsError("Aucun fichier sélectionné.");
      return null;
    }

    try {
      setLoadingDocuments(true);
      setDocumentsError(null);

      const created = await uploadDocument({
        userId: user.id,
        file,
        shared
      });

      if (!created) {
        throw new Error("Le document n'a pas été créé dans Supabase.");
      }

      await reloadDocuments();

      return created;
    } catch (error) {
      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        "Erreur upload document";

      console.error("Erreur upload document :", error);
      setDocumentsError(message);

      return null;
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
      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        "Erreur suppression document";

      console.error("Erreur suppression document :", error);
      setDocumentsError(message);

      return false;
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
      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        "Erreur partage document";

      console.error("Erreur partage document :", error);
      setDocumentsError(message);

      return false;
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
      const message =
        error?.message ||
        error?.error_description ||
        error?.details ||
        "Erreur ouverture document";

      console.error("Erreur ouverture document :", error);
      setDocumentsError(message);

      return null;
    }
  }

  useEffect(() => {
    reloadDocuments();
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
