// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
// ... (types etc.)

/ Re-export shared types so callers can import them from here too.
export type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList() {
  const supabase = createServerSupabase();

  // your existing queries...
  const { data: pillars } = await supabase.from("pillars").select("*").order("sort_order", { ascending: true });
  const { data: themes } = await supabase.from("themes").select("*").order("sort_order", { ascending: true });
  const { data: subthemes } = await supabase.from("subthemes").select("*").order("sort_order", { ascending: true });

  return { pillars: pillars ?? [], themes: themes ?? [], subthemes: subthemes ?? [] };
}
