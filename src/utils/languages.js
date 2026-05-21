export const LANGUAGES = {
  fr: { label: "Français", flag: "🇫🇷", locale: "fr-FR", months: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"], days: ["L","M","M","J","V","S","D"], slogan: "La coparentalité organisée intelligemment." },
  en: { label: "English", flag: "🇬🇧", locale: "en-GB", months: ["January","February","March","April","May","June","July","August","September","October","November","December"], days: ["M","T","W","T","F","S","S"], slogan: "Smart co-parenting made simple." },
  es: { label: "Español", flag: "🇪🇸", locale: "es-ES", months: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"], days: ["L","M","M","J","V","S","D"], slogan: "La coparentalidad organizada inteligentemente." },
  sv: { label: "Svenska", flag: "🇸🇪", locale: "sv-SE", months: ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"], days: ["M","T","O","T","F","L","S"], slogan: "Smart organiserad samföräldraskap." },
  de: { label: "Deutsch", flag: "🇩🇪", locale: "de-DE", months: ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], days: ["M","D","M","D","F","S","S"], slogan: "Intelligente Organisation für Co-Parenting." },
  it: { label: "Italiano", flag: "🇮🇹", locale: "it-IT", months: ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"], days: ["L","M","M","G","V","S","D"], slogan: "La co-genitorialità organizzata in modo intelligente." }
};

export const SUPPORTED_LANGUAGES = ["fr", "en", "es", "sv", "de", "it"];

export function getLanguage(code) {
  return LANGUAGES[code] || LANGUAGES.fr;
}
