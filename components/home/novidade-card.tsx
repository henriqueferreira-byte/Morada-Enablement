import Link from "next/link";
import {
  IconArticle,
  IconFileText,
  IconLink,
  IconPresentation,
  IconPlayerPlay,
  IconClipboardCheck,
} from "@tabler/icons-react";
import { Badge } from "@/niemeyer/components";
import { formatRelative } from "@/lib/format";
import { LESSON_TYPE_META } from "@/lib/lesson-types";
import type { NovidadeItem } from "@/lib/queries/novidades";

const LESSON_ICON = {
  video: IconPlayerPlay,
  artigo: IconArticle,
  deck: IconPresentation,
  quiz: IconClipboardCheck,
  template: IconFileText,
  link: IconLink,
} as const;

export function NovidadeCard({ item }: { item: NovidadeItem }) {
  const typeMeta = item.contentKind ? LESSON_TYPE_META[item.contentKind] : null;
  const Icon = item.contentKind ? LESSON_ICON[item.contentKind] : IconFileText;

  return (
    <Link
      href={item.href}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <span
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ backgroundColor: item.productAccent }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${item.productAccent}1a`, color: item.productAccent }}
        >
          <Icon className="size-4" />
        </span>
        {item.isNew && <Badge variant="default">NOVO</Badge>}
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-heading text-[15px] font-semibold text-foreground">{item.title}</p>
        <p className="mt-1 truncate text-xs text-neutral-500">
          {item.productName} · {item.kind === "lesson" ? "publicado" : "atualizado"} {formatRelative(item.publishedAt)}
        </p>
      </div>

      <Badge variant={typeMeta?.badgeVariant ?? "outline"} className="w-fit">
        {typeMeta?.label ?? item.format}
      </Badge>
    </Link>
  );
}
