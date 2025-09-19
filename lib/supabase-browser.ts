// lib/supabase-browser.ts
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

/**
 * Create a new Supabase client for use in the browser (React components).
 * This function should be called only on the client.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
