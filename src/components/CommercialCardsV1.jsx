import { tr } from "../i18n/translationsV1";

export function LegalNoticeCard({ lang = "fr" }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)", color: "#f59e0b", fontSize: 12, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>⚠️ {tr(lang, "legal.title")}</div>
      <div>{tr(lang, "legal.text")}</div>
    </div>
  );
}

export function AnalyticsConsentCard({ lang = "fr", enabled = false, onChange = () => {} }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
      <div style={{ fontWeight: 900, marginBottom: 6 }}>📊 {tr(lang, "settings.analytics")}</div>
      <label style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <span>{tr(lang, "settings.analyticsConsent")}</span>
        <input type="checkbox" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      </label>
    </div>
  );
}
