"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

const VALID_TEAMS = ["vendas", "cs", "onboarding", "marketing", "outro"];

export async function markOnboarded() {
  const { supabase, user } = await requireUser();
  await supabase.from("profiles").update({ onboarded_at: new Date().toISOString() }).eq("id", user.id);
}

export async function updateOwnTeam(team: string) {
  const { supabase, user } = await requireUser();

  if (!VALID_TEAMS.includes(team)) throw new Error("Time inválido.");

  const { error } = await supabase.from("profiles").update({ team }).eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
