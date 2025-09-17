// /lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/types/supabase";

export const createServerSupabase = () =>
  createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );
