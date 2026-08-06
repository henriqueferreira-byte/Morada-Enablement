"use client";

import type { ComponentProps, ReactNode } from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function TooltipProvider({
    delayDuration = 0,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    );
}

function Tooltip({ ...props }: ComponentProps<typeof TooltipPrimitive.Root>) {
    return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({
    ...props
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
    className,
    sideOffset = 0,
    children,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    "z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-md",
                    "origin-(--radix-tooltip-content-transform-origin)",
                    "bg-foreground px-3 py-1.5 text-xs text-background",
                    "has-data-[slot=kbd]:pr-1.5",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                    "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    "**:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
                    "data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95",
                    "data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    className,
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow className="fill-foreground" />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

type TooltipWrapperProps = {
    children: ReactNode;
    content: ReactNode;
    open?: boolean;
    delayDuration?: number;
} & Omit<ComponentProps<typeof TooltipContent>, "children" | "content">;

function TooltipWrapper({
    children,
    content,
    open,
    delayDuration = 200,
    ...contentProps
}: TooltipWrapperProps) {
    if (!content) return <>{children}</>;

    return (
        <TooltipProvider delayDuration={delayDuration}>
            <Tooltip open={open}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent {...contentProps}>{content}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    TooltipWrapper,
};
export type { TooltipWrapperProps };
