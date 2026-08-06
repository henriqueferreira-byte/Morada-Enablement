import Link from "next/link";
import { Progress } from "@/niemeyer/components";
import type { TrackRow, TrackProgress } from "@/lib/queries/tracks";

export function ContinueTrackCard({
  track,
  progress,
}: {
  track: TrackRow;
  progress: TrackProgress;
}) {
  return (
    <Link
      href={`/trilhas/${track.id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-[18px] shadow-xs transition-colors hover:border-neutral-300"
    >
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
      <h3 className="font-heading text-base font-semibold text-foreground">{track.title}</h3>
      {progress.nextLesson && (
        <p className="text-[13px] text-neutral-600">
          Próxima aula: {progress.nextLesson.title}
        </p>
      )}
      <div className="mt-auto flex items-center gap-3">
        <Progress value={progress.pct} className="h-1.5" />
        <span className="shrink-0 text-xs font-bold text-foreground">{progress.pct}%</span>
      </div>
      <span className="text-xs text-neutral-500">
        {progress.done} de {progress.total} aulas
      </span>
    </Link>
  );
}
