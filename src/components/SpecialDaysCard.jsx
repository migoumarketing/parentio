export default function SpecialDaysCard({
  S,
  L,
  T,
  showFeries,
  prochSpec,
  fm,
  fp,
  sd,
  getParent,
  cfg,
  vac,
  pA,
  colorA,
  colorB,
}) {
  if (!showFeries) return null;

  return (
    <div style={S.card}>
      <div style={S.sec}>🎉 Prochains jours spéciaux</div>

      {prochSpec.map((f, i) => {
        const isMere = sd(f.date, fm);
        const isPere = sd(f.date, fp);

        const c = isMere
          ? "#db2777"
          : isPere
            ? "#2563eb"
            : "#d97706";

        const par = getParent(f.date, cfg, vac);

        return (
          <div
            key={i}
            style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              padding:"8px 0",
              borderBottom:`1px solid ${T.border}`,
            }}
          >
            <div>
              <div
                style={{
                  fontWeight:700,
                  fontSize:13,
                  color:T.text,
                }}
              >
                {f.nom}
              </div>

              <div
                style={{
                  fontSize:11,
                  color:T.sub,
                }}
              >
                {f.date.toLocaleDateString(
                  "fr-FR",
                  {
                    weekday:"long",
                    day:"numeric",
                    month:"long",
                  }
                )}
              </div>
            </div>

            <span
              style={S.badge(
                par === pA
                  ? colorA
                  : colorB
              )}
            >
              {par}
            </span>
          </div>
        );
      })}
    </div>
  );
}
