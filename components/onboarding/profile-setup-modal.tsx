"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@/niemeyer/components";
import { saveProfileDetails } from "@/lib/actions/profile";
import { TEAM_LABELS, TEAM_OPTIONS } from "@/lib/teams";

export function ProfileSetupModal({
  open,
  mandatory,
  initialJobTitle,
  initialTeam,
  onComplete,
  onCancel,
}: {
  open: boolean;
  /** First-login setup: can't be dismissed without saving. Editing later can be cancelled. */
  mandatory: boolean;
  initialJobTitle: string;
  initialTeam: string;
  onComplete: () => void;
  onCancel?: () => void;
}) {
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  const [team, setTeam] = useState(initialTeam);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setJobTitle(initialJobTitle);
      setTeam(initialTeam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit() {
    if (!jobTitle.trim() || !team) return;

    startTransition(async () => {
      try {
        await saveProfileDetails({ jobTitle, team });
        onComplete();
      } catch (err) {
        toast(err instanceof Error ? err.message : "Não foi possível salvar. Tente novamente.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !mandatory && onCancel?.()}>
      <DialogContent
        showCloseButton={!mandatory}
        onEscapeKeyDown={(e) => mandatory && e.preventDefault()}
        onPointerDownOutside={(e) => mandatory && e.preventDefault()}
        onInteractOutside={(e) => mandatory && e.preventDefault()}
        className="sm:max-w-[440px]"
      >
        <DialogHeader>
          {mandatory && (
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Antes de começar
            </span>
          )}
          <DialogTitle>Conte um pouco sobre você</DialogTitle>
          <DialogDescription>
            Isso ajuda a mostrar conteúdo mais relevante para o seu dia a dia.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Qual é o seu cargo?</label>
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Ex: Analista de CS, SDR, Growth..."
              autoFocus
              className="h-10 w-full rounded-lg border border-neutral-200 bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Qual time você faz parte?</label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha seu time" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {TEAM_LABELS[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {!mandatory && (
            <Button variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancelar
            </Button>
          )}
          <Button
            className={mandatory ? "w-full justify-center" : ""}
            disabled={!jobTitle.trim() || !team}
            isLoading={isPending}
            onClick={handleSubmit}
          >
            {mandatory ? "Continuar" : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
