import Link from "next/link";
import { Badge, Progress } from "@/niemeyer/components";
import { formatDuration } from "@/lib/format";
import { TRACK_STATUS_META } from "@/lib/track-status";
import type { TrackRow, TrackProgress } from "@/lib/queries/tracks";

export function TrackGridCard({
  track,
  progress,
}: {
  track: TrackRow;
  progress: TrackProgress;
}) {
  const statusMeta = TRACK_STATUS_META[progress.status];

  return (
    <Link
      href={`/trilhas/${track.id}`}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div className="flex items-center justify-between gap-2">
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
        <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
      </div>

      <h3 className="font-heading text-lg font-semibold text-foreground">{track.title}</h3>
      {track.description && (
        <p className="text-[13px] text-neutral-600" style={{ textWrap: "pretty" }}>
          {track.description}
        </p>
      )}

      <div className="flex items-center gap-1.5 text-xs text-neutral-500">
        <span>{progress.done} de {progress.total} aulas</span>
        <span aria-hidden>·</span>
        <span>{formatDuration(progress.durationMin)}</span>
        <span aria-hidden>·</span>
        <span>{track.level}</span>
      </div>

      <div className="mt-1 flex items-center gap-3">
        <Progress value={progress.pct} className="h-1.5" />
        <span className="shrink-0 text-xs font-bold text-foreground">{progress.pct}%</span>
      </div>
    </Link>
  );
}
