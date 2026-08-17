// TEMPORARY diagnostic-only route — establishes a session from an
// admin-generated magiclink token_hash, so a specific issue can be verified
// against the real deployment without real Google OAuth. Requires a
// service-role-generated token tied to a specific email; deleted immediately
// after use.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  if (!token_hash) return NextResponse.redirect(`${origin}/login`);

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ token_hash, type: "email" });
  return NextResponse.redirect(`${origin}${error ? "/login?erro=dev" : "/"}`);
}
