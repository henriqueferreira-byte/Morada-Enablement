import type { SupabaseClient } from "@supabase/supabase-js";
import { isWithinDays } from "@/lib/format";
import type { LessonKind } from "@/lib/queries/tracks";

export type NovidadeItem = {
  id: string;
  kind: "lesson" | "material";
  title: string;
  href: string;
  publishedAt: string;
  isNew: boolean;
  productName: string;
  productAccent: string;
  authorName: string | null;
  contentKind: LessonKind | null;
  format: string | null;
};

/** "What's new" feed for the Home page — lessons and materials published/updated in the last 30 days, newest first. */
export async function getNovidades(
  supabase: SupabaseClient,
  limit = 8,
): Promise<NovidadeItem[]> {
  const [{ data: lessons }, { data: materials }] = await Promise.all([
    supabase
      .from("lessons")
      .select(
        `id, title, kind, published_at, track_id,
         track:tracks!lessons_track_id_fkey ( id, owner_name, product:products!tracks_product_id_fkey ( name, accent ) )`,
      )
      .eq("is_highlight", true)
      .gte("published_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("published_at", { ascending: false })
      .limit(limit),
    supabase
      .from("materials")
      .select(
        `id, title, format, updated_at, feature_id,
         feature:features!materials_feature_id_fkey ( id, product:products!features_product_id_fkey ( id, name, accent ) )`,
      )
      .eq("status", "published")
      .eq("is_highlight", true)
      .gte("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order("updated_at", { ascending: false })
      .limit(limit),
  ]);

  const lessonItems: NovidadeItem[] = (lessons ?? []).map((row: any) => ({
    id: `lesson:${row.id}`,
    kind: "lesson",
    title: row.title,
    href: `/trilhas/${row.track_id}`,
    publishedAt: row.published_at,
    isNew: isWithinDays(row.published_at, 7),
    productName: row.track?.product?.name ?? "",
    productAccent: row.track?.product?.accent ?? "#0073ff",
    authorName: row.track?.owner_name ?? null,
    contentKind: row.kind,
    format: null,
  }));

  const materialItems: NovidadeItem[] = (materials ?? []).map((row: any) => ({
    id: `material:${row.id}`,
    kind: "material",
    title: row.title,
    href: row.feature?.product?.id
      ? `/materiais/${row.feature.product.id}/${row.feature.id}`
      : "/materiais",
    publishedAt: row.updated_at,
    isNew: isWithinDays(row.updated_at, 7),
    productName: row.feature?.product?.name ?? "",
    productAccent: row.feature?.product?.accent ?? "#0073ff",
    authorName: null,
    contentKind: null,
    format: row.format,
  }));

  return [...lessonItems, ...materialItems]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
