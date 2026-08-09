"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  IconFlame,
  IconHelpCircle,
  IconLogout,
  IconMenu2,
  IconSearch,
  IconUserEdit,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  TopBarShell,
  TopBarLeft,
  TopBarRight,
} from "@/niemeyer/components";
import { signOut } from "@/lib/actions/auth";
import { TEAM_LABELS, type Team } from "@/lib/teams";
import type { Profile } from "@/lib/auth";

function initials(name: string | null, email: string) {
  const source = name?.trim() || email;
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TopBar({
  profile,
  streakDays,
  onMenuClick,
  onReplayTour,
  onEditProfile,
}: {
  profile: Profile;
  streakDays: number;
  onMenuClick: () => void;
  onReplayTour: () => void;
  onEditProfile: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const teamLabel = profile.team ? TEAM_LABELS[profile.team as Team] : null;

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get("q") ?? "";
      if (query === currentQ) return;

      const targetPath = pathname.startsWith("/materiais") ? pathname : "/trilhas";
      const params = new URLSearchParams(
        targetPath === pathname ? searchParams.toString() : undefined,
      );
      if (query) params.set("q", query);
      else params.delete("q");

      router.push(`${targetPath}${params.toString() ? `?${params.toString()}` : ""}`);
    }, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <TopBarShell className="h-14 px-6 backdrop-blur-sm">
      <TopBarLeft>
        <button
          type="button"
          onClick={onMenuClick}
          className="mr-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Abrir menu"
        >
          <IconMenu2 className="size-5" />
        </button>
        <div data-tour="search" className="relative hidden w-full max-w-[340px] sm:block">
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar aula, trilha ou template"
            className="h-9 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-3 text-sm outline-none placeholder:text-neutral-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </TopBarLeft>

      <TopBarRight>
        <button
          type="button"
          onClick={onReplayTour}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          aria-label="Como funciona o hub?"
          title="Como funciona o hub?"
        >
          <IconHelpCircle className="size-[18px]" />
        </button>
        <span data-tour="streak" className="hidden items-center gap-1.5 rounded-full border border-[rgba(247,184,125,0.5)] bg-[rgba(247,184,125,0.18)] px-2.5 py-1 text-xs font-bold text-[#8a4b12] sm:flex">
          <IconFlame className="size-3.5" />
          {streakDays} {streakDays === 1 ? "dia" : "dias"}
        </span>
        <span className="hidden text-[13px] text-neutral-600 md:inline">
          {profile.full_name?.split(" ")[0] ?? profile.email}
          {teamLabel ? ` · ${teamLabel}` : ""}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger data-tour="avatar" className="outline-none">
            <Avatar>
              {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
              <AvatarFallback>{initials(profile.full_name, profile.email)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <Avatar size="lg">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt="" />}
                <AvatarFallback>{initials(profile.full_name, profile.email)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{profile.full_name ?? profile.email}</p>
                <p className="truncate text-xs text-neutral-500">{profile.email}</p>
                {(profile.job_title || teamLabel) && (
                  <p className="truncate text-xs text-neutral-500">
                    {[profile.job_title, teamLabel].filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onEditProfile}>
              <IconUserEdit />
              Editar perfil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => signOut()}>
              <IconLogout />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TopBarRight>
    </TopBarShell>
  );
}
