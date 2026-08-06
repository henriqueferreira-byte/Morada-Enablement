import type { SupabaseClient } from "@supabase/supabase-js";
import { isWithinDays } from "@/lib/format";
import { getStreakInfo } from "./streak";
import { computeTrackProgress, getTracksWithLessons, type TrackRow } from "./tracks";

export type ProdutoProgress = {
  id: string;
  name: string;
  accent: string;
  done: number;
  total: number;
  pct: number;
};

export type Certificate = {
  trackId: string;
  trackTitle: string;
  productName: string;
  completedAt: string;
};

export async function getProgressoData(supabase: SupabaseClient, userId: string) {
  const [tracks, { data: progressRows }, streak] = await Promise.all([
    getTracksWithLessons(supabase),
    supabase.from("lesson_progress").select("lesson_id, completed_at").eq("user_id", userId),
    getStreakInfo(supabase, userId),
  ]);

  const completedAtByLesson = new Map<string, string>(
    (progressRows ?? []).map((row) => [row.lesson_id as string, row.completed_at as string]),
  );
  const completedLessonIds = new Set(completedAtByLesson.keys());

  const withProgress = tracks.map((track) => ({
    track,
    progress: computeTrackProgress(track, completedLessonIds),
  }));

  const allLessons = tracks.flatMap((t) => t.lessons);
  const completedLessons = allLessons.filter((l) => completedLessonIds.has(l.id));
  const totalStudyMin = completedLessons.reduce((sum, l) => sum + l.duration_min, 0);
  const studyMinThisWeek = completedLessons
    .filter((l) => isWithinDays(completedAtByLesson.get(l.id)!, 7))
    .reduce((sum, l) => sum + l.duration_min, 0);
  const lessonsThisWeek = completedLessons.filter((l) => isWithinDays(completedAtByLesson.get(l.id)!, 7)).length;

  const kpis = {
    aulasConcluidas: completedLessons.length,
    aulasConcluidasDelta: lessonsThisWeek,
    aulasPendentes: allLessons.length - completedLessons.length,
    trilhasConcluidas: withProgress.filter((t) => t.progress.status === "concluida").length,
    trilhasEmAndamento: withProgress.filter((t) => t.progress.status === "andamento").length,
    totalTrilhas: tracks.length,
    ofensivaAtual: streak.currentStreak,
    ofensivaMelhor: streak.bestStreak,
    tempoDeEstudoMin: totalStudyMin,
    tempoDeEstudoDeltaMin: studyMinThisWeek,
    mediaPorAulaMin: completedLessons.length ? Math.round(totalStudyMin / completedLessons.length) : 0,
  };

  const produtoMap = new Map<string, ProdutoProgress>();
  for (const { track, progress } of withProgress) {
    const existing = produtoMap.get(track.product.id) ?? {
      id: track.product.id,
      name: track.product.name,
      accent: track.product.accent,
      done: 0,
      total: 0,
      pct: 0,
    };
    existing.done += progress.done;
    existing.total += progress.total;
    produtoMap.set(track.product.id, existing);
  }
  const progressoPorProduto = [...produtoMap.values()].map((p) => ({
    ...p,
    pct: p.total === 0 ? 0 : Math.round((p.done / p.total) * 100),
  }));

  const certificates: Certificate[] = withProgress
    .filter((t) => t.progress.status === "concluida")
    .map(({ track }) => {
      const completedAt = track.lessons
        .map((l) => completedAtByLesson.get(l.id))
        .filter((d): d is string => !!d)
        .sort()
        .at(-1)!;
      return {
        trackId: track.id,
        trackTitle: track.title,
        productName: track.product.name,
        completedAt,
      };
    })
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  // Prefer a track already in progress (continue what you started) over one
  // not started yet, same priority Home gives "Continuar de onde parei".
  const pendingByRecency = (list: typeof withProgress) =>
    [...list].sort((a, b) => new Date(b.track.updated_at).getTime() - new Date(a.track.updated_at).getTime());
  const inProgress = pendingByRecency(withProgress.filter((t) => t.progress.status === "andamento"));
  const notStarted = pendingByRecency(withProgress.filter((t) => t.progress.status === "nao_iniciada"));
  const nextPendingLesson = inProgress[0] ?? notStarted[0];

  return {
    kpis,
    progressoPorProduto,
    certificates,
    streak,
    nextPendingTrackId: nextPendingLesson?.track.id ?? null,
  };
}
