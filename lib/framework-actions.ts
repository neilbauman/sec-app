// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Local-only mutations (draft) ----------

// Add
export function addPillarLocal(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push({
    id: uuidv4(),
    ref_code: "",
    name: "New Pillar",
    description: "",
    sort_order: copy.length + 1,
    themes: [],
  });
  return recalcRefCodes(copy);
}

export function addThemeLocal(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes.push({
      id: uuidv4(),
      pillar_id: pillar.id,
      ref_code: "",
      name: "New Theme",
      description: "",
      sort_order: pillar.themes.length + 1,
      subthemes: [],
    });
  }
  return recalcRefCodes(copy);
}

export function addSubthemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes.push({
      id: uuidv4(),
      theme_id: theme.id,
      ref_code: "",
      name: "New Subtheme",
      description: "",
      sort_order: theme.subthemes.length + 1,
    });
  }
  return recalcRefCodes(copy);
}

// Remove
export function removePillarLocal(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  let copy = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  return recalcRefCodes(copy);
}

export function removeThemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  }
  return recalcRefCodes(copy);
}

export function removeSubthemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string, subthemeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  const theme = pillar?.themes.find((t) => t.id === themeId);
  if (theme) {
    theme.subthemes = theme.subthemes.filter((s) => s.id !== subthemeId);
  }
  return recalcRefCodes(copy);
}

// Move
function moveItem<T extends { sort_order: number }>(items: T[], idx: number, direction: "up" | "down") {
  if (idx < 0) return;
  const newIdx = direction === "up" ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= items.length) return;
  const temp = items[idx];
  items[idx] = items[newIdx];
  items[newIdx] = temp;
  items.forEach((item, i) => (item.sort_order = i + 1));
}

export function movePillarLocal(pillars: NestedPillar[], pillarId: string, direction: "up" | "down"): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const idx = copy.findIndex((p) => p.id === pillarId);
  moveItem(copy, idx, direction);
  return recalcRefCodes(copy);
}

export function moveThemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string, direction: "up" | "down"): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find((p) => p.id === pillarId);
  if (pillar) {
    const idx = pillar.themes.findIndex((t) => t.id === themeId);
    moveItem(pillar.themes, idx, direction);
  }
  return recalcRefCodes(copy);
}

export function moveSubthemeLocal(pillars: NestedPillar[], pillarId: string, themeId: string, subthemeId: string, direction: "up" | "down"): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const theme = copy.find((p) => p.id === pillarId)?.themes.find((t) => t.id === themeId);
  if (theme) {
    const idx = theme.subthemes.findIndex((s) => s.id === subthemeId);
    moveItem(theme.subthemes, idx, direction);
  }
  return recalcRefCodes(copy);
}

// ---------- Persist (save) ----------

export async function saveFramework(pillars: NestedPillar[]): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from("framework").upsert({ data: pillars });
  if (error) throw error;
}
