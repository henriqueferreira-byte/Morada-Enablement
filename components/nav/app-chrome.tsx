"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AppShell } from "@/niemeyer/components";
import type { Profile } from "@/lib/auth";
import type { Product } from "@/lib/queries/catalog";
import type { StreakInfo } from "@/lib/queries/streak";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { ProfileSetupModal } from "@/components/onboarding/profile-setup-modal";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { SidebarNav } from "./sidebar-nav";
import { TopBar } from "./top-bar";

type Stage = "welcome" | "profile" | "tour" | "done";

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
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(profile.onboarded_at ? "done" : "welcome");
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  return (
    <AppShell
      sidebar={<SidebarNav products={products} isAdmin={isAdmin} streak={streak} />}
      renderTopNav={({ onMenuClick }) => (
        <TopBar
          profile={profile}
          streakDays={streak.currentStreak}
          onMenuClick={onMenuClick}
          onReplayTour={() => setStage("tour")}
          onEditProfile={() => setEditProfileOpen(true)}
        />
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-7 overflow-y-auto p-6">
        {children}
      </div>

      <WelcomeModal open={stage === "welcome"} isAdmin={isAdmin} onFinish={() => setStage("profile")} />

      <ProfileSetupModal
        open={stage === "profile" || editProfileOpen}
        mandatory={stage === "profile"}
        initialJobTitle={profile.job_title ?? ""}
        initialTeam={profile.team ?? ""}
        onCancel={() => setEditProfileOpen(false)}
        onComplete={() => {
          if (editProfileOpen) {
            setEditProfileOpen(false);
          } else {
            setStage("tour");
          }
          router.refresh();
        }}
      />

      <OnboardingTour open={stage === "tour"} onClose={() => setStage("done")} />
    </AppShell>
  );
}
