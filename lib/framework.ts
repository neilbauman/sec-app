// /lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

export async function getFramework(): Promise<Pillar[]> {
  const supabase = createServerSupabase();

  // Get all pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order");

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError);
    return [];
  }

  // Get all themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id");

  if (themeError) {
    console.error("Error fetching themes:", themeError);
    return [];
  }

  // Get all subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id");

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError);
    return [];
  }

  // Assemble hierarchy
  return pillars.map((pillar) => ({
    ...pillar,
    themes: themes
      .filter((t) => t.pillar_id === pillar.id)
      .map((theme) => ({
        ...theme,
        subthemes: subthemes.filter((st) => st.theme_id === theme.id),
      })),
  }));
}
