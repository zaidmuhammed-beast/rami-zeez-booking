export function daysUntil(dateStr: string) {
  const now = Date.now();
  return Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - now) / (1000 * 60 * 60 * 24))
  );
}
