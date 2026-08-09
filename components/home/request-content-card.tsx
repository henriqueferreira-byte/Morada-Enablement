"use client";

import { useState, useTransition } from "react";
import { IconFolder } from "@tabler/icons-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
  toast,
} from "@/niemeyer/components";
import { submitContentRequest } from "@/lib/actions/content-requests";

export function RequestContentCard({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    if (!message.trim()) return;

    startTransition(async () => {
      try {
        await submitContentRequest(message);
        toast("Solicitação enviada para o time de enablement.");
        setOpen(false);
        setMessage("");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Não foi possível enviar. Tente novamente.");
      }
    });
  }

  return (
    <>
      <div className="rounded-xl border border-neutral-150 bg-neutral-100 p-4">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <IconFolder className="size-4" />
          Faltou algum conteúdo?
        </p>
        <p className="mt-1 text-xs text-neutral-600">
          Peça um material novo para o time de enablement — respondemos em até 2 dias.
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => setOpen(true)}>
          Solicitar conteúdo
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Solicitar conteúdo</DialogTitle>
            <DialogDescription>
              De: {userName} ({userEmail})
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="O que está faltando? Ex: um deck sobre o novo fluxo de propostas."
            className="min-h-24"
            autoFocus
          />

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={!message.trim()} isLoading={isPending}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
