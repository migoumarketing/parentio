import { useState } from "react";

function h2r(h){
  const r=parseInt(h.slice(1,3),16),
        g=parseInt(h.slice(3,5),16),
        b=parseInt(h.slice(5,7),16);

  return `${r},${g},${b}`;
}

export default function Btn({
  children,
  onClick,
  color="#6366f1",
  size="md",
  full=false,
  danger=false,
  disabled=false
}) {

  const[h,setH]=useState(false);
  const[p,setP]=useState(false);

  const c=danger?"#ef4444":color;
  const rgb=h2r(c);

  const pad=size==="sm"
    ?"7px 13px"
    :size==="lg"
      ?"14px 26px"
      :"10px 18px";

  const fs=size==="sm"
    ?12
    :size==="lg"
      ?14
      :13;

  return(
    <button
      onMouseEnter={()=>!disabled&&setH(true)}
      onMouseLeave={()=>{
        setH(false);
        setP(false);
      }}
      onMouseDown={()=>!disabled&&setP(true)}
      onMouseUp={()=>setP(false)}
      onClick={()=>!disabled&&onClick&&onClick()}

      style={{
        display:"inline-flex",
        alignItems:"center",
        justifyContent:"center",
        gap:6,

        padding:pad,
        fontSize:fs,
        fontWeight:800,

        color:disabled
          ?"rgba(255,255,255,0.3)"
          :"#fff",

        cursor:disabled
          ?"not-allowed"
          :"pointer",

        width:full
          ?"100%"
          :"auto",

        background:disabled
          ?`rgba(${rgb},0.05)`
          :`rgba(${rgb},${h?0.30:0.14})`,

        backdropFilter:"blur(16px)",
        WebkitBackdropFilter:"blur(16px)",

        border:`1.5px solid rgba(${rgb},${disabled?0.08:h?0.6:0.28})`,

        borderRadius:13,

        boxShadow:disabled
          ?"none"
          :p
            ?`0 1px 3px rgba(${rgb},0.1), inset 0 1px 0 rgba(255,255,255,0.05)`
            :h
              ?`0 12px 28px rgba(${rgb},0.35),
                0 4px 8px rgba(${rgb},0.2),
                inset 0 1px 0 rgba(255,255,255,0.2),
                0 1px 0 rgba(${rgb},0.5)`
              :`0 6px 18px rgba(${rgb},0.22),
                0 2px 5px rgba(${rgb},0.12),
                inset 0 1px 0 rgba(255,255,255,0.14),
                0 1px 0 rgba(${rgb},0.38)`,

        transform:disabled
          ?"none"
          :p
            ?"scale(0.97) translateY(2px)"
            :h
              ?"translateY(-3px)"
              :"translateY(0)",

        transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",

        outline:"none",
        fontFamily:"inherit",
        letterSpacing:"0.2px",
      }}
    >
      {children}
    </button>
  );
}
