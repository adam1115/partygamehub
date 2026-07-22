"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      await supabase.auth.exchangeCodeForSession(
        window.location.href
      );

      router.replace("/");
    }

    init();
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      登入中...
    </main>
  );
}