"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/niemeyer/components";
import type { Profile } from "@/lib/auth";
import type { Product } from "@/lib/queries/catalog";
import type { StreakInfo } from "@/lib/queries/streak";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";

export function AppChrome({
  profile,
  products,
  isAdmin,
  streak,
  children,
}: {
  profile: Profile;
  products: Product[];
  isAdmin: boolean;
  streak: StreakInfo;
  children: ReactNode;
}) {
  return (
    <AppShell
      sidebar={<SidebarNav products={products} isAdmin={isAdmin} streak={streak} />}
      renderTopNav={({ onMenuClick }) => (
        <TopBar profile={profile} streakDays={streak.currentStreak} onMenuClick={onMenuClick} />
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-7 overflow-y-auto p-6">
        {children}
      </div>
    </AppShell>
  );
}
