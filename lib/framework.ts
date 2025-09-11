// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

/** Fetches pillars, themes, subthemes in sort_order. */
export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  const supabase = await createServerSupabase();

  const { data: pillars = [] } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes = [] } = await supabase
    .from("themes")
    .select("id, code, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  const { data: subthemes = [] } = await supabase
    .from("subthemes")
    .select("id, code, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  return { pillars: pillars as Pillar[], themes: themes as Theme[], subthemes: subthemes as Subtheme[] };
}
