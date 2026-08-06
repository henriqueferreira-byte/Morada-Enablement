import Link from "next/link";
import { IconFolder } from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { getProductsOverview } from "@/lib/queries/materials";
import { MaterialsSearchResults } from "@/components/materials/materials-search-results";

export default async function MateriaisPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase } = await requireUser();
  const { q } = await searchParams;

  if (q?.trim()) {
    return <MaterialsSearchResults supabase={supabase} query={q.trim()} />;
  }

  const products = await getProductsOverview(supabase);

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">Materiais</h1>
          <p className="text-sm text-neutral-600">
            Navegue por produto, abra a feature e encontre decks, apresentações e documentos.
          </p>
        </div>
        <Button variant="outline">Solicitar material</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/materiais/${product.id}`}
            className="relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-xs outline-none transition-colors hover:border-neutral-300 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {product.hasNew && (
              <span className="absolute right-4 top-4 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                NOVO
              </span>
            )}
            <span
              className="flex size-9 items-center justify-center rounded-full"
              style={{ backgroundColor: `${product.accent}1a`, color: product.accent }}
            >
              <IconFolder className="size-4" />
            </span>
            <h3 className="font-heading text-lg font-semibold text-foreground">{product.name}</h3>
            {product.description && <p className="text-[13px] text-neutral-600">{product.description}</p>}
            <p className="mt-auto text-xs text-neutral-500">
              {product.featureCount} {product.featureCount === 1 ? "feature" : "features"} · {product.fileCount} arquivos
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
