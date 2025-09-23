// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("pillars").insert([{ name: "New Pillar" }]).select().single();
  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
    themes: [],
  };
  return recalcRefCodes([...pillars, newPillar]);
}

export async function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("themes").insert([{ name: "New Theme", pillar_id: pillarId }]).select().single();
  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    pillar_id: pillarId,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
    subthemes: [],
  };
  const next = cloneFramework(pillars).map((p) =>
    p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
  );
  return recalcRefCodes(next);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("subthemes").insert([{ name: "New Subtheme", theme_id: themeId }]).select().single();
  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: themeId,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
  };
  const next = cloneFramework(pillars).map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: [...t.subthemes, newSub] } : t
          ),
        }
      : p
  );
  return recalcRefCodes(next);
}

// ---------- Remove ----------
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("pillars").delete().eq("id", pillarId);
  const next = pillars.filter((p) => p.id !== pillarId);
  return recalcRefCodes(next);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("themes").delete().eq("id", themeId);
  const next = cloneFramework(pillars).map((p) =>
    p.id === pillarId ? { ...p, themes: p.themes.filter((t) => t.id !== themeId) } : p
  );
  return recalcRefCodes(next);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("subthemes").delete().eq("id", subId);
  const next = cloneFramework(pillars).map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) } : t
          ),
        }
      : p
  );
  return recalcRefCodes(next);
}
