// /lib/framework.ts
import { createClient } from "@/lib/supabase-server";
import type { Pillar, Theme, Subtheme } from "@/types/framework";

// Fetch all framework data (pillars → themes → subthemes)
export async function getFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  // 1. Get pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError.message);
    return [];
  }

  // 2. Get themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, name, description, sort_order, pillar_id")
    .order("sort_order", { ascending: true });

  if (themeError) {
    console.error("Error fetching themes:", themeError.message);
    return [];
  }

  // 3. Get subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, name, description, sort_order, theme_id")
    .order("sort_order", { ascending: true });

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError.message);
    return [];
  }

  // Group subthemes by theme_id
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) {
      subthemesByTheme[s.theme_id] = [];
    }
    subthemesByTheme[s.theme_id].push({
      id: s.id,
      name: s.name,
      description: s.description,
      sort_order: s.sort_order,
    });
  });

  // Group themes by pillar_id (and attach subthemes)
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) {
      themesByPillar[t.pillar_id] = [];
    }
    themesByPillar[t.pillar_id].push({
      id: t.id,
      name: t.name,
      description: t.description,
      sort_order: t.sort_order,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  // Attach themes to pillars
  const framework: Pillar[] = (pillars || []).map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    sort_order: p.sort_order,
    themes: themesByPillar[p.id] || [],
  }));

  return framework;
}
