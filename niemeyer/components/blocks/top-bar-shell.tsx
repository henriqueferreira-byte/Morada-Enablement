import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Top app-bar strip: 48px tall, bordered bottom, card surface. Compose with
 * `<TopBarLeft>` and `<TopBarRight>` children for the standard split layout —
 * `<TopBarRight>` is right-aligned via `ml-auto`, no explicit spacer needed.
 */
export function TopBarShell({
    className,
    children,
    ...props
}: ComponentProps<"header">) {
    return (
        <header
            className={cn(
                "flex h-[48px] items-center gap-2 border-b border-border bg-card px-3",
                className,
            )}
            {...props}
        >
            {children}
        </header>
    );
}

/** Left-aligned cluster inside `TopBarShell`. */
export function TopBarLeft({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    return (
        <div className={cn("flex items-center gap-2", className)} {...props}>
            {children}
        </div>
    );
}

/** Right-aligned cluster inside `TopBarShell`. Pushes itself to the right edge via `ml-auto`. */
export function TopBarRight({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    return (
        <div
            className={cn("ml-auto flex items-center gap-2", className)}
            {...props}
        >
            {children}
        </div>
    );
}
