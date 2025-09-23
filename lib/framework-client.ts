// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { generateRefCodes } from "@/lib/framework-utils";

export type NestedSubtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  ref_code?: string;
};

export type NestedTheme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes: NestedSubtheme[];
  ref_code?: string;
};

export type NestedPillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: NestedTheme[];
  ref_code?: string;
};

/**
 * Fetches the full nested framework (pillars → themes → subthemes)
 * and attaches generated ref codes.
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Fetch pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (pillarError) throw pillarError;

  // Fetch themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (themeError) throw themeError;

  // Fetch subthemes
  const { data: subthemes, error: subError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (subError) throw subError;

  // Normalize into nested structure
  const nested: NestedPillar[] = (pillars || []).map((p) => ({
    ...p,
    themes: (themes || [])
      .filter((t) => t.pillar_id === p.id)
      .map((t) => ({
        ...t,
        subthemes: (subthemes || []).filter((s) => s.theme_id === t.id),
      })),
  }));

  // Generate ref codes
  return generateRefCodes(nested);
}
