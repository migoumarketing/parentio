export default function ViewEvents({
  S,
  TABS,
  L,
  upEvts,
  EVT_IDS,
  EVT_COLORS,
  getParent,
  cfg,
  vac,
  pA,
  colorA,
  colorB,
  T,
  delEvent,
}) {
  return (
    <div style={S.card}>
      <div style={S.sec}>🗓️ {TABS[1]}</div>
      <div style={S.disc}>{L.disc}</div>

      {upEvts.length === 0 && (
        <div style={{ textAlign:"center", padding:"40px 0", color:T.sub }}>
          <div style={{ fontSize:38, marginBottom:8 }}>📭</div>
          <div style={{ fontSize:14, fontWeight:700 }}>Aucun événement</div>
        </div>
      )}

      {upEvts.slice(0, 30).map((e, i) => {
        const idx = EVT_IDS.indexOf(e.type);
        const c = EVT_COLORS[idx] || "#8b5cf6";
        const par = getParent(e.date, cfg, vac);

        return (
          <div key={i} style={{ ...S.evtLine(c), paddingBottom:9 }}>
            <div style={{ width:3, height:36, borderRadius:2, background:c, flexShrink:0 }} />

            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:5, flexWrap:"wrap" }}>
                <span style={{ fontWeight:800, fontSize:13, color:T.text }}>
                  {e.titre}
                </span>

                <span style={S.badge(e.shared ? colorA : "#6b7280")}>
                  {e.shared ? L.shared : L.prive}
                </span>
              </div>

              <div style={{ fontSize:11, color:T.sub, marginTop:2 }}>
                {e.date.toLocaleDateString("fr-FR", {
                  weekday:"short",
                  day:"numeric",
                  month:"long",
                })}
                {e.heure && " · " + e.heure}
                {" · "}
                <span
                  style={{
                    color: par === pA ? colorA : colorB,
                    fontWeight:700,
                  }}
                >
                  {par}
                </span>
              </div>
            </div>

            <button
              onClick={(event) => {
                event.stopPropagation();
                delEvent(e.key, e.id);
              }}
              style={{
                background:"none",
                border:"none",
                color:T.sub,
                cursor:"pointer",
                fontSize:15,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
