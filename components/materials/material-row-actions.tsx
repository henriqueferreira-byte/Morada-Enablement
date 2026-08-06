"use client";

import { useState } from "react";
import { Button, toast } from "@/niemeyer/components";
import { getMaterialAccessUrl } from "@/lib/actions/materials";

export function MaterialRowActions({
  materialId,
  isLink,
}: {
  materialId: string;
  isLink: boolean;
}) {
  const [pendingKind, setPendingKind] = useState<"open" | "download" | null>(null);

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
    </div>
  );
}
