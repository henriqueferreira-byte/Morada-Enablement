import Link from "next/link";
import { notFound } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getCompletedLessonIds,
  getLessonRatings,
  getTrackWithLessons,
  type LessonRating,
} from "@/lib/queries/tracks";
import { TrackDetailClient } from "@/components/tracks/track-detail-client";

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ trilha: string }>;
}) {
  const { trilha } = await params;
  const { supabase, user } = await requireUser();

  const track = await getTrackWithLessons(supabase, trilha);
  if (!track) notFound();

  const [completedLessonIds, ratingsMap, { data: feedbackRows }] = await Promise.all([
    getCompletedLessonIds(supabase, user.id),
    getLessonRatings(supabase),
    supabase
      .from("lesson_feedback")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", track.lessons.map((l) => l.id)),
  ]);

  const ratings: Record<string, LessonRating> = {};
  for (const [lessonId, rating] of ratingsMap) ratings[lessonId] = rating;

  return (
    <>
      <Link
        href="/trilhas"
        className="flex w-fit items-center gap-1.5 text-[13px] font-bold text-neutral-600 hover:text-primary"
      >
        <IconChevronLeft className="size-4" />
        Todas as trilhas
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: track.product.accent }}
            aria-hidden
          />
          <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            {track.product.name}
          </span>
        </div>
        <h1 className="font-heading text-[30px] font-semibold tracking-tight text-foreground">
          {track.title}
        </h1>
        {track.description && (
          <p className="max-w-[64ch] text-[15px] text-neutral-600">{track.description}</p>
        )}
      </div>

      <TrackDetailClient
        track={track}
        initialCompletedIds={[...completedLessonIds]}
        ratings={ratings}
        ratedLessonIds={(feedbackRows ?? []).map((row) => row.lesson_id)}
      />
    </>
  );
}
