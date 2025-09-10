// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  // IMPORTANT: createServerSupabase is async in your repo right now → await it
  const supabase = await createServerSupabase();

  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  return {
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
