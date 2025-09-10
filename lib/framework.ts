// lib/framework.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Returns raw DB rows shaped for the editor page.
 * Uses only columns we render in the UI to avoid type drift.
 */
export async function fetchFrameworkList(): Promise<{
  pillars: Array<{ code: string; name: string; description: string | null; sort_order: number | null }>;
  themes: Array<{ code: string; name: string; description: string | null; sort_order: number | null; pillar_code: string }>;
  subthemes: Array<{ code: string; name: string; description: string | null; sort_order: number | null; theme_code: string }>;
}> {
  const [{ data: pillars = [] }, { data: themes = [] }, { data: subthemes = [] }] = await Promise.all([
    supabase.from("pillars").select("code,name,description,sort_order").order("sort_order", { ascending: true }),
    supabase.from("themes").select("code,name,description,sort_order,pillar_code").order("sort_order", { ascending: true }),
    supabase.from("subthemes").select("code,name,description,sort_order,theme_code").order("sort_order", { ascending: true }),
  ]);

  return { pillars, themes, subthemes };
}
