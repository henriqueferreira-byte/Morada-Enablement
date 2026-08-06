import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
    IconAlertCircle,
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/** Default icon for each `variant` (pair with the matching `Alert` `variant`). */
const ALERT_DEFAULT_ICONS = {
    info: IconInfoCircle,
    success: IconCircleCheck,
    warning: IconAlertTriangle,
    destructive: IconAlertCircle,
} as const;

export type AlertSemanticVariant = keyof typeof ALERT_DEFAULT_ICONS;

const alertVariants = cva(
    [
        "group/alert relative grid w-full grid-cols-1 items-start gap-y-0.5 rounded-xl border-2 text-left text-sm",
        "has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18",
        // Text-only: tighter inset (no "ghost" icon gutter). With icon: slightly more room.
        "[&:not(:has(>svg))]:p-4 has-[>svg]:p-3",
        /* with icon: two columns; without icon: single column */
        "has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2.5",
        "[&>svg]:row-span-2 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    ].join(" "),
    {
        variants: {
            variant: {
                default: "bg-card text-card-foreground border-border",
                info: "border-info-border bg-info-background text-info-text",
                success:
                    "border-success-border bg-success-background text-success-text",
                warning:
                    "border-warning-border bg-warning-background text-warning-text",
                destructive:
                    "border-destructive-border bg-destructive-background text-destructive-text",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Alert({
    className,
    variant,
    ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    const v = variant ?? "default";
    return (
        <div
            data-slot="alert"
            data-variant={v}
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-title"
            className={cn(
                "min-w-0 w-full max-w-full font-heading font-medium text-inherit",
                "group-has-[>svg]/alert:col-start-2 group-has-[>svg]/alert:row-start-1",
                "[&_a]:underline [&_a]:underline-offset-3",
                className,
            )}
            {...props}
        />
    );
}

const descriptionByVariant = [
    "min-w-0 w-full max-w-full text-sm text-balance md:text-pretty",
    "group-has-[>svg]/alert:col-start-2 group-has-[>svg]/alert:row-start-2",
    "group-data-[variant=default]/alert:text-muted-foreground",
    "group-data-[variant=info]/alert:text-info-text/90",
    "group-data-[variant=success]/alert:text-success-text/90",
    "group-data-[variant=warning]/alert:text-warning-text/90",
    "group-data-[variant=destructive]/alert:text-destructive-text/90",
    "[&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-2",
].join(" ");

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn(descriptionByVariant, className)}
            {...props}
        />
    );
}

function AlertAction({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-action"
            className={cn("absolute top-2 right-2", className)}
            {...props}
        />
    );
}

function AlertDefaultIcon({
    variant,
    className,
    ...props
}: {
    variant: AlertSemanticVariant;
} & ComponentProps<typeof IconInfoCircle>) {
    const Icon = ALERT_DEFAULT_ICONS[variant];
    return (
        <Icon
            className={cn("size-4 shrink-0", className)}
            aria-hidden
            {...props}
        />
    );
}

export {
    ALERT_DEFAULT_ICONS,
    Alert,
    alertVariants,
    AlertAction,
    AlertDefaultIcon,
    AlertDescription,
    AlertTitle,
    /* Recommended Tabler icons (peer: @tabler/icons-react) */
    IconAlertCircle,
    IconAlertTriangle,
    IconCircleCheck,
    IconInfoCircle,
};
