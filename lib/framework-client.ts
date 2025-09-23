// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/framework-utils";

export type NestedSubtheme = {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type NestedTheme = {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes: NestedSubtheme[];
};

export type NestedPillar = {
  id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes: NestedTheme[];
};

/**
 * Fetch the full framework from Supabase and normalize with recalcRefCodes.
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Fetch all pillars
  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });
  if (pillarError) throw pillarError;

  // Fetch all themes
  const { data: themes, error: themeError } = await supabase
    .from("themes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (themeError) throw themeError;

  // Fetch all subthemes
  const { data: subs, error: subError } = await supabase
    .from("subthemes")
    .select("*")
    .order("sort_order", { ascending: true });
  if (subError) throw subError;

  // Build hierarchy
  const nested: NestedPillar[] = (pillars || []).map((p) => ({
    ...p,
    themes: (themes || [])
      .filter((t) => t.pillar_id === p.id)
      .map((t) => ({
        ...t,
        subthemes: (subs || []).filter((s) => s.theme_id === t.id),
      })),
  }));

  // Recalculate ref codes
  return recalcRefCodes(nested);
}
