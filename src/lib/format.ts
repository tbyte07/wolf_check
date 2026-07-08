// Compact German number formatting for views/likes: 1234 → "1.234",
// 2_400_000 → "2,4 Mio".
export function formatCount(n: number | null | undefined): string {
  const v = typeof n === "number" && isFinite(n) ? n : 0;
  if (v >= 1_000_000) {
    return `${(v / 1_000_000).toLocaleString("de-DE", {
      maximumFractionDigits: 1,
    })} Mio`;
  }
  if (v >= 10_000) {
    return `${Math.round(v / 1000).toLocaleString("de-DE")} Tsd`;
  }
  return v.toLocaleString("de-DE");
}

// "gefunden_am" relative date, e.g. "vor 3 Tagen" / "heute".
export function relativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  if (!isFinite(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days <= 0) return "heute";
  if (days === 1) return "gestern";
  if (days < 30) return `vor ${days} Tagen`;
  const months = Math.floor(days / 30);
  if (months === 1) return "vor 1 Monat";
  return `vor ${months} Monaten`;
}
