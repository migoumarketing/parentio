import Btn from "./Btn";

export default function ChecklistCard({
  S,
  L,
  T,
  checklist,
  setChecklist,
  colorA,
  rgbA,
}) {
  return (
    <div style={S.card}>
      <div style={S.sec}>🎒 Checklist départ</div>

      {L.checkItems.map((item, i) => {
        const on = checklist[i];

        return (
          <div
            key={i}
            style={{
              display:"flex",
              alignItems:"center",
              gap:10,
              padding:"8px 0",
              borderBottom:`1px solid ${T.border}`,
            }}
          >
            <div
              onClick={() => setChecklist(p => ({ ...p, [i]:!p[i] }))}
              style={{
                width:22,
                height:22,
                borderRadius:7,
                border:`2px solid ${on ? colorA : T.border}`,
                background:on ? `rgba(${rgbA},0.22)` : "transparent",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                cursor:"pointer",
                flexShrink:0,
                transition:"all 0.14s",
              }}
            >
              {on && (
                <span style={{ color:colorA, fontSize:12, fontWeight:900 }}>
                  ✓
                </span>
              )}
            </div>

            <span
              style={{
                fontSize:13,
                fontWeight:600,
                color:on ? T.sub : T.text,
                textDecoration:on ? "line-through" : "none",
              }}
            >
              {item}
            </span>
          </div>
        );
      })}

      <div style={{ marginTop:9 }}>
        <Btn color="#6b7280" size="sm" onClick={() => setChecklist({})}>
          {L.reinit}
        </Btn>
      </div>
    </div>
  );
}
