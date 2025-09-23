// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/framework-utils";

export type NestedSubtheme = {
  id: string;
  theme_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  ref_code: string;
};

export type NestedTheme = {
  id: string;
  pillar_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  ref_code: string;
  subthemes: NestedSubtheme[];
};

export type NestedPillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  ref_code: string;
  themes: NestedTheme[];
};

/**
 * Fetch framework from DB and normalize with ref codes.
 */
export async function fetchFramework(): Promise<NestedPillar[]> {
  const client = getSupabaseClient();

  const { data: pillars, error: pErr } = await client.from("pillars").select("*").order("sort_order");
  if (pErr) throw pErr;

  const { data: themes, error: tErr } = await client.from("themes").select("*").order("sort_order");
  if (tErr) throw tErr;

  const { data: subs, error: sErr } = await client.from("subthemes").select("*").order("sort_order");
  if (sErr) throw sErr;

  const pillarMap: Record<string, NestedPillar> = {};
  (pillars || []).forEach((p) => {
    pillarMap[p.id] = { ...p, ref_code: "", themes: [] };
  });

  const themeMap: Record<string, NestedTheme> = {};
  (themes || []).forEach((t) => {
    themeMap[t.id] = { ...t, ref_code: "", subthemes: [] };
    pillarMap[t.pillar_id]?.themes.push(themeMap[t.id]);
  });

  (subs || []).forEach((s) => {
    themeMap[s.theme_id]?.subthemes.push({ ...s, ref_code: "" });
  });

  return recalcRefCodes(Object.values(pillarMap));
}
