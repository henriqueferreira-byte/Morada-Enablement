import type { SupabaseClient } from "@supabase/supabase-js";

const TZ = "America/Sao_Paulo";

function toSaoPauloDateString(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}

function addDays(dateString: string, days: number): string {
  const d = new Date(`${dateString}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayOf(dateString: string): number {
  return new Date(`${dateString}T12:00:00Z`).getUTCDay(); // 0=Sun..6=Sat
}

function isBusinessDay(dateString: string): boolean {
  const day = weekdayOf(dateString);
  return day !== 0 && day !== 6;
}

/** The most recent business day at or before `dateString` — weekends collapse onto the preceding Friday, so gaps across a weekend never break the streak. */
function toBusinessDay(dateString: string): string {
  let cursor = dateString;
  while (!isBusinessDay(cursor)) cursor = addDays(cursor, -1);
  return cursor;
}

function previousBusinessDay(dateString: string): string {
  let cursor = addDays(dateString, -1);
  while (!isBusinessDay(cursor)) cursor = addDays(cursor, -1);
  return cursor;
}

function nextBusinessDay(dateString: string): string {
  let cursor = addDays(dateString, 1);
  while (!isBusinessDay(cursor)) cursor = addDays(cursor, 1);
  return cursor;
}

export type StreakInfo = {
  /** Consecutive business days (Mon–Fri) with at least one completed lesson — weekends are always skipped, never required and never breaking it. Grace on the current business day: doesn't drop until it ends without a completion. */
  currentStreak: number;
  /** Longest run of consecutive business days with a completion, ever. */
  bestStreak: number;
  /** True if at least one lesson was completed today. */
  completedToday: boolean;
  /** Seg→Dom booleans for the current calendar week (America/Sao_Paulo), true where at least one lesson was completed. Weekends are shown for context only — they never count toward the streak. */
  weekDays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
};

export async function getStreakInfo(
  supabase: SupabaseClient,
  userId: string,
): Promise<StreakInfo> {
  const { data } = await supabase
    .from("lesson_progress")
    .select("completed_at")
    .eq("user_id", userId);

  const completedDates = new Set(
    (data ?? []).map((row) => toSaoPauloDateString(new Date(row.completed_at))),
  );

  const today = toSaoPauloDateString(new Date());

  let cursor: string;
  if (isBusinessDay(today)) {
    cursor = completedDates.has(today) ? today : previousBusinessDay(today);
  } else {
    cursor = toBusinessDay(today);
  }

  let currentStreak = 0;
  while (completedDates.has(cursor)) {
    currentStreak += 1;
    cursor = previousBusinessDay(cursor);
  }

  const todayWeekday = weekdayOf(today);
  const mondayOffset = todayWeekday === 0 ? -6 : 1 - todayWeekday;
  const monday = addDays(today, mondayOffset);
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    completedDates.has(addDays(monday, i)),
  ) as StreakInfo["weekDays"];

  const sortedBusinessDates = [...completedDates].filter(isBusinessDay).sort();
  let bestStreak = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of sortedBusinessDates) {
    run = previous && nextBusinessDay(previous) === date ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = date;
  }

  return { currentStreak, bestStreak, completedToday: completedDates.has(today), weekDays };
}
