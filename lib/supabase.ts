// lib/supabase.ts
"use server";

import { cookies } from "next/headers";
import {
  createBrowserClient,
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// If you have a generated Database type, you can:
// import type { Database } from "@/types/database";
// and then change SupabaseClient to SupabaseClient<Database> below.
// For now we keep it generic to avoid build-time type friction.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/** Client for browser components/hooks */
export function createClient(): SupabaseClient {
  // `createBrowserClient` infers types; returning as plain SupabaseClient
  // avoids the “GenericSchema vs 'public'” constraint error on Vercel.
  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient;
}

/** Client for server routes, server components, and server actions */
export function createClientOnServer(): SupabaseClient {
  const jar = cookies(); // sync in Next 15

  // Note: on the server, `cookies().set/remove` are available in server actions
  // and Route Handlers; they type-check here and are no-ops where not allowed.
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return jar.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        jar.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        jar.set(name, "", { ...options, maxAge: 0 });
      },
    },
  }) as unknown as SupabaseClient;
}
