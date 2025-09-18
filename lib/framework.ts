// /lib/framework.ts
import { createServerClient } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Fetch all framework data (pillars → themes → subthemes)
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createServerClient();

  // 1. Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order");

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError);
    return [];
  }

  // 2. Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order");

  if (themeError) {
    console.error("Error fetching themes:", themeError);
    return [];
  }

  // 3. Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order");

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError);
    return [];
  }

  // 4. Nest themes under pillars
  const themesByPillar: Record<string, Theme[]> = {};
  for (const theme of themes ?? []) {
    if (!themesByPillar[theme.pillar_id]) {
      themesByPillar[theme.pillar_id] = [];
    }
    themesByPillar[theme.pillar_id].push({ ...theme, subthemes: [] });
  }

  // 5. Nest subthemes under themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  for (const st of subthemes ?? []) {
    if (!subthemesByTheme[st.theme_id]) {
      subthemesByTheme[st.theme_id] = [];
    }
    subthemesByTheme[st.theme_id].push(st);
  }

  // 6. Assemble final nested structure
  const framework = (pillars ?? []).map((pillar) => {
    const pillarThemes = (themesByPillar[pillar.id] ?? []).map((theme) => ({
      ...theme,
      subthemes: subthemesByTheme[theme.id] ?? [],
    }));

    return {
      ...pillar,
      themes: pillarThemes,
    };
  });

  return framework;
}
