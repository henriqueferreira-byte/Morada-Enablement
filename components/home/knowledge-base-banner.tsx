import { IconArrowUpRight, IconBook2 } from "@tabler/icons-react";

export function KnowledgeBaseBanner() {
  return (
    <a
      href="https://docs.morada.ai/"
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <div
        aria-hidden
        className="absolute -right-10 -top-16 size-[200px] rounded-full opacity-70 blur-[10px]"
        style={{ background: "radial-gradient(circle, rgba(0,115,255,.14), transparent 65%)" }}
      />
      <div className="relative flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/[0.1] text-primary">
          <IconBook2 className="size-5" />
        </span>
        <div>
          <p className="font-heading text-[15px] font-semibold text-foreground">Base de conhecimento Morada</p>
          <p className="text-[13px] text-neutral-500">
            Artigos e documentação completa dos produtos em docs.morada.ai
          </p>
        </div>
      </div>
      <IconArrowUpRight className="relative size-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
    </a>
  );
}
