// lib/framework-actions.ts
import { v4 as uuidv4 } from "uuid";
import { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------
export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push({
    id: uuidv4(),
    name: "Untitled Pillar",
    description: "",
    themes: [],
    sort_order: copy.length,
    ref_code: "",
  });
  return recalcRefCodes(copy);
}

export function addTheme(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) {
    pillar.themes.push({
      id: uuidv4(),
      name: "Untitled Theme",
      description: "",
      subthemes: [],
      sort_order: pillar.themes.length,
      ref_code: "",
    });
  }
  return recalcRefCodes(copy);
}

export function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) {
    theme.subthemes.push({
      id: uuidv4(),
      name: "Untitled Subtheme",
      description: "",
      sort_order: theme.subthemes.length,
      ref_code: "",
    });
  }
  return recalcRefCodes(copy);
}

// ---------- Remove ----------
export function removePillar(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars).filter(p => p.id !== pillarId);
  return recalcRefCodes(copy);
}

export function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) {
    pillar.themes = pillar.themes.filter(t => t.id !== themeId);
  }
  return recalcRefCodes(copy);
}

export function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) {
    theme.subthemes = theme.subthemes.filter(s => s.id !== subId);
  }
  return recalcRefCodes(copy);
}

// ---------- Move ----------
function moveItem<T extends { sort_order: number }>(arr: T[], id: string, delta: number) {
  const index = arr.findIndex(x => (x as any).id === id);
  if (index === -1) return;
  const newIndex = index + delta;
  if (newIndex < 0 || newIndex >= arr.length) return;
  const [item] = arr.splice(index, 1);
  arr.splice(newIndex, 0, item);
  arr.forEach((it, idx) => (it.sort_order = idx));
}

export function movePillar(pillars: NestedPillar[], pillarId: string, delta: number): NestedPillar[] {
  const copy = cloneFramework(pillars);
  moveItem(copy, pillarId, delta);
  return recalcRefCodes(copy);
}

export function moveTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  delta: number
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) {
    moveItem(pillar.themes, themeId, delta);
  }
  return recalcRefCodes(copy);
}

export function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string,
  delta: number
): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) {
    moveItem(theme.subthemes, subId, delta);
  }
  return recalcRefCodes(copy);
}

// ---------- Save ----------
export async function saveFramework(pillars: NestedPillar[]): Promise<void> {
  // TODO: implement Supabase upsert call here
  console.log("Saving framework", pillars);
}
