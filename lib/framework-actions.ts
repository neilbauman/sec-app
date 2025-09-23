// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/framework-utils";

/**
 * Recalculate sort_order for an array of items
 */
function resequence<T extends { sort_order: number }>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, sort_order: i + 1 }));
}

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert([{ name: "Untitled Pillar", description: "", sort_order: pillars.length + 1 }])
    .select()
    .single();

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
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert([{ name: "Untitled Theme", description: "", sort_order: pillar.themes.length + 1, pillar_id: pillarId }])
    .select()
    .single();

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

  const updated = pillars.map((p) =>
    p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
  );

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const theme = pillars.find((p) => p.id === pillarId)?.themes.find((t) => t.id === themeId);
  if (!theme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert([{ name: "Untitled Subtheme", description: "", sort_order: theme.subthemes.length + 1, theme_id: themeId }])
    .select()
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: themeId,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
  };

  const updated = pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: [...t.subthemes, newSub] } : t
          ),
        }
      : p
  );

  return recalcRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("pillars").delete().eq("id", pillarId);
  const remaining = pillars.filter((p) => p.id !== pillarId);
  return recalcRefCodes(resequence(remaining));
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("themes").delete().eq("id", themeId);

  const updated = pillars.map((p) =>
    p.id === pillarId
      ? { ...p, themes: resequence(p.themes.filter((t) => t.id !== themeId)) }
      : p
  );

  return recalcRefCodes(updated);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("subthemes").delete().eq("id", subId);

  const updated = pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId
              ? { ...t, subthemes: resequence(t.subthemes.filter((s) => s.id !== subId)) }
              : t
          ),
        }
      : p
  );

  return recalcRefCodes(updated);
}

// ---------- Move ----------
export function movePillar(
  pillars: NestedPillar[],
  pillarId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const idx = pillars.findIndex((p) => p.id === pillarId);
  if (idx === -1) return pillars;

  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= pillars.length) return pillars;

  const newPillars = [...pillars];
  [newPillars[idx], newPillars[swapIdx]] = [newPillars[swapIdx], newPillars[idx]];

  return recalcRefCodes(resequence(newPillars));
}

export function moveTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  direction: "up" | "down"
): NestedPillar[] {
  return pillars.map((p) => {
    if (p.id !== pillarId) return p;
    const idx = p.themes.findIndex((t) => t.id === themeId);
    if (idx === -1) return p;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= p.themes.length) return p;

    const themes = [...p.themes];
    [themes[idx], themes[swapIdx]] = [themes[swapIdx], themes[idx]];

    return { ...p, themes: recalcRefCodes(resequence(themes)) };
  });
}

export function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  return pillars.map((p) => {
    if (p.id !== pillarId) return p;
    return {
      ...p,
      themes: p.themes.map((t) => {
        if (t.id !== themeId) return t;
        const idx = t.subthemes.findIndex((s) => s.id === subId);
        if (idx === -1) return t;

        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= t.subthemes.length) return t;

        const subthemes = [...t.subthemes];
        [subthemes[idx], subthemes[swapIdx]] = [subthemes[swapIdx], subthemes[idx]];

        return { ...t, subthemes: recalcRefCodes(resequence(subthemes)) };
      }),
    };
  });
}
