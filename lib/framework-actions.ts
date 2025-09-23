// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

/**
 * Helper to ensure sort_order is sequential starting from 1
 */
function resequence<T extends { sort_order: number }>(items: T[]): T[] {
  return items.map((item, idx) => ({
    ...item,
    sort_order: idx + 1,
  }));
}

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("pillars").insert([{ id: uuidv4(), name: "New Pillar", description: "", sort_order: pillars.length + 1 }]).select().single();
  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
  };

  return resequence([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await supabase.from("themes").insert([{ id: uuidv4(), pillar_id: pillarId, name: "New Theme", description: "", sort_order: pillar.themes.length + 1 }]).select().single();
  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    pillar_id: data.pillar_id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    subthemes: [],
  };

  return pillars.map((p) => (p.id === pillarId ? { ...p, themes: resequence([...p.themes, newTheme]) } : p));
}

export async function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;
  const theme = pillar.themes.find((t) => t.id === themeId);
  if (!theme) return pillars;

  const { data, error } = await supabase.from("subthemes").insert([{ id: uuidv4(), theme_id: themeId, name: "New Subtheme", description: "", sort_order: theme.subthemes.length + 1 }]).select().single();
  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: data.theme_id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  return pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: resequence([...t.subthemes, newSub]) } : t
          ),
        }
      : p
  );
}

// ---------- Remove ----------
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  return resequence(pillars.filter((p) => p.id !== pillarId));
}

export async function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  return pillars.map((p) =>
    p.id === pillarId ? { ...p, themes: resequence(p.themes.filter((t) => t.id !== themeId)) } : p
  );
}

export async function removeSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string, subId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", subId);
  if (error) throw error;

  return pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: resequence(t.subthemes.filter((s) => s.id !== subId)) } : t
          ),
        }
      : p
  );
}

// ---------- Update ----------
export async function updateRow(
  pillars: NestedPillar[],
  updatedRow: NestedPillar | NestedTheme | NestedSubtheme
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  let table: "pillars" | "themes" | "subthemes";

  if ("themes" in updatedRow) {
    table = "pillars";
  } else if ("subthemes" in updatedRow) {
    table = "themes";
  } else {
    table = "subthemes";
  }

  const { error } = await supabase.from(table).update(updatedRow).eq("id", updatedRow.id);
  if (error) throw error;

  return pillars.map((p) => {
    if (table === "pillars" && p.id === updatedRow.id) {
      return { ...(updatedRow as NestedPillar) };
    }
    if (table === "themes") {
      return {
        ...p,
        themes: p.themes.map((t) => (t.id === updatedRow.id ? { ...(updatedRow as NestedTheme) } : t)),
      };
    }
    if (table === "subthemes") {
      return {
        ...p,
        themes: p.themes.map((t) => ({
          ...t,
          subthemes: t.subthemes.map((s) => (s.id === updatedRow.id ? { ...(updatedRow as NestedSubtheme) } : s)),
        })),
      };
    }
    return p;
  });
}

// ---------- Move ----------
export function movePillar(pillars: NestedPillar[], pillarId: string, direction: "up" | "down"): NestedPillar[] {
  const idx = pillars.findIndex((p) => p.id === pillarId);
  if (
