// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";

// Re-export shared types so pages/components can import them from here OR from "@/types/framework"
export type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function fetchFrameworkList(): Promise<{
  pillars: import("@/types/framework").Pillar[];
  themes: import("@/types/framework").Theme[];
  subthemes: import("@/types/framework").Subtheme[];
}> {
  const supabase = await createServerSupabase();

  const { data: pillars } = await supabase
    .from("pillars")
    .select("id, code, name, description, sort_order")
    .order("sort_order", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("id, code, name, description, pillar_id, sort_order")
    .order("sort_order", { ascending: true });

  const { data: subthemes } = await supabase
    .from("subthemes")
    .select("id, code, name, description, theme_id, sort_order")
    .order("sort_order", { ascending: true });

  return {
    pillars: pillars ?? [],
    themes: themes ?? [],
    subthemes: subthemes ?? [],
  };
}
