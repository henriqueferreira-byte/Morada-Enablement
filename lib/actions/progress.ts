"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

const SIGNED_URL_TTL_SECONDS = 60;
const VIDEO_STREAM_TTL_SECONDS = 4 * 60 * 60;

/** Returns a URL to open/download/stream a lesson's file. External links (Drive, YouTube, Loom…) pass through as-is; Storage-backed files get a signed URL — short-lived for open/download, long-lived for "stream" so an in-progress video doesn't expire mid-watch. */
export async function getLessonAccessUrl(lessonId: string, kind: "open" | "download" | "stream") {
  const { supabase } = await requireUser();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, storage_path, external_url")
    .eq("id", lessonId)
    .single();

  if (!lesson) throw new Error("Aula não encontrada.");
  if (lesson.external_url) return { url: lesson.external_url };
  if (!lesson.storage_path) throw new Error("Aula sem arquivo ou link.");

  const ttl = kind === "stream" ? VIDEO_STREAM_TTL_SECONDS : SIGNED_URL_TTL_SECONDS;
  const { data: signed, error } = await supabase.storage
    .from("hub-materials")
    .createSignedUrl(lesson.storage_path, ttl, { download: kind === "download" });

  if (error || !signed) throw new Error("Não foi possível gerar o link do arquivo.");
  return { url: signed.signedUrl };
}

async function revalidateProgressPaths(trackId: string) {
  revalidatePath("/");
  revalidatePath("/trilhas");
  revalidatePath("/progresso");
  revalidatePath(`/trilhas/${trackId}`);
}

/** Idempotent: completing an already-completed lesson is a no-op. Returns whether the user already rated this lesson, so the caller can decide whether to open the feedback modal. */
export async function completeLesson(lessonId: string, trackId: string) {
  const { supabase, user } = await requireUser();

  await supabase
    .from("lesson_progress")
    .upsert({ user_id: user.id, lesson_id: lessonId }, { onConflict: "user_id,lesson_id", ignoreDuplicates: true });

  const { data: existingFeedback } = await supabase
    .from("lesson_feedback")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  await revalidateProgressPaths(trackId);
  return { alreadyRated: !!existingFeedback };
}

/** Idempotent: un-completing an already-pending lesson is a no-op. */
export async function uncompleteLesson(lessonId: string, trackId: string) {
  const { supabase, user } = await requireUser();

  await supabase
    .from("lesson_progress")
    .delete()
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId);

  await revalidateProgressPaths(trackId);
}
