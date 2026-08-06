import { Badge } from "@/niemeyer/components";
import { formatRelative } from "@/lib/format";
import type { PublicationItem } from "@/lib/queries/gerenciar";

export function RecentPublications({ items }: { items: PublicationItem[] }) {
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
                <Badge variant={item.status === "published" ? "success" : "secondary"} className="shrink-0">
                  {item.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">
                {item.locationLabel} · {formatRelative(item.createdAt)}
                {item.authorName ? `, por ${item.authorName}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
