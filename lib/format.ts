export function inrCr(valueCr: number) {
  return `₹${valueCr.toFixed(1)} Cr`;
}

export function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
