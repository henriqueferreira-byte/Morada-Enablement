"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Tabs as TabsPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Tabs({
    className,
    orientation = "horizontal",
    ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            data-orientation={orientation}
            className={cn(
                "group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
                className,
            )}
            {...props}
        />
    );
}

const tabsListVariants = cva(
    cn(
        "group/tabs-list inline-flex items-center text-muted-foreground",
        "group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col",
        "data-[variant=line]:rounded-none",
    ),
    {
        variants: {
            variant: {
                default: "w-fit justify-center rounded-lg bg-muted p-[3px]",
                line: "w-full justify-start gap-1 border-b border-border bg-transparent",
                pill: "w-fit justify-center rounded-full border border-border bg-background p-0.5",
            },
            size: {
                default: "group-data-[orientation=horizontal]/tabs:h-10",
                sm: "group-data-[orientation=horizontal]/tabs:h-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function TabsList({
    className,
    variant = "default",
    size = "default",
    ...props
}: ComponentProps<typeof TabsPrimitive.List> &
    VariantProps<typeof tabsListVariants>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            data-variant={variant}
            data-size={size}
            className={cn(tabsListVariants({ variant, size }), className)}
            {...props}
        />
    );
}

function TabsTrigger({
    className,
    ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "relative inline-flex h-[calc(100%-1px)] items-center justify-center gap-1.5 rounded-md",
                "border border-transparent px-3 py-0.5 text-sm font-medium whitespace-nowrap",
                "text-foreground/60 transition-all",
                "group-data-[variant=default]/tabs-list:flex-1",
                "group-data-[variant=pill]/tabs-list:rounded-full",
                "group-data-[size=sm]/tabs-list:gap-1 group-data-[size=sm]/tabs-list:px-2.5 group-data-[size=sm]/tabs-list:text-xs",
                "group-data-[size=sm]/tabs-list:[&_svg:not([class*='size-'])]:size-3.5",
                "group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start",
                "hover:text-foreground",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "focus-visible:outline-1 focus-visible:outline-ring",
                "disabled:pointer-events-none disabled:opacity-50",
                "has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1",
                "dark:text-muted-foreground dark:hover:text-foreground",
                "group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm",
                "group-data-[variant=pill]/tabs-list:data-[state=active]:shadow-sm",
                "group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                "group-data-[variant=line]/tabs-list:bg-transparent",
                "group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
                "group-data-[variant=line]/tabs-list:data-[state=active]:text-primary",
                "dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent",
                "dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent",
                "data-[state=active]:bg-background data-[state=active]:text-foreground",
                "group-data-[variant=pill]/tabs-list:data-[state=active]:bg-card",
                "dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground",
                "after:absolute after:bg-primary after:opacity-0 after:transition-opacity",
                "group-data-[orientation=horizontal]/tabs:after:inset-x-0",
                "group-data-[orientation=horizontal]/tabs:after:-bottom-px",
                "group-data-[orientation=horizontal]/tabs:after:h-0.5",
                "group-data-[orientation=vertical]/tabs:after:inset-y-0",
                "group-data-[orientation=vertical]/tabs:after:-right-1",
                "group-data-[orientation=vertical]/tabs:after:w-0.5",
                "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({
    className,
    ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn("flex-1 text-sm outline-none", className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
