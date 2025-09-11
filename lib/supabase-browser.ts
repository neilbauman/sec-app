// lib/supabase-browser.ts
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Client-side (browser) Supabase client for React client components/hooks. */
export function createBrowserSupabase(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Cast to the stable SupabaseClient type to avoid “GenericSchema vs 'public'” noise on CI
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient;
}
