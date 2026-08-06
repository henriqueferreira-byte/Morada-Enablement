"use client";

import { useState, type ComponentProps, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppShellProps = ComponentProps<"div"> & {
    /** Left rail. Hidden on mobile until the menu opens (controlled or via `defaultMobileOpen`). */
    sidebar?: ReactNode;
    /** Sticky top bar. Receives the toggle as `onMenuClick` for mobile only. */
    topNav?: ReactNode;
    /** Render-prop fallback when the consumer wants to wire its own mobile-toggle button into TopNav. */
    renderTopNav?: (ctx: {
        onMenuClick: () => void;
        mobileOpen: boolean;
    }) => ReactNode;
    /** Initial mobile-drawer state. Defaults to closed. */
    defaultMobileOpen?: boolean;
    /**
     * When `true` (default), the sidebar collapses behind a mobile drawer below
     * the `lg` breakpoint. Set to `false` to keep the sidebar always visible
     * regardless of viewport width — useful for apps without dedicated mobile UI.
     */
    responsive?: boolean;
};

/**
 * Layout shell: sidebar + top nav + scrollable main. Bring your own SidebarNav
 * and TopNav components — this is the dumb wrapper so apps don't reinvent the
 * fixed-rail-vs-mobile-drawer plumbing.
 *
 * ```tsx
 * <AppShell
 *     sidebar={<MySidebarNav onNavigate={…} />}
 *     renderTopNav={({ onMenuClick }) => <MyTopNav onMenuClick={onMenuClick} />}
 * >
 *     <Dashboard />
 * </AppShell>
 * ```
 */
export function AppShell({
    sidebar,
    topNav,
    renderTopNav,
    defaultMobileOpen = false,
    responsive = true,
    className,
    children,
    ...props
}: AppShellProps) {
    const [mobileOpen, setMobileOpen] = useState(defaultMobileOpen);

    return (
        <div
            data-slot="app-shell"
            className={cn("flex h-full bg-background", className)}
            {...props}
        >
            {/* Plain CSS so the `:has()` rule and CSS variable are guaranteed
                to land — Tailwind's nested-bracket variants don't always
                tokenize as expected. The variable drives the spacer width so
                content shifts right when the SidebarPanel opens, instead of
                the panel overlaying the page. */}
            <style>{`
                [data-slot="app-shell"] { --app-sidebar-width: 3.5rem; }
                [data-slot="app-shell"]:has([data-slot="sidebar-panel-wrapper"][data-open]) {
                    --app-sidebar-width: 17.25rem;
                }
            `}</style>

            {responsive && mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {sidebar && (
                <div
                    className={cn(
                        // Fixed (not sticky / relative) so the rail stays
                        // anchored at the viewport's top-left no matter how
                        // any ancestor scrolls. Sticky was unreliable — its
                        // behavior depends on which ancestor owns the scroll,
                        // and different browsers resolved that differently in
                        // long pages, leaving the rail half-visible mid-page.
                        // Fixed is the boring-but-robust choice.
                        "fixed inset-y-0 left-0 z-50",
                        responsive && !mobileOpen && "hidden lg:block",
                    )}
                >
                    {sidebar}
                </div>
            )}

            {/* Layout spacer for the fixed sidebar. Width follows the CSS
                variable above — rail-width when closed, rail + panel width
                when open — so opening the panel shifts content right. */}
            {sidebar && (
                <div
                    className={cn(
                        "h-full shrink-0 transition-[width] duration-200",
                        responsive && "hidden lg:block",
                    )}
                    style={{ width: "var(--app-sidebar-width)" }}
                    aria-hidden
                />
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                {renderTopNav
                    ? renderTopNav({
                          onMenuClick: () => setMobileOpen((open) => !open),
                          mobileOpen,
                      })
                    : topNav}
                <main className="flex min-h-0 flex-1 flex-col">{children}</main>
            </div>
        </div>
    );
}
