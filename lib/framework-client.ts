// lib/framework-client.ts
import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

/**
 * Row types from Supabase
 */
export type Pillar = Database["public"]["Tables"]["pillars"]["Row"];
export type Theme = Database["public"]["Tables"]["themes"]["Row"];
export type Subtheme = Database["public"]["Tables"]["subthemes"]["Row"];

/**
 * Manual Insert types (since codegen lacks Insert)
 * - PillarInsert requires ref_code, name, description, sort_order
 * - ThemeInsert links to pillar_id
 * - SubthemeInsert links to theme_id
 */
export type PillarInsert = {
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type ThemeInsert = {
  pillar_id: string;
  name: string;
  description?: string;
  sort_order: number;
};

export type SubthemeInsert = {
  theme_id: string;
  name: string;
  description?: string;
  sort_order: number;
};

/**
 * Fetch hierarchical framework (pillars → themes → subthemes)
 */
export async function fetchFramework() {
  const supabase = await createClient();

  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order");

  if (pillarError) throw pillarError;

  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order");

  if (themeError) throw themeError;

  const { data: subthemes, error: subthemeError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order");

  if (subthemeError) throw subthemeError;

  // Nest themes into pillars
  const themesByPillar: Record<string, Theme[]> = {};
  (themes || []).forEach((t) => {
    if (!themesByPillar[t.pillar_id]) themesByPillar[t.pillar_id] = [];
    themesByPillar[t.pillar_id].push({ ...t, subthemes: [] } as any);
  });

  // Nest subthemes into themes
  const subthemesByTheme: Record<string, Subtheme[]> = {};
  (subthemes || []).forEach((s) => {
    if (!subthemesByTheme[s.theme_id]) subthemesByTheme[s.theme_id] = [];
    subthemesByTheme[s.theme_id].push(s);
  });

  // Attach subthemes into themes
  Object.values(themesByPillar).forEach((themeList) => {
    themeList.forEach((t: any) => {
      t.subthemes = subthemesByTheme[t.id] || [];
    });
  });

  // Attach themes into pillars
  const nestedPillars = (pillars || []).map((p) => ({
    ...p,
    themes: themesByPillar[p.id] || [],
  }));

  return nestedPillars;
}
