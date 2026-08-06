"use client";

import type { ComponentProps, ComponentType, ReactNode } from "react";
import {
    IconAlertTriangle,
    IconDatabaseOff,
    IconSearchOff,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export type EmptyStateVariant = "no-data" | "no-results" | "error";

const VARIANT_DEFAULTS: Record<
    EmptyStateVariant,
    { icon: ComponentType<{ className?: string }> }
> = {
    "no-data": { icon: IconDatabaseOff },
    "no-results": { icon: IconSearchOff },
    error: { icon: IconAlertTriangle },
};

type EmptyStateProps = Omit<ComponentProps<"div">, "title"> & {
    variant?: EmptyStateVariant;
    /** Override the variant's default icon. */
    icon?: ComponentType<{ className?: string }>;
    title: ReactNode;
    description?: ReactNode;
    /** When provided, renders a primary `<Button>` calling `onAction`. */
    actionLabel?: ReactNode;
    onAction?: () => void;
};

export function EmptyState({
    variant = "no-data",
    icon: IconOverride,
    title,
    description,
    actionLabel,
    onAction,
    className,
    children,
    ...props
}: EmptyStateProps) {
    const Icon = IconOverride ?? VARIANT_DEFAULTS[variant].icon;

    return (
        <div
            data-slot="empty-state"
            data-variant={variant}
            className={cn(
                "flex flex-col items-center justify-center px-4 py-16 text-center",
                className,
            )}
            {...props}
        >
            <div className="flex size-12 items-center justify-center rounded-full border border-border bg-muted">
                <Icon className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-base font-semibold">
                {title}
            </h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {description}
                </p>
            )}
            {actionLabel && (
                <Button onClick={onAction} className="mt-4 rounded-full">
                    {actionLabel}
                </Button>
            )}
            {children}
        </div>
    );
}
