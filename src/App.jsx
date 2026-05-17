import { useState, useEffect, useRef } from "react";
import Btn from "./components/Btn";
import NoteModal from "./components/NoteModal";
import EventModal from "./components/EventModal";
import ContactsCard from "./components/ContactsCard";
import ViewEvents from "./components/ViewEvents";
import ViewAnnuel from "./components/ViewAnnuel";
import ViewSettings from "./components/ViewSettings";
import ViewCalExternal from "./components/ViewCal";
import ChecklistCard from "./components/ChecklistCard";
import UpcomingVacationsCard from "./components/UpcomingVacationsCard";
import SpecialDaysCard from "./components/SpecialDaysCard";
import AuthForm from "./components/AuthForm";
import ConsentScreen from "./components/ConsentScreen";
import { useAuth } from "./hooks/useAuth";
import { useEvents } from "./hooks/useEvents";
import { useNotes } from "./hooks/useNotes";
import {
  getPaques,
  getFeries,
  getFeteMeres,
  getFetePeres,
  getAnneeSco,
  getWN,
  dim,
  fdow,
  dk,
  h2r,
  sd
} from "./utils/dateUtils";
import { THEMES, PALETTES } from "./utils/themes";
import {
  EVT_IDS,
  EVT_COLORS,
  MOIS,
  MOISC,
  JOURS,
  SOCIAL
} from "./utils/constants";
import { CGU, CGV, PC, ML } from "./utils/legalTexts";
import { VACANCES_PAR_PAYS, PAYS_LIST } from "./data/vacationsData";


// Pour compatibilité avec le reste du code
function getVacances(an){ return VACANCES_PAR_PAYS.france.data[an] || VACANCES_PAR_PAYS.france.data[2025]; }


function getSpecial(date,y){
  const ff=getFeries(y),fm=getFeteMeres(y),fp=getFetePeres(y);
  const f=ff.find(x=>sd(x.date,date));
  if(f)return{label:f.nom,color:"#d97706",type:"ferie"};
  if(sd(date,fm))return{label:"Fête des Mères 💐",color:"#db2777",type:"mere"};
  if(sd(date,fp))return{label:"Fête des Pères 👔",color:"#2563eb",type:"pere"};
  return null;
}

// ─── LOGIQUE GARDE ────────────────────────────────────────────────────────────
// Mode classique avec années paires/impaires ET semaines paires/impaires
function getParent(date,cfg,vac){
  const{mode,pA,pB,paireA,zone,vacAlt,annePaireA,semPaireA}=cfg;
  const wn=getWN(date);
  const yn=date.getFullYear();
  const v=vac[zone]?.find(x=>date>=x.debut&&date<=x.fin)||null;

  if(mode==="alternee"){
    if(v&&vacAlt){const i=vac[zone].findIndex(x=>x.nom===v.nom);return i%2===0?pA:pB;}
    const isPaireSem=wn%2===0;
    return isPaireSem?(paireA?pA:pB):(paireA?pB:pA);
  }

  if(mode==="classique"){
    // Vacances : années paires/impaires
    if(v){
      const isYearPaire=date.getFullYear()%2===0;
      return isYearPaire?(annePaireA?pA:pB):(annePaireA?pB:pA);
    }
    const dow=date.getDay();
    if(dow===6||dow===0){
      // Week-ends : semaines paires/impaires
      const isPaireSem=wn%2===0;
      return isPaireSem?(semPaireA?pA:pB):(semPaireA?pB:pA);
    }
    return pA; // jours de semaine chez parent principal (A par défaut)
  }

  if(mode==="annee"){
    // Année paire/impaire
    const isYearPaire=yn%2===0;
    if(v&&vacAlt){const i=vac[zone].findIndex(x=>x.nom===v.nom);return i%2===0?pA:pB;}
    return isYearPaire?(annePaireA?pA:pB):(annePaireA?pB:pA);
  }

  if(mode==="personnalise"){
    // Mode personnalisé : l'utilisateur définit ses propres jours
    const dow=date.getDay();
    return cfg.joursA?.includes(dow)?pA:pB;
  }

  return pA;
}

function nextChg(cfg,vac){
  const t=new Date(),cp=getParent(t,cfg,vac);
  for(let i=1;i<=90;i++){const d=new Date(t);d.setDate(t.getDate()+i);if(getParent(d,cfg,vac)!==cp)return{days:i,parent:getParent(d,cfg,vac),date:d};}
  return null;
}

// ─── ANALYSE IA LOCALE ────────────────────────────────────────────────────────
// Analyse le texte du jugement sans API externe — 100% gratuit
function analyzeTextLocal(text){
  const t=text.toLowerCase();
  let result={mode:"alternee",paireA:true,parentA_nom:null,parentB_nom:null,heure:null,notes:""};

  // Détecter le mode
  if(t.includes("résidence alternée")||t.includes("garde alternée")||t.includes("semaine"))result.mode="alternee";
  else if(t.includes("résidence principale")||t.includes("garde principale")||t.includes("droit de visite"))result.mode="classique";
  else if(t.includes("année paire")||t.includes("année impaire"))result.mode="annee";

  // Semaines paires/impaires
  if(t.includes("semaine paire")&&(t.includes("mère")||t.includes("maman")))result.paireA=true;
  if(t.includes("semaine paire")&&(t.includes("père")||t.includes("papa")))result.paireA=false;
  if(t.includes("semaines impaires")&&(t.includes("mère")||t.includes("maman")))result.paireA=false;

  // Années paires/impaires
  if(t.includes("année paire")&&(t.includes("mère")||t.includes("maman")))result.annePaireA=true;
  if(t.includes("année paire")&&(t.includes("père")||t.includes("papa")))result.annePaireA=false;

  // Heure d'échange
  const heureMatch=t.match(/(\d{1,2})h(\d{2})?|(\d{1,2}):(\d{2})/);
  if(heureMatch)result.heure=heureMatch[0].replace("h",":");

  // Résumé
  if(result.mode==="alternee")result.notes="Résidence alternée détectée — semaines paires/impaires";
  else if(result.mode==="classique")result.notes="Résidence principale avec droit de visite détecté";
  else if(result.mode==="annee")result.notes="Garde par années paires/impaires détectée";

  return result;
}

// ─── TEXTES LÉGAUX ────────────────────────────────────────────────────────────
const APP="Parentio";const RESP="M. Alvarado";const EMAIL="migoumarketing@gmail.com";const ADR="Paris 75020, France";const VER="11.0"




function Pill({active,color,onClick,children}){
  const rgb=h2r(color);
  return(
    <div onClick={onClick} style={{
      padding:"7px 14px",borderRadius:22,fontSize:13,fontWeight:700,cursor:"pointer",
      background:active?`rgba(${rgb},0.2)`:"rgba(128,128,128,0.1)",
      border:`1.5px solid ${active?color:"rgba(128,128,128,0.2)"}`,
      color:active?color:"rgba(128,128,128,0.7)",
      boxShadow:active?`0 3px 12px rgba(${rgb},0.2),inset 0 1px 0 rgba(255,255,255,0.1)`:"none",
      transform:active?"translateY(-1px)":"none",
      transition:"all 0.18s",
    }}>{children}</div>
  );
}

