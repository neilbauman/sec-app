// lib/framework-client.ts
import { createClient } from "@/lib/supabase-browser";
import { Database } from "@/types/supabase";

// Create client once, synchronously
const supabase = createClient<Database>();

export type Pillar = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  themes: Theme[];
};

export type Theme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
  subthemes: Subtheme[];
};

export type Subtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// Fetch full framework hierarchy
export async function fetchFramework(): Promise<Pillar[]> {
  // ✅ supabase is already a client, no "await"
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("id, pillar_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("id, theme_id, name, description, sort_order")
    .order("sort_order", { ascending: true });

  if (subthemeError) throw subthemeError;

  // Assemble hierarchy
  const themesByPillar: Record<string, Theme[]> = {};
  const subthemesByTheme: Record<string, Subtheme[]> = {};

  subthemes?.forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push({ ...s });
  });

  themes?.forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({
      ...t,
      subthemes: subthemesByTheme[t.id] || [],
    });
  });

  return (
    pillars?.map((p) => ({
      ...p,
      themes: themesByPillar[p.id] || [],
    })) || []
  );
}
