// lib/framework-client.ts
import { createClient } from "@/lib/supabase-browser";

// -----------------------------
// Types
// -----------------------------

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

// -----------------------------
// Client
// -----------------------------

// ✅ No <Database> generic here
const supabase = createClient();

// -----------------------------
// Fetch Framework
// -----------------------------
export async function fetchFramework(): Promise<Pillar[]> {
  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) {
    console.error("Error fetching pillars:", pillarError);
    return [];
  }

  if (!pillars) return [];

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) {
    console.error("Error fetching themes:", themeError);
    return [];
  }

  // Fetch subthemes
  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) {
    console.error("Error fetching subthemes:", subthemeError);
    return [];
  }

  // Nest data
  const themesByPillar: Record<string, Theme[]> = {};
  const subthemesByTheme: Record<string, Subtheme[]> = {};

  for (const sub of subthemes ?? []) {
    if (!subthemesByTheme[sub.theme_id]) subthemesByTheme[sub.theme_id] = [];
    subthemesByTheme[sub.theme_id].push(sub as Subtheme);
  }

  for (const theme of themes ?? []) {
    themesByPillar[theme.pillar_id] ||= [];
    themesByPillar[theme.pillar_id].push({
      ...theme,
      subthemes: subthemesByTheme[theme.id] || [],
    });
  }

  return (pillars ?? []).map((pillar) => ({
    ...pillar,
    themes: themesByPillar[pillar.id] || [],
  }));
}
