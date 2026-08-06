import type { TrackStatus } from "@/lib/queries/tracks";

export const TRACK_STATUS_META: Record<
  TrackStatus,
  { label: string; badgeVariant: "success" | "default" | "secondary" }
> = {
  concluida: { label: "Concluída", badgeVariant: "success" },
  andamento: { label: "Em andamento", badgeVariant: "default" },
  nao_iniciada: { label: "Não iniciada", badgeVariant: "secondary" },
};
