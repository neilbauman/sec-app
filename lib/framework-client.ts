"use server";

import { createClient } from "@/lib/supabase-server";

// -----------------------------
// Types
// -----------------------------
export type Subtheme = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type Theme = {
  id: string;
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
// Fetch Framework
// -----------------------------
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

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

  const result: Pillar[] = [];

  for (const pillar of pillars) {
    // Fetch themes for each pillar
    const { data: themes, error: themeError } = await supabase
      .from("themes")
      .select("id, name, description, sort_order")
      .eq("pillar_id", pillar.id)
      .order("sort_order", { ascending: true });

    if (themeError) {
      console.error("Error fetching themes:", themeError);
      continue;
    }

    const themeResults: Theme[] = [];

    for (const theme of themes || []) {
      // Fetch subthemes for each theme
      const { data: subthemes, error: subError } = await supabase
        .from("subthemes")
        .select("id, name, description, sort_order")
        .eq("theme_id", theme.id)
        .order("sort_order", { ascending: true });

      if (subError) {
        console.error("Error fetching subthemes:", subError);
        continue;
      }

      themeResults.push({
        ...theme,
        subthemes: subthemes || [],
      });
    }

    result.push({
      ...pillar,
      themes: themeResults,
    });
  }

  return result;
}
