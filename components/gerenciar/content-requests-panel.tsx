"use client";

import { useTransition } from "react";
import { IconCheck } from "@tabler/icons-react";
import { Button, toast } from "@/niemeyer/components";
import { formatRelative } from "@/lib/format";
import { resolveContentRequest } from "@/lib/actions/content-requests";
import type { ContentRequestItem } from "@/lib/queries/gerenciar";

export function ContentRequestsPanel({ items }: { items: ContentRequestItem[] }) {
  const [isPending, startTransition] = useTransition();

  function handleResolve(id: string) {
    startTransition(async () => {
      try {
        await resolveContentRequest(id);
        toast("Solicitação marcada como resolvida.");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Não foi possível atualizar.");
      }
    });
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs">
      <h2 className="border-b border-border px-5 py-3 font-heading text-sm font-semibold text-foreground">
        Solicitações de conteúdo
      </h2>
      {items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">Nenhuma solicitação pendente.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3 border-b border-neutral-100 px-5 py-3 last:border-b-0">
              <div className="min-w-0">
                <p className="text-[13px] text-neutral-700">{item.message}</p>
                <p className="mt-1 text-[11px] text-neutral-400">
                  {item.userName ?? item.userEmail} · {formatRelative(item.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0"
                disabled={isPending}
                onClick={() => handleResolve(item.id)}
                aria-label="Marcar como resolvido"
              >
                <IconCheck className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
