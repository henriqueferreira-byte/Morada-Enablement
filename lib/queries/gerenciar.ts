import type { SupabaseClient } from "@supabase/supabase-js";

export type PublicationItem = {
  id: string;
  kind: "material" | "lesson";
  title: string;
  status: "draft" | "published";
  createdAt: string;
  authorName: string | null;
  locationLabel: string;
};

export async function getRecentPublications(
  supabase: SupabaseClient,
  limit = 8,
): Promise<PublicationItem[]> {
  const [{ data: materials }, { data: lessons }] = await Promise.all([
    supabase
      .from("materials")
      .select(
        `id, title, status, created_at,
         author:profiles!materials_created_by_fkey ( full_name ),
         feature:features!materials_feature_id_fkey ( name, product:products!features_product_id_fkey ( name ) )`,
      )
      .order("created_at", { ascending: false })
      .limit(limit),
    supabase
      .from("lessons")
      .select(
        `id, title, status, published_at,
         author:profiles!lessons_created_by_fkey ( full_name ),
         track:tracks!lessons_track_id_fkey ( title, product:products!tracks_product_id_fkey ( name ) )`,
      )
      .order("published_at", { ascending: false })
      .limit(limit),
  ]);

  const materialItems: PublicationItem[] = (materials ?? []).map((row: any) => ({
    id: row.id,
    kind: "material",
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    authorName: row.author?.full_name ?? null,
    locationLabel: `${row.feature?.product?.name ?? ""} · ${row.feature?.name ?? ""}`,
  }));

  const lessonItems: PublicationItem[] = (lessons ?? []).map((row: any) => ({
    id: row.id,
    kind: "lesson",
    title: row.title,
    status: row.status,
    createdAt: row.published_at,
    authorName: row.author?.full_name ?? null,
    locationLabel: `${row.track?.product?.name ?? ""} · ${row.track?.title ?? ""}`,
  }));

  return [...materialItems, ...lessonItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export type FeedbackItem = {
  id: string;
  stars: number;
  comment: string | null;
  createdAt: string;
  lessonTitle: string;
  userTeam: string | null;
};

export async function getFeedbackFeed(supabase: SupabaseClient, limit = 20): Promise<FeedbackItem[]> {
  const { data } = await supabase
    .from("lesson_feedback")
    .select(
      `id, stars, comment, created_at,
       lesson:lessons!lesson_feedback_lesson_id_fkey ( title ),
       user:profiles!lesson_feedback_user_id_fkey ( team )`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((row: any) => ({
    id: row.id,
    stars: row.stars,
    comment: row.comment,
    createdAt: row.created_at,
    lessonTitle: row.lesson?.title ?? "",
    userTeam: row.user?.team ?? null,
  }));
}
