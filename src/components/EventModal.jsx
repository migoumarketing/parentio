import Btn from "./Btn";

export default function EventModal({
  S,
  T,
  selDay,
  month,
  MOIS,
  newEvt,
  setNewEvt,
  addEvent,
  editingEvent,
  setEditingEvent,
  setModal,
  colorA,
  EVT_IDS,
  EVT_COLORS,
  L,
}) {
  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && setModal(null)}>
      <div style={S.mCard}>
        <div style={{fontWeight:900,fontSize:16,marginBottom:11,color:T.text}}>
          {editingEvent ? "✏️ Modifier événement" : `+ ${L.add}`} · {selDay} {MOIS[month]}
        </div>

        <div style={S.disc}>{L.disc}</div>

        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>Type</div>
          <div style={{...S.row,gap:5,marginTop:4}}>
            {EVT_IDS.map((id,i)=>(
              <button
                key={id}
                type="button"
                onClick={()=>setNewEvt(e=>({...e,type:id}))}
                style={{
                  padding:"7px 14px",
                  borderRadius:22,
                  fontSize:13,
                  fontWeight:700,
                  cursor:"pointer",
                  background:newEvt.type===id ? `${EVT_COLORS[i]}33` : "rgba(128,128,128,0.1)",
                  border:`1.5px solid ${newEvt.type===id ? EVT_COLORS[i] : "rgba(128,128,128,0.2)"}`,
                  color:newEvt.type===id ? EVT_COLORS[i] : "rgba(128,128,128,0.7)",
                }}
              >
                {L.evtTypes[i]}
              </button>
            ))}
          </div>
        </div>

        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>Titre *</div>
          <input
            style={S.inp}
            value={newEvt.titre}
            onChange={e=>setNewEvt(v=>({...v,titre:e.target.value}))}
            placeholder="Ex: Pédiatre, match de foot…"
            autoFocus
          />
        </div>

        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>Heure</div>
          <input
            type="time"
            style={S.inp}
            value={newEvt.heure}
            onChange={e=>setNewEvt(v=>({...v,heure:e.target.value}))}
          />
        </div>

        <div style={{marginBottom:16}}>
          <div style={S.inpLbl}>Visibilité</div>
          <div style={S.row}>
            <button
              type="button"
              onClick={()=>setNewEvt(v=>({...v,shared:true}))}
              style={{
                padding:"7px 14px",
                borderRadius:22,
                fontSize:13,
                fontWeight:700,
                cursor:"pointer",
                background:newEvt.shared ? `${colorA}33` : "rgba(128,128,128,0.1)",
                border:`1.5px solid ${newEvt.shared ? colorA : "rgba(128,128,128,0.2)"}`,
                color:newEvt.shared ? colorA : "rgba(128,128,128,0.7)",
              }}
            >
              {L.shared}
            </button>

            <button
              type="button"
              onClick={()=>setNewEvt(v=>({...v,shared:false}))}
              style={{
                padding:"7px 14px",
                borderRadius:22,
                fontSize:13,
                fontWeight:700,
                cursor:"pointer",
                background:!newEvt.shared ? "#6b728033" : "rgba(128,128,128,0.1)",
                border:`1.5px solid ${!newEvt.shared ? "#6b7280" : "rgba(128,128,128,0.2)"}`,
                color:!newEvt.shared ? "#6b7280" : "rgba(128,128,128,0.7)",
              }}
            >
              {L.prive}
            </button>
          </div>
        </div>

        <div style={{display:"flex",gap:8}}>
          <Btn color={colorA} size="lg" onClick={addEvent}>
            {editingEvent ? "Modifier" : L.ajouter}
          </Btn>

          <Btn
            color="#6b7280"
            size="lg"
            onClick={()=>{
              setEditingEvent(null);
              setNewEvt({type:"rdv",titre:"",heure:"",shared:true});
              setModal(null);
            }}
          >
            {L.annuler}
          </Btn>
        </div>
      </div>
    </div>
  );
}
