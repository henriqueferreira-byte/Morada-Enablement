"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconAward,
  IconChecklist,
  IconFolder,
  IconHome,
  IconSettings,
  IconStack2,
  IconUsersGroup,
} from "@tabler/icons-react";
import {
  SidebarShell,
  SidebarPanel,
  SidebarPanelHeader,
  SidebarPanelNav,
  SidebarPanelItem,
  Badge,
} from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import { Dolly } from "@/components/mascot/dolly";
import type { Product } from "@/lib/queries/catalog";
import type { StreakInfo } from "@/lib/queries/streak";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/trilhas", label: "Trilhas", icon: IconStack2 },
  { href: "/materiais", label: "Materiais", icon: IconFolder },
  { href: "/progresso", label: "Meu progresso", icon: IconAward },
];

const COMING_SOON_ITEM = { label: "Tarefas gerais", icon: IconChecklist };

export function SidebarNav({
  products,
  isAdmin,
  isLeader,
  streak,
}: {
  products: Product[];
  isAdmin: boolean;
  isLeader: boolean;
  streak: StreakInfo;
}) {
  const pathname = usePathname();

  return (
    <SidebarShell variant="light" className="h-full">
      <SidebarPanel open className="border-r border-border">
        <SidebarPanelHeader>
          <Link href="/" className="flex items-center pl-2" tabIndex={-1}>
            <Image src="/logos/logo-blue.svg" alt="Morada.ai" width={96} height={22} style={{ height: "auto" }} />
          </Link>
        </SidebarPanelHeader>

        <SidebarPanelNav data-tour="nav-links">
          <li className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Hub de enablement
          </li>
          {NAV_ITEMS.map((item) => (
            <SidebarPanelItem
              key={item.href}
              href={item.href}
              active={
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
              }
              className="font-semibold"
            >
              <item.icon className="size-[18px]" />
              {item.label}
            </SidebarPanelItem>
          ))}
          <SidebarPanelItem className="cursor-default font-semibold text-neutral-400 hover:bg-transparent">
            <COMING_SOON_ITEM.icon className="size-[18px]" />
            <span className="flex-1 truncate">{COMING_SOON_ITEM.label}</span>
            <Badge variant="warning" className="h-5 shrink-0 px-1.5 text-[10px]">
              Em breve
            </Badge>
          </SidebarPanelItem>
          {isAdmin && (
            <SidebarPanelItem href="/gerenciar" active={pathname.startsWith("/gerenciar")} className="font-semibold">
              <IconSettings className="size-[18px]" />
              Gerenciar
            </SidebarPanelItem>
          )}
          {(isLeader || isAdmin) && (
            <SidebarPanelItem href="/lideranca" active={pathname.startsWith("/lideranca")} className="font-semibold">
              <IconUsersGroup className="size-[18px]" />
              Painel de liderança
            </SidebarPanelItem>
          )}

          <li className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Módulos
          </li>
          {products.map((product) => (
            <SidebarPanelItem
              key={product.id}
              href={`/trilhas?modulo=${product.id}`}
              className="text-[13px] font-normal text-neutral-700"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: product.accent }}
                aria-hidden
              />
              {product.name}
            </SidebarPanelItem>
          ))}
        </SidebarPanelNav>

        <div className="m-2 mt-auto rounded-xl border border-neutral-150 bg-neutral-50 p-3.5">
          <div className="flex items-start gap-2">
            <Dolly size={36} animation="idle" className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="font-heading text-[13px] font-semibold text-foreground">
                Ofensiva de {streak.currentStreak} {streak.currentStreak === 1 ? "dia" : "dias"}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                Estude 1 aula por dia útil para manter.
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex gap-[5px]">
            {streak.weekDays.map((done, i) => {
              const label = WEEKDAY_LABELS[i] ?? "";
              const isWeekend = i >= 5;
              return (
                <div
                  key={i}
                  title={isWeekend ? `${label} · não conta na ofensiva` : label}
                  className={cn(
                    "flex h-6 flex-1 items-center justify-center rounded-md text-[10px] font-bold",
                    done && "bg-primary text-primary-foreground",
                    !done && !isWeekend && "bg-neutral-150 text-neutral-400",
                    !done && isWeekend && "border border-dashed border-neutral-200 text-neutral-300",
                  )}
                >
                  {label.charAt(0)}
                </div>
              );
            })}
          </div>
        </div>
      </SidebarPanel>
    </SidebarShell>
  );
}
