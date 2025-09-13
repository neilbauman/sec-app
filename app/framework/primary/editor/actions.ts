"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies, type ReadonlyRequestCookies } from "next/headers";

function getSupabase() {
  // ✅ cookies() is synchronous, no `await`
  const cookieStore: ReadonlyRequestCookies = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null;
        },
        set() {
          // no-op for server actions
        },
        remove() {
          // no-op for server actions
        },
      },
    }
  );
}
