import type { SupabaseClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Button, EmptyState } from "@/niemeyer/components";
import { searchMaterials } from "@/lib/queries/materials";
import { MaterialsBreadcrumb } from "./materials-breadcrumb";
import { MaterialsTable } from "./materials-table";

export async function MaterialsSearchResults({
  supabase,
  query,
}: {
  supabase: SupabaseClient;
  query: string;
}) {
  const materials = await searchMaterials(supabase, query);

  return (
    <>
      <MaterialsBreadcrumb crumbs={[{ label: "Materiais", href: "/materiais" }, { label: `Busca: ${query}` }]} />
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">
          Resultados da busca
        </h1>
        <p className="text-sm text-neutral-600">
          {materials.length} {materials.length === 1 ? "arquivo encontrado" : "arquivos encontrados"} em todos os produtos
        </p>
      </div>

      {materials.length === 0 ? (
        <EmptyState
          variant="no-results"
          title="Nenhum arquivo encontrado"
          description="Limpe a busca para voltar a navegar por produto."
        >
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/materiais">Limpar busca</Link>
          </Button>
        </EmptyState>
      ) : (
        <MaterialsTable materials={materials} showLocation />
      )}
    </>
  );
}
