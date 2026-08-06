"use client";

import type { ComponentProps } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

function Toaster({ ...props }: ToasterProps) {
    return (
        <Sonner
            theme="light"
            position="bottom-right"
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast rounded-xl border border-neutral-200 bg-card text-card-foreground shadow-md",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-muted text-muted-foreground",
                },
            }}
            {...props}
        />
    );
}

export { Toaster, toast };
