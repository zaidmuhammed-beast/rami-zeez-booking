export function formatPkr(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

/** Pakistan-local timestamp, so admin views read the same on any server. */
export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Karachi",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
