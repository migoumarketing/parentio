export default function CustodyConfigCard({
  S,
  L,
  T,
  pA,
  pB,
  setPa,
  setPb,
  heureA,
  heureB,
  setHeureA,
  setHeureB,
  mode,
  setMode,
  paireA,
  setPaireA,
  semPaireA,
  setSemPaireA,
  annePaireA,
  setAnnePaireA,
  joursA,
  setJoursA,
  colorA,
  colorB,
  getWN,
  year,
  pays,
  setPays,
  zone,
  setZone,
  PAYS_LIST,
  VACANCES_PAR_PAYS,
  zonesDisponibles,
  zoneLabels,
  anneeSco,
  getPaques,
  vacAlt,
  setVacAlt,
  showFeries,
  setShowFeries,
  Pill,
  Tog,
}) {
  return (
    <div style={S.card}>
      <div style={S.sec}>👤 Parents & mode de garde</div>

      <div style={{display:"flex",gap:8,marginBottom:11}}>
        <div style={{flex:1}}>
          <div style={S.inpLbl}>Prénom A</div>
          <input
            style={{...S.inp,borderColor:`${colorA}55`}}
            value={pA}
            onChange={e=>setPa(e.target.value)}
            placeholder="Maman"
          />
        </div>

        <div style={{flex:1}}>
          <div style={S.inpLbl}>Prénom B</div>
          <input
            style={{...S.inp,borderColor:`${colorB}55`}}
            value={pB}
            onChange={e=>setPb(e.target.value)}
            placeholder="Papa"
          />
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:11}}>
        <div style={{flex:1}}>
          <div style={S.inpLbl}>Heure échange → {pA}</div>
          <input type="time" style={S.inp} value={heureA} onChange={e=>setHeureA(e.target.value)} />
        </div>

        <div style={{flex:1}}>
          <div style={S.inpLbl}>Heure échange → {pB}</div>
          <input type="time" style={S.inp} value={heureB} onChange={e=>setHeureB(e.target.value)} />
        </div>
      </div>

      <div style={{...S.row,marginBottom:10}}>
        <Pill active={mode==="alternee"} color="#8b5cf6" onClick={()=>setMode("alternee")}>{L.alternee}</Pill>
        <Pill active={mode==="classique"} color="#8b5cf6" onClick={()=>setMode("classique")}>{L.classique}</Pill>
        <Pill active={mode==="annee"} color="#8b5cf6" onClick={()=>setMode("annee")}>{L.annee}</Pill>
        <Pill active={mode==="personnalise"} color="#8b5cf6" onClick={()=>setMode("personnalise")}>{L.perso}</Pill>
      </div>

      {mode==="alternee" && (
        <div style={{...S.row,marginBottom:10}}>
          <Pill active={paireA} color={colorA} onClick={()=>setPaireA(true)}>S{L.paire} → {pA}</Pill>
          <Pill active={!paireA} color={colorB} onClick={()=>setPaireA(false)}>S{L.paire} → {pB}</Pill>
        </div>
      )}

      {mode==="classique" && (
        <div style={{marginBottom:10}}>
          <div style={{marginBottom:10}}>
            <div style={S.inpLbl}>🗓️ Week-ends — Semaines paires</div>

            <div style={S.row}>
              <Pill active={semPaireA} color={colorA} onClick={()=>setSemPaireA(true)}>S{L.paire} → {pA||"A"}</Pill>
              <Pill active={!semPaireA} color={colorB} onClick={()=>setSemPaireA(false)}>S{L.paire} → {pB||"B"}</Pill>
            </div>

            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Semaine actuelle : S{getWN(new Date())} ({getWN(new Date())%2===0?"paire":"impaire"}) → WE chez{" "}
              <strong style={{color:getWN(new Date())%2===0?(semPaireA?colorA:colorB):(semPaireA?colorB:colorA)}}>
                {getWN(new Date())%2===0?(semPaireA?pA:pB):(semPaireA?pB:pA)}
              </strong>
            </div>
          </div>

          <div style={{marginBottom:10}}>
            <div style={S.inpLbl}>📆 Vacances & grandes périodes — Années paires</div>

            <div style={S.row}>
              <Pill active={annePaireA} color={colorA} onClick={()=>setAnnePaireA(true)}>A{L.paire} → {pA||"A"}</Pill>
              <Pill active={!annePaireA} color={colorB} onClick={()=>setAnnePaireA(false)}>A{L.paire} → {pB||"B"}</Pill>
            </div>

            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Cette année {new Date().getFullYear()} = {new Date().getFullYear()%2===0?"paire":"impaire"} → Vacances chez{" "}
              <strong style={{color:new Date().getFullYear()%2===0?(annePaireA?colorA:colorB):(annePaireA?colorB:colorA)}}>
                {new Date().getFullYear()%2===0?(annePaireA?pA:pB):(annePaireA?pB:pA)}
              </strong>
            </div>
          </div>

          <div style={{background:`rgba(128,128,128,0.08)`,borderRadius:9,padding:"9px 11px",fontSize:12,color:T.sub,lineHeight:1.6}}>
            📋 <strong style={{color:T.text}}>Résumé :</strong><br/>
            • Jours de semaine → <strong style={{color:colorA}}>{pA||"Parent A"}</strong><br/>
            • WE semaines paires → <strong style={{color:semPaireA?colorA:colorB}}>{semPaireA?pA||"A":pB||"B"}</strong><br/>
            • WE semaines impaires → <strong style={{color:semPaireA?colorB:colorA}}>{semPaireA?pB||"B":pA||"A"}</strong><br/>
            • Vacances années paires → <strong style={{color:annePaireA?colorA:colorB}}>{annePaireA?pA||"A":pB||"B"}</strong><br/>
            • Vacances années impaires → <strong style={{color:annePaireA?colorB:colorA}}>{annePaireA?pB||"B":pA||"A"}</strong>
          </div>
        </div>
      )}

      {mode==="annee" && (
        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>{L.anneesPaires}</div>
          <div style={S.row}>
            <Pill active={annePaireA} color={colorA} onClick={()=>setAnnePaireA(true)}>A{L.paire} → {pA}</Pill>
            <Pill active={!annePaireA} color={colorB} onClick={()=>setAnnePaireA(false)}>A{L.paire} → {pB}</Pill>
          </div>
          <div style={{fontSize:11,color:T.sub,marginTop:6}}>
            {year} = {year%2===0?"paire":"impaire"} → {year%2===0?(annePaireA?pA:pB):(annePaireA?pB:pA)}
          </div>
        </div>
      )}

      {mode==="personnalise" && (
        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>{L.joursA} ({pA})</div>
          <div style={S.row}>
            {L.joursSemaine.map((j,i)=>(
              <Pill
                key={i}
                active={joursA.includes(i+1)}
                color={colorA}
                onClick={()=>setJoursA(prev=>prev.includes(i+1)?prev.filter(x=>x!==i+1):[...prev,i+1].sort())}
              >
                {j}
              </Pill>
            ))}
          </div>
          <div style={{fontSize:11,color:T.sub,marginTop:5}}>Les autres jours → {pB}</div>
        </div>
      )}

      <div style={{marginBottom:10}}>
        <div style={S.inpLbl}>🌍 Pays</div>
        <div style={{...S.row,gap:6}}>
          {PAYS_LIST.map(p=>(
            <Pill
              key={p.id}
              active={pays===p.id}
              color="#10b981"
              onClick={()=>{
                setPays(p.id);
                const zones=VACANCES_PAR_PAYS[p.id]?.zones||["A"];
                setZone(zones[0]);
              }}
            >
              {p.flag} {p.label}
            </Pill>
          ))}
        </div>
      </div>

      {zonesDisponibles.length>1 && (
        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>{pays==="france"?"Zone scolaire":"Région / Zone"}</div>

          <div style={S.row}>
            {zonesDisponibles.map(z=>(
              <Pill key={z} active={zone===z} color="#10b981" onClick={()=>setZone(z)}>
                {pays==="france"?`Zone ${z}`:z}
              </Pill>
            ))}
          </div>

          {zoneLabels[zone] && (
            <div style={{fontSize:11,color:T.sub,marginTop:4}}>
              📍 {zoneLabels[zone]}
            </div>
          )}
        </div>
      )}

      <div style={{fontSize:11,color:T.sub,marginBottom:9}}>
        📚 {anneeSco}-{anneeSco+1} · 🐣 Pâques {year} : {getPaques(year).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}
      </div>

      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <Tog on={vacAlt} onChange={()=>setVacAlt(v=>!v)} label="Vacances alternées" color="#8b5cf6" T={T}/>
        <Tog on={showFeries} onChange={()=>setShowFeries(v=>!v)} label="Fériés & fêtes" color="#d97706" T={T}/>
      </div>
    </div>
  );
}
