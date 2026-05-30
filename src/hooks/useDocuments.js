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
      setDocuments(data);

      return data;
    } catch (error) {
      console.error("Erreur documents :", error);
      setDocumentsError(error.message || "Erreur documents");
      setDocuments([]);
      return [];
    } finally {
      setLoadingDocuments(false);
    }
  }

  async function addDocument(file, shared = false) {
    try {
      setDocumentsError(null);

      const created = await uploadDocument({
        userId: user?.id,
        file,
        shared
      });

      await reloadDocuments();

      return created;
    } catch (error) {
      console.error("Erreur upload document :", error);
      setDocumentsError(error.message || "Erreur upload document");
      return null;
    }
  }

  async function removeDocument(document) {
    try {
      setDocumentsError(null);

      await deleteDocument(document);
      await reloadDocuments();

      return true;
    } catch (error) {
      console.error("Erreur suppression document :", error);
      setDocumentsError(error.message || "Erreur suppression document");
      return false;
    }
  }

  async function setDocumentShared(documentId, shared) {
    try {
      setDocumentsError(null);

      await toggleDocumentSharing(documentId, shared);
      await reloadDocuments();

      return true;
    } catch (error) {
      console.error("Erreur partage document :", error);
      setDocumentsError(error.message || "Erreur partage document");
      return false;
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
      setDocumentsError(error.message || "Erreur ouverture document");
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
