// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/framework-utils";

// ---------- Types ----------
export interface NestedSubtheme {
  id: string;
  theme_id: string;
  name: string;
  description?: string | null;
  sort_order: number;
  ref_code: string;
}

export interface NestedTheme {
  id: string;
  pillar_id: string;
  name: string;
  description?: string | null;
  sort_order: number;
  ref_code: string;
  subthemes: NestedSubtheme[];
}

export interface NestedPillar {
  id: string;
  name: string;
  description?: string | null;
  sort_order: number;
  ref_code: string;
  themes: NestedTheme[];
}

// ---------- Fetch ----------
export async function fetchFramework(): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const { data: pillars } = await supabase.from("pillars").select("*").order("sort_order");
  const { data: themes } = await supabase.from("themes").select("*").order("sort_order");
  const { data: subs } = await supabase.from("subthemes").select("*").order("sort_order");

  if (!pillars) return [];

  const nested: NestedPillar[] = pillars.map((p) => ({
    ...p,
    themes: (themes || [])
      .filter((t) => t.pillar_id === p.id)
      .map((t) => ({
        ...t,
        subthemes: (subs || []).filter((s) => s.theme_id === t.id),
      })),
  }));

  return recalcRefCodes(nested);
}
