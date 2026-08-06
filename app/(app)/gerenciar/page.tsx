import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/queries/catalog";
import { getFeedbackFeed, getRecentPublications } from "@/lib/queries/gerenciar";
import { GerenciarForm } from "@/components/gerenciar/gerenciar-form";
import { RecentPublications } from "@/components/gerenciar/recent-publications";
import { FeedbackFeed } from "@/components/gerenciar/feedback-feed";

export default async function GerenciarPage() {
  const { supabase } = await requireAdmin();

  const [products, { data: features }, { data: tracks }, recentPublications, feedback] = await Promise.all([
    getProducts(supabase),
    supabase.from("features").select("id, product_id, name").order("position"),
    supabase.from("tracks").select("id, product_id, title").order("position"),
    getRecentPublications(supabase),
    getFeedbackFeed(supabase),
  ]);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-[28px] font-semibold tracking-tight text-foreground">Gerenciar conteúdo</h1>
        <p className="text-sm text-neutral-600">
          Suba um material para a pasta de uma feature ou publique uma aula em uma trilha. Só o time de enablement vê esta área.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <GerenciarForm
          products={products}
          features={(features ?? []).map((f) => ({ id: f.id, productId: f.product_id, name: f.name }))}
          tracks={(tracks ?? []).map((t) => ({ id: t.id, productId: t.product_id, title: t.title }))}
        />
        <div className="flex flex-col gap-5">
          <RecentPublications items={recentPublications} />
          <FeedbackFeed items={feedback} />
        </div>
      </div>
    </>
  );
}
