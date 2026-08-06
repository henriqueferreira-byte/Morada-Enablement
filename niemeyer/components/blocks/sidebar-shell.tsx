/* eslint-disable niemeyer/no-native-form-elements -- inline rail buttons + close button */
"use client";

import {
    createContext,
    useContext,
    type ComponentProps,
    type ComponentType,
    type ReactNode,
} from "react";
import { IconChevronLeft } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/* ─── Themes ───────────────────────────── */
/*
 * Dark = brand-navy treatment (intentional contrast against page bg, regardless
 * of the page's own light/dark mode). Brand color literals are scoped to this
 * block only. Light = semantic tokens.
 */

const themes = {
    dark: {
        rail: "bg-[#0d0f14] border-white/[0.06]",
        panel: "bg-[#13151b]",
        divider: "border-white/[0.06]",
        btnInactive: "text-white/45 hover:bg-white/10 hover:text-white",
        btnActive: "bg-white/10 text-white",
        dot: "bg-primary",
        tooltip: "bg-[#1c1f27] border-white/10 text-white/90",
        title: "text-white",
        closeBtn: "text-white/40 hover:bg-white/10 hover:text-white",
        itemInactive: "text-white/50 hover:text-white/85",
        itemActive: "text-white",
        itemBadge: "bg-primary/20 text-primary",
    },
    light: {
        rail: "bg-card border-border",
        panel: "bg-card",
        divider: "border-border",
        btnInactive:
            "text-muted-foreground hover:bg-muted hover:text-foreground",
        btnActive: "bg-primary text-primary-foreground",
        dot: "bg-primary",
        tooltip: "bg-foreground border-transparent text-background",
        title: "text-foreground",
        closeBtn: "text-muted-foreground hover:bg-muted hover:text-foreground",
        itemInactive: "text-muted-foreground hover:text-foreground",
        itemActive: "text-primary",
        itemBadge: "bg-primary/10 text-primary",
    },
} as const;

export type SidebarShellVariant = keyof typeof themes;
type Theme = (typeof themes)[SidebarShellVariant];

const SidebarThemeContext = createContext<Theme>(themes.dark);

function useSidebarTheme() {
    return useContext(SidebarThemeContext);
}

/* ─── Root ───────────────────────────── */

export type SidebarShellProps = ComponentProps<"aside"> & {
    variant?: SidebarShellVariant;
};

/**
 * Outer container + theme provider. Compose freely with `<SidebarRail>` and
 * `<SidebarPanel>` children. The `variant` prop sets the theme tokens that all
 * descendant primitives consume via context.
 */
export function SidebarShell({
    variant = "dark",
    className,
    children,
    ...props
}: SidebarShellProps) {
    return (
        <SidebarThemeContext.Provider value={themes[variant]}>
            <aside
                data-slot="sidebar-shell"
                data-variant={variant}
                className={cn("relative flex h-full", className)}
                {...props}
            >
                {children}
            </aside>
        </SidebarThemeContext.Provider>
    );
}

/* ─── Rail ───────────────────────────── */

