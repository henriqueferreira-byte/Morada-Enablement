import Link from "next/link";
import { notFound } from "next/navigation";
import { IconFolder } from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { formatRelative } from "@/lib/format";
import { getProductOverview } from "@/lib/queries/materials";
import { MaterialsBreadcrumb } from "@/components/materials/materials-breadcrumb";
import { MaterialsSearchResults } from "@/components/materials/materials-search-results";

export default async function ProductMaterialsPage({
  params,
  searchParams,
}: {
  params: Promise<{ produto: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireUser();
  const { produto } = await params;
  const { q } = await searchParams;

  if (q?.trim()) {
    return <MaterialsSearchResults supabase={supabase} query={q.trim()} />;
  }

  const overview = await getProductOverview(supabase, produto);
  if (!overview) notFound();

  return (
    <>
      <MaterialsBreadcrumb crumbs={[{ label: "Materiais", href: "/materiais" }, { label: overview.product.name }]} />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
            {overview.product.name}
          </h1>
          <p className="text-sm text-neutral-600">Escolha a feature para ver os arquivos.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="ghost">
            <Link href="/materiais">Voltar</Link>
          </Button>
          <Button variant="outline">Solicitar material</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overview.features.map((feature) => (
          <Link
            key={feature.id}
            href={`/materiais/${produto}/${feature.id}`}
            className="relative flex flex-col gap-2.5 rounded-xl border border-border bg-card p-[18px] shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {feature.hasNew && (
              <span className="absolute right-4 top-4 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                NOVO
              </span>
            )}
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/[0.08] text-primary">
              <IconFolder className="size-4" />
            </span>
            <h3 className="font-heading text-base font-semibold text-foreground">{feature.name}</h3>
            {feature.description && <p className="text-[13px] text-neutral-600">{feature.description}</p>}
            <p className="mt-auto text-xs text-neutral-500">
              {feature.fileCount} arquivos{feature.updatedAt ? ` · atualizado ${formatRelative(feature.updatedAt)}` : ""}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
