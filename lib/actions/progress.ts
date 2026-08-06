"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

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