function Tog({on,onChange,label,color="#6366f1",sub="",T}){
  const rgb=h2r(color);
  return(
    <label onClick={onChange} style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer",userSelect:"none"}}>
      <div style={{width:40,height:23,borderRadius:12,background:on?`rgba(${rgb},0.5)`:"rgba(128,128,128,0.15)",position:"relative",transition:"all 0.22s",boxShadow:on?`0 2px 10px rgba(${rgb},0.35)`:"none",flexShrink:0,border:`1.5px solid ${on?color:"rgba(128,128,128,0.2)"}`}}>
        <div style={{position:"absolute",top:2.5,left:on?19:2.5,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"all 0.22s",boxShadow:"0 2px 6px rgba(0,0,0,0.25)"}}/>
      </div>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:on?color:T?.sub||"rgba(128,128,128,0.7)"}}>{label}</div>
        {sub&&<div style={{fontSize:10,color:T?.sub||"rgba(128,128,128,0.5)",marginTop:1}}>{sub}</div>}
      </div>
    </label>
  );
}



// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App(){
  const [showAuth, setShowAuth] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(
  localStorage.getItem("parentio-consent") === "true"
);
  const { user, loadingAuth, logout, isLoggedIn } = useAuth();
  const { 
  events: cloudEvents, 
  addEvent: addCloudEvent, 
  removeEvent: removeCloudEvent,
  editEvent: editCloudEvent
} = useEvents(user);
  const { cloudNotes, saveCloudNote, removeCloudNoteByDate } = useNotes(user);
  const today=new Date();
  const[accepted,setAccepted]=useState(()=>localStorage.getItem("par_v11")==="1");
  const[lang,setLang]=useState(()=>localStorage.getItem("par_lang")||"fr");
  const[theme,setTheme]=useState(()=>localStorage.getItem("par_theme")||"dark");
  const[avion,setAvion]=useState(false);
  const[premium,setPremium]=useState(false);
  const[tab,setTab]=useState(0);
  const[month,setMonth]=useState(today.getMonth());
  const[year,setYear]=useState(today.getFullYear());
  const[zone,setZone]=useState("B");
  const[pays,setPays]=useState("france");

  // Modes de garde — v9 : alternee / classique / annee / personnalise
  const[mode,setMode]=useState("alternee");
  const[paireA,setPaireA]=useState(true);        // semaines paires → A
  const[semPaireA,setSemPaireA]=useState(true);   // classique : semaines paires WE → A
  const[annePaireA,setAnnePaireA]=useState(true); // années paires → A
  const[joursA,setJoursA]=useState([1,2,3]);      // personnalisé : jours A (1=lun...)

  const[pA,setPa]=useState("Maman");
  const[pB,setPb]=useState("Papa");
  const[heureA,setHeureA]=useState("18:00");
  const[heureB,setHeureB]=useState("18:00");
  const[vacAlt,setVacAlt]=useState(true);
  const[showFeries,setShowFeries]=useState(true);
  const[colorA,setColorA]=useState(PALETTES[0].a);
  const[colorB,setColorB]=useState(PALETTES[0].b);
  const[palIdx,setPalIdx]=useState(0);
  const[events,setEvents]=useState(()=>{try{return JSON.parse(localStorage.getItem("par_events")||"{}");}catch{return{};}});
  const[notes,setNotes]=useState(()=>{try{return JSON.parse(localStorage.getItem("par_notes")||"{}");}catch{return{};}});
  const[selDay,setSelDay]=useState(null);
const[modal,setModal]=useState(null);
const[editingEvent,setEditingEvent]=useState(null);
const[newEvt,setNewEvt]=useState({type:"rdv",titre:"",heure:"",shared:true});
  
  const[newNote,setNewNote]=useState("");
  const[checklist,setChecklist]=useState({});
  const[contacts,setContacts]=useState([{nom:"",tel:""}]);
  const[showDoc,setShowDoc]=useState(null);
  const[animIn,setAnimIn]=useState(false);
  const[screenW,setScreenW]=useState(typeof window!=="undefined"?window.innerWidth:390);
  const[notifEnabled,setNotifEnabled]=useState(false);
  const[notifHour,setNotifHour]=useState("09:00");
  const[jugText,setJugText]=useState("");
  const[aiResult,setAiResult]=useState(null);
  const fileRef=useRef();
const savingEventRef = useRef(false);

  const T=THEMES[theme]||THEMES.dark;
  const anneeSco=getAnneeSco(new Date(year,month,1));
  // Vacances selon le pays sélectionné
  const paysInfo = VACANCES_PAR_PAYS[pays] || VACANCES_PAR_PAYS.france;
  const zonesDisponibles = paysInfo.zones || ["A","B","C"];
  const zoneLabels = paysInfo.zoneLabels || {};
  const vacByZone = paysInfo.data[anneeSco] || paysInfo.data[2025] || {};
  // Compatibilité avec getParent qui attend un objet {zone: [...]}
  const vac = vacByZone;
  const cfg={mode,pA,pB,paireA,zone,vacAlt,annePaireA,semPaireA,joursA};

  // Sauvegarder automatiquement
  useEffect(()=>{localStorage.setItem("par_events",JSON.stringify(events));},[events]);
  useEffect(()=>{localStorage.setItem("par_notes",JSON.stringify(notes));},[notes]);
  useEffect(()=>{localStorage.setItem("par_theme",theme);},[theme]);
  useEffect(()=>{localStorage.setItem("par_lang",lang);},[lang]);
  
// Charger les notes Supabase dans l'application
useEffect(() => {
  if (!isLoggedIn) return;
  if (!cloudNotes || cloudNotes.length === 0) return;

  const groupedNotes = {};

  cloudNotes.forEach((note) => {
    groupedNotes[note.note_date] = note.content;
  });

  setNotes(groupedNotes);
}, [cloudNotes, isLoggedIn]);
  
useEffect(() => {
  if (!isLoggedIn) return;
  if (!cloudNotes || cloudNotes.length === 0) return;

  const groupedNotes = {};

  cloudNotes.forEach((note) => {
    groupedNotes[note.note_date] = note.content;
  });

  setNotes(groupedNotes);

}, [cloudNotes, isLoggedIn]);
// Charger les événements Supabase dans l'application
useEffect(() => {
  if (!isLoggedIn) return;
  if (!cloudEvents || cloudEvents.length === 0) return;

  const groupedEvents = {};

  cloudEvents.forEach((event) => {
    const key = event.event_date;

    if (!key) return;

    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }

    groupedEvents[key].push({
      id: event.id,
      titre: event.title || event.titre || "Événement",
      type: event.type || "rdv",
      parent: event.parent || "",
      date: event.event_date,
      shared: event.shared ?? true,
      heure: event.heure || event.time || "",
      status: event.status || "planned",
    });
  });

  setEvents(groupedEvents);
}, [cloudEvents, isLoggedIn]);
useEffect(() => {
  setTimeout(() => setAnimIn(true), 80);

  const r = () => setScreenW(window.innerWidth);

  window.addEventListener("resize", r);

  return () => window.removeEventListener("resize", r);
}, []);

  // Notifications intelligentes
  useEffect(()=>{
    if(!notifEnabled||avion)return;
    const check=setInterval(()=>{
      const now=new Date();
      const[hh,mm]=notifHour.split(":").map(Number);
      if(now.getHours()===hh&&now.getMinutes()===mm){
        const c=nextChg(cfg,vac);
        if(c&&c.days<=3&&"Notification"in window){
          Notification.requestPermission().then(p=>{
            if(p==="granted")new Notification(`${APP} 📅`,{body:`Changement dans ${c.days}j → ${c.parent}`});
          });
        }
      }
    },60000);
    return()=>clearInterval(check);
  },[notifEnabled,notifHour,avion]);

