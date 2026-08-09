"use client";

import { useEffect, useState } from "react";
import { IconBulb, IconX } from "@tabler/icons-react";

const STORAGE_PREFIX = "hub-page-tip:";

export function PageTip({
  pageKey,
  title,
  description,
}: {
  pageKey: string;
  title: string;
  description: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(STORAGE_PREFIX + pageKey) !== "1");
  }, [pageKey]);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_PREFIX + pageKey, "1");
    setVisible(false);
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.04] px-4 py-3">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <IconBulb className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-foreground">{title}</p>
        <p className="mt-0.5 text-[13px] text-neutral-600">{description}</p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-primary/10 hover:text-primary"
        aria-label="Entendi, fechar dica"
      >
        <IconX className="size-4" />
      </button>
    </div>
  );
}
