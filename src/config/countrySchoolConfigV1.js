export const SUPPORTED_COUNTRIES = {
  france: { id: "france", flag: "🇫🇷", label: "France", lang: "fr", zones: ["A", "B", "C"] },
  spain: { id: "spain", flag: "🇪🇸", label: "España", lang: "es", zones: ["Madrid", "Cataluña", "Andalucía", "Valencia", "Other"] },
  usa: { id: "usa", flag: "🇺🇸", label: "United States", lang: "en", zones: ["State / District"] },
  uk: { id: "uk", flag: "🇬🇧", label: "United Kingdom", lang: "en", zones: ["England", "Scotland", "Wales", "Northern Ireland"] },
  canada: { id: "canada", flag: "🇨🇦", label: "Canada", lang: "en", zones: ["Québec", "Ontario", "British Columbia", "Other"] },
  sweden: { id: "sweden", flag: "🇸🇪", label: "Sverige", lang: "sv", zones: ["Municipality"] },
  germany: { id: "germany", flag: "🇩🇪", label: "Deutschland", lang: "de", zones: ["Bundesland"] },
  italy: { id: "italy", flag: "🇮🇹", label: "Italia", lang: "it", zones: ["Region"] }
};

export function getCountryConfig(country = "france") {
  return SUPPORTED_COUNTRIES[country] || SUPPORTED_COUNTRIES.france;
}

export function getSchoolYearLabel(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = month >= 7 ? year : year - 1;
  return `${start}-${start + 1}`;
}

export function makeManualVacation({ name, startDate, endDate, country = "france", zone = "A" }) {
  return { id: `${country}-${zone}-${startDate}-${endDate}`, nom: name, debut: new Date(startDate), fin: new Date(endDate), country, zone, source: "manual" };
}
