import type { SupabaseClient } from "@supabase/supabase-js";

export type Product = {
  id: string;
  name: string;
  accent: string;
  description: string | null;
  position: number;
};

export async function getProducts(supabase: SupabaseClient): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("id, name, accent, description, position")
    .order("position");

  return data ?? [];
}
