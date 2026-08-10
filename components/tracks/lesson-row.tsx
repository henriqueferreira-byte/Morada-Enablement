"use client";

import { useState } from "react";
import { IconCheck, IconTrash } from "@tabler/icons-react";
import { Badge, Button } from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import { LESSON_TYPE_META } from "@/lib/lesson-types";
import type { LessonRating, LessonRow as LessonRowData } from "@/lib/queries/tracks";
import { ConfirmDeleteDialog } from "@/components/gerenciar/confirm-delete-dialog";

export function LessonRow({
  lesson,
  index,
  isDone,
  rating,
  hasRated,
  onToggle,
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
  isPending: boolean;
  isAdmin?: boolean;
  onDelete?: () => Promise<void>;
}) {
  const typeMeta = LESSON_TYPE_META[lesson.kind];
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex items-center gap-3.5 rounded-xl border border-border bg-card px-[18px] py-3.5 shadow-xs transition-colors hover:border-neutral-300">
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
  );
}
