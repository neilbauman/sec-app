// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Fetch all framework data (pillars → themes → subthemes)
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw new Error(`Error fetching pillars: ${pillarError.message}`);

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  if (themeError) throw new Error(`Error fetching themes: ${themeError.message}`);

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw new Error(`Error fetching subthemes: ${subthemeError.message}`);

  // Index themes by pillar_id
  const themesByPillar: Record<string, Theme[]> = {};
  for (const theme of themes || []) {
    if (!themesByPillar[theme.pillar_id]) themesByPillar[theme.pillar_id] = [];
    themesByPillar[theme.pillar_id].push({
      id: theme.id,
      name: theme.name,
      description: theme.description,
      sort_order: theme.sort_order,
      subthemes: [],
    });
  }

  // Index subthemes by theme_id
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  for (const sub of subthemes || []) {
    if (!subthemesByTheme[sub.theme_id]) subthemesByTheme[sub.theme_id] = [];
    subthemesByTheme[sub.theme_id].push({
      id: sub.id,
      name: sub.name,
      description: sub.description,
      sort_order: sub.sort_order,
    });
  }

  // Assemble hierarchy
  for (const pillar of pillars || []) {
    const pillarThemes = themesByPillar[pillar.id] || [];
    for (const theme of pillarThemes) {
      theme.subthemes = subthemesByTheme[theme.id] || [];
    }
    (pillar as Pillar).themes = pillarThemes;
  }

  return pillars || [];
}
