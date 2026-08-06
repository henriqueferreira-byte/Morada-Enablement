import type { SupabaseClient } from "@supabase/supabase-js";

export type MaterialRow = {
  id: string;
  title: string;
  description: string | null;
  ext: string;
  format: string;
  storage_path: string | null;
  external_url: string | null;
  status: "draft" | "published";
  is_highlight: boolean;
  created_at: string;
  updated_at: string;
  feature: { id: string; name: string; product: { id: string; name: string; accent: string } };
};

const MATERIAL_SELECT = `id, title, description, ext, format, storage_path, external_url, status, is_highlight, created_at, updated_at,
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
