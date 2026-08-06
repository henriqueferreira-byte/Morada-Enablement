"use client";

import type { ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const avatarSizeClass = {
    sm: "size-6",
    default: "size-8",
    lg: "size-10",
} as const;

function Avatar({
    className,
    size = "default",
    ...props
}: ComponentProps<typeof AvatarPrimitive.Root> & {
    size?: "default" | "sm" | "lg";
}) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            data-size={size}
            className={cn(
                "group/avatar relative flex shrink-0 select-none rounded-full",
                avatarSizeClass[size],
                className,
            )}
            {...props}
        />
    );
}

function AvatarImage({
    className,
    ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn(
                "size-full aspect-square rounded-full object-cover",
                className,
            )}
            {...props}
        />
    );
}

function AvatarFallback({
    className,
    ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(
                "flex size-full items-center justify-center rounded-full bg-blue-2 text-sm text-blue-7 group-data-[size=sm]/avatar:text-xs",
                className,
            )}
            {...props}
        />
    );
}

function AvatarBadge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            data-slot="avatar-badge"
            className={cn(
                "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-primary-foreground",
                "bg-blend-color",
                "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
                "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
                "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
                className,
            )}
            {...props}
        />
    );
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="avatar-group"
            className={cn("group/avatar-group -space-x-2 flex", className)}
            {...props}
        />
    );
}

function AvatarGroupCount({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="avatar-group-count"
            className={cn(
                "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-2 text-sm text-blue-7",
                "group-has-[[data-size=lg]]/avatar-group:size-10",
                "group-has-[[data-size=sm]]/avatar-group:size-6",
                "[&>svg]:size-4",
                "group-has-[[data-size=lg]]/avatar-group:[&>svg]:size-6",
                "group-has-[[data-size=sm]]/avatar-group:[&>svg]:size-3",
                className,
            )}
            {...props}
        />
    );
}

export {
    Avatar,
    AvatarBadge,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
    AvatarFallback,
};
