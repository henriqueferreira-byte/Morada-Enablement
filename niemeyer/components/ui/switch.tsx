"use client";

import type { ComponentProps } from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
    className,
    size = "default",
    ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & {
    size?: "sm" | "default";
}) {
    return (
        <SwitchPrimitive.Root
            data-slot="switch"
            data-size={size}
            className={cn(
                "peer group/switch relative inline-flex shrink-0 items-center rounded-full",
                "border-2 border-transparent transition-colors outline-none",
                "after:absolute after:-inset-x-3 after:-inset-y-2",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "data-[size=default]:h-[20px] data-[size=default]:w-[36px]",
                "data-[size=sm]:h-[16px] data-[size=sm]:w-[28px]",
                "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                "data-[state=checked]:bg-primary data-[state=unchecked]:bg-neutral-300",
                "dark:data-[state=unchecked]:bg-neutral-700",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                data-slot="switch-thumb"
                className={cn(
                    "pointer-events-none block rounded-full bg-background shadow-sm ring-0 transition-transform",
                    "group-data-[size=default]/switch:size-[14px] group-data-[size=sm]/switch:size-[10px]",
                    "group-data-[size=default]/switch:data-[state=checked]:translate-x-[18px]",
                    "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[12px]",
                    "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-[2px]",
                    "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-[2px]",
                    "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground",
                )}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
