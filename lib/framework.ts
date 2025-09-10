// lib/framework.ts
import { getSupabase } from "@/lib/supabase";

// Re-export your UI shapes if you want to import them here too
export type { Pillar, Theme, Subtheme } from "@/types/framework";

/** Fetch pillars, themes, subthemes in one go. Runs fine on the server. */
export async function fetchFrameworkList(): Promise<{
  pillars: Array<{ id: string; code: string; name: string; description: string | null; sort_order: number }>;
  themes: Array<{ id: string; code: string; name: string; description: string | null; sort_order: number; pillar_id: string | null; pillar_code?: string | null }>;
  subthemes: Array<{ id: string; code: string; name: string; description: string | null; sort_order: number; theme_id: string | null; theme_code?: string | null }>;
}> {
  const supabase = getSupabase();

  const [{ data: pillars = [], error: pErr }, { data: themes = [], error: tErr }, { data: subthemes = [], error: sErr }] =
    await Promise.all([
      supabase.from("pillars").select("id, code, name, description, sort_order").order("sort_order", { ascending: true }),
      supabase.from("themes").select("id, code, name, description, sort_order, pillar_id, pillar_code").order("sort_order", { ascending: true }),
      supabase.from("subthemes").select("id, code, name, description, sort_order, theme_id, theme_code").order("sort_order", { ascending: true }),
    ]);

  if (pErr) throw pErr;
  if (tErr) throw tErr;
  if (sErr) throw sErr;

  return { pillars, themes, subthemes };
}
