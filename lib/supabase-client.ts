// lib/supabase-client.ts
import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./database.types";

// Typed Supabase client
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
