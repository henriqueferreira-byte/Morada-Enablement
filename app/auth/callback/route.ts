import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { assertDomain } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && assertDomain(data.user?.email)) {
      return NextResponse.redirect(`${origin}/`);
    }

    // `hd=morada.ai` on the authorize call is a hint, not a guarantee — a
    // personal Google account can still complete the OAuth handshake, so the
    // domain is re-checked here server-side before a session is trusted.
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(`${origin}/login?erro=dominio`);
}
