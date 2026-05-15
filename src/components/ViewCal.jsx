export default function ViewCal({ S, L }) {
  return (
    <>
      <div style={S.disc}>{L.disc}</div>

      <div style={S.card}>
        <div style={S.sec}>📅 Calendrier</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          Vue calendrier en migration
        </div>
      </div>
    </>
  );
}
