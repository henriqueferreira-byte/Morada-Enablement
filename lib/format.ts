const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "agora" / "12 min" / "1h" / "há 2h" / "há 3 dias" / "há 2 semanas" / "há 3 meses". */
export function formatRelative(date: string | Date): string {
  const ms = Date.now() - new Date(date).getTime();
  if (ms < MINUTE) return "agora";
  if (ms < HOUR) return `há ${Math.round(ms / MINUTE)} min`;
  if (ms < DAY) return `há ${Math.round(ms / HOUR)}h`;
  const days = Math.round(ms / DAY);
  if (days < 7) return `há ${days} ${days === 1 ? "dia" : "dias"}`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return `há ${weeks} ${weeks === 1 ? "semana" : "semanas"}`;
  }
  const months = Math.round(days / 30);
  return `há ${months} ${months === 1 ? "mês" : "meses"}`;
}

export function isWithinDays(date: string | Date, days: number): boolean {
  return Date.now() - new Date(date).getTime() <= days * DAY;
}

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes === 0 ? `${hours}h` : `${hours}h ${String(minutes).padStart(2, "0")}`;
}
