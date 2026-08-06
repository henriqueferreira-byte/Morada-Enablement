"use client";

import { useState, useTransition } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Textarea,
  toast,
} from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import { submitFeedback } from "@/lib/actions/feedback";

const TAGS = [
  "Clara e direta",
  "Faltou exemplo prático",
  "Longa demais",
  "Conteúdo desatualizado",
  "Vou usar hoje",
];

export function LessonFeedbackModal({
  open,
  onOpenChange,
  onSubmitted,
  lessonId,
  lessonTitle,
  trackTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
  lessonId: string;
  lessonTitle: string;
  trackTitle: string;
}) {
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();

  function reset() {
    setStars(0);
    setHoverStars(0);
    setTags([]);
    setComment("");
  }

  function handleSkip() {
    onOpenChange(false);
    reset();
  }

  function handleSend() {
    startTransition(async () => {
      await submitFeedback({ lessonId, stars: stars || 5, tags, comment });
      toast("Avaliação enviada. Obrigado!");
      onSubmitted();
      onOpenChange(false);
      reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleSkip()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            Aula concluída
          </span>
          <DialogTitle className="text-lg">{lessonTitle}</DialogTitle>
          <DialogDescription>{trackTitle}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">Essa aula te ajudou?</p>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = (hoverStars || stars) >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setStars(n)}
                    onMouseEnter={() => setHoverStars(n)}
                    onMouseLeave={() => setHoverStars(0)}
                    className="flex size-10 items-center justify-center text-neutral-300 hover:text-neutral-400"
                    aria-label={`${n} de 5 estrelas`}
                  >
                    {filled ? (
                      <IconStarFilled className="size-7 text-primary" />
                    ) : (
                      <IconStar className="size-7" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-foreground">O que descreve melhor?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      setTags((prev) =>
                        active ? prev.filter((t) => t !== tag) : [...prev, tag],
                      )
                    }
                    className={cn(
                      "flex h-8 items-center rounded-full border px-3 text-[13px] transition-colors",
                      active
                        ? "border-primary bg-primary font-bold text-primary-foreground"
                        : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
                    )}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Quer detalhar? O que faltou, o que atualizar (opcional)"
            className="min-h-20"
          />
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <p className="text-xs text-neutral-500">Só o time de enablement vê sua resposta.</p>
          <div className="flex shrink-0 gap-2">
            <Button variant="ghost" onClick={handleSkip} disabled={isPending}>
              Pular
            </Button>
            <Button onClick={handleSend} isLoading={isPending}>
              Enviar avaliação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
