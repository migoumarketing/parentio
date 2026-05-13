export default function UpcomingVacationsCard({
  S,
  L,
  T,
  vac,
  zone,
  today,
  vacAlt,
  pA,
  pB,
  colorA,
  colorB,
  anneeSco,
}) {
  return (
    <div style={S.card}>
      <div style={S.sec}>
        🌴 {L.vacances} Zone {zone} · {anneeSco}-{anneeSco + 1}
      </div>

      {vac[zone]?.filter(v => v.fin >= today).slice(0, 4).map((v, i) => {
        const now = today >= v.debut && today <= v.fin;
        const par = vacAlt ? (i % 2 === 0 ? pA : pB) : "—";

        return (
          <div key={v.nom} style={S.vacItem(now)}>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:T.text }}>
                {now ? "🟢 " : ""}{v.nom}
              </div>

              <div style={{ fontSize:11, color:T.sub }}>
                {v.debut.toLocaleDateString("fr-FR")} → {v.fin.toLocaleDateString("fr-FR")}
              </div>
            </div>

            {vacAlt && (
              <span style={S.badge(par === pA ? colorA : colorB)}>
                {par}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