function handleAccept(l){
  localStorage.setItem("parentio-consent", "true");
  localStorage.setItem("par_v11","1");
  setLang(l);
  setAccepted(true);
  setConsentAccepted(true);
}

  // Analyse IA locale du jugement
  function analyzeJugement(){
    if(!jugText.trim())return;
    const result=analyzeTextLocal(jugText);
    setAiResult(result);
    setMode(result.mode);
    if(result.paireA!==undefined)setPaireA(result.paireA);
    if(result.annePaireA!==undefined)setAnnePaireA(result.annePaireA);
    if(result.heure)setHeureA(result.heure);
  }

  // Export données RGPD
  function exportJSON(){
    const data={date:new Date().toISOString(),app:`${APP} v${VER}`,rgpd:"Art.20 RGPD",parents:{A:pA,B:pB},parametres:{mode,zone,paireA,vacAlt,colorA,colorB,lang,theme},evenements:events,notes,contacts};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`${APP}-donnees-${new Date().toISOString().split("T")[0]}.json`;a.click();URL.revokeObjectURL(url);
  }
  function exportCSV(){
    const rows=[["Date","Titre","Type","Partagé","Heure"]];
    Object.entries(events).forEach(([date,evts])=>evts.forEach(e=>rows.push([date,e.titre,e.type,e.shared?"Oui":"Non",e.heure||""])));
    const blob=new Blob([rows.map(r=>r.join(",")).join("\n")],{type:"text/csv"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");
    a.href=url;a.download=`${APP}-events-${new Date().toISOString().split("T")[0]}.csv`;a.click();URL.revokeObjectURL(url);
  }
  function deleteAll(){
    if(window.confirm("⚠️ Toutes vos données seront supprimées définitivement. Continuer ?")){
      setEvents({});setNotes({});setChecklist({});setContacts([{nom:"",tel:""}]);
      localStorage.clear();setAccepted(false);
    }
  }

  if(!accepted)return <ConsentScreen onAccept={handleAccept}/>;
  if (showAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#07071a", color: "#fff" }}>
        <button
          onClick={() => setShowAuth(false)}
          style={{ margin: 20, padding: 12 }}
        >
          ← Retour à l’application
        </button>
        <AuthForm />
      </div>
    );
  }
  const isDesktop=screenW>=1024;const isMobile=screenW<640;
  const rgbA=h2r(colorA);const rgbB=h2r(colorB);
  const dimM=dim(year,month);const fd=fdow(year,month);
  const cells=[];for(let i=0;i<fd;i++)cells.push(null);for(let i=1;i<=dimM;i++)cells.push(i);

  function getCellData(day){
    if(!day)return null;
    const date=new Date(year,month,day);const key=dk(year,month,day);
    const par=getParent(date,cfg,vac);
    const v=vac[zone]?.find(x=>date>=x.debut&&date<=x.fin)||null;
    const special=getSpecial(date,year);
    return{par,v,special,isA:par===pA,wn:getWN(date),isToday:sd(date,today),evts:events[key]||[],note:notes[key]||"",key};
  }

  const allD=cells.map(d=>d?getCellData(d):null).filter(Boolean);
  const stA=allD.filter(d=>d.isA).length,stB=allD.filter(d=>!d.isA).length;
  const pct=Math.round(stA/(stA+stB||1)*100);
  const cntd=nextChg(cfg,vac);
  const selData=selDay?getCellData(selDay):null;
async function addEvent(){
  if (savingEventRef.current) return;
  if (!newEvt.titre.trim()) return;
  if (!selDay) return;

  savingEventRef.current = true;

  const key = editingEvent?.key || dk(year, month, selDay);

  const localEvent = {
    id: editingEvent?.id || crypto.randomUUID(),
    titre: newEvt.titre,
    type: newEvt.type || "rdv",
    parent: newEvt.parent || "",
    date: key,
    shared: newEvt.shared ?? true,
    heure: newEvt.heure || "",
  };

  try {
    if (isLoggedIn) {
      if (editingEvent) {
        await editCloudEvent(editingEvent.id, {
          title: newEvt.titre,
          type: newEvt.type || "rdv",
          parent: newEvt.parent || "",
          event_date: key,
          status: "planned"
        });
      } else {
        const created = await addCloudEvent({
          title: newEvt.titre,
          type: newEvt.type || "rdv",
          parent: newEvt.parent || "",
          event_date: key,
          status: "planned"
        });

        const saved = created?.[0];
        if (saved?.id) localEvent.id = saved.id;
      }
    }

    setEvents((p) => {
      const current = p[key] || [];

      if (editingEvent) {
        return {
          ...p,
          [key]: current.map((e) =>
            e.id === editingEvent.id ? localEvent : e
          )
        };
      }

      return {
        ...p,
        [key]: [...current, localEvent]
      };
    });

    setNewEvt({ type: "rdv", titre: "", heure: "", shared: true });
    setEditingEvent(null);
    setModal(null);

  } catch (error) {
    console.error("Erreur événement :", error);
    alert("Erreur lors de l'enregistrement de l'événement.");
  } finally {
    savingEventRef.current = false;
  }
async function delEvent(key, id){
  try {

    // Suppression immédiate dans l’interface
    setEvents((p) => ({
      ...p,
      [key]: (p[key] || []).filter((e) => e.id !== id)
    }));

    // Si connecté → suppression Supabase
    if (isLoggedIn && id) {
      await removeCloudEvent(id);
    }

  } catch (error) {
    console.error("Erreur suppression événement :", error);
    alert("Erreur suppression événement");
  }
}
async function saveNote(){
  if (!selDay) return;

  const key = dk(year, month, selDay);

  try {
    if (isLoggedIn) {
      await saveCloudNote({
        note_date: key,
        content: newNote
      });
    }

    setNotes((p) => ({
      ...p,
      [key]: newNote
    }));

    setModal(null);

  } catch (error) {
    console.error(error);
    alert("Erreur sauvegarde note");
  }
}
  async function deleteNote(){
  if (!selDay) return;

  const key = dk(year, month, selDay);

  try {
    if (isLoggedIn) {
    await removeCloudNoteByDate(key);
    }

    setNotes((p) => {
      const copy = { ...p };
      delete copy[key];
      return copy;
    });

    setNewNote("");
    setModal(null);

  } catch (error) {
    console.error(error);
    alert("Erreur suppression note");
  }
}
  const upEvts=[];
  for(let m2=0;m2<3;m2++){const mm=(month+m2)%12;const yy=year+Math.floor((month+m2)/12);for(let d=1;d<=dim(yy,mm);d++){const key=dk(yy,mm,d);if(events[key]?.length){const date=new Date(yy,mm,d);if(date>=today)events[key].forEach(e=>upEvts.push({...e,date,key}));}}}
  upEvts.sort((a,b)=>a.date-b.date);

  const feries=getFeries(year),fm=getFeteMeres(year),fp=getFetePeres(year);
  const prochSpec=[...feries,{date:fm,nom:"Fête des Mères 💐"},{date:fp,nom:"Fête des Pères 👔"}]
    .filter(f=>f.date>=today).sort((a,b)=>a.date-b.date).slice(0,6);

  // Labels selon langue
  const LBL={
    fr:{tabs:["Calendrier","Événements","Annuel","Réglages"],garde:"Garde",paire:"paire",impaire:"impaire",
      alternee:"🔄 Alternée",classique:"🏠 Classique",annee:"📆 Par année",perso:"✏️ Perso",
      semPaires:"Semaines paires →",anneesPaires:"Années paires →",vacances:"Prochaines vacances",
      countdown:"Prochain changement",jours:"j",add:"+ Événement",note:"📝 Note",
      shared:"Partagé",prive:"Privé 🔒",ajouter:"Ajouter",annuler:"Annuler",enregistrer:"Enregistrer",
      disc:"⚠️ Outil d'organisation uniquement — Aucune valeur juridique",
      evtTypes:["🏥 Médical","⚽ Sport","📚 École","🎂 Fête","📌 Autre"],
      jugTitle:"🤖 Analyse de votre jugement",jugSub:"Copiez-collez le texte de votre jugement ci-dessous",
      jugBtn:"Analyser",jugPlh:"Collez ici le texte de votre jugement de garde...",
      premium:"🚀 Passer Premium",premiumSub:"3,99€/mois — Débloquez toutes les fonctionnalités",
      social:"Nous suivre",langue:"Langue",theme:"Thème",couleurs:"Couleurs",
      avionLabel:"✈️ Mode avion",avionSub:"Désactive toutes les notifications",
      notifLabel:"🔔 Notifications",notifSub:"Max 1/jour à l'heure choisie",
      droits:"Vos droits RGPD",securite:"Sécurité technique",legal:"Documents légaux",
      mesDonnees:"Mes données",exporter:"📤 Exporter JSON",exporterCSV:"📊 Exporter CSV",effacer:"🗑️ Effacer mes données",
      checkItems:["Cartable 🎒","Médicaments 💊","Peluche 🧸","Vêtements 👕","Chaussures 👟","Doudou 🧸","Livre 📖"],
      contacts:"Contacts urgence",reinit:"Réinitialiser",
      joursSemaine:["Lu","Ma","Me","Je","Ve","Sa","Di"],joursA:"Jours Parent A",
    },
    es:{tabs:["Calendario","Eventos","Anual","Ajustes"],garde:"Custodia",paire:"par",impaire:"impar",
      alternee:"🔄 Alternada",classique:"🏠 Clásica",annee:"📆 Por año",perso:"✏️ Perso",
      semPaires:"Semanas pares →",anneesPaires:"Años pares →",vacances:"Próximas vacaciones",
      countdown:"Próximo cambio",jours:"d",add:"+ Evento",note:"📝 Nota",
      shared:"Compartido",prive:"Privado 🔒",ajouter:"Añadir",annuler:"Cancelar",enregistrer:"Guardar",
      disc:"⚠️ Solo herramienta organizativa — Sin valor jurídico",
      evtTypes:["🏥 Médico","⚽ Deporte","📚 Escuela","🎂 Fiesta","📌 Otro"],
      jugTitle:"🤖 Análisis de su sentencia",jugSub:"Copie y pegue el texto de su sentencia",
      jugBtn:"Analizar",jugPlh:"Pegue aquí el texto de su sentencia...",
      premium:"🚀 Plan Premium",premiumSub:"3,99€/mes — Desbloquea todo",
      social:"Síguenos",langue:"Idioma",theme:"Tema",couleurs:"Colores",
      avionLabel:"✈️ Modo avión",avionSub:"Desactiva todas las notificaciones",
      notifLabel:"🔔 Notificaciones",notifSub:"Máx 1/día a la hora elegida",
      droits:"Sus derechos RGPD",securite:"Seguridad técnica",legal:"Documentos legales",
      mesDonnees:"Mis datos",exporter:"📤 Exportar JSON",exporterCSV:"📊 Exportar CSV",effacer:"🗑️ Borrar mis datos",
      checkItems:["Mochila 🎒","Medicamentos 💊","Peluche 🧸","Ropa 👕","Zapatos 👟","Mantita 🧸","Libro 📖"],
      contacts:"Contactos urgencia",reinit:"Reiniciar",
      joursSemaine:["Lu","Ma","Mi","Ju","Vi","Sá","Do"],joursA:"Días Padre/Madre A",
    },
    en:{tabs:["Calendar","Events","Yearly","Settings"],garde:"Custody",paire:"even",impaire:"odd",
      alternee:"🔄 Alternating",classique:"🏠 Classic",annee:"📆 By year",perso:"✏️ Custom",
      semPaires:"Even weeks →",anneesPaires:"Even years →",vacances:"Upcoming holidays",
      countdown:"Next handover",jours:"d",add:"+ Event",note:"📝 Note",
      shared:"Shared",prive:"Private 🔒",ajouter:"Add",annuler:"Cancel",enregistrer:"Save",
      disc:"⚠️ Organisational tool only — No legal value",
      evtTypes:["🏥 Medical","⚽ Sport","📚 School","🎂 Party","📌 Other"],
      jugTitle:"🤖 Court order analysis",jugSub:"Copy and paste the text of your court order",
      jugBtn:"Analyse",jugPlh:"Paste your court order text here...",
      premium:"🚀 Go Premium",premiumSub:"€3.99/month — Unlock all features",
      social:"Follow us",langue:"Language",theme:"Theme",couleurs:"Colors",
      avionLabel:"✈️ Airplane mode",avionSub:"Disables all notifications",
      notifLabel:"🔔 Notifications",notifSub:"Max 1/day at chosen time",
      droits:"Your GDPR rights",securite:"Technical security",legal:"Legal documents",
      mesDonnees:"My data",exporter:"📤 Export JSON",exporterCSV:"📊 Export CSV",effacer:"🗑️ Delete my data",
      checkItems:["School bag 🎒","Medication 💊","Stuffed toy 🧸","Clothes 👕","Shoes 👟","Comfort toy 🧸","Book 📖"],
      contacts:"Emergency contacts",reinit:"Reset",
      joursSemaine:["Mo","Tu","We","Th","Fr","Sa","Su"],joursA:"Parent A days",
    },
  };
  const L=LBL[lang]||LBL.fr;
  const TABS=L.tabs;const ICONS=["📅","🗓️","📆","⚙️"];

  // ─── STYLES ───────────────────────────────────────────────────────────────
  const S={
    app:{minHeight:"100vh",background:T.bg,color:T.text,fontFamily:"'Nunito','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",transition:"background 0.3s,color 0.3s"},
    hdr:{width:"100%",background:T.bg+"ee",backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderBottom:`1px solid ${T.border}`,padding:isDesktop?"14px 40px":"12px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:300,boxSizing:"border-box"},
    layout:{width:"100%",maxWidth:isDesktop?920:460,display:isDesktop?"grid":"flex",gridTemplateColumns:isDesktop?"230px 1fr":"",flexDirection:"column",gap:isDesktop?20:0,padding:isDesktop?"20px 20px 40px":"14px 16px 88px",boxSizing:"border-box",opacity:animIn?1:0,transform:animIn?"none":"translateY(14px)",transition:"all 0.4s ease"},
    sidebar:{display:isDesktop?"flex":"none",flexDirection:"column",gap:6,position:"sticky",top:80,height:"fit-content"},
    sideItem:on=>({display:"flex",alignItems:"center",gap:9,padding:"11px 14px",borderRadius:12,cursor:"pointer",fontWeight:700,fontSize:13,background:on?`rgba(${rgbA},0.15)`:T.card,color:on?colorA:T.sub,border:`1px solid ${on?colorA+"55":T.border}`,transition:"all 0.15s",boxShadow:on?`0 3px 12px rgba(${rgbA},0.15)`:"none"}),
    main:{flex:1,minWidth:0},
    card:{background:T.card,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderRadius:18,border:`1px solid ${T.border}`,padding:isDesktop?"20px":"16px",marginBottom:12,boxShadow:theme==="light"?"0 4px 20px rgba(99,102,241,0.08)":"0 4px 20px rgba(0,0,0,0.2)"},
    sec:{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:T.sub,marginBottom:9},
    row:{display:"flex",gap:7,flexWrap:"wrap"},
    inp:{background:T.input,border:`1px solid ${T.inputBorder}`,borderRadius:11,padding:"10px 13px",color:T.inputText,fontSize:14,fontWeight:600,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"},
    inpLbl:{fontSize:11,color:T.sub,marginBottom:3,fontWeight:600},
    calHdr:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12},
    mTitle:{fontSize:isDesktop?22:19,fontWeight:900,color:T.text,letterSpacing:"-0.5px"},
    grid:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3},
    dHdr:{textAlign:"center",fontSize:10,fontWeight:700,color:T.sub,paddingBottom:5},
    cell:(d,sel)=>{
      if(!d)return{height:44,borderRadius:9};
      const bg=d.isToday
        ?`rgba(${rgbA},0.35)`
        :d.isA?`rgba(${rgbA},0.18)`:`rgba(${rgbB},0.18)`;
      return{height:44,borderRadius:9,background:bg,cursor:"pointer",position:"relative",
        border:`2px solid ${sel?"rgba(255,255,255,0.6)":d.v?"rgba(217,119,6,0.4)":d.special&&(d.special.type==="mere"||d.special.type==="pere")?`${d.special.color}55`:"transparent"}`,
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        transition:"all 0.12s",overflow:"hidden",
        boxShadow:sel?`0 0 0 2px rgba(255,255,255,0.2),0 4px 12px rgba(${d.isA?rgbA:rgbB},0.25)`:d.isToday?`0 4px 14px rgba(${rgbA},0.35)`:"none"};
    },
    panel:{background:T.card,borderRadius:13,border:`1px solid ${T.border}`,padding:"13px 14px",marginTop:10,boxShadow:theme==="light"?"0 4px 16px rgba(99,102,241,0.08)":"0 4px 14px rgba(0,0,0,0.2)"},
    statsBar:{marginTop:11,background:theme==="light"?"rgba(0,0,0,0.07)":"rgba(0,0,0,0.2)",borderRadius:7,overflow:"hidden",height:7,display:"flex"},
    statsRow:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginTop:9},
    statBox:c=>({background:`rgba(${h2r(c)},0.1)`,border:`1px solid rgba(${h2r(c)},0.2)`,borderRadius:12,padding:"12px",textAlign:"center",boxShadow:`0 3px 10px rgba(${h2r(c)},0.08)`}),
    badge:c=>({padding:"3px 8px",borderRadius:20,fontSize:11,fontWeight:700,background:`rgba(${h2r(c)},0.15)`,color:c,border:`1px solid rgba(${h2r(c)},0.25)`}),
    evtLine:c=>({display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.border}`}),
    modal:{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:500},
    mCard:{background:T.bg,border:`1px solid ${T.border}`,borderRadius:"22px 22px 0 0",padding:"22px 20px 44px",width:"100%",maxWidth:460,boxShadow:"0 -8px 28px rgba(0,0,0,0.35)"},
    navBar:{position:"fixed",bottom:0,left:0,right:0,background:T.navBg,backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,display:isDesktop?"none":"flex",justifyContent:"space-around",padding:"10px 0 calc(10px + env(safe-area-inset-bottom))",zIndex:300},
    navItem:on=>({display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",color:on?colorA:T.sub,fontSize:10,fontWeight:700,transition:"all 0.15s",transform:on?"translateY(-2px)":"none",padding:"4px 18px",borderRadius:11,background:on?`rgba(${rgbA},0.1)`:"transparent"}),
    disc:{background:theme==="light"?"rgba(217,119,6,0.08)":"rgba(217,119,6,0.07)",border:"1px solid rgba(217,119,6,0.18)",borderRadius:10,padding:"8px 12px",fontSize:11,color:theme==="light"?"rgba(120,60,0,0.85)":"rgba(251,191,36,0.75)",textAlign:"center",marginBottom:11,lineHeight:1.5,fontWeight:600},
    vacItem:now=>({display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 10px",borderRadius:9,background:now?`rgba(217,119,6,0.09)`:"transparent",border:now?"1px solid rgba(217,119,6,0.25)":`1px solid ${T.border}`,marginBottom:4}),
    cdown:{background:`rgba(${rgbA},0.09)`,border:`1px solid rgba(${rgbA},0.2)`,borderRadius:15,padding:"13px 15px",marginBottom:11,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:`0 4px 14px rgba(${rgbA},0.1)`},
  };

  function ViewCal(){return(<>
    {avion&&<div style={{background:"rgba(37,99,235,0.1)",border:"1px solid rgba(37,99,235,0.25)",borderRadius:10,padding:"8px 14px",marginBottom:11,fontSize:12,color:theme==="light"?"#1d4ed8":"rgba(147,197,253,0.9)",textAlign:"center",fontWeight:600}}>✈️ Mode avion activé — Notifications désactivées</div>}
    <div style={S.disc}>{L.disc}</div>

    {/* Compte à rebours */}
    {cntd&&<div style={S.cdown}>
      <div>
        <div style={{fontSize:10,fontWeight:700,color:T.sub,textTransform:"uppercase",letterSpacing:1}}>{L.countdown}</div>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginTop:2}}>→ <strong style={{color:cntd.parent===pA?colorA:colorB}}>{cntd.parent}</strong> · {cntd.date.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"})} à {cntd.parent===pA?heureA:heureB}</div>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:34,fontWeight:900,lineHeight:1,color:cntd.parent===pA?colorA:colorB}}>{cntd.days}</div>
        <div style={{fontSize:11,color:T.sub,fontWeight:600}}>{L.jours}</div>
      </div>
    </div>}

    {/* Analyse IA locale */}
    <div style={S.card}>
      <div style={S.sec}>{L.jugTitle}</div>
      <div style={{fontSize:12,color:T.sub,marginBottom:8,lineHeight:1.5}}>{L.jugSub}</div>
      <textarea style={{...S.inp,height:90,resize:"none",lineHeight:1.5,marginBottom:8}} value={jugText} onChange={e=>setJugText(e.target.value)} placeholder={L.jugPlh}/>
      <Btn color="#8b5cf6" onClick={analyzeJugement} disabled={!jugText.trim()}>{L.jugBtn}</Btn>
      {aiResult&&<div style={{background:"rgba(16,185,129,0.09)",border:"1px solid rgba(16,185,129,0.22)",borderRadius:10,padding:"10px 12px",fontSize:12,color:theme==="light"?"#065f46":"rgba(200,255,220,0.85)",marginTop:8}}>
        <div style={{fontWeight:800,marginBottom:3}}>✅ Calendrier configuré</div>
        <div>Mode : {aiResult.mode} · {aiResult.notes}</div>
        <div style={{marginTop:4,fontSize:11,opacity:0.7}}>⚠️ Vérifiez que cela correspond à votre jugement.</div>
      </div>}
    </div>
    
    

{/* Config parents & mode de garde */}
<CustodyConfigCard
  S={S}
  L={L}
  T={T}
  pA={pA}
  pB={pB}
  setPa={setPa}
  setPb={setPb}
  heureA={heureA}
  heureB={heureB}
  setHeureA={setHeureA}
  setHeureB={setHeureB}
  mode={mode}
  setMode={setMode}
  paireA={paireA}
  setPaireA={setPaireA}
  semPaireA={semPaireA}
  setSemPaireA={setSemPaireA}
  annePaireA={annePaireA}
  setAnnePaireA={setAnnePaireA}
  joursA={joursA}
  setJoursA={setJoursA}
  colorA={colorA}
  colorB={colorB}
  getWN={getWN}
  year={year}
  pays={pays}
  setPays={setPays}
  zone={zone}
  setZone={setZone}
  PAYS_LIST={PAYS_LIST}
  VACANCES_PAR_PAYS={VACANCES_PAR_PAYS}
  zonesDisponibles={zonesDisponibles}
  zoneLabels={zoneLabels}
  anneeSco={anneeSco}
  getPaques={getPaques}
  vacAlt={vacAlt}
  setVacAlt={setVacAlt}
  showFeries={showFeries}
  setShowFeries={setShowFeries}
  Pill={Pill}
  Tog={Tog}
/>

      {/* 4 modes de garde */}
      <div style={{...S.row,marginBottom:10}}>
        <Pill active={mode==="alternee"} color="#8b5cf6" onClick={()=>setMode("alternee")}>{L.alternee}</Pill>
        <Pill active={mode==="classique"} color="#8b5cf6" onClick={()=>setMode("classique")}>{L.classique}</Pill>
        <Pill active={mode==="annee"} color="#8b5cf6" onClick={()=>setMode("annee")}>{L.annee}</Pill>
        <Pill active={mode==="personnalise"} color="#8b5cf6" onClick={()=>setMode("personnalise")}>{L.perso}</Pill>
      </div>

      {/* Options selon le mode */}
      {mode==="alternee"&&(
        <div style={{...S.row,marginBottom:10}}>
          <Pill active={paireA} color={colorA} onClick={()=>setPaireA(true)}>S{L.paire} → {pA}</Pill>
          <Pill active={!paireA} color={colorB} onClick={()=>setPaireA(false)}>S{L.paire} → {pB}</Pill>
        </div>
      )}

      {mode==="classique"&&(
        <div style={{marginBottom:10}}>
          {/* Semaines paires/impaires pour les week-ends */}
          <div style={{marginBottom:10}}>
            <div style={S.inpLbl}>🗓️ Week-ends — Semaines paires</div>
            <div style={S.row}>
              <Pill active={semPaireA} color={colorA} onClick={()=>setSemPaireA(true)}>S{L.paire} → {pA||"A"}</Pill>
              <Pill active={!semPaireA} color={colorB} onClick={()=>setSemPaireA(false)}>S{L.paire} → {pB||"B"}</Pill>
            </div>
            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Semaine actuelle : S{getWN(new Date())} ({getWN(new Date())%2===0?"paire":"impaire"}) → WE chez <strong style={{color:getWN(new Date())%2===0?(semPaireA?colorA:colorB):(semPaireA?colorB:colorA)}}>{getWN(new Date())%2===0?(semPaireA?pA:pB):(semPaireA?pB:pA)}</strong>
            </div>
          </div>
          {/* Années paires/impaires pour les vacances longues */}
          <div style={{marginBottom:10}}>
            <div style={S.inpLbl}>📆 Vacances & grandes périodes — Années paires</div>
            <div style={S.row}>
              <Pill active={annePaireA} color={colorA} onClick={()=>setAnnePaireA(true)}>A{L.paire} → {pA||"A"}</Pill>
              <Pill active={!annePaireA} color={colorB} onClick={()=>setAnnePaireA(false)}>A{L.paire} → {pB||"B"}</Pill>
            </div>
            <div style={{fontSize:11,color:T.sub,marginTop:5}}>
              Cette année {new Date().getFullYear()} = {new Date().getFullYear()%2===0?"paire":"impaire"} → Vacances chez <strong style={{color:new Date().getFullYear()%2===0?(annePaireA?colorA:colorB):(annePaireA?colorB:colorA)}}>{new Date().getFullYear()%2===0?(annePaireA?pA:pB):(annePaireA?pB:pA)}</strong>
            </div>
          </div>
          {/* Résumé du mode classique */}
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

      {mode==="annee"&&(
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

      {mode==="personnalise"&&(
        <div style={{marginBottom:10}}>
          <div style={S.inpLbl}>{L.joursA} ({pA})</div>
          <div style={S.row}>
            {L.joursSemaine.map((j,i)=>(
              <Pill key={i} active={joursA.includes(i+1)} color={colorA} onClick={()=>setJoursA(prev=>prev.includes(i+1)?prev.filter(x=>x!==i+1):[...prev,i+1].sort())}>{j}</Pill>
            ))}
          </div>
          <div style={{fontSize:11,color:T.sub,marginTop:5}}>Les autres jours → {pB}</div>
        </div>
      )}

      {/* Sélecteur de pays */}
      <div style={{marginBottom:10}}>
        <div style={S.inpLbl}>🌍 Pays</div>
        <div style={{...S.row,gap:6}}>
          {PAYS_LIST.map(p=>(
            <Pill key={p.id} active={pays===p.id} color="#10b981" onClick={()=>{setPays(p.id);const zones=VACANCES_PAR_PAYS[p.id]?.zones||["A"];setZone(zones[0]);}}>
              {p.flag} {p.label}
            </Pill>
          ))}
        </div>
      </div>
      {/* Zones selon le pays */}
      {zonesDisponibles.length>1&&<div style={{marginBottom:10}}>
        <div style={S.inpLbl}>{pays==="france"?"Zone scolaire":"Région / Zone"}</div>
        <div style={S.row}>
          {zonesDisponibles.map(z=><Pill key={z} active={zone===z} color="#10b981" onClick={()=>setZone(z)}>{pays==="france"?`Zone ${z}`:z}</Pill>)}
        </div>
        {zoneLabels[zone]&&<div style={{fontSize:11,color:T.sub,marginTop:4}}>📍 {zoneLabels[zone]}</div>}
      </div>}
      <div style={{fontSize:11,color:T.sub,marginBottom:9}}>📚 {anneeSco}-{anneeSco+1} · 🐣 Pâques {year} : {getPaques(year).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}</div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap"}}>
        <Tog on={vacAlt} onChange={()=>setVacAlt(v=>!v)} label="Vacances alternées" color="#8b5cf6" T={T}/>
      

    {/* Calendrier */}
    <div style={S.card}>
      <div style={S.calHdr}>
        <Btn onClick={()=>{if(month===0){setMonth(11);setYear(y=>y-1);}else setMonth(m=>m-1)}} color="#6366f1" size="lg">‹</Btn>
        <div style={S.mTitle}>{MOIS[month]} {year}</div>
        <Btn onClick={()=>{if(month===11){setMonth(0);setYear(y=>y+1);}else setMonth(m=>m+1)}} color="#6366f1" size="lg">›</Btn>
      </div>
      <div style={S.grid}>
        {JOURS.map(j=><div key={j} style={S.dHdr}>{j}</div>)}
        {cells.map((day,i)=>{
          const d=day?getCellData(day):null;const sel=selDay===day;
          const ec=(d?.evts||[]).map(e=>EVT_COLORS[EVT_IDS.indexOf(e.type)]||"#8b5cf6");
          return(
            <div key={i} style={S.cell(d,sel)} onClick={()=>day&&setSelDay(sel?null:day)}>
              {day&&<>
                <span style={{fontSize:12,fontWeight:d?.isToday?900:600,color:d?.isToday?"#fff":T.text,lineHeight:1}}>{day}</span>
                <span style={{position:"absolute",top:1,right:2,fontSize:7,color:T.sub,fontWeight:700}}>S{d.wn}</span>
                {d.v&&<div style={{width:4,height:4,borderRadius:"50%",background:"#d97706",marginTop:1}}/>}
                {d.special&&showFeries&&!d.v&&<div style={{width:4,height:4,borderRadius:"50%",background:d.special.color,marginTop:1}}/>}
                {!d.v&&!d.special&&ec.length>0&&<div style={{display:"flex",gap:1.5,marginTop:1}}>{ec.slice(0,3).map((c,ci)=><div key={ci} style={{width:3.5,height:3.5,borderRadius:"50%",background:c}}/>)}</div>}
                {d.special?.type==="mere"&&<div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:"#db2777",borderRadius:"9px 9px 0 0"}}/>}
                {d.special?.type==="pere"&&<div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:"#2563eb",borderRadius:"9px 9px 0 0"}}/>}
                {d.special?.type==="ferie"&&showFeries&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"#d97706"}}/>}
                {d.note&&<div style={{position:"absolute",bottom:1,right:2,fontSize:6,opacity:0.5}}>📝</div>}
              </>}
            </div>
          );
        })}
      </div>
      {/* Légende */}
      <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
        {[[colorA,pA],[colorB,pB],["#d97706","Vac."],["#db2777","Mères"],["#2563eb","Pères"]].map(([c,l])=>(
          <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:T.sub}}>
            <div style={{width:9,height:9,borderRadius:3,background:c}}/><span style={{fontWeight:600}}>{l}</span>
          </div>
        ))}
      </div>

      {/* Panneau jour */}
      {selDay&&selData&&<div style={S.panel}>
        <div style={{fontWeight:900,fontSize:14,marginBottom:5,color:T.text}}>
          📅 {selDay} {MOIS[month]} {year}
          <span style={{fontSize:11,color:T.sub,marginLeft:7}}>S{selData.wn} · S{selData.wn%2===0?L.paire:L.impaire}</span>
        </div>
        <div style={{marginBottom:7,fontSize:13,color:T.text}}>
          {L.garde} : <strong style={{color:selData.isA?colorA:colorB}}>{selData.par}</strong>
          {" · "}{selData.isA?heureA:heureB}
          {selData.v&&<span style={{marginLeft:6,color:"#d97706",fontSize:11}}>🌴 {selData.v.nom}</span>}
          {selData.special&&showFeries&&<span style={{marginLeft:6,fontSize:11,color:selData.special.color}}>{selData.special.label}</span>}
        </div>
        {selData.evts.map(e=>{const idx=EVT_IDS.indexOf(e.type);const c=EVT_COLORS[idx]||"#8b5cf6";return(
          <div
  key={e.id}
  style={S.evtLine(c)}
  onClick={() => {
    setEditingEvent({ ...e, key: selData.key });
    setNewEvt({
      type: e.type || "rdv",
      titre: e.titre || "",
      heure: e.heure || "",
      shared: e.shared ?? true,
    });
    setModal("event");
  }}
>
            <div style={{width:3,height:28,borderRadius:2,background:c,flexShrink:0}}/>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,color:T.text}}>{e.titre}</div><div style={{fontSize:11,color:T.sub,display:"flex",gap:5}}>{e.heure&&<span>🕐{e.heure}</span>}<span style={S.badge(e.shared?colorA:"#6b7280")}>{e.shared?L.shared:L.prive}</span></div></div>
            <button onClick={(event)=>{
  event.stopPropagation();
  delEvent(selData.key,e.id);
}} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:16}}>×</button>
          </div>
        );})}
        {selData.note&&<div style={{marginTop:7,background:`rgba(128,128,128,0.08)`,borderRadius:8,padding:"7px 9px",fontSize:12,color:T.sub}}>🔒 {selData.note}</div>}
        <div style={{display:"flex",gap:8,marginTop:11,flexWrap:"wrap"}}>
          <Btn color={colorA} size="lg" onClick={()=>setModal("event")}>{L.add}</Btn>
          <Btn color="#10b981" size="lg" onClick={()=>{setNewNote(notes[selData.key]||"");setModal("note");}}>{L.note}</Btn>
        </div>
      </div>}

      {/* Stats */}
      <div style={S.statsBar}><div style={{width:`${pct}%`,background:colorA,transition:"width 0.4s"}}/><div style={{flex:1,background:colorB}}/></div>
      <div style={S.statsRow}>
        <div style={S.statBox(colorA)}><div style={{fontSize:28,fontWeight:900,color:colorA}}>{stA}</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>jours {pA}</div></div>
        <div style={S.statBox(colorB)}><div style={{fontSize:28,fontWeight:900,color:colorB}}>{stB}</div><div style={{fontSize:11,color:T.sub,marginTop:2}}>jours {pB}</div></div>
      </div>
    </div>

 {/* Vacances */}
<UpcomingVacationsCard
  S={S}
  L={L}
  T={T}
  vac={vac}
  zone={zone}
  today={today}
  vacAlt={vacAlt}
  pA={pA}
  pB={pB}
  colorA={colorA}
  colorB={colorB}
  anneeSco={anneeSco}
/>

 {/* Jours spéciaux */}
<SpecialDaysCard
  S={S}
  L={L}
  T={T}
  showFeries={showFeries}
  prochSpec={prochSpec}
  fm={fm}
  fp={fp}
  sd={sd}
  getParent={getParent}
  cfg={cfg}
  vac={vac}
  pA={pA}
  colorA={colorA}
  colorB={colorB}
/>

      {/* Checklist */}
    <ChecklistCard
      S={S}
      L={L}
      T={T}
      checklist={checklist}
      setChecklist={setChecklist}
      colorA={colorA}
      rgbA={rgbA}
    />

    {/* Contacts */}
    <ContactsCard
      S={S}
      L={L}
      T={T}
      contacts={contacts}
      setContacts={setContacts}
    />
</div>
  </>);
}

  


  return(
    <div style={S.app}>
      {/* Header */}
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:8,fontWeight:900,fontSize:isDesktop?20:17,letterSpacing:"-0.5px",color:T.text}}>
          <div style={{width:34,height:34,background:`rgba(${rgbA},0.18)`,border:`1.5px solid rgba(${rgbA},0.32)`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,boxShadow:`0 3px 10px rgba(${rgbA},0.18)`,flexShrink:0}}>👨‍👧</div>
          <span style={{background:'linear-gradient(135deg,#4F8EF7,#FF6B6B)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>{APP}</span>
          {avion&&<span style={{fontSize:14}}>✈️</span>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button
  onClick={() => {
    if (isLoggedIn) {
      logout();
    } else {
      setShowAuth(true);
    }
  }}
  style={{
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    color: T.text,
    fontWeight: 800,
    fontSize: 12,
    cursor: "pointer",
  }}
>
  {isLoggedIn ? "Déconnexion" : "Connexion"}
</button>
          {isDesktop&&<div style={{display:"flex",gap:6}}>{[["fr","🇫🇷"],["es","🇪🇸"],["en","🇬🇧"]].map(([l,f])=><div key={l} onClick={()=>setLang(l)} style={{fontSize:18,cursor:"pointer",opacity:lang===l?1:0.25,transition:"opacity 0.15s"}}>{f}</div>)}</div>}
          <div onClick={()=>setAvion(v=>!v)} style={{width:30,height:30,borderRadius:8,background:avion?`rgba(37,99,235,0.2)`:T.card,border:`1px solid ${avion?"rgba(37,99,235,0.4)":T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}} title="Mode avion">✈️</div>
          <div onClick={()=>{const ts=Object.keys(THEMES);const ci=ts.indexOf(theme);setTheme(ts[(ci+1)%ts.length]);}} style={{width:30,height:30,borderRadius:8,background:T.card,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14}}>
            {theme==="dark"?"🌙":theme==="light"?"☀️":theme==="eco"?"🌿":theme==="zen"?"💜":theme==="ocean"?"🌊":"🌸"}
          </div>
          <span style={{fontSize:10,color:T.sub,fontWeight:700}}>v9</span>
        </div>
      </div>

      {/* Layout */}
      <div style={S.layout}>
        {isDesktop&&<div style={S.sidebar}>
          <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:T.sub,padding:"0 6px 5px"}}>Navigation</div>
          {TABS.map((label,i)=><div key={i} style={S.sideItem(tab===i)} onClick={()=>setTab(i)}><span style={{fontSize:18}}>{ICONS[i]}</span><span>{label}</span></div>)}
          <div style={{marginTop:11,padding:"0 6px"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:T.sub,marginBottom:7}}>Thème</div>
            <div style={S.row}>
              {Object.entries(THEMES).map(([key,th])=><div key={key} onClick={()=>setTheme(key)} style={{fontSize:18,cursor:"pointer",opacity:theme===key?1:0.3,transition:"opacity 0.15s"}}>{th.name.split(" ")[0]}</div>)}
            </div>
          </div>
          <div style={{marginTop:10,padding:"0 6px"}}>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.2px",textTransform:"uppercase",color:T.sub,marginBottom:7}}>Couleurs</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
              {PALETTES.map((p,i)=><div key={i} onClick={()=>{setPalIdx(i);setColorA(p.a);setColorB(p.b);}} style={{height:20,borderRadius:6,display:"flex",overflow:"hidden",cursor:"pointer",border:palIdx===i?"2px solid #fff":"2px solid transparent",transition:"all 0.14s"}}><div style={{flex:1,background:p.a}}/><div style={{flex:1,background:p.b}}/></div>)}
            </div>
          </div>
          <div style={{marginTop:10,padding:"8px 10px",background:`rgba(217,119,6,0.06)`,borderRadius:9,border:`1px solid rgba(217,119,6,0.13)`,fontSize:10,color:`rgba(217,119,6,0.7)`,lineHeight:1.5,fontWeight:600}}>{L.disc}</div>
        </div>}
