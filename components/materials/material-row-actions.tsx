"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconTrash } from "@tabler/icons-react";
import { Button, toast } from "@/niemeyer/components";
import { getMaterialAccessUrl } from "@/lib/actions/materials";
import { deleteMaterial } from "@/lib/actions/gerenciar";
import { ConfirmDeleteDialog } from "@/components/gerenciar/confirm-delete-dialog";

export function MaterialRowActions({
  materialId,
  materialTitle,
  isLink,
  isAdmin,
}: {
  materialId: string;
  materialTitle: string;
  isLink: boolean;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [pendingKind, setPendingKind] = useState<"open" | "download" | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function handle(kind: "open" | "download") {
    setPendingKind(kind);
    try {
      const { url } = await getMaterialAccessUrl(materialId, kind);
      window.open(url, "_blank", "noreferrer");
    } catch {
      toast("Não foi possível abrir o arquivo. Tente novamente.");
    } finally {
      setPendingKind(null);
    }
  }

  return (
    <div className="flex shrink-0 justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        isLoading={pendingKind === "open"}
        disabled={pendingKind !== null}
        onClick={() => handle("open")}
      >
        Abrir
      </Button>
      {!isLink && (
        <Button
          variant="ghost"
          size="sm"
          isLoading={pendingKind === "download"}
          disabled={pendingKind !== null}
          onClick={() => handle("download")}
        >
          Baixar
        </Button>
      )}
      {isAdmin && (
        <>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label="Excluir material"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-400 outline-none hover:bg-destructive/10 hover:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <IconTrash className="size-4" />
          </button>
          <ConfirmDeleteDialog
            open={confirmingDelete}
            onOpenChange={setConfirmingDelete}
            title="Excluir material?"
            description={`"${materialTitle}" será removido do hub para sempre. Essa ação não pode ser desfeita.`}
            onConfirm={async () => {
              await deleteMaterial(materialId);
              toast("Material excluído.");
              router.refresh();
            }}
          />
        </>
      )}
    </div>
  );
}
