// lib/framework-actions.ts
import { v4 as uuidv4 } from "uuid";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import { getSupabaseClient } from "@/lib/supabase-client";

// ---------- Save ----------

export async function saveFramework(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const withCodes = recalcRefCodes(pillars);

  // Replace with your Supabase table + schema
  const { data, error } = await supabase
    .from("framework")
    .upsert({ id: "primary", data: withCodes })
    .select()
    .single();

  if (error) throw error;
  return data.data as NestedPillar[];
}

// ---------- Add ----------

export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push({
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    sort_order: copy.length + 1,
    ref_code: "",
    themes: [],
  });
  return recalcRefCodes(copy);
}

export function addTheme(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;

  pillar.themes.push({
    id: uuidv4(),
    pillar_id: pillar.id,
    name: "Untitled Theme",
    description: "",
    sort_order: pillar.themes.length + 1,
    ref_code: "",
    subthemes: [],
  });
  return recalcRefCodes(copy);
}

export function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;
  const theme = pillar.themes.find((t) => t.id === themeId);
  if (!theme) return copy;

  theme.subthemes.push({
    id: uuidv4(),
    theme_id: theme.id,
    name: "Untitled Subtheme",
    description: "",
    sort_order: theme.subthemes.length + 1,
    ref_code: "",
  });
  return recalcRefCodes(copy);
}

// ---------- Remove ----------

export function removePillar(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  return recalcRefCodes(copy);
}

export function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;
  pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  return recalcRefCodes(copy);
}

export function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;
  const theme = pillar.themes.find((t) => t.id === themeId);
  if (!theme) return copy;

  theme.subthemes = theme.subthemes.filter((s) => s.id !== subId);
  return recalcRefCodes(copy);
}

// ---------- Move ----------

export function movePillar(
  pillars: NestedPillar[],
  pillarId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const idx = copy.findIndex((p) => p.id === pillarId);
  if (idx === -1) return copy;

  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= copy.length) return copy;

  [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
  return recalcRefCodes(copy);
}

export function moveTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;

  const idx = pillar.themes.findIndex((t) => t.id === themeId);
  if (idx === -1) return copy;

  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= pillar.themes.length) return copy;

  [pillar.themes[idx], pillar.themes[swap]] = [pillar.themes[swap], pillar.themes[idx]];
  return recalcRefCodes(copy);
}

export function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (!pillar) return copy;
  const theme = pillar.themes.find((t) => t.id === themeId);
  if (!theme) return copy;

  const idx = theme.subthemes.findIndex((s) => s.id === subId);
  if (idx === -1) return copy;

  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= theme.subthemes.length) return copy;

  [theme.subthemes[idx], theme.subthemes[swap]] = [theme.subthemes[swap], theme.subthemes[idx]];
  return recalcRefCodes(copy);
}
