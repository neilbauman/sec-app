// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes, normalizeSortOrders } from "@/lib/framework-utils";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert([{ name: "Untitled Pillar", description: "", sort_order: pillars.length + 1 }])
    .select("*")
    .single();

  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
    // ref_code is computed
  };

  return recalcRefCodes([...pillars, newPillar]);
}

export async function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const parent = pillars.find((p) => p.id === pillarId);
  if (!parent) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert([{ name: "Untitled Theme", description: "", sort_order: parent.themes.length + 1, pillar_id: pillarId }])
    .select("*")
    .single();

  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    pillar_id: data.pillar_id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    subthemes: [],
  };

  const updated = cloneFramework(pillars);
  const pIdx = updated.findIndex((p) => p.id === pillarId);
  if (pIdx >= 0) {
    updated[pIdx].themes.push(newTheme);
  }

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Find parent theme
  const parentTheme = pillars.flatMap((p) => p.themes).find((t) => t.id === themeId);
  if (!parentTheme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert([{ name: "Untitled Subtheme", description: "", sort_order: parentTheme.subthemes.length + 1, theme_id: themeId }])
    .select("*")
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: data.theme_id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  const updated = cloneFramework(pillars);
  for (const pillar of updated) {
    const theme = pillar.themes.find((t) => t.id === themeId);
    if (theme) {
      theme.subthemes.push(newSub);
      break;
    }
  }

  return recalcRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  const trimmed = cloneFramework(pillars).filter((p) => p.id !== pillarId);
  const normalized = normalizeSortOrders(trimmed);
  return recalcRefCodes(normalized);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  const updated = cloneFramework(pillars);
  const pillar = updated.find((p) => p.id === pillarId);
  if (pillar) {
    pillar.themes = pillar.themes.filter((t) => t.id !== themeId);
  }
  const normalized = normalizeSortOrders(updated);
  return recalcRefCodes(normalized);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", subId);
  if (error) throw error;

  const updated = cloneFramework(pillars);
  for (const pillar of updated) {
    if (pillar.id === pillarId) {
      const theme = pillar.themes.find((t) => t.id === themeId);
      if (theme) {
        theme.subthemes = theme.subthemes.filter((s) => s.id !== subId);
      }
      break;
    }
  }
  const normalized = normalizeSortOrders(updated);
  return recalcRefCodes(normalized);
}

// ---------- Update (inline edits) ----------
export async function updateRow(
  pillars: NestedPillar[],
  updatedRow: NestedPillar | NestedTheme | NestedSubtheme
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  // Identify the table by shape
  const isPillar = "themes" in updatedRow;
  const isTheme = !isPillar && "subthemes" in updatedRow;
  const table = isPillar ? "pillars" : isTheme ? "themes" : "subthemes";

  const { error } = await supabase
    .from(table)
    .update({
      name: (updatedRow as any).name,
      description: (updatedRow as any).description,
      sort_order: (updatedRow as any).sort_order,
    })
    .eq("id", (updatedRow as any).id);

  if (error) throw error;

  // Update local copy
  const updated = cloneFramework(pillars);

  if (isPillar) {
    const idx = updated.findIndex((p) => p.id === (updatedRow as NestedPillar).id);
    if (idx >= 0) updated[idx] = updatedRow as NestedPillar;
  } else if (isTheme) {
    for (const pillar of updated) {
      const idx = pillar.themes.findIndex((t) => t.id === (updatedRow as NestedTheme).id);
      if (idx >= 0) {
        pillar.themes[idx] = updatedRow as NestedTheme;
        break;
      }
    }
  } else {
    for (const pillar of updated) {
      for (const theme of pillar.themes) {
        const idx = theme.subthemes.findIndex((s) => s.id === (updatedRow as NestedSubtheme).id);
        if (idx >= 0) {
          theme.subthemes[idx] = updatedRow as NestedSubtheme;
          break;
        }
      }
    }
  }

  return recalcRefCodes(updated);
}
