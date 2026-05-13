import { useState } from "react";

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
  const [weekendStart, setWeekendStart] = useState("samedi");
  const [vacancesMode, setVacancesMode] = useState("moitie");
  const [firstHalfEvenA, setFirstHalfEvenA] = useState(false);

  const currentWeek = getWN(new Date());
  const isCurrentWeekEven = currentWeek % 2 === 0;
  const isCurrentYearEven = new Date().getFullYear() % 2 === 0;

  const weekendEvenParent = semPaireA ? pA : pB;
  const weekendOddParent = semPaireA ? pB : pA;

  const yearEvenParent = annePaireA ? pA : pB;
  const yearOddParent = annePaireA ? pB : pA;

  const firstHalfEvenParent = firstHalfEvenA ? pA : pB;
  const secondHalfEvenParent = firstHalfEvenA ? pB : pA;
  const firstHalfOddParent = firstHalfEvenA ? pB : pA;
  const secondHalfOddParent = firstHalfEvenA ? pA : pB;

  return (
    <div style={S.card}>
      <div style={S.sec}>👤 Parents & mode de garde</div>

      <div style={{display:"flex",gap:8,marginBottom:11}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={S.inpLbl}>Prénom A</div>
          <input
            style={{...S.inp,borderColor:`${colorA}55`}}
            value={pA}
            onChange={e=>setPa(e.target.value)}
            placeholder="Maman"
          />
        </div>

        <div style={{flex:1,minWidth:0}}>
          <div style={S.inpLbl}>Prénom B</div>
          <input
            style={{...S.inp,borderColor:`${colorB}55`}}
            value={pB}
            onChange={e=>setPb(e.target.value)}
            placeholder="Papa"
          />
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:11}}>
        <div style={{minWidth:0}}>
          <div style={S.inpLbl}>Heure échange → {pA}</div>
          <input
            type="time"
            style={{...S.inp,width:"100%",minWidth:0,boxSizing:"border-box"}}
            value={heureA}
            onChange={e=>setHeureA(e.target.value)}
          />
        </div>

        <div style={{minWidth:0}}>
          <div style={S.inpLbl}>Heure échange → {pB}</div>
          <input
            type="time"
            style={{...S.inp,width:"100%",minWidth:0,boxSizing:"border-box"}}
            value={heureB}
            onChange={e=>setHeureB(e.target.value)}
          />
        </div>
      </div>

      <div style={{...S.row,marginBottom:10}}>
        <Pill active={mode==="alternee"} color="#8b5cf6" onClick={()=>setMode("alternee")}>
          {L.alternee}
        </Pill>

        <Pill active={mode==="classique"} color="#8b5cf6" onClick={()=>setMode("classique")}>
          {L.classique}
        </Pill>

        <Pill active={mode==="personnalise"} color="#8b5cf6" onClick={()=>setMode("personnalise")}>
          {L.perso}
        </Pill>
      </div>

      {mode==="alternee" && (
        <div style={{...S.row,marginBottom:10}}>
          <Pill active={paireA} color={colorA} onClick={()=>setPaireA(true)}>
            Semaine paire → {pA}
          </Pill>

          <Pill active={!paireA} color={colorB} onClick={()=>setPaireA(false)}>
            Semaine paire → {pB}
          </Pill>
        </div>
      )}

      {mode==="classique" && (
        <div style={{marginBottom:10}}>
          <div style={{marginBottom:12}}>
            <div style={S.inpLbl}>🗓️ Week-end — semaines paires</div>

            <div style={S.row}>
              <Pill active={semPaireA} color={colorA} onClick={()=>setSemPaireA(true)}>
                Semaine paire → {pA || "Parent A"}
              </Pill>

              <Pill active={!semPaireA} color={colorB} onClick={()=>setSemPaireA(false)}>
                Semaine paire → {pB || "Parent B"}
              </Pill>
            </div>

            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Semaine actuelle : S{currentWeek} ({isCurrentWeekEven ? "paire" : "impaire"}) → week-end chez{" "}
              <strong style={{color:isCurrentWeekEven ? (semPaireA ? colorA : colorB) : (semPaireA ? colorB : colorA)}}>
                {isCurrentWeekEven ? weekendEvenParent : weekendOddParent}
              </strong>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <div style={S.inpLbl}>⏱️ Début du week-end</div>

            <div style={S.row}>
              <Pill active={weekendStart==="vendredi"} color="#06b6d4" onClick={()=>setWeekendStart("vendredi")}>
                Vendredi → dimanche
              </Pill>

              <Pill active={weekendStart==="samedi"} color="#06b6d4" onClick={()=>setWeekendStart("samedi")}>
                Samedi → dimanche
              </Pill>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <div style={S.inpLbl}>📆 Années paires</div>

            <div style={S.row}>
              <Pill active={annePaireA} color={colorA} onClick={()=>setAnnePaireA(true)}>
                Année paire → {pA || "Parent A"}
              </Pill>

              <Pill active={!annePaireA} color={colorB} onClick={()=>setAnnePaireA(false)}>
                Année paire → {pB || "Parent B"}
              </Pill>
            </div>

            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Cette année {new Date().getFullYear()} = {isCurrentYearEven ? "paire" : "impaire"} → référence chez{" "}
              <strong style={{color:isCurrentYearEven ? (annePaireA ? colorA : colorB) : (annePaireA ? colorB : colorA)}}>
                {isCurrentYearEven ? yearEvenParent : yearOddParent}
              </strong>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <div style={S.inpLbl}>🌴 Vacances scolaires</div>

            <div style={S.row}>
              <Pill active={vacancesMode==="moitie"} color="#d97706" onClick={()=>setVacancesMode("moitie")}>
                1ère moitié / 2ème moitié
              </Pill>

              <Pill active={vacancesMode==="semaine"} color="#d97706" onClick={()=>setVacancesMode("semaine")}>
                1ère semaine / 2ème semaine
              </Pill>
            </div>
          </div>

          <div style={{marginBottom:12}}>
            <div style={S.inpLbl}>🌴 Vacances — année paire</div>

            <div style={S.row}>
              <Pill active={firstHalfEvenA} color={colorA} onClick={()=>setFirstHalfEvenA(true)}>
                1ère partie année paire → {pA || "Parent A"}
              </Pill>

              <Pill active={!firstHalfEvenA} color={colorB} onClick={()=>setFirstHalfEvenA(false)}>
                1ère partie année paire → {pB || "Parent B"}
              </Pill>
            </div>
          </div>

          <div style={{
            background:`rgba(128,128,128,0.08)`,
            borderRadius:9,
            padding:"9px 11px",
            fontSize:12,
            color:T.sub,
            lineHeight:1.6,
          }}>
            📋 <strong style={{color:T.text}}>Résumé classique :</strong><br/>
            • Semaine normale → <strong style={{color:colorA}}>{pA || "Parent A"}</strong><br/>
            • Week-end semaines paires → <strong style={{color:semPaireA ? colorA : colorB}}>{weekendEvenParent}</strong><br/>
            • Week-end semaines impaires → <strong style={{color:semPaireA ? colorB : colorA}}>{weekendOddParent}</strong><br/>
            • Début week-end → <strong style={{color:T.text}}>{weekendStart === "vendredi" ? "vendredi" : "samedi"}</strong><br/>
            • Années paires → <strong style={{color:annePaireA ? colorA : colorB}}>{yearEvenParent}</strong><br/>
            • Années impaires → <strong style={{color:annePaireA ? colorB : colorA}}>{yearOddParent}</strong><br/>
            • Vacances année paire : 1ère partie → <strong style={{color:firstHalfEvenA ? colorA : colorB}}>{firstHalfEvenParent}</strong>, 2ème partie → <strong style={{color:firstHalfEvenA ? colorB : colorA}}>{secondHalfEvenParent}</strong><br/>
            • Vacances année impaire : 1ère partie → <strong style={{color:firstHalfEvenA ? colorB : colorA}}>{firstHalfOddParent}</strong>, 2ème partie → <strong style={{color:firstHalfEvenA ? colorA : colorB}}>{secondHalfOddParent}</strong>
          </div>
        </div>
      )}

      {mode==="personnalise" && (
        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>⚙️ Personnaliser les jours chez {pA}</div>

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

          <div style={{fontSize:11,color:T.sub,marginTop:5}}>
            Les autres jours → {pB}. Les options avancées anciennement “Par année” sont à regrouper ici.
          </div>
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
          <div style={S.inpLbl}>{pays==="france" ? "Zone scolaire" : "Région / Zone"}</div>

          <div style={S.row}>
            {zonesDisponibles.map(z=>(
              <Pill key={z} active={zone===z} color="#10b981" onClick={()=>setZone(z)}>
                {pays==="france" ? `Zone ${z}` : z}
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
