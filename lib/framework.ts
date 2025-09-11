// /lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
export type { Pillar, Theme, Subtheme } from "@/types/framework";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  const supabase = await createServerSupabase();

  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("id, pillar_id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("id, theme_id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  };
}
