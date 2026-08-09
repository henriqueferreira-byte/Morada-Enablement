"use server";

import { requireUser } from "@/lib/auth";

const SIGNED_URL_TTL_SECONDS = 60;

/** Returns a URL to open/download a material and logs a material_events row. External links pass through as-is; Storage-backed files get a short-lived signed URL — never a public one. */
export async function getMaterialAccessUrl(materialId: string, kind: "open" | "download") {
  const { supabase, user } = await requireUser();

  const { data: material } = await supabase
    .from("materials")
    .select("id, ext, storage_path, external_url")
    .eq("id", materialId)
    .single();

  if (!material) throw new Error("Material não encontrado.");

  await supabase.from("material_events").insert({ user_id: user.id, material_id: materialId, kind });

  if (material.external_url) {
    return { url: material.external_url };
  }

  if (!material.storage_path) throw new Error("Material sem arquivo ou link.");

  // Supabase Storage always serves .html objects as text/plain (an
  // intentional anti-phishing measure — it refuses to host renderable
  // pages), so "open" routes HTML through our own proxy route instead of a
  // signed URL, which re-serves the bytes with the real content-type.
  // "download" is unaffected — Content-Disposition still saves the file
  // correctly regardless of the mislabeled type.
  if (material.ext === "HTML" && kind === "open") {
    return { url: `/api/materials/${materialId}/view` };
  }

  const { data: signed, error } = await supabase.storage
    .from("hub-materials")
    .createSignedUrl(material.storage_path, SIGNED_URL_TTL_SECONDS, {
      download: kind === "download",
    });

  if (error || !signed) throw new Error("Não foi possível gerar o link do arquivo.");
  return { url: signed.signedUrl };
}
