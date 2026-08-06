import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva(
    cn(
        "font-heading text-foreground",
        // Sensible default tracking + leading; size variants override leading when needed.
        "tracking-tight",
    ),
    {
        variants: {
            size: {
                xl: "text-2xl leading-tight font-bold",
                lg: "text-lg leading-snug font-semibold",
                md: "text-base leading-snug font-semibold",
                sm: "text-sm leading-tight font-semibold",
                xs: "text-xs leading-tight font-semibold uppercase tracking-wide text-muted-foreground",
            },
        },
        defaultVariants: {
            size: "lg",
        },
    },
);

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const DEFAULT_SIZE_BY_LEVEL: Record<
    HeadingLevel,
    NonNullable<VariantProps<typeof headingVariants>["size"]>
> = {
    h1: "xl",
    h2: "lg",
    h3: "sm",
    h4: "sm",
    h5: "xs",
    h6: "xs",
};

type HeadingProps = ComponentProps<"h1"> &
    VariantProps<typeof headingVariants> & {
        /**
         * Semantic HTML level for the document outline / screen-reader
         * navigation. Defaults to `h2` because `h1` should typically appear
         * only once per page.
         */
        as?: HeadingLevel;
    };

/**
 * Page / section / sub-section headings with Niemeyer typography baked in:
 * Outfit (`font-heading`), foreground color, sensible weight + size pairs.
 *
 * `as` controls the *semantic* level (`<h1>` … `<h6>`). `size` controls the
 * *visual* size — defaults match `as` (h1→xl, h2→lg, h3/h4→sm, h5/h6→xs)
 * but can be overridden when an h2 needs to look like an h3, or an h3
 * needs to look like a page title.
 *
 * ```tsx
 * <Heading as="h1">Imóveis</Heading>             // h1 + size="xl"
 * <Heading as="h2">Filtros</Heading>             // h2 + size="lg"
 * <Heading as="h2" size="sm">Detalhes</Heading>  // h2 styled as h3
 * <Heading as="h3" size="xs">Categoria</Heading> // eyebrow label
 * ```
 */
function Heading({ as = "h2", size, className, ...props }: HeadingProps) {
    const Tag = as;
    const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[as];
    return (
        <Tag
            data-slot="heading"
            className={cn(headingVariants({ size: resolvedSize }), className)}
            {...props}
        />
    );
}

export { Heading, headingVariants };
