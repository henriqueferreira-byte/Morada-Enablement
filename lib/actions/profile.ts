"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isValidTeam } from "@/lib/teams";

export async function markOnboarded() {
  const { supabase, user } = await requireUser();
  await supabase.from("profiles").update({ onboarded_at: new Date().toISOString() }).eq("id", user.id);
}

export async function saveProfileDetails(input: { jobTitle: string; team: string }) {
  const { supabase, user } = await requireUser();

  const jobTitle = input.jobTitle.trim();
  if (!jobTitle) throw new Error("Diga qual é o seu cargo.");
  if (!isValidTeam(input.team)) throw new Error("Escolha um time da lista.");

  const { error } = await supabase
    .from("profiles")
    .update({ job_title: jobTitle, team: input.team })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
