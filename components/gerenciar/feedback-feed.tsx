import { formatRelative } from "@/lib/format";
import { TEAM_LABELS, isValidTeam } from "@/lib/teams";
import type { FeedbackItem } from "@/lib/queries/gerenciar";

export function FeedbackFeed({ items }: { items: FeedbackItem[] }) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-xs">
      <h2 className="border-b border-border px-5 py-3 font-heading text-sm font-semibold text-foreground">
        Feedback das aulas
      </h2>
      {items.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted-foreground">Nenhuma avaliação recebida ainda.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className="border-b border-neutral-100 px-5 py-3 last:border-b-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-primary">{item.stars} de 5</span>
                <span className="text-xs text-neutral-500">{item.lessonTitle}</span>
              </div>
              {item.comment && <p className="mt-1 text-[13px] text-neutral-700">{item.comment}</p>}
              <p className="mt-1 text-[11px] text-neutral-400">
                {item.userTeam && isValidTeam(item.userTeam) ? TEAM_LABELS[item.userTeam] : item.userTeam ?? "Time não informado"} · {formatRelative(item.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
