import { useState } from "react";

const TXT = {
  fr: {
    title: "Documents familiaux",
    sub: "Ajoutez des documents privés. Vous choisissez ensuite s’ils sont partagés.",
    upload: "Ajouter le document",
    private: "Privé",
    shared: "Partagé",
    share: "Partager",
    unshare: "Rendre privé",
    open: "Ouvrir",
    delete: "Supprimer",
    empty: "Aucun document.",
    premium: "Fonction Premium.",
    login: "Connectez-vous pour gérer vos documents.",
    uploading: "Chargement..."
  },

  es: {
    title: "Documentos familiares",
    sub: "Añada documentos privados. Luego decide si se comparten.",
    upload: "Añadir documento",
    private: "Privado",
    shared: "Compartido",
    share: "Compartir",
    unshare: "Hacer privado",
    open: "Abrir",
    delete: "Eliminar",
    empty: "Ningún documento.",
    premium: "Función Premium.",
    login: "Inicie sesión para gestionar sus documentos.",
    uploading: "Cargando..."
  },

  en: {
    title: "Family documents",
    sub: "Add private documents. You decide later whether to share them.",
    upload: "Upload document",
    private: "Private",
    shared: "Shared",
    share: "Share",
    unshare: "Make private",
    open: "Open",
    delete: "Delete",
    empty: "No document.",
    premium: "Premium feature.",
    login: "Sign in to manage your documents.",
    uploading: "Uploading..."
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
  const t = TXT[lang] || TXT.fr;

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return;

    try {
      setUploading(true);

      const created = await addDocument(file, false);

      console.log("Document créé :", created);

      setFile(null);

      const input = document.getElementById("parentio-document-input");

      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  if (!user?.id) {
    return (
      <div style={S.card}>
        <div style={S.sec}>📁 {t.title}</div>
        <p style={{ color: T.sub }}>{t.login}</p>
      </div>
    );
  }

  if (!premium) {
    return (
      <div style={S.card}>
        <div style={S.sec}>📁 {t.title}</div>
        <p style={{ color: T.sub }}>{t.premium}</p>
      </div>
    );
  }

  return (
    <div style={S.card}>
      <div style={S.sec}>📁 {t.title}</div>

      <p
        style={{
          color: T.sub,
          fontSize: 12,
          lineHeight: 1.5
        }}
      >
        {t.sub}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 12
        }}
      >
        <input
          id="parentio-document-input"
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          style={S.inp}
        />

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{
            border: "none",
            borderRadius: 12,
            padding: "12px 14px",
            background:
              !file || uploading
                ? "#9ca3af"
                : "#6366f1",
            color: "#fff",
            fontWeight: 900,
            cursor:
              !file || uploading
                ? "not-allowed"
                : "pointer"
          }}
        >
          {uploading
            ? t.uploading
            : t.upload}
        </button>
      </div>

      {documentsError && (
        <div
          style={{
            marginTop: 10,
            color: "#ef4444",
            fontSize: 12,
            fontWeight: 800
          }}
        >
          {documentsError}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: 18
        }}
      >
        {loadingDocuments && (
          <div
            style={{
              color: T.sub,
              fontSize: 12
            }}
          >
            ...
          </div>
        )}

        {!loadingDocuments &&
          documents.length === 0 && (
            <div
              style={{
                color: T.sub,
                fontSize: 12
              }}
            >
              {t.empty}
            </div>
          )}

        {documents.map((doc) => (
          <div
            key={doc.id}
            style={{
              padding: 12,
              borderRadius: 12,
              background:
                "rgba(255,255,255,0.05)",
              border: `1px solid ${
                T.border ||
                "rgba(255,255,255,0.15)"
              }`
            }}
          >
            <div
              style={{
                fontWeight: 900,
                fontSize: 13
              }}
            >
              📄 {doc.filename}
            </div>

            <div
              style={{
                marginTop: 5,
                fontSize: 12,
                color: T.sub
              }}
            >
              {doc.shared
                ? t.shared
                : t.private}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 10
              }}
            >
              <button
                type="button"
                onClick={() =>
                  openDocument(doc)
                }
              >
                {t.open}
              </button>

              <button
                type="button"
                onClick={() =>
                  setDocumentShared(
                    doc.id,
                    !doc.shared
                  )
                }
              >
                {doc.shared
                  ? t.unshare
                  : t.share}
              </button>

              <button
                type="button"
                onClick={() =>
                  removeDocument(doc)
                }
                style={{
                  color: "#ef4444"
                }}
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
