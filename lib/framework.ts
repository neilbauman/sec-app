import { createClient } from "@/lib/supabase";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[]; themes: Theme[]; subthemes: Subtheme[];
}> {
  const supabase = createClient();

  const { data: pillars = [] } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes = [] } = await supabase
    .from("themes")
    .select("id, pillar_id, code, name, description, sort_order")
    .order("pillar_id", { ascending: true })
    .order("sort_order", { ascending: true });

  const { data: subthemes = [] } = await supabase
    .from("subthemes")
    .select("id, theme_id, code, name, description, sort_order")
    .order("theme_id", { ascending: true })
    .order("sort_order", { ascending: true });

  return { pillars, themes, subthemes };
}
