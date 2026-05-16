const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function ViewCal({
  S = {},
  L = {},
  month = 0,
  year = new Date().getFullYear(),
  setMonth = () => {},
  setYear = () => {},
  MOIS = [],
  cells = [],
  getCellData = () => null,
  colorA = "#6366f1",
  colorB = "#ec4899"
}) {
  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <>
