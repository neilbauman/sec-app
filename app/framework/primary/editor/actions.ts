"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper: get Supabase client for server actions
async function getSupabase() {
  const cookieStore = await cookies(); // 👈 FIX: Await here
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}
