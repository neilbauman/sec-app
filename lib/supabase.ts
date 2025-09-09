import { createClient } from "@supabase/supabase-js";

// Use anon key for read-only access (RLS should allow public read OR your anon key has privileges)
export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  // No cookies/headers used. Pure server-side client.
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
