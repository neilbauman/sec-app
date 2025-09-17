// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes?: Subtheme[];
};

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

/**
 * Get the entire framework: pillars, themes, and subthemes.
 * Read-only for now.
 */
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError.message);
    return [];
  }

  if (!pillars || pillars.length === 0) {
    return [];
  }

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) {
    console.error("Error fetching themes:", themeError.message);
    return pillars;
  }

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError.message);
    return pillars;
  }

  // Nest themes into pillars
  const themesByPillar: Record<string, Theme[]> = {};
  for (const theme of themes ?? []) {
    if (!themesByPillar[theme.pillar_id]) {
      themesByPillar[theme.pillar_id] = [];
    }
    themesByPillar[theme.pillar_id].push({ ...theme, subthemes: [] });
  }

  // Nest subthemes into themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  for (const subtheme of subthemes ?? []) {
    if (!subthemesByTheme[subtheme.theme_id]) {
      subthemesByTheme[subtheme.theme_id] = [];
    }
    subthemesByTheme[subtheme.theme_id].push(subtheme);
  }

  for (const pillar of pillars) {
    pillar.themes = themesByPillar[pillar.id] ?? [];
    for (const theme of pillar.themes) {
      theme.subthemes = subthemesByTheme[theme.id] ?? [];
    }
  }

  return pillars;
}
