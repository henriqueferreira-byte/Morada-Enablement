import type { LessonKind } from "@/lib/queries/tracks";

export const LESSON_TYPE_META: Record<
  LessonKind,
  { label: string; badgeVariant: "default" | "info" | "secondary" | "warning" | "success" | "outline" }
> = {
  video: { label: "Vídeo", badgeVariant: "default" },
  artigo: { label: "Artigo", badgeVariant: "info" },
  deck: { label: "Slides", badgeVariant: "secondary" },
  quiz: { label: "Quiz", badgeVariant: "warning" },
  template: { label: "Template", badgeVariant: "success" },
  link: { label: "Link externo", badgeVariant: "outline" },
};
