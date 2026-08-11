"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";
import { Button, Progress, toast } from "@/niemeyer/components";
import { completeLesson, uncompleteLesson } from "@/lib/actions/progress";
import { deleteLesson } from "@/lib/actions/gerenciar";
import { formatDuration, formatRelative } from "@/lib/format";
import type { LessonRating, TrackRow } from "@/lib/queries/tracks";
import { LessonRow } from "./lesson-row";
import { LessonFeedbackModal } from "./lesson-feedback-modal";

export function TrackDetailClient({
  track,
  initialCompletedIds,
  ratings,
  ratedLessonIds,
  isAdmin = false,
}: {
  track: TrackRow;
  initialCompletedIds: string[];
  ratings: Record<string, LessonRating>;
  ratedLessonIds: string[];
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(new Set(initialCompletedIds));
  const [rated, setRated] = useState(new Set(ratedLessonIds));
  const [skippedThisSession, setSkippedThisSession] = useState(new Set<string>());
  const [feedbackLessonId, setFeedbackLessonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const total = track.lessons.length;
  const done = track.lessons.filter((l) => completed.has(l.id)).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const durationMin = track.lessons.reduce((sum, l) => sum + l.duration_min, 0);
  const nextLesson = track.lessons.find((l) => !completed.has(l.id));
  const nextLessonIndex = nextLesson ? track.lessons.findIndex((l) => l.id === nextLesson.id) : -1;

  function handleToggle(lessonId: string) {
    const isDone = completed.has(lessonId);
    startTransition(async () => {
      if (isDone) {
        setCompleted((prev) => {
          const next = new Set(prev);
          next.delete(lessonId);
          return next;
        });
        await uncompleteLesson(lessonId, track.id);
      } else {
        setCompleted((prev) => new Set(prev).add(lessonId));
        const { alreadyRated } = await completeLesson(lessonId, track.id);
        if (!alreadyRated && !rated.has(lessonId) && !skippedThisSession.has(lessonId)) {
          setFeedbackLessonId(lessonId);
        }
      }
    });
  }

  function handleAutoComplete(lessonId: string) {
    if (!completed.has(lessonId)) handleToggle(lessonId);
  }

  const feedbackLesson = track.lessons.find((l) => l.id === feedbackLessonId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="flex flex-col gap-2.5">
        {track.coming_soon && (
          <div className="rounded-xl border border-warning-border bg-warning-background px-4 py-3 text-sm text-warning-text">
            Esta trilha ainda está em preparação — o conteúdo completo chega em breve.
          </div>
        )}
        {track.lessons.map((lesson, index) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            index={index}
            isDone={completed.has(lesson.id)}
            rating={ratings[lesson.id]}
            hasRated={rated.has(lesson.id)}
            isPending={isPending}
            onToggle={() => handleToggle(lesson.id)}
            onAutoComplete={() => handleAutoComplete(lesson.id)}
            isAdmin={isAdmin}
            onDelete={async () => {
              await deleteLesson(lesson.id);
              toast("Aula excluída.");
              router.refresh();
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="font-heading text-sm font-semibold text-foreground">Seu progresso</p>
          <p className="mt-1 font-heading text-[22px] font-semibold text-primary">{pct}%</p>
          <Progress value={pct} className="mt-2 h-2" />
          <p className="mt-2 text-xs text-neutral-500">
            {done} de {total} aulas · {formatDuration(durationMin)} de conteúdo
          </p>
          {pct === 100 ? (
            <Button disabled className="mt-4 w-full justify-center">
              Trilha concluída
            </Button>
          ) : nextLesson?.external_url ? (
            <Button asChild className="mt-4 w-full justify-center">
              <a href={nextLesson.external_url} target="_blank" rel="noreferrer">
                Começar aula {nextLessonIndex + 1}
              </a>
            </Button>
          ) : (
            <Button disabled className="mt-4 w-full justify-center">
              Começar aula {nextLessonIndex + 1}
            </Button>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
          <p className="text-[13px] text-neutral-600">Para quem é</p>
          <p className="mt-1 text-sm text-foreground">{track.audience}</p>
          <div className="my-4 border-t border-neutral-100" />
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Responsável</p>
          <p className="mt-1.5 text-[13px] font-bold text-foreground">{track.owner_name ?? "Time de enablement"}</p>
          {track.owner_role && <p className="text-xs text-neutral-500">{track.owner_role}</p>}
          <div className="my-4 border-t border-neutral-100" />
          <p className="text-xs text-neutral-500">Atualizada {formatRelative(track.updated_at)}</p>
        </div>

        {track.feature && (
          <Link
            href={`/materiais/${track.product.id}/${track.feature.id}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div>
              <p className="text-[13px] font-bold text-foreground">Materiais de {track.feature.name}</p>
              <p className="text-xs text-neutral-500">Decks, PDFs e links que complementam esta trilha.</p>
            </div>
            <IconArrowRight className="size-4 shrink-0 text-neutral-400" />
          </Link>
        )}
      </div>

      {feedbackLesson && (
        <LessonFeedbackModal
          open={!!feedbackLessonId}
          onOpenChange={(open) => {
            if (!open) {
              setSkippedThisSession((prev) => new Set(prev).add(feedbackLesson.id));
              setFeedbackLessonId(null);
            }
          }}
          onSubmitted={() => setRated((prev) => new Set(prev).add(feedbackLesson.id))}
          lessonId={feedbackLesson.id}
          lessonTitle={feedbackLesson.title}
          trackTitle={track.title}
        />
      )}
    </div>
  );
}
