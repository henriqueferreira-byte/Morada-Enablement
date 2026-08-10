"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash } from "@tabler/icons-react";
import { Badge, toast } from "@/niemeyer/components";
import { formatRelative } from "@/lib/format";
import type { PublicationItem } from "@/lib/queries/gerenciar";
import { deleteLesson, deleteMaterial } from "@/lib/actions/gerenciar";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";

export function RecentPublications({ items }: { items: PublicationItem[] }) {
  const router = useRouter();
  const [toDelete, setToDelete] = useState<PublicationItem | null>(null);

  async function handleConfirm() {
    if (!toDelete) return;
    if (toDelete.kind === "material") {
      await deleteMaterial(toDelete.id);
    } else {
      await deleteLesson(toDelete.id);
    }
    toast(toDelete.kind === "material" ? "Material excluído." : "Aula excluída.");
    router.refresh();
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-xs">
      <h2 className="border-b border-border px-5 py-3 font-heading text-sm font-semibold text-foreground">
        Publicados recentemente
      </h2>
      {items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">Nada publicado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2 p-3">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`} className="rounded-lg border border-neutral-150 bg-neutral-50 px-3.5 py-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-bold text-foreground">{item.title}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={item.status === "published" ? "success" : "secondary"}>
                    {item.status === "published" ? "Publicado" : "Rascunho"}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => setToDelete(item)}
                    aria-label={item.kind === "material" ? "Excluir material" : "Excluir aula"}
                    className="flex size-6 items-center justify-center rounded-md text-neutral-400 outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <IconTrash className="size-3.5" />
                  </button>
                </div>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                {item.locationLabel} · {formatRelative(item.createdAt)}
                {item.authorName ? `, por ${item.authorName}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={toDelete?.kind === "material" ? "Excluir material?" : "Excluir aula?"}
        description={`"${toDelete?.title}" será removido do hub para sempre${
          toDelete?.kind === "lesson" ? ", junto com o progresso e as avaliações registradas nela" : ""
        }. Essa ação não pode ser desfeita.`}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
