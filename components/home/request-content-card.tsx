"use client";

import { useState } from "react";
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

const REQUEST_EMAIL = process.env.NEXT_PUBLIC_CONTENT_REQUEST_EMAIL ?? "henrique.ferreira@morada.ai";

export function RequestContentCard({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim()) return;

    const subject = `Solicitação de conteúdo — Hub de Enablement (${userName})`;
    const body = `De: ${userName} (${userEmail})\n\n${message.trim()}`;
    const mailto = `mailto:${REQUEST_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    toast("Abrindo seu aplicativo de e-mail...");
    setOpen(false);
    setMessage("");
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
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSend} disabled={!message.trim()}>
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
