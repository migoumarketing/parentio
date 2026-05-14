import { useState } from "react";
import Btn from "./Btn";
import { SOCIAL } from "../utils/constants";
import { CGU, CGV, PC } from "../utils/legalTexts";

const APP = "Parentio";

export default function ConsentScreen({ onAccept }) {
  const [lang, setLang] = useState("fr");
  const [c1, setC1] = useState(false);
  const [c2, setC2] = useState(false);
  const [c3, setC3] = useState(false);
  const [c4, setC4] = useState(false);
  const [err, setErr] = useState(false);
  const [doc, setDoc] = useState(null);

  const L = {
    fr: {
      title: `Bienvenue sur ${APP}`,
      sub: "Lisez et acceptez nos conditions avant de commencer.",
      cguLbl: "CGU",
      pcLbl: "Politique de Confidentialité",
      cgvLbl: "CGV — Conditions de vente et abonnement",
      l1: "J'ai lu et j'accepte les ",
      l2: " et la ",
      l3: "Je certifie être le parent ou tuteur légal des enfants concernés",
      l4: "Je certifie avoir 18 ans ou plus",
      btn: `Accéder à ${APP} →`,
      err: "Veuillez accepter toutes les conditions.",
      close: "Fermer",
      subtitle: "Organisation coparentalité",
      warning: "⚠️ Outil d'organisation uniquement — Aucune valeur juridique",
      security: "🔒 Données chiffrées TLS+AES256 · Hébergement EU (Irlande) · Conforme RGPD & CNIL",
      what: [
        "📅 Calendrier de garde organisationnel",
        "🤖 Analyse locale de votre jugement",
        "🌴 Vacances scolaires automatiques",
        "💐 Fête des Mères & Pères intégrées",
        "🌍 3 langues : FR / ES / EN"
      ],
      not: [
        "❌ Conseils juridiques ou calcul de pension",
        "❌ Remplacer un avocat ou une décision de justice",
        "❌ Partager vos données à des tiers",
        "❌ Accéder à votre localisation"
      ]
    },
    es: {
      title: `Bienvenido a ${APP}`,
      sub: "Lee y acepta nuestras condiciones.",
      cguLbl: "TyC",
      pcLbl: "Política de Privacidad",
      cgvLbl: "CGV — Condiciones de venta y suscripción",
      l1: "He leído y acepto los ",
      l2: " y la ",
      l3: "Certifico ser el padre/madre o tutor legal",
      l4: "Certifico tener 18 años o más",
      btn: `Acceder a ${APP} →`,
      err: "Debe aceptar todas las condiciones.",
      close: "Cerrar",
      subtitle: "Organización de coparentalidad",
      warning: "⚠️ Solo herramienta organizativa — Sin valor jurídico",
      security: "🔒 Datos cifrados TLS+AES256 · Alojamiento EU (Irlanda) · Conforme RGPD & CNIL",
      what: [
        "📅 Calendario organizativo de custodia",
        "🤖 Análisis local de sentencia",
        "🌴 Vacaciones escolares automáticas",
        "💐 Día de la Madre y del Padre",
        "🌍 3 idiomas : FR / ES / EN"
      ],
      not: [
        "❌ Consejos jurídicos o pensión",
        "❌ Reemplazar una decisión judicial",
        "❌ Compartir datos con terceros",
        "❌ Acceder a su ubicación"
      ]
    },
    en: {
      title: `Welcome to ${APP}`,
      sub: "Please read and accept our terms.",
      cguLbl: "Terms",
      pcLbl: "Privacy Policy",
      cgvLbl: "Sales terms and subscription",
      l1: "I have read and accept the ",
      l2: " and the ",
      l3: "I confirm I am the legal parent/guardian",
      l4: "I confirm I am 18 or older",
      btn: `Enter ${APP} →`,
      err: "Please accept all terms to continue.",
      close: "Close",
      subtitle: "Co-parenting organisation",
      warning: "⚠️ Organisational tool only — No legal value",
      security: "🔒 TLS+AES256 encrypted data · EU hosting (Ireland) · GDPR & CNIL compliant",
      what: [
        "📅 Organisational custody calendar",
        "🤖 Local court order analysis",
        "🌴 Automatic school holidays",
        "💐 Mother's & Father's Day",
        "🌍 3 languages : FR / ES / EN"
      ],
      not: [
        "❌ Legal advice or child support",
        "❌ Replace a court order",
        "❌ Share data with third parties",
        "❌ Access your location"
      ]
    }
  };

  const t = L[lang] || L.fr;

  function accept() {
    if (!c1 || !c2 || !c3 || !c4) {
      setErr(true);
      return;
    }
    onAccept(lang);
  }

  return (
    <div style={{
      minHeight:"100vh",
      background:"#07071a",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      padding:"20px 16px",
      fontFamily:"'Nunito','Segoe UI',sans-serif"
    }}>
      <div style={{
        background:"rgba(255,255,255,0.055)",
        backdropFilter:"blur(24px)",
        borderRadius:24,
        border:"1px solid rgba(255,255,255,0.09)",
        padding:"28px 22px",
        maxWidth:460,
        width:"100%",
        boxShadow:"0 24px 64px rgba(0,0,0,0.6)"
      }}>
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:18}}>
          {[["fr","🇫🇷"],["es","🇪🇸"],["en","🇬🇧"]].map(([l,f])=>(
            <div
              key={l}
              onClick={()=>setLang(l)}
              style={{
                fontSize:24,
                cursor:"pointer",
                opacity:lang===l?1:0.25,
                transform:lang===l?"scale(1.15)":"scale(1)",
                transition:"all 0.15s"
              }}
            >
              {f}
            </div>
          ))}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{
            width:48,
            height:48,
            background:"rgba(99,102,241,0.2)",
            border:"2px solid rgba(99,102,241,0.4)",
            borderRadius:14,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontSize:24,
            boxShadow:"0 6px 20px rgba(99,102,241,0.25)"
          }}>
            👨‍👧
          </div>

          <div>
            <div style={{fontWeight:900,fontSize:26,color:"#fff",letterSpacing:"-0.5px"}}>
              {APP}
            </div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>
              {t.subtitle}
            </div>
          </div>
        </div>

        <div style={{fontSize:18,fontWeight:900,color:"#fff",marginBottom:3}}>
          {t.title}
        </div>

        <div style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginBottom:14}}>
          {t.sub}
        </div>

        <div style={{marginBottom:10}}>
          {t.what.map((item,i)=>(
            <div key={i} style={{
              fontSize:12,
              color:"rgba(255,255,255,0.7)",
              marginBottom:4,
              lineHeight:1.5
            }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{
          background:"rgba(239,68,68,0.07)",
          border:"1px solid rgba(239,68,68,0.18)",
          borderRadius:11,
          padding:"10px 12px",
          marginBottom:12
        }}>
          {t.not.map((item,i)=>(
            <div key={i} style={{
              fontSize:12,
              color:"rgba(239,68,68,0.8)",
              marginBottom:3,
              lineHeight:1.4
            }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{
          background:"rgba(99,102,241,0.08)",
          border:"1px solid rgba(99,102,241,0.18)",
          borderRadius:10,
          padding:"9px 12px",
          marginBottom:12,
          fontSize:12,
          color:"rgba(200,200,255,0.7)",
          lineHeight:1.5
        }}>
          {t.security}
        </div>

        {[
          [c1,setC1,<>{t.l1}<span onClick={e=>{e.stopPropagation();setDoc("cgu");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>{t.cguLbl}</span>{t.l2}<span onClick={e=>{e.stopPropagation();setDoc("pc");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>{t.pcLbl}</span></>],
          [c2,setC2,<span onClick={e=>{e.stopPropagation();setDoc("cgv");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>{t.cgvLbl}</span>],
          [c3,setC3,t.l3],
          [c4,setC4,t.l4],
        ].map(([val,setter,label],idx)=>(
          <div key={idx} style={{
            display:"flex",
            alignItems:"flex-start",
            gap:10,
            padding:"9px 0",
            borderTop:"1px solid rgba(255,255,255,0.06)"
          }}>
            <div
              onClick={()=>setter(v=>!v)}
              style={{
                width:22,
                height:22,
                borderRadius:7,
                border:`2px solid ${val?"#6366f1":"rgba(255,255,255,0.18)"}`,
                background:val?"rgba(99,102,241,0.3)":"transparent",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                cursor:"pointer",
                flexShrink:0,
                marginTop:1
              }}
            >
              {val && <span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}
            </div>

            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>
              {label}
            </div>
          </div>
        ))}

        {err && (
          <div style={{color:"#ef4444",fontSize:12,textAlign:"center",margin:"8px 0",fontWeight:700}}>
            {t.err}
          </div>
        )}

        <div style={{marginTop:14}}>
          <Btn onClick={accept} color="#6366f1" size="lg" full>
            {t.btn}
          </Btn>
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:14}}>
          {SOCIAL.map(s=>(
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              style={{fontSize:22,textDecoration:"none",opacity:0.5}}
              title={s.name}
            >
              {s.icon}
            </a>
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:10,fontSize:10,color:"rgba(255,255,255,0.15)"}}>
          {t.warning}
        </div>
      </div>

      {doc && (
        <div
          style={{
            position:"fixed",
            inset:0,
            background:"rgba(0,0,0,0.85)",
            backdropFilter:"blur(12px)",
            zIndex:999,
            display:"flex",
            alignItems:"flex-end",
            justifyContent:"center"
          }}
          onClick={e=>e.target===e.currentTarget&&setDoc(null)}
        >
          <div style={{
            background:"#0d0d20",
            border:"1px solid rgba(255,255,255,0.09)",
            borderRadius:"22px 22px 0 0",
            padding:"22px 20px 40px",
            width:"100%",
            maxWidth:460,
            maxHeight:"85vh",
            overflow:"auto"
          }}>
            <div style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:14}}>
              {doc==="cgu" ? t.cguLbl : doc==="cgv" ? "CGV" : t.pcLbl}
            </div>

            <pre style={{
              fontSize:11,
              color:"rgba(255,255,255,0.55)",
              lineHeight:1.8,
              whiteSpace:"pre-wrap",
              fontFamily:"inherit"
            }}>
              {doc==="cgu" ? CGU : doc==="cgv" ? CGV : PC}
            </pre>

            <div style={{marginTop:16}}>
              <Btn onClick={()=>setDoc(null)} color="#6366f1">
                ✓ {t.close}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
