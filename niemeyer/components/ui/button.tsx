import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const buttonVariants = cva(
    cn(
        "group/button box-border inline-flex shrink-0 items-center justify-center border border-transparent",
        "bg-clip-padding text-sm font-medium leading-none whitespace-nowrap transition-all outline-none select-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "active:not-aria-[haspopup]:translate-y-px",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    ),
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
                outline: cn(
                    "border-border bg-background hover:bg-muted hover:text-foreground",
                    "aria-expanded:bg-muted aria-expanded:text-foreground",
                    "dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                ),
                /**
                 * Looks like an `<Input>` / `<SelectTrigger>` — `border-input`,
                 * transparent bg, subtle hover. Use when a button is acting as
                 * an input-shaped surface (e.g. an async-select trigger inside
                 * a form), so it visually lines up with sibling inputs and
                 * selects.
                 */
                input: cn(
                    "border-input bg-transparent text-foreground hover:bg-muted hover:text-foreground",
                    "aria-expanded:bg-muted aria-expanded:text-foreground",
                    "data-placeholder:text-muted-foreground",
                    "dark:bg-input/30 dark:hover:bg-input/50",
                ),
                secondary: cn(
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    "aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
                ),
                ghost: cn(
                    "hover:bg-muted hover:text-foreground",
                    "aria-expanded:bg-muted aria-expanded:text-foreground",
                    "dark:hover:bg-muted/50",
                ),
                /** Solid (product); shadcn often uses a soft /10 “destructive” in registry — Niemeyer UI matches labels + destructive actions. */
                destructive:
                    "bg-destructive text-destructive-foreground hover:opacity-90 [a]:hover:opacity-90",
                link: "rounded-sm bg-transparent text-primary shadow-none ring-offset-background underline-offset-4 hover:underline",
            },
            size: {
                /** 32 / 40 / 48px heights (h-8 / h-10 / h-12 on the standard Tailwind ladder). */
                default: "h-10 min-h-10 gap-2 px-4",
                sm: "h-8 min-h-8 gap-1.5 px-3",
                xs: "h-6 min-h-6 gap-1 px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
                lg: "h-12 min-h-12 gap-2 px-8 text-base [&_svg:not([class*='size-'])]:size-6",
                icon: "size-10 p-0 [&_svg:not([class*='size-'])]:size-4",
                "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-8 p-0 [&_svg:not([class*='size-'])]:size-4",
                "icon-lg": "size-12 p-0 [&_svg:not([class*='size-'])]:size-6",
            },
            /** Border radius shape. `"pill"` (default — page CTAs, toolbar
             *  actions, filter chips) or `"default"` (rounded-lg — form-mode,
             *  e.g. as the trigger of a form-field Multiselect). The `link`
             *  variant overrides this with its own `rounded-sm`. */
            shape: {
                default: "rounded-lg",
                pill: "rounded-full",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "pill",
        },
        compoundVariants: [
            {
                variant: "link",
                class: "h-auto min-h-0 w-auto !gap-0 border-0 px-0.5 py-0.5",
            },
        ],
    },
);

type ButtonProps = ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
        /**
         * When true: disables the button, hides its children, and overlays a
         * spinner so the click target stays the same width. Ignored when
         * `asChild` is true — pass loading state down to the rendered child.
         */
        isLoading?: boolean;
    };

function Button({
    className,
    variant = "default",
    size = "default",
    shape = "pill",
    asChild = false,
    isLoading = false,
    disabled,
    children,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot.Root : "button";
    const showSpinnerOverlay = isLoading && !asChild;

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            data-shape={shape}
            data-loading={isLoading || undefined}
            disabled={disabled || isLoading || undefined}
            className={cn(
                buttonVariants({ variant, size, shape }),
                showSpinnerOverlay && "relative",
                className,
            )}
            {...props}
        >
            {showSpinnerOverlay ? (
                <>
                    <span className="inline-flex items-center opacity-20 [gap:inherit]">
                        {children}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center">
                        <Spinner />
                    </span>
                </>
            ) : (
                children
            )}
        </Comp>
    );
}

export { Button, buttonVariants };
export type { ButtonProps };
