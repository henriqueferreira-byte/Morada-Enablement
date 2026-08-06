"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tableContainerVariants = cva(
    "relative w-full overflow-x-auto rounded-lg border border-border",
    {
        variants: {
            variant: {
                default: "",
                plain: "",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Table({
    className,
    tableClassName,
    variant = "default",
    ...props
}: ComponentProps<"table"> &
    VariantProps<typeof tableContainerVariants> & { tableClassName?: string }) {
    return (
        <div
            data-slot="table-container"
            data-variant={variant}
            className={cn(tableContainerVariants({ variant }), className)}
        >
            <table
                data-slot="table"
                className={cn("w-full caption-bottom text-sm", tableClassName)}
                {...props}
            />
        </div>
    );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
    return (
        <thead
            data-slot="table-header"
            className={cn(
                "bg-primary/[0.06] in-data-[variant=plain]:bg-transparent [&_tr]:border-b [&_tr]:border-border [&_tr]:hover:bg-transparent",
                className,
            )}
            {...props}
        />
    );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
    return (
        <tbody
            data-slot="table-body"
            className={cn("[&_tr:last-child]:border-0", className)}
            {...props}
        />
    );
}

function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn(
                "border-t border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
                className,
            )}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                "border-b border-border transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                "h-10 px-4 text-left align-middle text-xs font-semibold whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
    return (
        <td
            data-slot="table-cell"
            className={cn(
                "px-4 py-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
                className,
            )}
            {...props}
        />
    );
}

function TableCaption({ className, ...props }: ComponentProps<"caption">) {
    return (
        <caption
            data-slot="table-caption"
            className={cn("mt-4 text-sm text-muted-foreground", className)}
            {...props}
        />
    );
}

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
    tableContainerVariants,
};
