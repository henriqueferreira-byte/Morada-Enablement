import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/server";

export type UserTrackProgress = {
  trackId: string;
  trackTitle: string;
  done: number;
  total: number;
};

export type DirectoryUser = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  team: string | null;
  jobTitle: string | null;
  role: "member" | "admin" | "leader";
  leadsTeam: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  tracks: UserTrackProgress[];
};

export async function getUserDirectory(supabase: SupabaseClient): Promise<DirectoryUser[]> {
  const [{ data: profiles }, { data: tracksData }, { data: progressRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url, team, job_title, role, leads_team, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("tracks").select("id, title, lessons(id)"),
    supabase
      .from("lesson_progress")
      .select("user_id, lessons!lesson_progress_lesson_id_fkey(track_id)"),
  ]);

  const trackLessonCount = new Map<string, number>();
  const trackTitleById = new Map<string, string>();
  for (const track of (tracksData ?? []) as any[]) {
    trackLessonCount.set(track.id, (track.lessons ?? []).length);
    trackTitleById.set(track.id, track.title);
  }

  const doneByUserAndTrack = new Map<string, Map<string, number>>();
  for (const row of (progressRows ?? []) as any[]) {
    const trackId = row.lessons?.track_id;
    if (!trackId) continue;
    if (!doneByUserAndTrack.has(row.user_id)) doneByUserAndTrack.set(row.user_id, new Map());
    const perTrack = doneByUserAndTrack.get(row.user_id)!;
    perTrack.set(trackId, (perTrack.get(trackId) ?? 0) + 1);
  }

  // Last sign-in lives on auth.users, which is only reachable with the
  // service-role key — best-effort, since that key may be absent locally.
  const lastSignInById = new Map<string, string | null>();
  try {
    const { data } = await createAdminClient().auth.admin.listUsers({ perPage: 200 });
    for (const authUser of data.users) lastSignInById.set(authUser.id, authUser.last_sign_in_at ?? null);
  } catch {
    // no-op — the directory still renders without "último acesso".
  }

  return (profiles ?? []).map((profile) => {
    const perTrack = doneByUserAndTrack.get(profile.id) ?? new Map<string, number>();
    const tracks: UserTrackProgress[] = [...perTrack.entries()].map(([trackId, done]) => ({
      trackId,
      trackTitle: trackTitleById.get(trackId) ?? trackId,
      done,
      total: trackLessonCount.get(trackId) ?? 0,
    }));

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      team: profile.team,
      jobTitle: profile.job_title,
      role: profile.role,
      leadsTeam: profile.leads_team,
      createdAt: profile.created_at,
      lastSignInAt: lastSignInById.get(profile.id) ?? null,
      tracks,
    };
  });
}
