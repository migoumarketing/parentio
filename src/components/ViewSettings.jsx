export default function ViewSettings({
  S,
  L,
  T,
  THEMES,
  PALETTES,
  theme,
  setTheme,
  colorA,
  colorB,
  setColorA,
  setColorB,
  palIdx,
  setPalIdx,
  pA,
  pB,
  rgbA,
  h2r,
  avion,
  setAvion,
  notifEnabled,
  setNotifEnabled,
  notifHour,
  setNotifHour,
  SOCIAL,
  APP,
  premium,
  setShowDoc,
  exportJSON,
  exportCSV,
  deleteAll,
  Tog,
  Pill,
  Btn,
  EMAIL,
  RESP,
  VER
}) {
  return (
    <>
      <div style={S.card}>
        <div style={S.sec}>🌍 {L.langue}</div>
        <div style={{fontSize:12,color:T.sub}}>
          Langue gérée depuis le sélecteur principal.
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>🎨 {L.theme}</div>
        <div style={S.row}>
          {Object.entries(THEMES).map(([key,th])=>(
            <Pill
              key={key}
              active={theme===key}
              color="#6366f1"
              onClick={()=>setTheme(key)}
            >
              {th.name}
            </Pill>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>🎨 {L.couleurs}</div>

        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(6,1fr)",
          gap:8,
          marginBottom:12
        }}>
          {PALETTES.map((p,i)=>(
            <div
              key={i}
              onClick={()=>{
                setPalIdx(i);
                setColorA(p.a);
                setColorB(p.b);
              }}
              style={{
                height:28,
                borderRadius:9,
                display:"flex",
                overflow:"hidden",
                cursor:"pointer",
                border:palIdx===i?"3px solid #fff":"3px solid transparent"
              }}
            >
              <div style={{flex:1,background:p.a}}/>
              <div style={{flex:1,background:p.b}}/>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:10}}>
          <div style={{flex:1}}>
            <div style={S.inpLbl}>{pA || "A"}</div>
            <input
              type="color"
              value={colorA}
              onChange={e=>{
                setColorA(e.target.value);
                setPalIdx(-1);
              }}
              style={{width:"100%",height:36}}
            />
          </div>

          <div style={{flex:1}}>
            <div style={S.inpLbl}>{pB || "B"}</div>
            <input
              type="color"
              value={colorB}
              onChange={e=>{
                setColorB(e.target.value);
                setPalIdx(-1);
              }}
              style={{width:"100%",height:36}}
            />
          </div>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>🔔 Notifications</div>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Tog
            on={avion}
            onChange={()=>setAvion(v=>!v)}
            label={L.avionLabel}
            sub={L.avionSub}
            color="#2563eb"
            T={T}
          />

          <Tog
            on={notifEnabled&&!avion}
            onChange={()=>setNotifEnabled(v=>!v)}
            label={L.notifLabel}
            sub={L.notifSub}
            color="#10b981"
            T={T}
          />

          {notifEnabled&&!avion && (
            <div>
              <div style={S.inpLbl}>Heure de notification</div>
              <input
                type="time"
                style={{...S.inp,maxWidth:140}}
                value={notifHour}
                onChange={e=>setNotifHour(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>📱 {L.social}</div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {SOCIAL.map(s=>(
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display:"flex",
                alignItems:"center",
                gap:6,
                padding:"8px 14px",
                borderRadius:12,
                background:T.card,
                border:`1px solid ${T.border}`,
                textDecoration:"none",
                fontSize:13,
                fontWeight:700,
                color:s.color
              }}
            >
              <span style={{fontSize:18}}>{s.icon}</span>
              {s.name}
            </a>
          ))}
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>💳 Abonnement</div>

        <div style={{
          background:`rgba(${rgbA},0.08)`,
          border:`1px solid rgba(${rgbA},0.2)`,
          borderRadius:14,
          padding:"16px",
          marginBottom:12
        }}>
          <div style={{
            fontWeight:900,
            fontSize:16,
            color:T.text,
            marginBottom:8
          }}>
            {premium ? "✅ Plan Premium actif" : "🚀 Plan Gratuit"}
          </div>

          <div style={{
            fontSize:13,
            color:T.sub,
            marginBottom:10,
            lineHeight:1.7
          }}>
            ✅ Calendrier complet<br/>
            ✅ Vacances scolaires<br/>
            ✅ Événements & notes<br/>
            🔒 Stripe à connecter plus tard
          </div>

          {!premium && (
            <Btn
              color={colorA}
              size="lg"
              full
              onClick={()=>alert("Stripe sera connecté plus tard. Contact : "+EMAIL)}
            >
              💳 S'abonner — Stripe
            </Btn>
          )}
        </div>

        <div style={S.row}>
          <Btn color="#6366f1" size="sm" onClick={()=>setShowDoc("cgv")}>
            CGV
          </Btn>
          <Btn color="#6b7280" size="sm" onClick={()=>alert("Factures disponibles après souscription.")}>
            📄 Factures
          </Btn>
        </div>
      </div>

      <div style={S.card}>
        <div style={S.sec}>📦 {L.mesDonnees} · {RESP} · {EMAIL}</div>

        <div style={{
          display:"flex",
          flexDirection:"column",
          gap:10
        }}>
          <Btn color="#10b981" size="lg" full onClick={exportJSON}>
            {L.exporter}
          </Btn>

          <Btn color="#06b6d4" size="lg" full onClick={exportCSV}>
            {L.exporterCSV}
          </Btn>

          <Btn color="#ef4444" size="lg" full danger onClick={deleteAll}>
            {L.effacer}
          </Btn>
        </div>
      </div>

      <div style={{
        textAlign:"center",
        fontSize:10,
        color:T.sub,
        padding:"8px 0 4px"
      }}>
        {APP} v{VER} · {RESP}
      </div>
    </>
  );
}
