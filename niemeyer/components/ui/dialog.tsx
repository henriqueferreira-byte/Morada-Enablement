"use client";

import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { IconX } from "@tabler/icons-react";

function Dialog({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({
    ...props
}: ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({
    ...props
}: ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({
    ...props
}: ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                "fixed inset-0 isolate z-50 bg-black/10 duration-100",
                "supports-backdrop-filter:backdrop-blur-xs",
                "data-[state=open]:animate-in data-[state=open]:fade-in-0",
                "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
                className,
            )}
            {...props}
        />
    );
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    "fixed top-1/2 left-1/2 z-50 grid grid-cols-[minmax(0,1fr)] w-full max-w-[calc(100%-2rem)] sm:max-w-sm",
                    "-translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4",
                    "text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                    className,
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close data-slot="dialog-close" asChild>
                        <Button
                            variant="ghost"
                            className="absolute top-2 right-2"
                            size="icon-sm"
                        >
                            <IconX />
                            <span className="sr-only">Close</span>
                        </Button>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

/**
 * Scrollable body for long dialog content. Wraps children in a ScrollArea
 * so the rounded corners of DialogContent stay clean and the styled
 * scrollbar lives inside the dialog instead of clipping the corner. The
 * `-mr-2 pr-2` pair pulls the scrollbar flush to the dialog edge while
 * keeping content padded away from it.
 *
 * `min-w-0` is required because DialogContent is a `grid`, and grid children
 * default to `min-width: auto` (intrinsic content width). Without `min-w-0`,
 * a long unbreakable string inside the body would push the dialog past its
 * declared `max-w-sm` width and break `truncate` / `overflow-hidden` on
 * descendants.
 */
function DialogContentBody({
    className,
    children,
    ...props
}: ComponentProps<"div">) {
    return (
        <ScrollArea
            data-slot="dialog-content-body"
            className={cn(
                "-mr-2 max-h-[calc(100vh-12rem)] min-w-0 pr-2",
                className,
            )}
        >
            <div {...props}>{children}</div>
        </ScrollArea>
    );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-2", className)}
            {...props}
        />
    );
}

function DialogFooter({
    className,
    showCloseButton = false,
    children,
    ...props
}: ComponentProps<"div"> & {
    showCloseButton?: boolean;
}) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                className,
            )}
            {...props}
        >
            {children}
            {showCloseButton && (
                <DialogPrimitive.Close asChild>
                    <Button variant="outline">Close</Button>
                </DialogPrimitive.Close>
            )}
        </div>
    );
}

function DialogTitle({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-base leading-none font-medium", className)}
            {...props}
        />
    );
}

function DialogDescription({
    className,
    ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn(
                "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogContentBody,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
