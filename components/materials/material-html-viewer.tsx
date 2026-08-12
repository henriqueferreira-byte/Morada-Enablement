"use client";

import { IconArrowUpRight } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/niemeyer/components";

export function MaterialHtmlViewer({
  open,
  onOpenChange,
  url,
  title,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[88vh] w-[95vw] max-w-6xl flex-col gap-0 p-0 sm:max-w-6xl">
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-border px-5 py-3">
          <DialogTitle className="truncate text-[15px]">{title}</DialogTitle>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mr-8 flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
          >
            Abrir em nova aba
            <IconArrowUpRight className="size-3.5" />
          </a>
        </DialogHeader>
        <iframe src={url} title={title} className="min-h-0 flex-1 border-0" />
      </DialogContent>
    </Dialog>
  );
}
