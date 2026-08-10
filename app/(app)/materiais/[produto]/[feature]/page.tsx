import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, EmptyState } from "@/niemeyer/components";
import { requireUser } from "@/lib/auth";
import { formatRelative } from "@/lib/format";
import { getFeatureMaterials } from "@/lib/queries/materials";
import { MaterialsBreadcrumb } from "@/components/materials/materials-breadcrumb";
import { MaterialsSearchResults } from "@/components/materials/materials-search-results";
import { MaterialsTable } from "@/components/materials/materials-table";

export default async function FeatureMaterialsPage({
  params,
  searchParams,
}: {
  params: Promise<{ produto: string; feature: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { supabase, profile } = await requireUser();
  const { produto, feature: rawFeature } = await params;
  // Some browsers percent-encode the literal ":" in feature ids (e.g. "vendas:filas")
  // when navigating, and it can arrive undecoded here — decode defensively.
  const feature = decodeURIComponent(rawFeature);
  const { q } = await searchParams;

  if (q?.trim()) {
    return <MaterialsSearchResults supabase={supabase} query={q.trim()} isAdmin={profile.role === "admin"} />;
  }

  const result = await getFeatureMaterials(supabase, produto, feature);
  if (!result) notFound();

  const latestUpdate = result.materials[0]?.updated_at;

  return (
    <>
      <MaterialsBreadcrumb
        crumbs={[
          { label: "Materiais", href: "/materiais" },
          { label: result.product.name, href: `/materiais/${produto}` },
          { label: result.feature.name },
        ]}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
            {result.feature.name}
          </h1>
          <p className="text-sm text-neutral-600">
            {result.materials.length} arquivos{latestUpdate ? ` · atualizado ${formatRelative(latestUpdate)}` : ""}
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href={`/materiais/${produto}`}>Voltar</Link>
        </Button>
      </div>

      {result.materials.length === 0 ? (
        <EmptyState variant="no-data" title="Nenhum arquivo nesta pasta ainda" />
      ) : (
        <MaterialsTable materials={result.materials} showLocation={false} isAdmin={profile.role === "admin"} />
      )}
    </>
  );
}
