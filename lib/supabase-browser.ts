import { createBrowserClient } from "@supabase/ssr";

// ✅ Export a `supabase` client that can be used across the app
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
