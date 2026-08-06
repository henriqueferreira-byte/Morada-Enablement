"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import type { LessonKind } from "@/lib/queries/tracks";

type PublishInput = {
  kind: "material" | "lesson";
  productId: string;
  targetId: string; // featureId for material, trackId for lesson
  title: string;
  description: string;
  upload: { path: string; ext: string; format: string } | null;
  externalUrl: string | null;
  status: "draft" | "published";
  publishToNovidades: boolean;
  notifySlack: boolean;
  isRequired: boolean;
};

function inferLessonKind(upload: PublishInput["upload"], externalUrl: string | null): LessonKind {
  if (!upload) return "link";
  switch (upload.ext) {
    case "MP4":
      return "video";
    case "PPTX":
      return "deck";
    case "XLSX":
      return "template";
    default:
      return "artigo";
  }
}

function inferSourceLabel(upload: PublishInput["upload"], externalUrl: string | null): string {
  if (upload) {
    return { MP4: "Gravação interna", PPTX: "Deck enviado", XLSX: "Planilha enviada" }[upload.ext] ?? "Documento enviado";
  }
  const url = (externalUrl ?? "").toLowerCase();
  if (url.includes("drive.google")) return "Drive";
  if (url.includes("notion.so")) return "Notion";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("loom.com")) return "Loom";
  return "Link externo";
}

async function notifySlackWebhook(text: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Best-effort — publishing must not fail because Slack is unreachable.
  }
}

export async function publishContent(input: PublishInput) {
  const { supabase, user } = await requireAdmin();

  if (!input.upload && !input.externalUrl) {
    throw new Error("Envie um arquivo ou cole um link.");
  }
  if (!input.title.trim()) {
    throw new Error("Título é obrigatório.");
  }

  if (input.kind === "material") {
    const { error } = await supabase.from("materials").insert({
      feature_id: input.targetId,
      title: input.title.trim(),
      description: input.description.trim() || null,
      ext: input.upload?.ext ?? "LINK",
      format: input.upload?.format ?? "Drive",
      storage_path: input.upload?.path ?? null,
      external_url: input.externalUrl,
      status: input.status,
      is_highlight: input.publishToNovidades,
      created_by: user.id,
    });
    if (error) throw new Error(error.message);

    revalidatePath("/materiais");
    revalidatePath(`/materiais/${input.productId}`);
    revalidatePath(`/materiais/${input.productId}/${input.targetId}`);
  } else {
    const { data: lastLesson } = await supabase
      .from("lessons")
      .select("position")
      .eq("track_id", input.targetId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { error } = await supabase.from("lessons").insert({
      track_id: input.targetId,
      position: (lastLesson?.position ?? 0) + 1,
      title: input.title.trim(),
      kind: inferLessonKind(input.upload, input.externalUrl),
      duration_min: 0,
      source_label: inferSourceLabel(input.upload, input.externalUrl),
      storage_path: input.upload?.path ?? null,
      external_url: input.externalUrl,
      status: input.status,
      is_highlight: input.publishToNovidades,
      created_by: user.id,
    });
    if (error) throw new Error(error.message);

    await supabase.from("tracks").update({ is_required: input.isRequired, updated_at: new Date().toISOString() }).eq("id", input.targetId);

    revalidatePath("/trilhas");
    revalidatePath(`/trilhas/${input.targetId}`);
  }

  revalidatePath("/");
  revalidatePath("/gerenciar");

  if (input.status === "published" && input.notifySlack) {
    const label = input.kind === "material" ? "material" : "aula";
    await notifySlackWebhook(`📚 Novo ${label} publicado no Hub de Enablement: *${input.title.trim()}*`);
  }
}