<div style={S.main}>
  {[
    <ViewCalExternal
      S={S}
      L={L}
      T={T}
      month={month}
      year={year}
      setMonth={setMonth}
      setYear={setYear}
      MOIS={MOIS}
      cells={cells}
      getCellData={getCellData}
      colorA={colorA}
      colorB={colorB}
      events={events}
      notes={notes}
      pA={pA}
      pB={pB}
      setPa={setPa}
      setPb={setPb}
      heureA={heureA}
      heureB={heureB}
      setHeureA={setHeureA}
      setHeureB={setHeureB}
      mode={mode}
      setMode={setMode}
      paireA={paireA}
      setPaireA={setPaireA}
      semPaireA={semPaireA}
      setSemPaireA={setSemPaireA}
      annePaireA={annePaireA}
      setAnnePaireA={setAnnePaireA}
      joursA={joursA}
      setJoursA={setJoursA}
      getWN={getWN}
      pays={pays}
      setPays={setPays}
      zone={zone}
      setZone={setZone}
      PAYS_LIST={PAYS_LIST}
      VACANCES_PAR_PAYS={VACANCES_PAR_PAYS}
      zonesDisponibles={zonesDisponibles}
      zoneLabels={zoneLabels}
      anneeSco={anneeSco}
      getPaques={getPaques}
      vacAlt={vacAlt}
      setVacAlt={setVacAlt}
      showFeries={showFeries}
      setShowFeries={setShowFeries}
      setSelDay={setSelDay}
      setModal={setModal}
      setNewNote={setNewNote}
      checklist={checklist}
      setChecklist={setChecklist}
      contacts={contacts}
      setContacts={setContacts}
      rgbA={rgbA}
      vac={vac}
      today={today}
      prochSpec={prochSpec}
      fm={fm}
      fp={fp}
      sd={sd}
      getParent={getParent}
      cfg={cfg}
      Pill={Pill}
      Tog={Tog}
      Btn={Btn}
    />,

    <ViewEvents
      S={S}
      TABS={TABS}
      L={L}
      upEvts={upEvts}
      EVT_IDS={EVT_IDS}
      EVT_COLORS={EVT_COLORS}
      getParent={getParent}
      cfg={cfg}
      vac={vac}
      pA={pA}
      colorA={colorA}
      colorB={colorB}
      T={T}
      delEvent={delEvent}
    />,

    <ViewAnnuel
      S={S}
      TABS={TABS}
      year={year}
      setYear={setYear}
      T={T}
      anneeSco={anneeSco}
      getPaques={getPaques}
      fm={fm}
      fp={fp}
      dim={dim}
      fdow={fdow}
      sd={sd}
      today={today}
      getParent={getParent}
      cfg={cfg}
      vac={vac}
      pA={pA}
      rgbA={rgbA}
      rgbB={rgbB}
      colorA={colorA}
      colorB={colorB}
      MOISC={MOISC}
    />,

    <ViewSettings
      S={S}
      L={L}
      T={T}
      THEMES={THEMES}
      PALETTES={PALETTES}
      theme={theme}
      setTheme={setTheme}
      colorA={colorA}
      colorB={colorB}
      setColorA={setColorA}
      setColorB={setColorB}
      palIdx={palIdx}
      setPalIdx={setPalIdx}
      pA={pA}
      pB={pB}
      rgbA={rgbA}
      h2r={h2r}
      avion={avion}
      setAvion={setAvion}
      notifEnabled={notifEnabled}
      setNotifEnabled={setNotifEnabled}
      notifHour={notifHour}
      setNotifHour={setNotifHour}
      SOCIAL={SOCIAL}
      APP={APP}
      premium={premium}
      setShowDoc={setShowDoc}
      exportJSON={exportJSON}
      exportCSV={exportCSV}
      deleteAll={deleteAll}
      Tog={Tog}
      Pill={Pill}
      Btn={Btn}
      EMAIL={EMAIL}
      RESP={RESP}
      VER={VER}
    />,
  ][tab]}
