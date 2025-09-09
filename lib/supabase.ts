import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Returns a browser-safe supabase client. We only use it on the server for now,
 * but this form keeps options minimal and avoids cookie APIs entirely.
 */
export function getSupabase() {
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key);
}
