export default function ViewAnnuel({
  S,
  TABS,
  year,
  setYear,
  T,
  anneeSco,
  getPaques,
  fm,
  fp,
  dim,
  fdow,
  sd,
  today,
  getParent,
  cfg,
  vac,
  pA,
  rgbA,
  rgbB,
  colorA,
  colorB,
  MOISC
}) {

  return (
    <div style={S.card}>
      <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom:10
      }}>
        <div style={S.sec}>
          📆 {TABS[2]} {year}
        </div>

        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setYear(y=>y-1)}>‹</button>
          <button onClick={()=>setYear(y=>y+1)}>›</button>
        </div>
      </div>

      <div style={{
        fontSize:11,
        color:T.sub,
        marginBottom:11,
        lineHeight:1.5
      }}>
        📚 {anneeSco}-{anneeSco+1}
      </div>

      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(3,1fr)",
        gap:9
      }}>
        {Array.from({length:12},(_,mi)=>{

          const d2 = dim(year,mi);
          const fd2 = fdow(year,mi);

          const mc=[];

          for(let i=0;i<fd2;i++) mc.push(null);

          for(let d=1;d<=d2;d++) mc.push(d);

          while(mc.length%7!==0) mc.push(null);

          return(
            <div
              key={mi}
              style={{
                background:T.card,
                borderRadius:11,
                padding:"9px 7px",
                border:`1px solid ${T.border}`
              }}
            >
              <div style={{
                fontSize:10,
                fontWeight:800,
                textAlign:"center",
                marginBottom:5,
                color:T.sub
              }}>
                {MOISC[mi]}
              </div>

              <div style={{
                display:"grid",
                gridTemplateColumns:"repeat(7,1fr)",
                gap:1.5
              }}>
                {mc.map((d,j)=>{

                  if(!d){
                    return(
                      <div
                        key={j}
                        style={{
                          width:"100%",
                          paddingTop:"100%"
                        }}
                      />
                    );
                  }

                  const date2 = new Date(year,mi,d);

                  const isA2 =
                    getParent(date2,cfg,vac)===pA;

                  const isT2 =
                    sd(date2,today);

                  return(
                    <div
                      key={j}
                      style={{
                        width:"100%",
                        paddingTop:"100%",
                        borderRadius:2,
                        background:isT2
                          ? "#fff"
                          : isA2
                            ? `rgba(${rgbA},0.45)`
                            : `rgba(${rgbB},0.45)`
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display:"flex",
        gap:8,
        justifyContent:"center",
        marginTop:11,
        flexWrap:"wrap"
      }}>
        {[
          [colorA,pA],
          [colorB,"Parent B"]
        ].map(([c,l])=>(
          <div
            key={l}
            style={{
              display:"flex",
              alignItems:"center",
              gap:4,
              fontSize:11,
              color:T.sub
            }}
          >
            <div style={{
              width:9,
              height:9,
              borderRadius:3,
              background:c
            }}/>

            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
