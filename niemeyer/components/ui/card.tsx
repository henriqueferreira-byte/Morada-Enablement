import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type CardSize = "default" | "sm";
type CardVariant = "default" | "plain";

function Card({
    className,
    size = "default",
    variant = "default",
    ...props
}: ComponentProps<"div"> & {
    size?: CardSize;
    /**
     * `default` (new) — soft border + `shadow-xs`. Matches the product
     * dashboard look where cards sit on a light page background and need a
     * clear container outline.
     *
     * `plain` — original behaviour: no border, `shadow-sm` only. Use when the
     * card sits over a darker / textured surface and the shadow alone reads
     * cleanly, or when the consumer is overriding the surface entirely.
     */
    variant?: CardVariant;
}) {
    return (
        <div
            data-slot="card"
            data-size={size}
            data-variant={variant}
            className={cn(
                "group/card flex flex-col gap-0 overflow-hidden rounded-lg bg-card text-sm text-card-foreground",
                "has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0",
                "data-[size=sm]:gap-0 data-[size=sm]:p-6 data-[size=sm]:has-data-[slot=card-footer]:pb-0",
                "*:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
                variant === "default" && "border border-border shadow-xs",
                variant === "plain" && "shadow-sm",
                className,
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-lg",
                // No bottom padding — CardContent's own pt-6 owns the gap below
                // the header. Lets CardContent stand alone (without a header)
                // with symmetric pt-6 / pb-6 of its own.
                "px-6 pt-6",
                "group-data-[size=sm]/card:px-0 group-data-[size=sm]/card:pt-0",
                "has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
                "[.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
                className,
            )}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-title"
            className={cn(
                "font-heading text-sm font-semibold leading-snug text-card-foreground group-data-[size=sm]/card:text-xs",
                className,
            )}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-description"
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
                className,
            )}
            {...props}
        />
    );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-content"
            className={cn(
                // Symmetric pt-6 / pb-6 so CardContent works standalone (no
                // header above it). When a CardHeader is present, the header
                // contributes no pb and this pt-6 alone is the visual gap.
                "px-6 pt-6 pb-6",
                "group-data-[size=sm]/card:px-0 group-data-[size=sm]/card:pt-0 group-data-[size=sm]/card:pb-0",
                className,
            )}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="card-footer"
            className={cn(
                "flex items-center rounded-b-lg border-t border-border bg-card px-6 py-3 group-data-[size=sm]/card:px-0",
                className,
            )}
            {...props}
        />
    );
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
};
