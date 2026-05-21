export default function RealtimeStatusCard({
  realtimeConnected=false,
  lastRealtimeEvent=null,
  lang="fr"
}) {
  return (
    <div style={{
      padding:16,
      borderRadius:18,
      background:"rgba(255,255,255,0.06)",
      marginBottom:12
    }}>
      <div style={{
        fontSize:11,
        fontWeight:900,
        marginBottom:10
      }}>
        🔄 Synchronisation temps réel
      </div>

      <div style={{
        color: realtimeConnected ? "#10b981" : "#f59e0b",
        fontWeight:900,
        marginBottom:10
      }}>
        {realtimeConnected ? "Connecté" : "Non connecté"}
      </div>

      <div style={{
        fontSize:12,
        opacity:0.75
      }}>
        Dernière activité :
        {" "}
        {lastRealtimeEvent?.at || "Aucune"}
      </div>
    </div>
  );
}
