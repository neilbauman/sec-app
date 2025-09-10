// lib/supabase.ts
// Server-side Supabase client factory for Next.js App Router
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/**
 * Create a Supabase client bound to Next.js server cookies.
 * Avoid explicit return typing to prevent generic-mismatch TS errors on Vercel.
 */
export function createClientOnServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookies().get(name)?.value;
      },
      set(name: string, value: string, options: Parameters<typeof cookies.set>[2]) {
        cookies().set(name, value, options);
      },
      remove(name: string, options: Parameters<typeof cookies.set>[2]) {
        // Next's cookies API has no .delete; emulate via set + maxAge=0
        cookies().set(name, "", { ...options, maxAge: 0 });
      },
    },
  });
}

/**
 * Back-compat alias: some files previously imported { createClient } from "@/lib/supabase".
 * Keeping this alias prevents import errors without hunting every caller.
 */
export const createClient = createClientOnServer;

export default createClientOnServer;
