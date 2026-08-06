/**
 * Blocks — opinionated layout patterns built on top of the design-system
 * primitives. Each block is prop-driven, accepts a `className` so the consumer
 * can override styles, and avoids hardcoded business data.
 */
export { AppShell } from "./app-shell";
export { EmptyState } from "./empty-state";
export type { EmptyStateVariant } from "./empty-state";
export {
    PageHeaderRoot,
    PageHeaderContainer,
    PageHeaderTitle,
    PageHeaderDescription,
    PageHeaderBreadcrumbs,
} from "./page-header";
export type { PageHeaderBreadcrumb } from "./page-header";
export {
    SidebarShell,
    SidebarRail,
    SidebarRailLogo,
    SidebarRailNav,
    SidebarRailItem,
    SidebarRailFooter,
    SidebarPanel,
    SidebarPanelHeader,
    SidebarPanelNav,
    SidebarPanelItem,
    SidebarPanelItemBadge,
    SidebarPanelFooter,
} from "./sidebar-shell";
export type {
    SidebarShellProps,
    SidebarShellVariant,
    SidebarRailItemProps,
    SidebarPanelProps,
    SidebarPanelHeaderProps,
    SidebarPanelItemProps,
} from "./sidebar-shell";
export { TopBarShell, TopBarLeft, TopBarRight } from "./top-bar-shell";
