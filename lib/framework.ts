// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Fetch all framework data (pillars → themes → subthemes)
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // Pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order");

  if (pillarError) throw pillarError;

  // Themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id");

  if (themeError) throw themeError;

  // Subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id");

  if (subthemeError) throw subthemeError;

  // Map themes to pillars
  const themesByPillar: Record<string, Theme[]> = {};
  themes?.forEach((theme) => {
    if (!themesByPillar[theme.pillar_id]) themesByPillar[theme.pillar_id] = [];
    themesByPillar[theme.pillar_id].push({ ...theme, subthemes: [] });
  });

  // Map subthemes to themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  subthemes?.forEach((sub) => {
    if (!subthemesByTheme[sub.theme_id]) subthemesByTheme[sub.theme_id] = [];
    subthemesByTheme[sub.theme_id].push(sub);
  });

  // Nest them
  return pillars?.map((pillar) => {
    const pillarThemes = themesByPillar[pillar.id] || [];
    pillarThemes.forEach((theme) => {
      theme.subthemes = subthemesByTheme[theme.id] || [];
    });
    return { ...pillar, themes: pillarThemes };
  }) ?? [];
}
