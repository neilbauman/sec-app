// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: Theme[];
};

/**
 * Get the full framework hierarchy (pillars → themes → subthemes).
 */
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // --- Fetch pillars ---
  const { data: rawPillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError.message);
    return [];
  }

  // Cast into Pillar objects with empty themes arrays
  const pillars: Pillar[] =
    rawPillars?.map((p) => ({
      ...p,
      themes: [],
    })) ?? [];

  if (pillars.length === 0) return [];

  // --- Fetch themes ---
  const { data: rawThemes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) {
    console.error("Error fetching themes:", themeError.message);
    return pillars;
  }

  const themes: Theme[] =
    rawThemes?.map((t) => ({
      ...t,
      subthemes: [],
    })) ?? [];

  // --- Fetch subthemes ---
  const { data: rawSubthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError.message);
  }

  const subthemes: Subtheme[] = rawSubthemes ?? [];

  // --- Nest subthemes into themes ---
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  for (const st of subthemes) {
    if (!subthemesByTheme[st.theme_id]) subthemesByTheme[st.theme_id] = [];
    subthemesByTheme[st.theme_id].push(st);
  }

  for (const theme of themes) {
    theme.subthemes = subthemesByTheme[theme.id] ?? [];
  }

  // --- Nest themes into pillars ---
  const themesByPillar: Record<string, Theme[]> = {};
  for (const th of themes) {
    if (!themesByPillar[th.pillar_id]) themesByPillar[th.pillar_id] = [];
    themesByPillar[th.pillar_id].push(th);
  }

  for (const pillar of pillars) {
    pillar.themes = themesByPillar[pillar.id] ?? [];
  }

  return pillars;
}
