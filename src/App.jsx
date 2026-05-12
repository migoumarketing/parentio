import { useState, useEffect, useRef } from "react";
import Btn from "./components/Btn";
import NoteModal from "./components/NoteModal";
import AuthForm from "./components/AuthForm";
import { useAuth } from "./hooks/useAuth";
import { useEvents } from "./hooks/useEvents";
import { useNotes } from "./hooks/useNotes";
// ─── CALCULS AUTO ─────────────────────────────────────────────────────────────
function getPaques(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31)-1,day=((h+l-7*m+114)%31)+1;return new Date(y,month,day);}
function getFeries(y){const p=getPaques(y),lp=new Date(p),asc=new Date(p),pent=new Date(p);lp.setDate(p.getDate()+1);asc.setDate(p.getDate()+39);pent.setDate(p.getDate()+50);return[{date:new Date(y,0,1),nom:"Jour de l'An 🎆"},{date:lp,nom:"Lundi de Pâques 🐣"},{date:new Date(y,4,1),nom:"Fête du Travail 🌹"},{date:new Date(y,4,8),nom:"Victoire 1945 🕊️"},{date:asc,nom:"Ascension ✝️"},{date:pent,nom:"Pentecôte 🕊️"},{date:new Date(y,6,14),nom:"Fête Nationale 🇫🇷"},{date:new Date(y,7,15),nom:"Assomption 🌸"},{date:new Date(y,10,1),nom:"Toussaint 🕯️"},{date:new Date(y,10,11),nom:"Armistice 🎖️"},{date:new Date(y,11,25),nom:"Noël 🎄"}];}
function getFeteMeres(y){const p=getPaques(y),pent=new Date(p);pent.setDate(p.getDate()+49);let d=new Date(y,4,31);while(d.getDay()!==0)d.setDate(d.getDate()-1);if(d.toDateString()===pent.toDateString()){d=new Date(y,5,1);while(d.getDay()!==0)d.setDate(d.getDate()+1);}return d;}
function getFetePeres(y){let count=0,d=new Date(y,5,1);while(count<3){if(d.getDay()===0)count++;if(count<3)d.setDate(d.getDate()+1);}return d;}

// ─── VACANCES PAR PAYS ────────────────────────────────────────────────────────
const VACANCES_PAR_PAYS = {
  // ── FRANCE ──────────────────────────────────────────────────────────────────
  france: {
    zones: ["A","B","C"],
    zoneLabels: {
      A:"Zone A — Lyon, Bordeaux, Grenoble, Dijon, Clermont, Limoges",
      B:"Zone B — Paris, Versailles, Créteil, Toulouse, Montpellier",
      C:"Zone C — Aix-Marseille, Amiens, Caen, Lille, Nantes, Nice, Rennes",
    },
    data: {
      2025:{
        A:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,14),fin:new Date(2026,2,2)},{nom:"Printemps",debut:new Date(2026,3,11),fin:new Date(2026,3,27)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
        B:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,7),fin:new Date(2026,1,23)},{nom:"Printemps",debut:new Date(2026,3,4),fin:new Date(2026,3,20)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
        C:[{nom:"Toussaint",debut:new Date(2025,9,18),fin:new Date(2025,10,3)},{nom:"Noël",debut:new Date(2025,11,20),fin:new Date(2026,0,5)},{nom:"Hiver",debut:new Date(2026,1,21),fin:new Date(2026,2,9)},{nom:"Printemps",debut:new Date(2026,3,18),fin:new Date(2026,4,4)},{nom:"Été",debut:new Date(2026,6,4),fin:new Date(2026,8,31)}],
      },
      2026:{
        A:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,13),fin:new Date(2027,2,1)},{nom:"Printemps",debut:new Date(2027,3,10),fin:new Date(2027,3,26)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
        B:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,6),fin:new Date(2027,1,22)},{nom:"Printemps",debut:new Date(2027,3,3),fin:new Date(2027,3,19)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
        C:[{nom:"Toussaint",debut:new Date(2026,9,17),fin:new Date(2026,10,2)},{nom:"Noël",debut:new Date(2026,11,19),fin:new Date(2027,0,4)},{nom:"Hiver",debut:new Date(2027,1,20),fin:new Date(2027,2,8)},{nom:"Printemps",debut:new Date(2027,3,17),fin:new Date(2027,4,3)},{nom:"Été",debut:new Date(2027,6,3),fin:new Date(2027,8,31)}],
      },
    },
  },
  // ── ESPAGNE ──────────────────────────────────────────────────────────────────
  espagne: {
    zones: ["Nacional"],
    zoneLabels: { Nacional:"España — Nacional (dates communes)" },
    data: {
      2025:{
        Nacional:[
          {nom:"Navidad",debut:new Date(2025,11,22),fin:new Date(2026,0,7)},
          {nom:"Semana Santa",debut:new Date(2026,2,29),fin:new Date(2026,3,5)},
          {nom:"Verano",debut:new Date(2026,5,22),fin:new Date(2026,8,8)},
        ],
      },
      2026:{
        Nacional:[
          {nom:"Navidad",debut:new Date(2026,11,22),fin:new Date(2027,0,7)},
          {nom:"Semana Santa",debut:new Date(2027,2,28),fin:new Date(2027,3,4)},
          {nom:"Verano",debut:new Date(2027,5,21),fin:new Date(2027,8,14)},
        ],
      },
    },
  },
  // ── ÉQUATEUR ─────────────────────────────────────────────────────────────────
  equateur: {
    zones: ["Sierra-Amazonía","Costa-Galápagos"],
    zoneLabels: {
      "Sierra-Amazonía":"Sierra y Amazonía (Quito, Cuenca, Loja...)",
      "Costa-Galápagos":"Costa y Galápagos (Guayaquil, Manta...)",
    },
    data: {
      2025:{
        "Sierra-Amazonía":[
          {nom:"Navidad",debut:new Date(2025,11,26),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,17)},
          {nom:"Vacaciones",debut:new Date(2026,5,29),fin:new Date(2026,8,10)},
        ],
        "Costa-Galápagos":[
          {nom:"Navidad",debut:new Date(2025,11,26),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,17)},
          {nom:"Fin año lectivo",debut:new Date(2026,1,26),fin:new Date(2026,3,12)},
        ],
      },
    },
  },
  // ── COLOMBIE ─────────────────────────────────────────────────────────────────
  colombie: {
    zones: ["Calendario A"],
    zoneLabels: { "Calendario A":"Colombia — Calendario A (colegios oficiales)" },
    data: {
      2025:{
        "Calendario A":[
          {nom:"Semana Santa",debut:new Date(2026,2,30),fin:new Date(2026,3,5)},
          {nom:"Mitad de año",debut:new Date(2026,5,22),fin:new Date(2026,6,6)},
          {nom:"Semana de receso",debut:new Date(2026,9,5),fin:new Date(2026,9,12)},
          {nom:"Fin de año",debut:new Date(2026,11,1),fin:new Date(2027,0,25)},
        ],
      },
    },
  },
  // ── BELGIQUE ─────────────────────────────────────────────────────────────────
  belgique: {
    zones: ["Fédération W-B"],
    zoneLabels: { "Fédération W-B":"Belgique — Fédération Wallonie-Bruxelles" },
    data: {
      2025:{
        "Fédération W-B":[
          {nom:"Toussaint",debut:new Date(2025,9,27),fin:new Date(2025,10,2)},
          {nom:"Noël",debut:new Date(2025,11,22),fin:new Date(2026,0,4)},
          {nom:"Carnaval",debut:new Date(2026,1,16),fin:new Date(2026,1,22)},
          {nom:"Pâques",debut:new Date(2026,3,6),fin:new Date(2026,3,19)},
          {nom:"Été",debut:new Date(2026,6,1),fin:new Date(2026,8,31)},
        ],
      },
    },
  },
  // ── UK ────────────────────────────────────────────────────────────────────────
  uk: {
    zones: ["England & Wales"],
    zoneLabels: { "England & Wales":"United Kingdom — England & Wales" },
    data: {
      2025:{
        "England & Wales":[
          {nom:"Half Term",debut:new Date(2025,9,27),fin:new Date(2025,10,2)},
          {nom:"Christmas",debut:new Date(2025,11,20),fin:new Date(2026,0,4)},
          {nom:"Half Term",debut:new Date(2026,1,16),fin:new Date(2026,1,22)},
          {nom:"Easter",debut:new Date(2026,3,3),fin:new Date(2026,3,19)},
          {nom:"Half Term",debut:new Date(2026,4,25),fin:new Date(2026,5,1)},
          {nom:"Summer",debut:new Date(2026,6,22),fin:new Date(2026,8,1)},
        ],
      },
    },
  },
  // ── USA ───────────────────────────────────────────────────────────────────────
  usa: {
    zones: ["General"],
    zoneLabels: { General:"United States — General (varies by state)" },
    data: {
      2025:{
        General:[
          {nom:"Thanksgiving Break",debut:new Date(2025,10,24),fin:new Date(2025,10,30)},
          {nom:"Winter Break",debut:new Date(2025,11,20),fin:new Date(2026,0,4)},
          {nom:"Spring Break",debut:new Date(2026,2,23),fin:new Date(2026,3,5)},
          {nom:"Summer",debut:new Date(2026,5,15),fin:new Date(2026,8,7)},
        ],
      },
    },
  },
  // ── PERSONNALISÉ ──────────────────────────────────────────────────────────────
  custom: {
    zones: ["Perso"],
    zoneLabels: { Perso:"Pays personnalisé — saisissez vos dates" },
    data: { 2025:{ Perso:[] }, 2026:{ Perso:[] } },
  },
};

