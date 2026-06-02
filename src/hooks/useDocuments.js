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
      console.error("Erreur chargement documents :", error);

      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur chargement documents";

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
      setDocumentsError("Fichier manquant.");
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

      await reloadDocuments();

      return created;
    } catch (error) {
      console.error("Erreur upload document :", error);

      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur upload document";

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
      console.error("Erreur suppression document :", error);

      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur suppression document";

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
      console.error("Erreur partage document :", error);

      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur partage document";

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
      console.error("Erreur ouverture document :", error);

      const message =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Erreur ouverture document";

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