export function SidebarRail({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    const theme = useSidebarTheme();
    return (
        <div
            data-slot="sidebar-rail"
            className={cn(
                "flex h-full w-[56px] shrink-0 flex-col items-center border-r py-3",
                theme.rail,
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function SidebarRailLogo({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-rail-logo"
            tabIndex={-1}
            className={cn(
                "mb-3 flex h-12 w-12 items-center justify-center",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function SidebarRailNav({
    className,
    children,
    ...props
}: ComponentProps<"nav">) {
    return (
        <nav
            data-slot="sidebar-rail-nav"
            className={cn("flex flex-col items-center gap-px", className)}
            {...props}
        >
            {children}
        </nav>
    );
}

export type SidebarRailItemProps = ComponentProps<"button"> & {
    /** Optional icon component — rendered when no children are provided. */
    icon?: ComponentType<{ className?: string; strokeWidth?: number }>;
    /** Tooltip label shown on hover. */
    label?: ReactNode;
    active?: boolean;
};

/**
 * One icon button on the rail. Pass `icon` for the default icon rendering or
 * `children` to fully control the inside (e.g. a custom logo).
 */
export function SidebarRailItem({
    icon: Icon,
    label,
    active = false,
    className,
    children,
    ...props
}: SidebarRailItemProps) {
    const theme = useSidebarTheme();
    return (
        <button
            type="button"
            data-slot="sidebar-rail-item"
            data-active={active || undefined}
            title={typeof label === "string" ? label : undefined}
            className={cn(
                "group relative flex h-12 w-12 items-center justify-center rounded-lg outline-none transition-all duration-150 focus:outline-none",
                active ? theme.btnActive : theme.btnInactive,
                className,
            )}
            {...props}
        >
            {children ??
                (Icon && (
                    <Icon className="h-4 w-4" strokeWidth={active ? 2 : 1.75} />
                ))}
            {active && (
                <span
                    aria-hidden
                    className={cn(
                        // Vertical centering via auto-margins instead of -translate-y-1/2,
                        // because third-party widget CSS (e.g. Novu) can override the
                        // `translate` property and knock the indicator out of place.
                        "absolute left-0 inset-y-0 my-auto h-3 w-0.5 rounded-r-full",
                        theme.dot,
                    )}
                />
            )}
            {label && (
                <span
                    aria-hidden
                    className={cn(
                        "pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg border",
                        "px-2.5 py-1.5 text-xs font-medium shadow-xl",
                        "opacity-0 transition-opacity group-hover:opacity-100",
                        theme.tooltip,
                    )}
                >
                    {label}
                </span>
            )}
        </button>
    );
}

export function SidebarRailFooter({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    return (
        <div
            data-slot="sidebar-rail-footer"
            className={cn("mt-3 pb-1", className)}
            {...props}
        >
            {children}
        </div>
    );
}

/* ─── Panel ───────────────────────────── */

export type SidebarPanelProps = ComponentProps<"div"> & {
    /** When false, the panel collapses to width 0 with a slide animation. */
    open?: boolean;
};

export function SidebarPanel({
    open = true,
    className,
    children,
    ...props
}: SidebarPanelProps) {
    const theme = useSidebarTheme();
    return (
        <div
            data-slot="sidebar-panel-wrapper"
            data-open={open || undefined}
            className={cn(
                "overflow-hidden transition-all duration-200",
                open ? "w-[220px]" : "w-0",
            )}
        >
            <div
                data-slot="sidebar-panel"
                className={cn(
                    "flex h-full w-[220px] shrink-0 flex-col",
                    theme.panel,
                    className,
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    );
}

export type SidebarPanelHeaderProps = ComponentProps<"div"> & {
    /** When provided, renders a chevron close button to the right of the title. */
    onClose?: () => void;
};

export function SidebarPanelHeader({
    onClose,
    className,
    children,
    ...props
}: SidebarPanelHeaderProps) {
    const theme = useSidebarTheme();
    return (
        <div
            data-slot="sidebar-panel-header"
            className={cn(
                "flex h-[52px] items-center justify-between px-4",
                className,
            )}
            {...props}
        >
            <span className={cn("text-sm font-semibold", theme.title)}>
                {children}
            </span>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg outline-none transition-colors focus:outline-none",
                        theme.closeBtn,
                    )}
                    aria-label="Close section"
                >
                    <IconChevronLeft className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

export function SidebarPanelNav({
    className,
    children,
    ...props
}: ComponentProps<"nav">) {
    return (
        <nav
            data-slot="sidebar-panel-nav"
            className={cn("flex-1 overflow-y-auto px-2 py-1", className)}
            {...props}
        >
            <ul className="space-y-0.5">{children}</ul>
        </nav>
    );
}

export type SidebarPanelItemProps = Omit<ComponentProps<"a">, "children"> & {
    active?: boolean;
    /**
     * When provided, the item renders an `<a>` with this href. Otherwise
     * `e.preventDefault()` is called on click so consumers can route via
     * `onClick`.
     */
    href?: string;
    children: ReactNode;
};

/**
 * Single panel item. Children are rendered inside the link — typically the
 * label plus any badges, beta tags, or icons the consumer wants to add.
 */
export function SidebarPanelItem({
    active = false,
    href,
    className,
    children,
    onClick,
    ...props
}: SidebarPanelItemProps) {
    const theme = useSidebarTheme();
    return (
        <li>
            <a
                data-slot="sidebar-panel-item"
                data-active={active || undefined}
                href={href ?? "#"}
                onClick={(e) => {
                    if (!href) e.preventDefault();
                    onClick?.(e);
                }}
                className={cn(
                    "relative flex items-center gap-2 rounded-lg px-3 py-[7px] text-sm outline-none transition-colors focus:outline-none",
                    active ? theme.itemActive : theme.itemInactive,
                    className,
                )}
                {...props}
            >
                {active && (
                    <span
                        aria-hidden
                        className={cn(
                            // Same translate-free centering as SidebarRailItem above —
                            // guards against third-party CSS overriding `translate`.
                            "absolute left-0 inset-y-0 my-auto h-3.5 w-0.5 rounded-r-full",
                            theme.dot,
                        )}
                    />
                )}
                {children}
            </a>
        </li>
    );
}

/** Number/count badge styled in the active theme. Use for unread counts etc. */
export function SidebarPanelItemBadge({
    className,
    children,
    ...props
}: ComponentProps<"span">) {
    const theme = useSidebarTheme();
    return (
        <span
            data-slot="sidebar-panel-item-badge"
            className={cn(
                "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                theme.itemBadge,
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}

export function SidebarPanelFooter({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    const theme = useSidebarTheme();
    return (
        <div
            data-slot="sidebar-panel-footer"
            className={cn("border-t p-2", theme.divider, className)}
            {...props}
        >
            {children}
        </div>
    );
}
