import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { getProducts } from "@/lib/queries/catalog";
import { getStreakInfo } from "@/lib/queries/streak";
import { AppChrome } from "@/components/nav/app-chrome";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const { supabase, user, profile } = await requireUser();

  const [products, streak] = await Promise.all([
    getProducts(supabase),
    getStreakInfo(supabase, user.id),
  ]);

  return (
    <AppChrome
      profile={profile}
      products={products}
      isAdmin={profile.role === "admin"}
      isLeader={profile.role === "leader"}
      streak={streak}
    >
      {children}
    </AppChrome>
  );
}
