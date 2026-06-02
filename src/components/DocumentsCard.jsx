import { useState } from "react";

const TXT = {
  fr: {
    title: "Documents familiaux",
    sub: "Ajoutez des documents privés. Vous choisissez ensuite s’ils sont partagés.",
    upload: "Ajouter le document",
    uploading: "Upload en cours...",
    private: "Privé",
    shared: "Partagé",
    share: "Partager",
    unshare: "Rendre privé",
    open: "Ouvrir",
    delete: "Supprimer",
    empty: "Aucun document.",
    premium: "Fonction Premium.",
    login: "Connectez-vous pour gérer vos documents.",
    selected: "Fichier sélectionné",
    noFile: "Choisissez d’abord un fichier.",
    success: "Document ajouté avec succès.",
    failed: "Erreur : le document n’a pas été ajouté."
  },
  es: {
    title: "Documentos familiares",
    sub: "Añada documentos privados. Luego decide si se comparten.",
    upload: "Añadir documento",
    uploading: "Subida en curso...",
    private: "Privado",
    shared: "Compartido",
    share: "Compartir",
    unshare: "Hacer privado",
    open: "Abrir",
    delete: "Eliminar",
    empty: "Ningún documento.",
    premium: "Función Premium.",
    login: "Inicie sesión para gestionar sus documentos.",
    selected: "Archivo seleccionado",
    noFile: "Primero elija un archivo.",
    success: "Documento añadido correctamente.",
    failed: "Error: el documento no se añadió."
  },
  en: {
    title: "Family documents",
    sub: "Add private documents. You decide later whether to share them.",
    upload: "Upload document",
    uploading: "Uploading...",
    private: "Private",
    shared: "Shared",
    share: "Share",
    unshare: "Make private",
    open: "Open",
    delete: "Delete",
    empty: "No document.",
    premium: "Premium feature.",
    login: "Sign in to manage your documents.",
    selected: "Selected file",
    noFile: "Choose a file first.",
    success: "Document uploaded successfully.",
    failed: "Error: document was not uploaded."
  }
};

export default function DocumentsCard({
  S = {},
  T = {},
  lang = "fr",
  user = null,
  premium = false,
  documents = [],
  loadingDocuments = false,
  documentsError = null,
  addDocument = async () => null,
  removeDocument = async () => false,
  setDocumentShared = async () => false,
  openDocument = async () => null
}) {
  const currentLang = ["fr", "es", "en"].includes(lang) ? lang : "fr";
  const t = TXT[currentLang];

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    setMessage("");
    setLocalError("");

    if (!file) {
      setLocalError(t.noFile);
      return;
    }

    try {
      setUploading(true);
      setMessage(t.uploading);

      const created = await addDocument(file, false);

      setFile(null);
      setMessage(t.success);

      const input = document.getElementById("parentio-document-input");
      if (input) input.value = "";

      console.log("Document ajouté :", created);
    } catch (error) {
      setMessage("");

      const realError =
        error?.message ||
        error?.details ||
        error?.hint ||
        JSON.stringify(error) ||
        documentsError ||
        t.failed;

      setLocalError(realError);
      console.error("Erreur réelle document :", error);
    } finally {
      setUploading(false);
    }
  }

  if (!user?.id) {
    return (
      <div style={S.card}>
        <div style={S.sec}>📁 {t.title}</div>
        <p style={{ color: T.sub, fontSize: 13 }}>{t.login}</p>
      </div>
    );
  }

  if (!premium) {
    return (
      <div style={S.card}>
        <div style={S.sec}>📁 {t.title}</div>
        <p style={{ color: T.sub, fontSize: 13 }}>{t.premium}</p>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <div style={S.sec}>📁 {t.title}</div>

      <p style={{ color: T.sub, fontSize: 12, lineHeight: 1.5 }}>
        {t.sub}
      </p>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <input
          id="parentio-document-input"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={(event) => {
            setFile(event.target.files?.[0] || null);
            setMessage("");
            setLocalError("");
          }}
          style={S.inp}
        />

        {file && (
          <div style={{ color: T.sub, fontSize: 12 }}>
            {t.selected} : {file.name}
          </div>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading || loadingDocuments}
          style={{
            border: "none",
            borderRadius: 12,
            padding: "12px 14px",
            background: uploading || loadingDocuments ? "#9ca3af" : "#6366f1",
            color: "#fff",
            fontWeight: 900,
            cursor: uploading || loadingDocuments ? "not-allowed" : "pointer"
          }}
        >
          {uploading || loadingDocuments ? t.uploading : t.upload}
        </button>
      </div>

      {message && (
        <div style={{ color: "#10b981", fontSize: 12, fontWeight: 800, marginTop: 10 }}>
          {message}
        </div>
      )}

      {(localError || documentsError) && (
        <div style={{ color: "#ef4444", fontSize: 12, fontWeight: 800, marginTop: 10 }}>
          {localError || documentsError}
        </div>
      )}

      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        {!loadingDocuments && documents.length === 0 && (
          <div style={{ color: T.sub, fontSize: 12 }}>{t.empty}</div>
        )}

        {(documents || []).map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: 12,
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${T.border || "rgba(255,255,255,0.15)"}`
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 13 }}>
              📄 {doc.filename}
            </div>

            <div style={{ marginTop: 5, fontSize: 12, color: T.sub }}>
              {doc.shared ? t.shared : t.private}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
              <button type="button" onClick={() => openDocument(doc)}>
                {t.open}
              </button>

              <button type="button" onClick={() => setDocumentShared(doc.id, !doc.shared)}>
                {doc.shared ? t.unshare : t.share}
              </button>

              <button
                type="button"
                onClick={() => removeDocument(doc)}
                style={{ color: "#ef4444" }}
              >
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
