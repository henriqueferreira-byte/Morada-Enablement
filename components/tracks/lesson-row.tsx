"use client";

import { useState } from "react";
import { IconCheck, IconExternalLink, IconTrash } from "@tabler/icons-react";
import { Badge, Button, toast } from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import { LESSON_TYPE_META } from "@/lib/lesson-types";
import { getLessonAccessUrl } from "@/lib/actions/progress";
import type { LessonRating, LessonRow as LessonRowData } from "@/lib/queries/tracks";
import { ConfirmDeleteDialog } from "@/components/gerenciar/confirm-delete-dialog";
import { LessonVideoPlayer } from "./lesson-video-player";

export function LessonRow({
  lesson,
  index,
  isDone,
  rating,
  hasRated,
  onToggle,
  onAutoComplete,
  isPending,
  isAdmin = false,
  onDelete,
}: {
  lesson: LessonRowData;
  index: number;
  isDone: boolean;
  rating?: LessonRating;
  hasRated: boolean;
  onToggle: () => void;
  onAutoComplete: () => void;
  isPending: boolean;
  isAdmin?: boolean;
  onDelete?: () => Promise<void>;
}) {
  const typeMeta = LESSON_TYPE_META[lesson.kind];
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [openingLink, setOpeningLink] = useState(false);

  const hasContent = !!(lesson.storage_path || lesson.external_url);
  const isPlayableVideo = lesson.kind === "video" && !!lesson.storage_path;

  async function handleOpenLink() {
    setOpeningLink(true);
    try {
      const { url } = await getLessonAccessUrl(lesson.id, "open");
      window.open(url, "_blank", "noreferrer");
    } catch {
      toast("Não foi possível abrir o arquivo. Tente novamente.");
    } finally {
      setOpeningLink(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card px-[18px] py-3.5 shadow-xs transition-colors hover:border-neutral-300">
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onToggle}
          disabled={isPending}
          aria-label={isDone ? "Marcar como não vista" : "Marcar como vista"}
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
            isDone
              ? "border-primary bg-primary text-primary-foreground"
              : "border-neutral-200 bg-white text-neutral-400",
          )}
        >
          {isDone ? <IconCheck className="size-4" strokeWidth={3} /> : index + 1}
        </button>

        <div className="min-w-0 flex-1">
          <p className="font-heading text-[15px] font-semibold text-foreground">{lesson.title}</p>
          <p className="text-xs text-neutral-500">
            {lesson.duration_min} min
            {lesson.source_label ? ` · ${lesson.source_label}` : ""}
            {rating ? ` · ${rating.avgStars.toFixed(1).replace(".", ",")} (${rating.ratingsCount} avaliações)` : ""}
            {hasRated ? " · você avaliou" : ""}
          </p>
        </div>

        <Badge variant={typeMeta.badgeVariant} className="shrink-0">
          {typeMeta.label}
        </Badge>

        {isPlayableVideo ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPlayer((prev) => !prev)}
            className="shrink-0"
          >
            {showPlayer ? "Ocultar vídeo" : "Assistir"}
          </Button>
        ) : (
          hasContent && (
            <Button
              variant="outline"
              size="sm"
              isLoading={openingLink}
              onClick={handleOpenLink}
              className="shrink-0"
            >
              <IconExternalLink className="size-3.5" />
              Abrir
            </Button>
          )
        )}

        <Button variant="ghost" size="sm" onClick={onToggle} disabled={isPending} className="shrink-0">
          {isDone ? "Refazer" : "Marcar como vista"}
        </Button>
        {isAdmin && onDelete && (
          <>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Excluir aula"
              className="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-400 outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <IconTrash className="size-4" />
            </button>
            <ConfirmDeleteDialog
              open={confirmingDelete}
              onOpenChange={setConfirmingDelete}
              title="Excluir aula?"
              description={`"${lesson.title}" será removida da trilha para sempre, junto com o progresso e as avaliações registradas nela. Essa ação não pode ser desfeita.`}
              onConfirm={onDelete}
            />
          </>
        )}
      </div>

      {isPlayableVideo && showPlayer && (
        <LessonVideoPlayer lessonId={lesson.id} onAutoComplete={onAutoComplete} />
      )}
    </div>
  );
}
