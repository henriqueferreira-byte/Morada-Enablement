/* eslint-disable niemeyer/no-native-form-elements -- design-system Input primitive */
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type InputShape = "default" | "pill";

function Input({
    className,
    type,
    shape = "default",
    ...props
}: ComponentProps<"input"> & {
    /** `"default"` (rounded-lg, form-mode) or `"pill"` (rounded-full, toolbar /
     *  search / filter contexts). */
    shape?: InputShape;
}) {
    return (
        <input
            type={type}
            data-slot="input"
            data-shape={shape}
            className={cn(
                "h-10 w-full min-w-0 border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none md:text-sm",
                shape === "pill" ? "rounded-full" : "rounded-lg",
                "placeholder:text-muted-foreground",
                "file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                "dark:bg-input/30 dark:disabled:bg-input/80",
                "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
export type { InputShape };
