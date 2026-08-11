import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const ALLOWED_EMAIL_DOMAIN = process.env.ALLOWED_EMAIL_DOMAIN ?? "morada.ai";

export function assertDomain(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`);
}

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  team: string | null;
  job_title: string | null;
  role: "member" | "admin" | "leader";
  leads_team: string | null;
  onboarded_at: string | null;
};

/** Server-side gate for pages/actions: redirects to /login when there is no session. */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !assertDomain(user.email)) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, team, job_title, role, leads_team, onboarded_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  return { supabase, user, profile: profile as Profile };
}

/** Server-side gate for the admin-only area: 404s (never 403) for non-admins. */
export async function requireAdmin() {
  const ctx = await requireUser();
  if (ctx.profile.role !== "admin") {
    notFound();
  }
  return ctx;
}

/** Server-side gate for the leadership panel: admins can also peek in; everyone else 404s. */
export async function requireLeader() {
  const ctx = await requireUser();
  if (ctx.profile.role !== "leader" && ctx.profile.role !== "admin") {
    notFound();
  }
  return ctx;
}