</div>

</div>
    

      {/* Nav mobile */}
      <div style={S.navBar}>
        {TABS.map((label,i)=><div key={i} style={S.navItem(tab===i)} onClick={()=>setTab(i)}><span style={{fontSize:22}}>{ICONS[i]}</span><span>{label}</span></div>)}
      </div>

{/* Modal événement */}
{modal==="event"&&selDay&&(
  <EventModal
    S={S}
    T={T}
    selDay={selDay}
    month={month}
    MOIS={MOIS}
    newEvt={newEvt}
    setNewEvt={setNewEvt}
    addEvent={addEvent}
    editingEvent={editingEvent}
    setEditingEvent={setEditingEvent}
    setModal={setModal}
    colorA={colorA}
    EVT_IDS={EVT_IDS}
    EVT_COLORS={EVT_COLORS}
    L={L}
  />
)}

{/* Modal note */}
{modal==="note"&&selDay&&(
  <NoteModal
    S={S}
    T={T}
    selDay={selDay}
    month={month}
    MOIS={MOIS}
    newNote={newNote}
    setNewNote={setNewNote}
    saveNote={saveNote}
    deleteNote={deleteNote}
    notes={notes}
    dk={dk}
    year={year}
    L={L}
    setModal={setModal}
  />
)}
 
      {/* Modals légaux */}
      {showDoc&&<div style={S.modal} onClick={e=>e.target===e.currentTarget&&setShowDoc(null)}>
        <div style={{...S.mCard,maxHeight:"85vh",overflow:"auto"}}>
          <div style={{fontWeight:900,fontSize:16,marginBottom:14,color:T.text}}>
            {showDoc==="cgu"?"CGU":showDoc==="cgv"?"CGV":showDoc==="ml"?"Mentions Légales":"Politique de Confidentialité"}
          </div>
          <pre style={{fontSize:11,color:T.sub,lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{showDoc==="cgu"?CGU:showDoc==="cgv"?CGV:showDoc==="ml"?ML:PC}</pre>
          <div style={{marginTop:16}}><Btn color="#6366f1" size="lg" full onClick={()=>setShowDoc(null)}>Fermer</Btn></div>
        </div>
      </div>}
    </div>
  );
}
