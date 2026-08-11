import Link from "next/link";
import { Button, EmptyState } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { isWithinDays } from "@/lib/format";
import { getProducts } from "@/lib/queries/catalog";
import {
  computeTrackProgress,
  getCompletedLessonIds,
  getTracksWithLessons,
} from "@/lib/queries/tracks";
import { FilterChip } from "@/components/tracks/filter-chip";
import { TrackGridCard } from "@/components/tracks/track-grid-card";
import { PageTip } from "@/components/onboarding/page-tip";

const STATUS_OPTIONS = [
  { value: "andamento", label: "Em andamento" },
  { value: "concluidas", label: "Concluídas" },
  { value: "nao", label: "Não iniciadas" },
] as const;

function buildHref(params: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const next = new URLSearchParams();
  const merged = { ...params, ...patch };
  for (const [key, value] of Object.entries(merged)) {
    if (value) next.set(key, value);
  }
  const query = next.toString();
  return `/trilhas${query ? `?${query}` : ""}`;
}

export default async function TrilhasPage({
  searchParams,
}: {
  searchParams: Promise<{ modulo?: string; status?: string; q?: string }>;
}) {
  const { supabase, user } = await requireUser();
  const { modulo, status, q } = await searchParams;

  const [products, tracks, completedLessonIds] = await Promise.all([
    getProducts(supabase),
    getTracksWithLessons(supabase),
    getCompletedLessonIds(supabase, user.id),
  ]);

  const withProgress = tracks.map((track) => ({
    track,
    progress: computeTrackProgress(track, completedLessonIds),
  }));

  const query = q?.trim().toLowerCase() ?? "";
  const filtered = withProgress.filter(({ track, progress }) => {
    if (modulo && track.product.id !== modulo) return false;
    if (status === "andamento" && progress.status !== "andamento") return false;
    if (status === "concluidas" && progress.status !== "concluida") return false;
    if (status === "nao" && progress.status !== "nao_iniciada") return false;
    if (query) {
      const haystack = [track.title, track.description ?? "", ...track.lessons.map((l) => l.title)]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  // Trilhas with a genuinely new published lesson float to the top with a
  // "NOVO" badge — content_updated_at only moves on real publishes, not on
  // metadata edits, so toggling a flag can't masquerade as new content.
  // Sort is stable, so ties keep their catalog order.
  filtered.sort((a, b) => {
    const aNew = !!a.track.content_updated_at && isWithinDays(a.track.content_updated_at, 7);
    const bNew = !!b.track.content_updated_at && isWithinDays(b.track.content_updated_at, 7);
    return aNew === bNew ? 0 : aNew ? -1 : 1;
  });

  const totalLessons = tracks.reduce((sum, t) => sum + t.lessons.length, 0);
  const params = { modulo, status, q };

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">Trilhas</h1>
        <p className="text-sm text-neutral-600">
          {tracks.length} trilhas · {totalLessons} aulas publicadas no hub
        </p>
      </div>

      <PageTip
        pageKey="trilhas"
        title="Como funcionam as trilhas"
        description="Cada trilha é uma sequência de aulas de um módulo do produto. Marque como vista, avalie ao final e conclua tudo para ganhar o certificado."
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip href={buildHref(params, { modulo: undefined })} active={!modulo}>
          Todos os módulos
        </FilterChip>
        {products.map((product) => (
          <FilterChip
            key={product.id}
            href={buildHref(params, { modulo: modulo === product.id ? undefined : product.id })}
            active={modulo === product.id}
          >
            {product.name}
          </FilterChip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <FilterChip
            key={option.value}
            href={buildHref(params, { status: status === option.value ? undefined : option.value })}
            active={status === option.value}
          >
            {option.label}
          </FilterChip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          variant="no-results"
          title="Nenhuma trilha com esses filtros"
          description="Limpe a busca ou volte para todos os módulos."
        >
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/trilhas">Limpar filtros</Link>
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(({ track, progress }) => (
            <TrackGridCard key={track.id} track={track} progress={progress} />
          ))}
        </div>
      )}
    </>
  );
}
