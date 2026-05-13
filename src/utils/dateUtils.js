export function getPaques(y){
  const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),month=Math.floor((h+l-7*m+114)/31)-1,day=((h+l-7*m+114)%31)+1;
  return new Date(y,month,day);
}

export function getFeries(y){
  const p=getPaques(y),lp=new Date(p),asc=new Date(p),pent=new Date(p);
  lp.setDate(p.getDate()+1);
  asc.setDate(p.getDate()+39);
  pent.setDate(p.getDate()+50);

  return [
    {date:new Date(y,0,1),nom:"Jour de l'An 🎆"},
    {date:lp,nom:"Lundi de Pâques 🐣"},
    {date:new Date(y,4,1),nom:"Fête du Travail 🌹"},
    {date:new Date(y,4,8),nom:"Victoire 1945 🕊️"},
    {date:asc,nom:"Ascension ✝️"},
    {date:pent,nom:"Pentecôte 🕊️"},
    {date:new Date(y,6,14),nom:"Fête Nationale 🇫🇷"},
    {date:new Date(y,7,15),nom:"Assomption 🌸"},
    {date:new Date(y,10,1),nom:"Toussaint 🕯️"},
    {date:new Date(y,10,11),nom:"Armistice 🎖️"},
    {date:new Date(y,11,25),nom:"Noël 🎄"},
  ];
}

export function getFeteMeres(y){
  const p=getPaques(y),pent=new Date(p);
  pent.setDate(p.getDate()+49);

  let d=new Date(y,4,31);
  while(d.getDay()!==0)d.setDate(d.getDate()-1);

  if(d.toDateString()===pent.toDateString()){
    d=new Date(y,5,1);
    while(d.getDay()!==0)d.setDate(d.getDate()+1);
  }

  return d;
}

export function getFetePeres(y){
  let count=0,d=new Date(y,5,1);
  while(count<3){
    if(d.getDay()===0)count++;
    if(count<3)d.setDate(d.getDate()+1);
  }
  return d;
}

export function getAnneeSco(d){
  return d.getMonth()>=8 ? d.getFullYear() : d.getFullYear()-1;
}

export function getWN(d){
  const u=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));
  const day=u.getUTCDay()||7;
  u.setUTCDate(u.getUTCDate()+4-day);
  const y=new Date(Date.UTC(u.getUTCFullYear(),0,1));
  return Math.ceil((((u-y)/86400000)+1)/7);
}

export function dim(y,m){
  return new Date(y,m+1,0).getDate();
}

export function fdow(y,m){
  const d=new Date(y,m,1).getDay();
  return d===0 ? 6 : d-1;
}

export function dk(y,m,d){
  return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

export function h2r(h){
  const r=parseInt(h.slice(1,3),16);
  const g=parseInt(h.slice(3,5),16);
  const b=parseInt(h.slice(5,7),16);
  return `${r},${g},${b}`;
}

export function sd(a,b){
  return a.getFullYear()===b.getFullYear()
    && a.getMonth()===b.getMonth()
    && a.getDate()===b.getDate();
}
