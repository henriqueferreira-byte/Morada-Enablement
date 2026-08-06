export function MaterialFileWell({ ext }: { ext: string }) {
  return (
    <span className="flex size-[34px] shrink-0 items-center justify-center rounded-lg bg-primary/[0.08] font-mono text-[10px] font-bold text-primary">
      {ext}
    </span>
  );
}
