import type { SupabaseClient } from "@supabase/supabase-js";
import { isWithinDays } from "@/lib/format";

export type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  ext: string;
  format: string;
  content_type: string | null;
  category: string | null;
  storage_path: string | null;
  external_url: string | null;
  status: "draft" | "published";
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
  feature: { id: string; name: string; product: { id: string; name: string; accent: string } };
};

const MATERIAL_SELECT = `id, title, description, ext, format, content_type, category, storage_path, external_url, status, is_highlight, created_at, updated_at,
   feature:features!materials_feature_id_fkey ( id, name, product:products!features_product_id_fkey ( id, name, accent ) )`;

export async function getRecentMaterials(
  supabase: SupabaseClient,
  limit = 3,
): Promise<MaterialRow[]> {
  const { data } = await supabase
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("status", "published")
    .eq("is_highlight", true)
    .order("updated_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as unknown as MaterialRow[];
}

export type ProductOverview = {
  id: string;
  name: string;
  accent: string;
  description: string | null;
  featureCount: number;
  fileCount: number;
  hasNew: boolean;
};

export type FeatureOverview = {
  id: string;
  name: string;
  description: string | null;
  fileCount: number;
  updatedAt: string | null;
  hasNew: boolean;
};

type RawTree = {
  id: string;
  name: string;
  accent: string;
  description: string | null;
  features: {
    id: string;
    name: string;
    description: string | null;
    materials: { updated_at: string; status: string }[];
  }[];
};

const TREE_SELECT = `id, name, accent, description,
  features (
    id, name, description,
    materials ( updated_at, status )
  )`;

async function getCatalogTree(supabase: SupabaseClient): Promise<RawTree[]> {
  const { data } = await supabase.from("products").select(TREE_SELECT).order("position");
  return (data ?? []) as unknown as RawTree[];
}

/** Nível 1 — produtos com pelo menos uma feature (o catálogo pode ter módulos só-de-trilha, como "transversal", sem pasta de materiais). */
export async function getProductsOverview(supabase: SupabaseClient): Promise<ProductOverview[]> {
  const tree = await getCatalogTree(supabase);
  return tree
    .filter((product) => product.features.length > 0)
    .map((product) => {
      const published = product.features.flatMap((f) => f.materials.filter((m) => m.status === "published"));
      return {
        id: product.id,
        name: product.name,
        accent: product.accent,
        description: product.description,
        featureCount: product.features.length,
        fileCount: published.length,
        hasNew: published.some((m) => isWithinDays(m.updated_at, 7)),
      };
    });
}

export async function getProductOverview(
  supabase: SupabaseClient,
  productId: string,
): Promise<{ product: { id: string; name: string; accent: string; description: string | null }; features: FeatureOverview[] } | null> {
  const tree = await getCatalogTree(supabase);
  const product = tree.find((p) => p.id === productId);
  if (!product) return null;

  const features: FeatureOverview[] = product.features.map((feature) => {
    const published = feature.materials.filter((m) => m.status === "published");
    const updatedAt = published.reduce<string | null>(
      (latest, m) => (!latest || m.updated_at > latest ? m.updated_at : latest),
      null,
    );
    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
      fileCount: published.length,
      updatedAt,
      hasNew: published.some((m) => isWithinDays(m.updated_at, 7)),
    };
  });

  return {
    product: { id: product.id, name: product.name, accent: product.accent, description: product.description },
    features,
  };
}

export async function getFeatureMaterials(
  supabase: SupabaseClient,
  productId: string,
  featureId: string,
): Promise<{
  product: { id: string; name: string; accent: string };
  feature: { id: string; name: string; description: string | null };
  materials: MaterialRow[];
  relatedTrack: { id: string; title: string } | null;
} | null> {
  const { data: feature } = await supabase
    .from("features")
    .select(`id, name, description, product:products!features_product_id_fkey ( id, name, accent )`)
    .eq("id", featureId)
    .eq("product_id", productId)
    .maybeSingle();

  if (!feature) return null;

  const [{ data: materials }, { data: relatedTrack }] = await Promise.all([
    supabase
      .from("materials")
      .select(MATERIAL_SELECT)
      .eq("feature_id", featureId)
      .eq("status", "published")
      .order("updated_at", { ascending: false }),
    supabase.from("tracks").select("id, title").eq("feature_id", featureId).order("position").limit(1).maybeSingle(),
  ]);

  const productData = feature.product as unknown as { id: string; name: string; accent: string };

  return {
    product: productData,
    feature: { id: feature.id, name: feature.name, description: feature.description },
    materials: (materials ?? []) as unknown as MaterialRow[],
    relatedTrack: relatedTrack ?? null,
  };
}

/** Filters client-side (not a PostgREST `.or()` filter string) so search
 * terms with `%`, `,` or `()` — which are structurally significant in
 * PostgREST/ilike syntax — can't break or skew the query. The catalog is
 * small enough that fetching published materials once and matching in JS
 * is simpler than sanitizing a filter string. */
export async function searchMaterials(supabase: SupabaseClient, query: string): Promise<MaterialRow[]> {
  const { data } = await supabase
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  const needle = query.trim().toLowerCase();
  return ((data ?? []) as unknown as MaterialRow[])
    .filter((m) => `${m.title} ${m.description ?? ""}`.toLowerCase().includes(needle))
    .slice(0, 50);
}
