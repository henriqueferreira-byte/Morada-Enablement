"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin, requireUser } from "@/lib/auth";

export async function submitContentRequest(message: string) {
  const { supabase, user } = await requireUser();

  if (!message.trim()) throw new Error("Escreva o que está faltando.");

  const { error } = await supabase.from("content_requests").insert({
    user_id: user.id,
    message: message.trim(),
  });
  if (error) throw new Error(error.message);

  revalidatePath("/gerenciar");
}

export async function resolveContentRequest(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("content_requests").update({ status: "resolved" }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/gerenciar");
}
