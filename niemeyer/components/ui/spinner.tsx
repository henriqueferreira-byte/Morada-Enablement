import type { ComponentProps } from "react";
import { IconLoader } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/**
 * Inline loading affordance — a spinning Tabler `IconLoader`. Use inside
 * buttons, inputs, list items, dropdowns, async selects, toasts, anywhere
 * you need a small "working…" indicator that lives in the content flow.
 *
 * For page-scale or panel-scale loaders that cover an entire route /
 * Suspense boundary, use `LoadingOverlay` instead.
 *
 * Default sizing is `size-4` (16px) at the parent's current text color
 * and full opacity. For subtler placements (search inputs, async select
 * triggers) add `className="opacity-60"`. For arbitrary sizes pass
 * `className="size-5"`, `size-6`, etc.
 */
export function Spinner({
    className,
    ...props
}: ComponentProps<typeof IconLoader>) {
    return (
        <IconLoader
            data-slot="spinner"
            aria-hidden
            className={cn("size-4 shrink-0 animate-spin", className)}
            {...props}
        />
    );
}
