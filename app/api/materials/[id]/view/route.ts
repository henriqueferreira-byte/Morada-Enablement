import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

/**
 * Re-serves an HTML material with the real content-type. Supabase Storage
 * always forces .html objects to text/plain (an intentional anti-phishing
 * measure — see supabase/storage#186) even when uploaded with the correct
 * type, so a signed URL alone would show the page source instead of
 * rendering it. This route downloads the bytes server-side (bypassing that
 * restriction, which only applies to Storage's own public-facing URLs) and
 * returns them with `Content-Type: text/html`.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireUser();

  const { data: material } = await supabase
    .from("materials")
    .select("id, ext, storage_path")
    .eq("id", id)
    .single();

  if (!material || material.ext !== "HTML" || !material.storage_path) {
    return new NextResponse("Material não encontrado.", { status: 404 });
  }

  const { data: file, error } = await supabase.storage.from("hub-materials").download(material.storage_path);
  if (error || !file) {
    return new NextResponse("Não foi possível abrir o arquivo.", { status: 502 });
  }

  // material_events "open" is already logged by getMaterialAccessUrl before
  // it hands back this route's URL — don't double-count here.
  return new NextResponse(await file.text(), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
