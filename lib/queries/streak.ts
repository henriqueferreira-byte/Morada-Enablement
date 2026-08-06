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

export type StreakInfo = {
  /** Consecutive days (through today or, if today has no completion yet, through yesterday) with at least one completed lesson. */
  currentStreak: number;
  /** Longest run of consecutive days with a completion, ever. */
  bestStreak: number;
  /** True if at least one lesson was completed today. */
  completedToday: boolean;
  /** Seg→Dom booleans for the current calendar week (America/Sao_Paulo), true where at least one lesson was completed. */
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
  let cursor = completedDates.has(today) ? today : addDays(today, -1);
  let currentStreak = 0;
  while (completedDates.has(cursor)) {
    currentStreak += 1;
    cursor = addDays(cursor, -1);
  }

  const todayWeekday = new Date(`${today}T12:00:00Z`).getUTCDay(); // 0=Sun..6=Sat
  const mondayOffset = todayWeekday === 0 ? -6 : 1 - todayWeekday;
  const monday = addDays(today, mondayOffset);
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    completedDates.has(addDays(monday, i)),
  ) as StreakInfo["weekDays"];

  const sortedDates = [...completedDates].sort();
  let bestStreak = 0;
  let run = 0;
  let previous: string | null = null;
  for (const date of sortedDates) {
    run = previous && addDays(previous, 1) === date ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    previous = date;
  }

  return { currentStreak, bestStreak, completedToday: completedDates.has(today), weekDays };
}
