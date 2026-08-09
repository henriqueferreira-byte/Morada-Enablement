import type { SupabaseClient } from "@supabase/supabase-js";
import { isWithinDays } from "@/lib/format";
import { getNovidades } from "./novidades";
import { getRecentMaterials } from "./materials";
import {
  computeTrackProgress,
  getCompletedLessonIds,
  getTracksWithLessons,
  type TrackRow,
  type TrackProgress,
} from "./tracks";

const TEAM_TO_PRODUCT: Record<string, string | undefined> = {
  vendas: "vendas",
  suporte: "relacionamento",
  onboarding: "transversal",
  marketing: "relacionamento",
  marketing_produto: "institucional",
  produto: undefined,
  tecnologia: undefined,
};

export function greetingForHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

export async function getHomeData(supabase: SupabaseClient, userId: string, team: string | null) {
  const [tracks, completedLessonIds, novidades, recentMaterials] = await Promise.all([
    getTracksWithLessons(supabase),
    getCompletedLessonIds(supabase, userId),
    getNovidades(supabase, 6),
    getRecentMaterials(supabase, 3),
  ]);

  const withProgress = tracks.map((track) => ({
    track,
    progress: computeTrackProgress(track, completedLessonIds),
  }));

  const continueTracks = withProgress
    .filter((t) => t.progress.status === "andamento" && !t.track.coming_soon)
    .sort((a, b) => new Date(b.track.updated_at).getTime() - new Date(a.track.updated_at).getTime())
    .slice(0, 3);

  const preferredProduct = team ? TEAM_TO_PRODUCT[team] : undefined;
  const recommendedTracks = withProgress
    .filter((t) => t.progress.status === "nao_iniciada" && !t.track.coming_soon)
    .sort((a, b) => {
      const aMatch = a.track.product.id === preferredProduct ? 0 : 1;
      const bMatch = b.track.product.id === preferredProduct ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 2);

  const pendingLessonsInStarted = continueTracks.reduce(
    (sum, t) => sum + (t.progress.total - t.progress.done),
    0,
  );

  const weekSummary = {
    aulasConcluidas: tracks.flatMap((t) => t.lessons).filter((l) => completedLessonIds.has(l.id)).length,
    trilhasEmAndamento: withProgress.filter((t) => t.progress.status === "andamento").length,
    conteudosNovos: novidades.filter((n) => isWithinDays(n.publishedAt, 7)).length,
    certificados: withProgress.filter((t) => t.progress.status === "concluida").length,
  };

  return {
    continueTracks: continueTracks as { track: TrackRow; progress: TrackProgress }[],
    recommendedTracks: recommendedTracks as { track: TrackRow; progress: TrackProgress }[],
    novidades,
    recentMaterials,
    weekSummary,
    pendingLessonsInStarted,
    totalTracks: tracks.length,
  };
}
