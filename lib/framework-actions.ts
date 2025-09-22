// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert({
      name: "Untitled Pillar",
      description: "",
      sort_order: pillars.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    ref_code: "", // placeholder, recalculated below
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
  };

  return recalcRefCodes([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert({
      pillar_id: pillarId,
      name: "Untitled Theme",
      description: "",
      sort_order: pillar.themes.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
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
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;
  const theme = pillar.themes.find((t) => t.id === themeId);
  if (!theme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert({
      theme_id: themeId,
      name: "Untitled Subtheme",
      description: "",
      sort_order: theme.subthemes.length + 1,
    })
    .select()
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
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
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("pillars").delete().eq("id", pillarId);
  const updated = pillars.filter((p) => p.id !== pillarId);
  return recalcRefCodes(updated);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  await supabase.from("themes").delete().eq("id", themeId);
  const updated = pillars.map((p) =>
    p.id === pillarId ? { ...p, themes: p.themes.filter((t) => t.id !== themeId) } : p
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
            t.id === themeId ? { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) } : t
          ),
        }
      : p
  );
  return recalcRefCodes(updated);
}

// ---------- Update ----------
export async function updateRow<T extends NestedPillar | NestedTheme | NestedSubtheme>(
  pillars: NestedPillar[],
  updatedRow: T
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  let table: string = "";
  let idField: string = "id";

  if ("themes" in updatedRow) {
    table = "pillars";
  } else if ("subthemes" in updatedRow) {
    table = "themes";
  } else {
    table = "subthemes";
  }

  const { error } = await supabase.from(table).update({
    name: updatedRow.name,
    description: updatedRow.description,
    sort_order: updatedRow.sort_order,
  }).eq(idField, updatedRow.id);

  if (error) throw error;

  // Replace node in local state
  function replaceNode(list: NestedPillar[]): NestedPillar[] {
    return list.map((p) => {
      if (p.id === updatedRow.id && "themes" in updatedRow) {
        return { ...(updatedRow as NestedPillar) };
      }
      return {
        ...p,
        themes: p.themes.map((t) => {
          if (t.id === updatedRow.id && "subthemes" in updatedRow) {
            return { ...(updatedRow as NestedTheme) };
          }
          return {
            ...t,
            subthemes: t.subthemes.map((s) =>
              s.id === updatedRow.id ? { ...(updatedRow as NestedSubtheme) } : s
            ),
          };
        }),
      };
    });
  }

  return recalcRefCodes(replaceNode(pillars));
}
