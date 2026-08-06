import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function MaterialsBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] text-neutral-500">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden className="text-neutral-300">/</span>}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-primary">
              {crumb.label}
            </Link>
          ) : (
            <span className="font-bold text-neutral-700">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
