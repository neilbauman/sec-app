// /lib/supabase-server.ts
import { createClient } from "@supabase/supabase-js";

export const createServerSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key for secure server access
  );
};
