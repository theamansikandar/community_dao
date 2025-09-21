export function badgeColor(status) {
  if (status === "passed") return "success";
  if (status === "rejected") return "danger";
  return "warn";
}

export function fmt(n, max = 2) {
  return Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: max });
}

export function short(addr) {
  return addr?.length > 10 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}