"use client";

import { useState } from "react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/niemeyer/components";
import { createClient } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: { hd: "morada.ai", prompt: "select_account" },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Button
      variant="outline"
      size="lg"
      shape="pill"
      className="w-full justify-center border-neutral-200 text-base"
      isLoading={isLoading}
      onClick={handleClick}
    >
      <IconBrandGoogle />
      Entrar com Google
    </Button>
  );
}
