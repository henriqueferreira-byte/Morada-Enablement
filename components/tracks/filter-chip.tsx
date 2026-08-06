import Link from "next/link";
import { cn } from "@/lib/utils";

export function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-8 items-center rounded-full border px-3 text-[13px] transition-colors outline-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        active
          ? "border-primary bg-primary font-bold text-primary-foreground"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
      )}
    >
      {children}
    </Link>
  );
}
