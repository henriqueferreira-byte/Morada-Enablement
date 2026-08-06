"use client";

import type { ComponentProps, ReactNode } from "react";
import { IconChevronRight } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

export type PageHeaderBreadcrumb = { label: ReactNode; href?: string };

/**
 * Outer wrapper for an app page header. Border + card surface + horizontal
 * and top padding. Compose with the part components inside — usually an
 * optional <PageHeaderBreadcrumbs>, then a <PageHeaderContainer> for the
 * title row, then any extra rows (tabs, filters) as children.
 *
 * The default `pb-4` makes the header self-contained. When you nest tabs
 * or filter bars that flush against the bottom border, override with
 * `className="pb-0"`.
 */
function PageHeaderRoot({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header"
            className={cn(
                "border-b border-border bg-card px-6 pt-4 pb-4",
                className,
            )}
            {...props}
        />
    );
}

/**
 * Title + actions row. Renders as a flex column on mobile, splitting into
 * `[title group] · [actions]` on `sm` breakpoint and up. Put the title
 * group (Title + optional Description) as the first child and the actions
 * cluster as the second.
 */
function PageHeaderContainer({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="page-header-container"
            className={cn(
                "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
                className,
            )}
            {...props}
        />
    );
}

function PageHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
    return (
        <h1
            data-slot="page-header-title"
            className={cn(
                "font-heading text-lg font-semibold text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function PageHeaderDescription({ className, ...props }: ComponentProps<"p">) {
    return (
        <p
            data-slot="page-header-description"
            className={cn("mt-0.5 text-xs text-muted-foreground", className)}
            {...props}
        />
    );
}

type PageHeaderBreadcrumbsProps = Omit<ComponentProps<"nav">, "children"> & {
    items: PageHeaderBreadcrumb[];
};

function PageHeaderBreadcrumbs({
    items,
    className,
    ...props
}: PageHeaderBreadcrumbsProps) {
    if (!items || items.length === 0) return null;
    return (
        <nav
            data-slot="page-header-breadcrumbs"
            aria-label="Breadcrumb"
            className={cn(
                "mb-2 flex items-center gap-1 text-xs text-muted-foreground",
                className,
            )}
            {...props}
        >
            {items.map((crumb, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={index} className="flex items-center gap-1">
                        {index > 0 && (
                            <IconChevronRight
                                aria-hidden
                                className="size-3 text-muted-foreground/60"
                            />
                        )}
                        {crumb.href && !isLast ? (
                            <a
                                href={crumb.href}
                                className="transition-colors hover:text-foreground"
                            >
                                {crumb.label}
                            </a>
                        ) : (
                            <span
                                aria-current={isLast ? "page" : undefined}
                                className={cn(
                                    isLast && "font-medium text-foreground",
                                )}
                            >
                                {crumb.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

export {
    PageHeaderRoot,
    PageHeaderContainer,
    PageHeaderTitle,
    PageHeaderDescription,
    PageHeaderBreadcrumbs,
};
