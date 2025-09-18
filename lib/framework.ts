// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

/**
 * Fetch the full framework hierarchy:
 * Pillars → Themes → Subthemes
 */
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // 1. Get all pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order");

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError);
    return [];
  }

  // 2. Get all themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order");

  if (themeError) {
    console.error("Error fetching themes:", themeError);
    return [];
  }

  // 3. Get all subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order");

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError);
    return [];
  }

  // 4. Organize subthemes by theme_id
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  for (const st of subthemes || []) {
    if (!subthemesByTheme[st.theme_id]) {
      subthemesByTheme[st.theme_id] = [];
    }
    subthemesByTheme[st.theme_id].push(st);
  }

  // 5. Organize themes by pillar_id and attach subthemes
  const themesByPillar: Record<string, Theme[]> = {};
  for (const t of themes || []) {
    const themeWithSubs: Theme = {
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    };
    if (!themesByPillar[t.pillar_id]) {
      themesByPillar[t.pillar_id] = [];
    }
    themesByPillar[t.pillar_id].push(themeWithSubs);
  }

  // 6. Attach themes to their pillars
  const framework: Pillar[] = (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));

  return framework;
}
