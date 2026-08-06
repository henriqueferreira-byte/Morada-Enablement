"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconAward,
  IconFolder,
  IconHome,
  IconSettings,
  IconStack2,
} from "@tabler/icons-react";
import {
  SidebarShell,
  SidebarPanel,
  SidebarPanelHeader,
  SidebarPanelNav,
  SidebarPanelItem,
} from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/queries/catalog";
import type { StreakInfo } from "@/lib/queries/streak";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/trilhas", label: "Trilhas", icon: IconStack2 },
  { href: "/materiais", label: "Materiais", icon: IconFolder },
  { href: "/progresso", label: "Meu progresso", icon: IconAward },
];

export function SidebarNav({
  products,
  isAdmin,
  streak,
}: {
  products: Product[];
  isAdmin: boolean;
  streak: StreakInfo;
}) {
  const pathname = usePathname();

  return (
    <SidebarShell variant="light" className="h-full">
      <SidebarPanel open className="border-r border-border">
        <SidebarPanelHeader>
          <Link href="/" className="flex items-center pl-2" tabIndex={-1}>
            <Image src="/logos/logo-blue.svg" alt="Morada.ai" width={96} height={22} />
          </Link>
        </SidebarPanelHeader>

        <SidebarPanelNav>
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
          {isAdmin && (
            <SidebarPanelItem href="/gerenciar" active={pathname.startsWith("/gerenciar")} className="font-semibold">
              <IconSettings className="size-[18px]" />
              Gerenciar
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
          <p className="font-heading text-[13px] font-semibold text-foreground">
            Ofensiva de {streak.currentStreak} {streak.currentStreak === 1 ? "dia" : "dias"}
          </p>
          <p className="mt-0.5 text-xs text-neutral-500">
            Estude 1 aula por dia para manter.
          </p>
          <div className="mt-2.5 flex gap-[5px]">
            {streak.weekDays.map((done, i) => {
              const label = WEEKDAY_LABELS[i] ?? "";
              return (
                <div
                  key={i}
                  title={label}
                  className={cn(
                    "flex h-6 flex-1 items-center justify-center rounded-md text-[10px] font-bold",
                    done ? "bg-primary text-primary-foreground" : "bg-neutral-150 text-neutral-400",
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