const PAYS_LIST = [
  {id:"france", flag:"🇫🇷", label:"France"},
  {id:"espagne", flag:"🇪🇸", label:"España"},
  {id:"equateur", flag:"🇪🇨", label:"Ecuador"},
  {id:"colombie", flag:"🇨🇴", label:"Colombia"},
  {id:"belgique", flag:"🇧🇪", label:"Belgique"},
  {id:"uk", flag:"🇬🇧", label:"United Kingdom"},
  {id:"usa", flag:"🇺🇸", label:"United States"},
  {id:"custom", flag:"🌍", label:"Autre pays"},
];

function getVacancesPays(pays, an, zone) {
  const paysData = VACANCES_PAR_PAYS[pays];
  if(!paysData) return [];
  const yearData = paysData.data[an] || paysData.data[2025] || {};
  return yearData[zone] || [];
}

// Pour compatibilité avec le reste du code
function getVacances(an){ return VACANCES_PAR_PAYS.france.data[an] || VACANCES_PAR_PAYS.france.data[2025]; }

function getAnneeSco(d){return d.getMonth()>=8?d.getFullYear():d.getFullYear()-1;}
function getWN(d){const u=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),day=u.getUTCDay()||7;u.setUTCDate(u.getUTCDate()+4-day);const y=new Date(Date.UTC(u.getUTCFullYear(),0,1));return Math.ceil((((u-y)/86400000)+1)/7);}
function dim(y,m){return new Date(y,m+1,0).getDate();}
function fdow(y,m){const d=new Date(y,m,1).getDay();return d===0?6:d-1;}
function dk(y,m,d){return`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function h2r(h){const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return`${r},${g},${b}`;}
function sd(a,b){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();}

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
const APP="Parentio";const RESP="M. Alvarado";const EMAIL="migoumarketing@gmail.com";const ADR="Paris 75020, France";const VER="11.0";

const CGU=`CONDITIONS GÉNÉRALES D'UTILISATION — ${APP} v${VER}

1. OBJET
${APP} est un outil d'organisation pour parents séparés.

2. ⚠️ LIMITATION DE RESPONSABILITÉ
• Outil d'ORGANISATION UNIQUEMENT
• Aucun conseil juridique
• Ne remplace PAS un avocat ou juge (JAF)
• Calculs INDICATIFS — vérifiez votre jugement
• En cas de litige, seule une décision de justice fait foi

3. ACCÈS
• Avoir 18 ans ou plus
• Être parent ou tuteur légal des enfants concernés

4. ABONNEMENT
Voir CGV. Paiements sécurisés via Stripe.

5. ACCEPTATION
L'utilisation vaut acceptation des présentes CGU.`;

const CGV=`CONDITIONS GÉNÉRALES DE VENTE — ${APP} v${VER}

1. VENDEUR
${RESP} — ${ADR} — ${EMAIL}

2. OFFRES
Plan Gratuit : 0€/mois
• Calendrier complet (tous les enfants, toutes les zones)
• Semaines paires/impaires, vacances scolaires, jours fériés
• 10 événements/mois, 5 notes/mois
• 2 contacts urgence
• 2 thèmes visuels (Sombre / Clair)

Plan Premium : 3,99€/mois ou 29,99€/an
• Tout le plan Gratuit, plus :
• Analyse IA du jugement (configuration automatique)
• Événements et notes illimités
• Vue annuelle complète
• Notifications intelligentes (max 1/jour)
• Export JSON & CSV complet
• 6 thèmes visuels + personnalisation couleurs
• Contacts urgence illimités
• Partage du planning avec l'autre parent
• Sauvegarde cloud Supabase
• Support prioritaire par email

3. PAIEMENT
• Paiement sécurisé via Stripe Inc. (certifié PCI-DSS niveau 1)
• Stripe traite les données bancaires — Parentio ne stocke AUCUNE donnée bancaire
• Stripe est soumis aux clauses contractuelles types UE pour le transfert de données vers les USA
• Moyens acceptés : CB Visa/Mastercard, Apple Pay, Google Pay
• Facture automatique générée après chaque paiement
• En cas de litige de paiement : migoumarketing@gmail.com

4. RÉTRACTATION
14 jours — Art. L221-18 Code de la consommation
Contact : ${EMAIL}

5. RÉSILIATION
À tout moment depuis Réglages → Abonnement.`;

const PC=`POLITIQUE DE CONFIDENTIALITÉ — ${APP} v${VER}
Conforme RGPD (UE) 2016/679 & CNIL

1. RESPONSABLE : ${RESP} — ${EMAIL} — ${ADR}

2. DONNÉES COLLECTÉES
• Email, prénoms parents, événements, notes
• Documents uploadés : traitement local uniquement, non stockés
• Aucune localisation, aucune donnée bancaire

3. BASE LÉGALE
• Consentement (Art. 6.1.a RGPD)
• Exécution du service (Art. 6.1.b RGPD)

4. HÉBERGEMENT
Supabase EU (Irlande) — Données dans l'UE — Conforme RGPD
Vercel (front-end)

5. SÉCURITÉ TECHNIQUE
• Chiffrement TLS 1.3 / HTTPS pour toutes les connexions
• Chiffrement AES-256 au repos (Supabase, standard bancaire)
• Row Level Security — chaque parent accède uniquement à ses données
• Authentification JWT + sessions sécurisées
• Documents jugements : traitement local uniquement, jamais transmis

6. SOUS-TRAITANTS
• Supabase Inc. — base de données (Irlande, UE)
• Vercel Inc. — hébergement front-end (USA — clauses contractuelles UE)
• Stripe Inc. — traitement des paiements (USA — certifié PCI-DSS N1 — clauses contractuelles UE)

Note Stripe : Parentio ne voit ni ne stocke vos données bancaires.
Elles sont traitées directement par Stripe dans un environnement sécurisé certifié.

6. VOS DROITS
✅ Accès (Art.15) → Export JSON/CSV
✅ Rectification (Art.16) → Modifier dans l'app
✅ Effacement (Art.17) → Bouton dédié dans Réglages
✅ Portabilité (Art.20) → Export JSON fonctionnel
✅ Opposition (Art.21) → Effacer vos données

7. CONSERVATION
Jusqu'à suppression du compte.
Factures : 10 ans (obligation légale).

8. CONTACT CNIL : cnil.fr — 01 53 73 22 22`;

const ML=`MENTIONS LÉGALES — ${APP} v${VER}

ÉDITEUR
${RESP} — ${ADR}
Email : ${EMAIL}
Statut : Auto-entrepreneur

HÉBERGEMENT
Front-end : Vercel Inc., San Francisco, USA
Base de données : Supabase (Irlande, EU)

PROPRIÉTÉ INTELLECTUELLE
${APP} et son contenu sont protégés.
Reproduction interdite sans autorisation.

LIMITATION
${APP} est un outil d'organisation uniquement.
Aucune valeur juridique.`;

// ─── THÈMES ───────────────────────────────────────────────────────────────────
const THEMES={
  dark:{bg:"#07071a",card:"rgba(255,255,255,0.06)",border:"rgba(255,255,255,0.09)",text:"#ffffff",sub:"rgba(255,255,255,0.45)",input:"rgba(255,255,255,0.08)",inputBorder:"rgba(255,255,255,0.12)",inputText:"#ffffff",navBg:"rgba(7,7,26,0.95)",name:"🌙 Sombre"},
  light:{bg:"#f8faff",card:"rgba(255,255,255,0.95)",border:"rgba(99,102,241,0.15)",text:"#1e1b4b",sub:"rgba(30,27,75,0.55)",input:"rgba(255,255,255,1)",inputBorder:"rgba(99,102,241,0.25)",inputText:"#1e1b4b",navBg:"rgba(248,250,255,0.97)",name:"☀️ Clair"},
  eco:{bg:"#071a09",card:"rgba(34,197,94,0.07)",border:"rgba(34,197,94,0.15)",text:"#f0fff4",sub:"rgba(240,255,244,0.5)",input:"rgba(34,197,94,0.08)",inputBorder:"rgba(34,197,94,0.2)",inputText:"#f0fff4",navBg:"rgba(7,26,9,0.95)",name:"🌿 Éco"},
  zen:{bg:"#0d0a1f",card:"rgba(139,92,246,0.07)",border:"rgba(139,92,246,0.15)",text:"#f5f3ff",sub:"rgba(245,243,255,0.5)",input:"rgba(139,92,246,0.08)",inputBorder:"rgba(139,92,246,0.2)",inputText:"#f5f3ff",navBg:"rgba(13,10,31,0.95)",name:"💜 Zen"},
  ocean:{bg:"#061525",card:"rgba(6,182,212,0.07)",border:"rgba(6,182,212,0.15)",text:"#ecfeff",sub:"rgba(236,254,255,0.5)",input:"rgba(6,182,212,0.08)",inputBorder:"rgba(6,182,212,0.2)",inputText:"#ecfeff",navBg:"rgba(6,21,37,0.95)",name:"🌊 Océan"},
  rose:{bg:"#1a070f",card:"rgba(236,72,153,0.07)",border:"rgba(236,72,153,0.15)",text:"#fff0f6",sub:"rgba(255,240,246,0.5)",input:"rgba(236,72,153,0.08)",inputBorder:"rgba(236,72,153,0.2)",inputText:"#fff0f6",navBg:"rgba(26,7,15,0.95)",name:"🌸 Rose"},
};

const PALETTES=[
  {a:"#6366f1",b:"#ec4899",name:"Violet/Rose"},
  {a:"#10b981",b:"#f97316",name:"Vert/Orange"},
  {a:"#06b6d4",b:"#8b5cf6",name:"Cyan/Violet"},
  {a:"#f43f5e",b:"#0ea5e9",name:"Rouge/Bleu"},
  {a:"#84cc16",b:"#a855f7",name:"Lime/Pourpre"},
  {a:"#22c55e",b:"#22c55e",name:"🌿 Éco pur"},
];

const EVT_IDS=["rdv","sport","ecole","fete","autre"];
const EVT_COLORS=["#ef4444","#10b981","#3b82f6","#f59e0b","#8b5cf6"];
const MOIS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MOISC=["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];
const JOURS=["Lu","Ma","Me","Je","Ve","Sa","Di"];

// Réseaux sociaux — mettez vos vraies URLs ici
const SOCIAL=[
  {icon:"📸",name:"Instagram",url:"https://instagram.com/alternea.app",color:"#e1306c"},
  {icon:"🎵",name:"TikTok",url:"https://tiktok.com/@alternea.app",color:"#69c9d0"},
  {icon:"📘",name:"Facebook",url:"https://facebook.com/alterneaapp",color:"#1877f2"},
  {icon:"💼",name:"LinkedIn",url:"https://linkedin.com/company/alternea",color:"#0a66c2"},
];



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

// ─── ÉCRAN CONSENTEMENT ───────────────────────────────────────────────────────
function ConsentScreen({onAccept}){
  const[lang,setLang]=useState("fr");
  const[c1,setC1]=useState(false);
  const[c2,setC2]=useState(false);
  const[c3,setC3]=useState(false);
  const[c4,setC4]=useState(false);
  const[err,setErr]=useState(false);
  const[doc,setDoc]=useState(null);

  const L={
    fr:{title:`Bienvenue sur ${APP}`,sub:"Lisez et acceptez nos conditions avant de commencer.",
      what:["📅 Calendrier de garde organisationnel","🤖 Analyse locale de votre jugement","🌴 Vacances scolaires automatiques 2025-2027","💐 Fête des Mères & Pères intégrées","🌍 3 langues : FR / ES / EN"],
      not:["❌ Conseils juridiques ou calcul de pension","❌ Remplacer un avocat ou décision de justice","❌ Partager vos données à des tiers","❌ Accéder à votre localisation"],
      l1:"J'ai lu et j'accepte les ",l2:" et la ",cguLbl:"CGU",pcLbl:"Politique de Confidentialité",
      l3:"Je certifie être le parent ou tuteur légal des enfants concernés",
      l4:"Je certifie avoir 18 ans ou plus",
      btn:`Accéder à ${APP} →`,err:"Veuillez accepter toutes les conditions."},
    es:{title:`Bienvenido a ${APP}`,sub:"Lee y acepta nuestras condiciones.",
      what:["📅 Calendario de custodia","🤖 Análisis local de sentencia","🌴 Vacaciones escolares automáticas","💐 Día de la Madre y del Padre","🌍 3 idiomas"],
      not:["❌ Consejos jurídicos o pensión","❌ Reemplazar decisión judicial","❌ Compartir datos con terceros","❌ Acceder a ubicación"],
      l1:"He leído y acepto los ",l2:" y la ",cguLbl:"TyC",pcLbl:"Política de Privacidad",
      l3:"Certifico ser el padre/madre o tutor legal",l4:"Certifico tener 18 años o más",
      btn:`Acceder a ${APP} →`,err:"Debe aceptar todas las condiciones."},
    en:{title:`Welcome to ${APP}`,sub:"Please read and accept our terms.",
      what:["📅 Organisational custody calendar","🤖 Local court order analysis","🌴 Automatic school holidays","💐 Mother's & Father's Day","🌍 3 languages"],
      not:["❌ Legal advice or child support","❌ Replace a court order","❌ Share data with third parties","❌ Access your location"],
      l1:"I have read and accept the ",l2:" and the ",cguLbl:"Terms",pcLbl:"Privacy Policy",
      l3:"I confirm I am the legal parent/guardian",l4:"I confirm I am 18 or older",
      btn:`Enter ${APP} →`,err:"Please accept all terms to continue."},
  };
  const t=L[lang]||L.fr;

  return(
    <div style={{minHeight:"100vh",background:"#07071a",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px 16px",fontFamily:"'Nunito','Segoe UI',sans-serif"}}>
      <div style={{background:"rgba(255,255,255,0.055)",backdropFilter:"blur(24px)",borderRadius:24,border:"1px solid rgba(255,255,255,0.09)",padding:"28px 22px",maxWidth:460,width:"100%",boxShadow:"0 24px 64px rgba(0,0,0,0.6)"}}>
        {/* Langue */}
        <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:18}}>
          {[["fr","🇫🇷"],["es","🇪🇸"],["en","🇬🇧"]].map(([l,f])=>(
            <div key={l} onClick={()=>setLang(l)} style={{fontSize:24,cursor:"pointer",opacity:lang===l?1:0.25,transform:lang===l?"scale(1.15)":"scale(1)",transition:"all 0.15s"}}>{f}</div>
          ))}
        </div>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <div style={{width:48,height:48,background:"rgba(99,102,241,0.2)",border:"2px solid rgba(99,102,241,0.4)",borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:"0 6px 20px rgba(99,102,241,0.25)"}}>👨‍👧</div>
          <div>
            <div style={{fontWeight:900,fontSize:26,color:"#fff",letterSpacing:"-0.5px"}}>{APP}</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.35)"}}>Organisation coparentalité</div>
          </div>
        </div>
        <div style={{fontSize:18,fontWeight:900,color:"#fff",marginBottom:3}}>{t.title}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.38)",marginBottom:14}}>{t.sub}</div>
        {/* Ce que fait */}
        <div style={{marginBottom:10}}>
          {t.what.map((item,i)=><div key={i} style={{display:"flex",gap:7,fontSize:12,color:"rgba(255,255,255,0.7)",marginBottom:4,lineHeight:1.5}}>{item}</div>)}
        </div>
        {/* Ce que ne fait pas */}
        <div style={{background:"rgba(239,68,68,0.07)",border:"1px solid rgba(239,68,68,0.18)",borderRadius:11,padding:"10px 12px",marginBottom:12}}>
          {t.not.map((item,i)=><div key={i} style={{fontSize:12,color:"rgba(239,68,68,0.8)",marginBottom:3,lineHeight:1.4}}>{item}</div>)}
        </div>
        {/* Sécurité */}
        <div style={{background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.18)",borderRadius:10,padding:"9px 12px",marginBottom:12,fontSize:12,color:"rgba(200,200,255,0.7)",lineHeight:1.5}}>
          🔒 Données chiffrées TLS+AES256 · Hébergement EU (Irlande) · Conforme RGPD & CNIL
        </div>
        {/* 4 cases obligatoires */}
        {[
          [c1,setC1,<>{t.l1}<span onClick={e=>{e.stopPropagation();setDoc("cgu");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>{t.cguLbl}</span>{t.l2}<span onClick={e=>{e.stopPropagation();setDoc("pc");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>{t.pcLbl}</span></>],
          [c2,setC2,<><span onClick={e=>{e.stopPropagation();setDoc("cgv");}} style={{color:"#818cf8",cursor:"pointer",textDecoration:"underline dotted"}}>CGV</span> — Conditions de vente et abonnement</>],
          [c3,setC3,t.l3],
          [c4,setC4,t.l4],
        ].map(([val,setter,label],idx)=>(
          <div key={idx} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"9px 0",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
            <div onClick={()=>setter(v=>!v)} style={{width:22,height:22,borderRadius:7,border:`2px solid ${val?"#6366f1":"rgba(255,255,255,0.18)"}`,background:val?"rgba(99,102,241,0.3)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,transition:"all 0.15s",boxShadow:val?"0 2px 8px rgba(99,102,241,0.3)":"none"}}>
              {val&&<span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}
            </div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5}}>{label}</div>
          </div>
        ))}
        {err&&<div style={{color:"#ef4444",fontSize:12,textAlign:"center",margin:"8px 0",fontWeight:700}}>{t.err}</div>}
        <div style={{marginTop:14}}>
          <Btn onClick={()=>{if(!c1||!c2||!c3||!c4){setErr(true);return;}onAccept(lang);}} color="#6366f1" size="lg" full>{t.btn}</Btn>
        </div>
        {/* Réseaux sociaux */}
        <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:14}}>
          {SOCIAL.map(s=>(
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{fontSize:22,textDecoration:"none",opacity:0.5,transition:"all 0.15s"}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0.5} title={s.name}>{s.icon}</a>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:10,fontSize:10,color:"rgba(255,255,255,0.15)"}}>
          ⚠️ Outil d'organisation uniquement — Aucune valeur juridique
        </div>
      </div>
      {doc&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(12px)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>e.target===e.currentTarget&&setDoc(null)}>
          <div style={{background:"#0d0d20",border:"1px solid rgba(255,255,255,0.09)",borderRadius:"22px 22px 0 0",padding:"22px 20px 40px",width:"100%",maxWidth:460,maxHeight:"85vh",overflow:"auto"}}>
            <div style={{fontWeight:900,fontSize:16,color:"#fff",marginBottom:14}}>
              {doc==="cgu"?"CGU":doc==="cgv"?"CGV":"Politique de Confidentialité"}
            </div>
            <pre style={{fontSize:11,color:"rgba(255,255,255,0.55)",lineHeight:1.8,whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{doc==="cgu"?CGU:doc==="cgv"?CGV:PC}</pre>
            <div style={{marginTop:16}}><Btn onClick={()=>setDoc(null)} color="#6366f1">✓ Fermer</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPALE ───────────────────────────────────────────────────────────
export default function App(){
  const [showAuth, setShowAuth] = useState(false);
  const { user, loadingAuth, logout, isLoggedIn } = useAuth();
  const { 
  events: cloudEvents, 
  addEvent: addCloudEvent, 
  removeEvent: removeCloudEvent,
  editEvent: editCloudEvent
} = useEvents(user);
  const { cloudNotes, saveCloudNote } = useNotes(user);
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
    localStorage.setItem("par_v11","1");
    setLang(l);setAccepted(true);
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
  if(savingEventRef.current) return;
  if(!newEvt.titre.trim()) return;

  savingEventRef.current = true;

  const key = editingEvent?.key || dk(year,month,selDay);

  try{
    if(editingEvent){
      await editCloudEvent(editingEvent.id, {
        title: newEvt.titre,
        type: newEvt.type || "standard",
        parent: newEvt.parent || "",
        event_date: key,
        status: "planned"
      });

      setEvents(p=>({
        ...p,
        [key]: (p[key]||[]).map(e =>
          e.id === editingEvent.id
            ? {
                ...e,
                titre: newEvt.titre,
                type: newEvt.type || "standard",
                parent: newEvt.parent || "",
                date: key,
                shared: newEvt.shared,
                heure: newEvt.heure || "",
              }
            : e
        )
      }));
    } else {
      const created = await addCloudEvent({
        title: newEvt.titre,
        type: newEvt.type || "standard",
        parent: newEvt.parent || "",
        event_date: key,
        status: "planned"
      });

      const saved = created?.[0];

      const evt = {
        id: saved?.id || crypto.randomUUID(),
        titre: newEvt.titre,
        type: newEvt.type || "standard",
        parent: newEvt.parent || "",
        date: key,
        shared: newEvt.shared,
        heure: newEvt.heure || "",
      };

      setEvents(p=>({
        ...p,
        [key]: [...(p[key]||[]), evt]
      }));
    }

    setNewEvt({type:"rdv",titre:"",heure:"",shared:true});
    setEditingEvent(null);
    setModal(null);

  }catch(error){
    console.error(error);
    alert("Erreur lors de l'enregistrement de l'événement.");
  }finally{
    savingEventRef.current = false;
  }
}
  async function delEvent(key,id){

  setEvents(p=>({
    ...p,
    [key]: p[key].filter(e=>e.id!==id)
  }));

  try{
    await removeCloudEvent(id);
  }catch(error){
    console.error(error);
  }
}
  async function saveNote(){

  const key = dk(year,month,selDay);

  try{

    await saveCloudNote({
      note_date: key,
      content: newNote
    });

    setNotes(p => ({
      ...p,
      [key]: newNote
    }));

    setModal(null);

  }catch(error){
    console.error(error);
    alert("Erreur sauvegarde note");
  }
}
async function deleteNote(){
  const key = dk(year,month,selDay);

  try{
    await saveCloudNote({
      note_date: key,
      content: ""
    });

    setNotes(p => {
      const copy = {...p};
      delete copy[key];
      return copy;
    });

    setNewNote("");
    setModal(null);

  }catch(error){
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
    <div style={S.card}>
      <div style={S.sec}>👤 Parents & mode de garde</div>
      <div style={{display:"flex",gap:8,marginBottom:11}}>
        <div style={{flex:1}}><div style={S.inpLbl}>Prénom A</div><input style={{...S.inp,borderColor:`${colorA}55`}} value={pA} onChange={e=>setPa(e.target.value)} placeholder="Maman"/></div>
        <div style={{flex:1}}><div style={S.inpLbl}>Prénom B</div><input style={{...S.inp,borderColor:`${colorB}55`}} value={pB} onChange={e=>setPb(e.target.value)} placeholder="Papa"/></div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:11}}>
        <div style={{flex:1}}><div style={S.inpLbl}>Heure échange → {pA}</div><input type="time" style={S.inp} value={heureA} onChange={e=>setHeureA(e.target.value)}/></div>
        <div style={{flex:1}}><div style={S.inpLbl}>Heure échange → {pB}</div><input type="time" style={S.inp} value={heureB} onChange={e=>setHeureB(e.target.value)}/></div>
      </div>

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
        <Tog on={showFeries} onChange={()=>setShowFeries(v=>!v)} label="Fériés & fêtes" color="#d97706" T={T}/>
      </div>
    </div>

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
            <button onClick={()=>delEvent(selData.key,e.id)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:16}}>×</button>
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
    <div style={S.card}>
      <div style={S.sec}>🌴 {L.vacances} Zone {zone} · {anneeSco}-{anneeSco+1}</div>
      {vac[zone]?.filter(v=>v.fin>=today).slice(0,4).map((v,i)=>{
        const now=today>=v.debut&&today<=v.fin;const par=vacAlt?(i%2===0?pA:pB):"—";
        return(<div key={v.nom} style={S.vacItem(now)}>
          <div><div style={{fontWeight:700,fontSize:13,color:T.text}}>{now?"🟢 ":""}{v.nom}</div><div style={{fontSize:11,color:T.sub}}>{v.debut.toLocaleDateString("fr-FR")} → {v.fin.toLocaleDateString("fr-FR")}</div></div>
          {vacAlt&&<span style={S.badge(par===pA?colorA:colorB)}>{par}</span>}
        </div>);
      })}
    </div>

    {/* Jours spéciaux */}
    {showFeries&&<div style={S.card}>
      <div style={S.sec}>🎉 Prochains jours spéciaux</div>
      {prochSpec.map((f,i)=>{const isMere=sd(f.date,fm),isPere=sd(f.date,fp);const c=isMere?"#db2777":isPere?"#2563eb":"#d97706";const par=getParent(f.date,cfg,vac);return(
        <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div><div style={{fontWeight:700,fontSize:13,color:T.text}}>{f.nom}</div><div style={{fontSize:11,color:T.sub}}>{f.date.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div></div>
          <span style={S.badge(par===pA?colorA:colorB)}>{par}</span>
        </div>
      );})}
    </div>}

    {/* Checklist */}
    <div style={S.card}>
      <div style={S.sec}>🎒 Checklist départ</div>
      {L.checkItems.map((item,i)=>{const on=checklist[i];return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div onClick={()=>setChecklist(p=>({...p,[i]:!p[i]}))} style={{width:22,height:22,borderRadius:7,border:`2px solid ${on?colorA:T.border}`,background:on?`rgba(${rgbA},0.22)`:"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all 0.14s"}}>
            {on&&<span style={{color:colorA,fontSize:12,fontWeight:900}}>✓</span>}
          </div>
          <span style={{fontSize:13,fontWeight:600,color:on?T.sub:T.text,textDecoration:on?"line-through":"none"}}>{item}</span>
        </div>
      );})}
      <div style={{marginTop:9}}><Btn color="#6b7280" size="sm" onClick={()=>setChecklist({})}>{L.reinit}</Btn></div>
    </div>

    {/* Contacts */}
    <div style={S.card}>
      <div style={S.sec}>🚨 {L.contacts}</div>
      {contacts.map((c,i)=>(<div key={i} style={{display:"flex",gap:7,marginBottom:8}}>
        <input style={{...S.inp,flex:1}} placeholder="Nom" value={c.nom} onChange={e=>setContacts(p=>p.map((x,j)=>j===i?{...x,nom:e.target.value}:x))}/>
        <input style={{...S.inp,flex:1}} placeholder="Tél" value={c.tel} onChange={e=>setContacts(p=>p.map((x,j)=>j===i?{...x,tel:e.target.value}:x))}/>
        <button onClick={()=>setContacts(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:18}}>×</button>
      </div>))}
      <Btn color="#10b981" size="sm" onClick={()=>setContacts(p=>[...p,{nom:"",tel:""}])}>+ Contact</Btn>
    </div>
  </>);}

  function ViewEvents(){return(<div style={S.card}>
    <div style={S.sec}>🗓️ {TABS[1]}</div>
    <div style={S.disc}>{L.disc}</div>
    {upEvts.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:T.sub}}><div style={{fontSize:38,marginBottom:8}}>📭</div><div style={{fontSize:14,fontWeight:700}}>Aucun événement</div></div>}
    {upEvts.slice(0,30).map((e,i)=>{const idx=EVT_IDS.indexOf(e.type);const c=EVT_COLORS[idx]||"#8b5cf6";const par=getParent(e.date,cfg,vac);return(
      <div key={i} style={{...S.evtLine(c),paddingBottom:9}}>
        <div style={{width:3,height:36,borderRadius:2,background:c,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
            <span style={{fontWeight:800,fontSize:13,color:T.text}}>{e.titre}</span>
            <span style={S.badge(e.shared?colorA:"#6b7280")}>{e.shared?L.shared:L.prive}</span>
          </div>
          <div style={{fontSize:11,color:T.sub,marginTop:2}}>
            {e.date.toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"long"})}{e.heure&&" · "+e.heure} · <span style={{color:par===pA?colorA:colorB,fontWeight:700}}>{par}</span>
          </div>
        </div>
        <button onClick={()=>delEvent(e.key,e.id)} style={{background:"none",border:"none",color:T.sub,cursor:"pointer",fontSize:15}}>×</button>
      </div>
    );})}
  </div>);}

  function ViewAnnuel(){return(<div style={S.card}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
      <div style={S.sec}>📆 {TABS[2]} {year}</div>
      <div style={{display:"flex",gap:6}}><Btn color="#6366f1" size="sm" onClick={()=>setYear(y=>y-1)}>‹</Btn><Btn color="#6366f1" size="sm" onClick={()=>setYear(y=>y+1)}>›</Btn></div>
    </div>
    <div style={{fontSize:11,color:T.sub,marginBottom:11,lineHeight:1.5}}>
      📚 {anneeSco}-{anneeSco+1} · 🐣 {getPaques(year).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})} · 💐 {fm.toLocaleDateString("fr-FR",{day:"numeric",month:"long"})} · 👔 {fp.toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
      {Array.from({length:12},(_,mi)=>{
        const d2=dim(year,mi),fd2=fdow(year,mi),mc=[];
        for(let i=0;i<fd2;i++)mc.push(null);for(let d=1;d<=d2;d++)mc.push(d);
        while(mc.length%7!==0)mc.push(null);
        const vacAnn=getVacances(getAnneeSco(new Date(year,mi,1)));
        return(<div key={mi} style={{background:T.card,borderRadius:11,padding:"9px 7px",border:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,fontWeight:800,textAlign:"center",marginBottom:5,color:T.sub}}>{MOISC[mi]}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1.5}}>
            {mc.map((d,j)=>{
              if(!d)return<div key={j} style={{width:"100%",paddingTop:"100%"}}/>;
              const date2=new Date(year,mi,d);
              const isA2=getParent(date2,cfg,vacAnn)===pA;
              const sp=getSpecial(date2,year);
              const isT2=sd(date2,today);
              return<div key={j} style={{width:"100%",paddingTop:"100%",borderRadius:2,background:isT2?"#fff":sp?`${sp.color}88`:isA2?`rgba(${rgbA},0.45)`:`rgba(${rgbB},0.45)`}}/>;
            })}
          </div>
        </div>);
      })}
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:11,flexWrap:"wrap"}}>
      {[[colorA,pA],[colorB,pB],["#d97706","Vac."],["#db2777","Mères"],["#2563eb","Pères"]].map(([c,l])=>(
        <div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:T.sub}}>
          <div style={{width:9,height:9,borderRadius:3,background:c}}/><span>{l}</span>
        </div>
      ))}
    </div>
  </div>);}

  function ViewSettings(){return(<>
    {/* Langue */}
    <div style={S.card}>
      <div style={S.sec}>🌍 {L.langue}</div>
      <div style={S.row}>
        {[["fr","🇫🇷 Français"],["es","🇪🇸 Español"],["en","🇬🇧 English"]].map(([l,lb])=>(
          <Pill key={l} active={lang===l} color="#8b5cf6" onClick={()=>setLang(l)}>{lb}</Pill>
        ))}
      </div>
    </div>

    {/* Thème */}
    <div style={S.card}>
      <div style={S.sec}>🎨 {L.theme}</div>
      <div style={S.row}>
        {Object.entries(THEMES).map(([key,th])=>(
          <Pill key={key} active={theme===key} color={key==="eco"?"#22c55e":key==="zen"?"#8b5cf6":key==="ocean"?"#06b6d4":key==="rose"?"#ec4899":key==="light"?"#6366f1":"#6366f1"} onClick={()=>setTheme(key)}>{th.name}</Pill>
        ))}
      </div>
    </div>

    {/* Couleurs */}
    <div style={S.card}>
      <div style={S.sec}>🎨 {L.couleurs}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8,marginBottom:12}}>
        {PALETTES.map((p,i)=><div key={i} onClick={()=>{setPalIdx(i);setColorA(p.a);setColorB(p.b);}} style={{height:28,borderRadius:9,display:"flex",overflow:"hidden",cursor:"pointer",border:palIdx===i?"3px solid #fff":"3px solid transparent",transition:"all 0.14s"}}><div style={{flex:1,background:p.a}}/><div style={{flex:1,background:p.b}}/></div>)}
      </div>
      <div style={{display:"flex",gap:10}}>
        <div style={{flex:1}}>
          <div style={S.inpLbl}>{pA||"A"}</div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <input type="color" value={colorA} onChange={e=>{setColorA(e.target.value);setPalIdx(-1);}} style={{width:38,height:32,borderRadius:8,border:"none",cursor:"pointer",padding:2}}/>
            <div style={{height:32,flex:1,borderRadius:8,background:`rgba(${rgbA},0.18)`,border:`2px solid ${colorA}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:colorA}}>{pA||"A"}</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={S.inpLbl}>{pB||"B"}</div>
          <div style={{display:"flex",gap:7,alignItems:"center"}}>
            <input type="color" value={colorB} onChange={e=>{setColorB(e.target.value);setPalIdx(-1);}} style={{width:38,height:32,borderRadius:8,border:"none",cursor:"pointer",padding:2}}/>
            <div style={{height:32,flex:1,borderRadius:8,background:`rgba(${h2r(colorB)},0.18)`,border:`2px solid ${colorB}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:colorB}}>{pB||"B"}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Avion + Notifications */}
    <div style={S.card}>
      <div style={S.sec}>🔔 Notifications</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        <Tog on={avion} onChange={()=>setAvion(v=>!v)} label={L.avionLabel} sub={L.avionSub} color="#2563eb" T={T}/>
        <Tog on={notifEnabled&&!avion} onChange={()=>setNotifEnabled(v=>!v)} label={L.notifLabel} sub={L.notifSub} color="#10b981" T={T}/>
        {notifEnabled&&!avion&&<div>
          <div style={S.inpLbl}>Heure de notification</div>
          <input type="time" style={{...S.inp,maxWidth:140}} value={notifHour} onChange={e=>setNotifHour(e.target.value)}/>
          <div style={{fontSize:11,color:T.sub,marginTop:5}}>💡 Notification uniquement si changement dans moins de 3 jours</div>
        </div>}
      </div>
    </div>

    {/* Réseaux sociaux */}
    <div style={S.card}>
      <div style={S.sec}>📱 {L.social}</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
        {SOCIAL.map(s=>(
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:12,background:T.card,border:`1px solid ${T.border}`,textDecoration:"none",fontSize:13,fontWeight:700,color:s.color,transition:"all 0.15s",boxShadow:`0 2px 8px rgba(0,0,0,0.1)`}}>
            <span style={{fontSize:18}}>{s.icon}</span>{s.name}
          </a>
        ))}
      </div>
      {/* Partage du planning */}
      <div style={{marginTop:4}}>
        <Btn color="#10b981" size="sm" onClick={()=>{
          const url=`https://alternea.vercel.app`;
          const txt=`📅 Mon planning de garde sur ${APP} : ${url}`;
          if(navigator.share){navigator.share({title:APP,text:txt,url});}
          else{navigator.clipboard?.writeText(txt);alert("Lien copié !");};
        }}>📤 Partager l'app</Btn>
      </div>
    </div>

    {/* Premium */}
    <div style={S.card}>
      <div style={S.sec}>💳 Abonnement</div>
      <div style={{background:`rgba(${rgbA},0.08)`,border:`1px solid rgba(${rgbA},0.2)`,borderRadius:14,padding:"16px",marginBottom:12}}>
        <div style={{fontWeight:900,fontSize:16,color:T.text,marginBottom:8}}>
          {premium?"✅ Plan Premium actif":"🚀 Plan Gratuit"}
        </div>
        <div style={{fontSize:13,color:T.sub,marginBottom:10,lineHeight:1.7}}>
          {premium?(
            <>
              ✅ Calendrier complet tous enfants<br/>
              ✅ Analyse IA jugement<br/>
              ✅ Événements &amp; notes illimités<br/>
              ✅ Vue annuelle<br/>
              ✅ Notifications intelligentes<br/>
              ✅ Export JSON &amp; CSV<br/>
              ✅ 6 thèmes + couleurs perso<br/>
              ✅ Contacts urgence illimités<br/>
              ✅ Sauvegarde cloud
            </>
          ):(
            <>
              ✅ Calendrier complet (tous enfants)<br/>
              ✅ Semaines paires/impaires<br/>
              ✅ Vacances scolaires &amp; fériés<br/>
              ✅ 10 événements/mois<br/>
              ✅ 5 notes privées/mois<br/>
              ✅ 2 thèmes visuels<br/>
              🔒 Analyse IA jugement — <strong>Premium</strong><br/>
              🔒 Vue annuelle — <strong>Premium</strong><br/>
              🔒 Notifications — <strong>Premium</strong><br/>
              🔒 Export données — <strong>Premium</strong><br/>
              🔒 Thèmes avancés — <strong>Premium</strong>
            </>
          )}
        </div>
        {!premium&&<>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:28,fontWeight:900,color:colorA}}>3,99€</div>
            <div style={{fontSize:13,color:T.sub}}>/mois<br/>ou 29,99€/an</div>
          </div>
          <Btn color={colorA} size="lg" full onClick={()=>{
              // Stripe checkout — remplacez VOTRE_PRICE_ID par votre Price ID Stripe
              const STRIPE_KEY = 'pk_test_VOTRE_CLE_PUBLIQUE';
              alert('Abonnement Premium — Intégration Stripe\nContactez : '+EMAIL+'\npour activer votre abonnement.');
            }}>
            💳 S'abonner — Stripe
          </Btn>
          <div style={{fontSize:10,color:T.sub,marginTop:6,textAlign:"center"}}>Sécurisé · Résiliation à tout moment · Facture auto</div>
        </>}
      </div>
      <div style={S.row}>
        <Btn color="#6366f1" size="sm" onClick={()=>setShowDoc("cgv")}>CGV</Btn>
        <Btn color="#6b7280" size="sm" onClick={()=>alert("Factures disponibles après souscription.")}>📄 Factures</Btn>
      </div>
    </div>

    {/* Droits RGPD */}
    <div style={S.card}>
      <div style={S.sec}>🔒 {L.droits}</div>
      {[["✅ Accès (Art.15)","Export JSON/CSV ci-dessous"],["✅ Rectification (Art.16)","Modifier dans l'app"],["✅ Effacement (Art.17)","Bouton rouge ci-dessous"],["✅ Portabilité (Art.20)","Export JSON + CSV fonctionnels"],["✅ Opposition (Art.21)","Effacer vos données"],["📧 CNIL","cnil.fr · 01 53 73 22 22"]].map(([l,d])=>(
        <div key={l} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontWeight:700,fontSize:12,color:T.text}}>{l}</div>
          <div style={{fontSize:11,color:T.sub,marginTop:1}}>{d}</div>
        </div>
      ))}
    </div>

    {/* Sécurité */}
    <div style={S.card}>
      <div style={S.sec}>🛡️ {L.securite}</div>
      {[["🔐 TLS/HTTPS","Chiffrement en transit"],["🗄️ AES-256","Chiffrement au repos (Supabase)"],["👁️ RLS","Isolation totale — chaque parent voit ses données uniquement"],["📍 Hébergement","Europe — Irlande — Conforme RGPD"],["📄 Jugements","Traitement local uniquement, jamais stockés"]].map(([l,d])=>(
        <div key={l} style={{padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
          <div style={{fontWeight:700,fontSize:12,color:T.text}}>{l}</div>
          <div style={{fontSize:11,color:T.sub,marginTop:1}}>{d}</div>
        </div>
      ))}
    </div>

    {/* Docs légaux */}
    <div style={S.card}>
      <div style={S.sec}>⚖️ {L.legal}</div>
      <div style={{...S.row,marginBottom:11}}>
        {[["cgu","CGU"],["cgv","CGV"],["pc","Confidentialité"],["ml","Mentions légales"]].map(([key,label])=>(
          <Btn key={key} color="#6366f1" size="sm" onClick={()=>setShowDoc(key)}>{label}</Btn>
        ))}
      </div>
      <div style={{fontSize:11,color:T.sub,background:`rgba(217,119,6,0.06)`,borderRadius:8,padding:"8px 10px",border:`1px solid rgba(217,119,6,0.14)`,lineHeight:1.5}}>{L.disc}</div>
    </div>

    {/* Mes données */}
    <div style={S.card}>
      <div style={S.sec}>📦 {L.mesDonnees} · {RESP} · {EMAIL}</div>
      <div style={{fontSize:12,color:T.sub,marginBottom:12,lineHeight:1.6}}>
        Données hébergées en Europe (Irlande). Conservation jusqu'à suppression du compte. Factures conservées 10 ans (obligation légale).
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <Btn color="#10b981" size="lg" full onClick={exportJSON}>{L.exporter}</Btn>
        <Btn color="#06b6d4" size="lg" full onClick={exportCSV}>{L.exporterCSV}</Btn>
        <Btn color="#ef4444" size="lg" full danger onClick={deleteAll}>{L.effacer}</Btn>
      </div>
    </div>

    <div style={{textAlign:"center",fontSize:10,color:T.sub,padding:"8px 0 4px"}}>{APP} v{VER} · {RESP} · Conforme RGPD & CNIL</div>
  </>);}

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
        <div style={S.main}>{[<ViewCal/>,<ViewEvents/>,<ViewAnnuel/>,<ViewSettings/>][tab]}</div>
      </div>

      {/* Nav mobile */}
      <div style={S.navBar}>
        {TABS.map((label,i)=><div key={i} style={S.navItem(tab===i)} onClick={()=>setTab(i)}><span style={{fontSize:22}}>{ICONS[i]}</span><span>{label}</span></div>)}
      </div>

  
      {/* Modal événement */}
{modal==="event"&&selDay&&<div style={S.modal} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
  <div style={S.mCard}>
    <div style={{fontWeight:900,fontSize:16,marginBottom:11,color:T.text}}>
      {editingEvent ? "✏️ Modifier événement" : `+ ${L.add}`} · {selDay} {MOIS[month]}
    </div>

    <div style={S.disc}>{L.disc}</div>

    <div style={{marginBottom:10}}>
      <div style={S.inpLbl}>Type</div>
      <div style={{...S.row,gap:5,marginTop:4}}>
        {EVT_IDS.map((id,i)=>
          <Pill key={id} active={newEvt.type===id} color={EVT_COLORS[i]} onClick={()=>setNewEvt(e=>({...e,type:id}))}>
            {L.evtTypes[i]}
          </Pill>
        )}
      </div>
    </div>

    <div style={{marginBottom:10}}>
      <div style={S.inpLbl}>Titre *</div>
      <input style={S.inp} value={newEvt.titre} onChange={e=>setNewEvt(v=>({...v,titre:e.target.value}))} placeholder="Ex: Pédiatre, match de foot…" autoFocus/>
    </div>

    <div style={{marginBottom:10}}>
      <div style={S.inpLbl}>Heure</div>
      <input type="time" style={S.inp} value={newEvt.heure} onChange={e=>setNewEvt(v=>({...v,heure:e.target.value}))}/>
    </div>

    <div style={{marginBottom:16}}>
      <div style={S.inpLbl}>Visibilité</div>
      <div style={S.row}>
        <Pill active={newEvt.shared} color={colorA} onClick={()=>setNewEvt(v=>({...v,shared:true}))}>{L.shared}</Pill>
        <Pill active={!newEvt.shared} color="#6b7280" onClick={()=>setNewEvt(v=>({...v,shared:false}))}>{L.prive}</Pill>
      </div>
    </div>

    <div style={{display:"flex",gap:8}}>
      <Btn color={colorA} size="lg" onClick={addEvent}>
        {editingEvent ? "Modifier" : L.ajouter}
      </Btn>
      <Btn color="#6b7280" size="lg" onClick={()=>{
        setEditingEvent(null);
        setNewEvt({type:"rdv",titre:"",heure:"",shared:true});
        setModal(null);
      }}>
        {L.annuler}
      </Btn>
    </div>
  </div>
</div>}

{/* Modal note */}
{modal==="note"&&selDay&&(
  <div style={S.modal} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
    <div style={S.mCard}>
      <div style={{fontWeight:900,fontSize:16,marginBottom:5,color:T.text}}>
        📝 {selDay} {MOIS[month]}
      </div>

      <div style={{fontSize:12,color:T.sub,marginBottom:10,fontWeight:600}}>
        🔒 Note privée — jamais visible par l'autre parent
      </div>

      <textarea
        style={{...S.inp,height:120,resize:"none",lineHeight:1.6}}
        value={newNote}
        onChange={e=>setNewNote(e.target.value)}
        placeholder="Remarque, rappel…"
        autoFocus
      />

      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <Btn color="#10b981" size="lg" onClick={saveNote}>
          {L.enregistrer}
        </Btn>

        {!!notes[dk(year,month,selDay)] && (
          <Btn color="#ef4444" size="lg" danger onClick={deleteNote}>
            Supprimer
          </Btn>
        )}

        <Btn color="#6b7280" size="lg" onClick={()=>setModal(null)}>
          {L.annuler}
        </Btn>
      </div>
    </div>
  </div>
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
