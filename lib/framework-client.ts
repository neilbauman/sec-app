// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/refCodes";

// ---------- Types ----------
export type NestedSubtheme = {
  id: string;
  theme_id: string;
  ref_code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type NestedTheme = {
  id: string;
  theme_id: string; // FK to pillar
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

// ---------- Fetch Framework ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      name,
      description,
      sort_order,
      themes (
        id,
        pillar_id,
        name,
        description,
        sort_order,
        subthemes (
          id,
          theme_id,
          name,
          description,
          sort_order
        )
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("fetchFramework error:", error);
    throw error;
  }

  // Ensure themes and subthemes are arrays
  const normalized: NestedPillar[] = (data || []).map((pillar: any) => ({
    ...pillar,
    ref_code: "",
    themes: (pillar.themes || []).map((theme: any) => ({
      ...theme,
      ref_code: "",
      subthemes: (theme.subthemes || []).map((sub: any) => ({
        ...sub,
        ref_code: "",
      })),
    })),
  }));

  // Recalculate P/T/ST codes + sort order
  return recalcRefCodes(normalized);
}
