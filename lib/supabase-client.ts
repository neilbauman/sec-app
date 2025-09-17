// /lib/supabase-client.ts
import { createClient } from "@supabase/supabase-js";

export const createBrowserSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // anon key for client-side
  );
};
