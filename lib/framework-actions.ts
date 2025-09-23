import type { NestedPillar } from "@/lib/framework-client";
import {
  cloneFramework,
  recalcRefCodes,
  createPillar,
  createTheme,
  createSubtheme,
} from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Add ----------
export function addPillar(pillars: NestedPillar[]): NestedPillar[] {
  const copy = cloneFramework(pillars);
  copy.push(createPillar());
  return recalcRefCodes(copy);
}

export function addTheme(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) pillar.themes.push(createTheme(pillarId));
  return recalcRefCodes(copy);
}

export function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) theme.subthemes.push(createSubtheme(themeId));
  return recalcRefCodes(copy);
}

// ---------- Remove ----------
export function removePillar(pillars: NestedPillar[], pillarId: string): NestedPillar[] {
  return recalcRefCodes(cloneFramework(pillars).filter(p => p.id !== pillarId));
}

export function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) pillar.themes = pillar.themes.filter(t => t.id !== themeId);
  return recalcRefCodes(copy);
}

export function removeSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string, subId: string): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) theme.subthemes = theme.subthemes.filter(s => s.id !== subId);
  return recalcRefCodes(copy);
}

// ---------- Move ----------
function move<T>(items: T[], from: number, to: number): T[] {
  const copy = [...items];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export function movePillar(pillars: NestedPillar[], from: number, to: number): NestedPillar[] {
  return recalcRefCodes(move(cloneFramework(pillars), from, to));
}

export function moveTheme(pillars: NestedPillar[], pillarId: string, from: number, to: number): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  if (pillar) pillar.themes = move(pillar.themes, from, to);
  return recalcRefCodes(copy);
}

export function moveSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string, from: number, to: number): NestedPillar[] {
  const copy = cloneFramework(pillars);
  const pillar = copy.find(p => p.id === pillarId);
  const theme = pillar?.themes.find(t => t.id === themeId);
  if (theme) theme.subthemes = move(theme.subthemes, from, to);
  return recalcRefCodes(copy);
}

// ---------- Save (stub) ----------
export async function saveFramework(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  // Eventually: POST to Supabase
  return recalcRefCodes(cloneFramework(pillars));
}
