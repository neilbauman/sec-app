// lib/framework-client.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import { recalcRefCodes } from "@/lib/framework-utils";

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
  pillar_id: string;
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

export async function fetchFramework(): Promise<NestedPillar[]> {
  const client = getSupabaseClient();

  const { data: pillars } = await client.from("pillars").select("*, themes(*, subthemes(*))").order("sort_order");
  if (!pillars) return [];

  return recalcRefCodes(pillars as NestedPillar[]);
}
