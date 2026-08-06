"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function submitFeedback(input: {
  lessonId: string;
  stars: number;
  tags: string[];
  comment: string;
}) {
  const { supabase, user } = await requireUser();

  await supabase.from("lesson_feedback").insert({
    user_id: user.id,
    lesson_id: input.lessonId,
    stars: input.stars,
    tags: input.tags,
    comment: input.comment.trim() || null,
  });

  revalidatePath("/gerenciar");
}
