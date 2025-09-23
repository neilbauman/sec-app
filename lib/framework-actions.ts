// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { generateRefCodes } from "@/lib/framework-utils";

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
    themes: [],
  };

  return generateRefCodes([...pillars, newPillar]);
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
    .insert([
      {
        pillar_id: pillarId,
        name: "New Theme",
        description: "",
        sort_order: pillar.themes.length + 1,
      },
    ])
    .select()
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

  const updated = pillars.map((p) =>
    p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
  );

  return generateRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  let targetPillar: NestedPillar | undefined;
  let targetTheme: NestedTheme | undefined;

  for (const p of pillars) {
    const t = p.themes.find((t) => t.id === themeId);
    if (t) {
      targetPillar = p;
      targetTheme = t;
      break;
    }
  }
  if (!targetPillar || !targetTheme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert([
      {
        theme_id: themeId,
        name: "New Subtheme",
        description: "",
        sort_order: targetTheme.subthemes.length + 1,
      },
    ])
    .select()
    .single();
  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    theme_id: data.theme_id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
  };

  const updated = pillars.map((p) =>
    p.id === targetPillar!.id
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId ? { ...t, subthemes: [...t.subthemes, newSub] } : t
          ),
        }
      : p
  );

  return generateRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  const updated = pillars.filter((p) => p.id !== pillarId);
  return generateRefCodes(updated);
}

export async function removeTheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  const updated = pillars.map((p) => ({
    ...p,
    themes: p.themes.filter((t) => t.id !== themeId),
  }));

  return generateRefCodes(updated);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  subthemeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", subthemeId);
  if (error) throw error;

  const updated = pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) => ({
      ...t,
      subthemes: t.subthemes.filter((s) => s.id !== subthemeId),
    })),
  }));

  return generateRefCodes(updated);
}

// ---------- Update ----------
export async function updateRow(
  pillars: NestedPillar[],
  updatedRow: NestedPillar | NestedTheme | NestedSubtheme
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  if ("themes" in updatedRow) {
    // Pillar
    const { error } = await supabase
      .from("pillars")
      .update({
        name: updatedRow.name,
        description: updatedRow.description,
        sort_order: updatedRow.sort_order,
      })
      .eq("id", updatedRow.id);
    if (error) throw error;

    const updated = pillars.map((p) =>
      p.id === updatedRow.id ? { ...p, ...updatedRow } : p
    );
    return generateRefCodes(updated);
  } else if ("subthemes" in updatedRow) {
    // Theme
    const { error } = await supabase
      .from("themes")
      .update({
        name: updatedRow.name,
        description: updatedRow.description,
        sort_order: updatedRow.sort_order,
      })
      .eq("id", updatedRow.id);
    if (error) throw error;

    const updated = pillars.map((p) => ({
      ...p,
      themes: p.themes.map((t) =>
        t.id === updatedRow.id ? { ...t, ...updatedRow } : t
      ),
    }));
    return generateRefCodes(updated);
  } else {
    // Subtheme
    const { error } = await supabase
      .from("subthemes")
      .update({
        name: updatedRow.name,
        description: updatedRow.description,
        sort_order: updatedRow.sort_order,
      })
      .eq("id", updatedRow.id);
    if (error) throw error;

    const updated = pillars.map((p) => ({
      ...p,
      themes: p.themes.map((t) => ({
        ...t,
        subthemes: t.subthemes.map((s) =>
          s.id === updatedRow.id ? { ...s, ...updatedRow } : s
        ),
      })),
    }));
    return generateRefCodes(updated);
  }
}

// ---------- Move ----------
export function movePillar(
  pillars: NestedPillar[],
  pillarId: string,
  direction: "up" | "down"
): NestedPillar[] {
  const idx = pillars.findIndex((p) => p.id === pillarId);
  if (idx === -1) return pillars;

  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= pillars.length) return pillars;

  const swapped = [...pillars];
  [swapped[idx], swapped[targetIdx]] = [swapped[targetIdx], swapped[idx]];

  return generateRefCodes(swapped);
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

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= p.themes.length) return p;

    const swapped = [...p.themes];
    [swapped[idx], swapped[targetIdx]] = [swapped[targetIdx], swapped[idx]];

    return { ...p, themes: swapped };
  });
}

export function moveSubtheme(
  pillars: NestedPillar[],
  themeId: string,
  subId: string,
  direction: "up" | "down"
): NestedPillar[] {
  return pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) => {
      if (t.id !== themeId) return t;
      const idx = t.subthemes.findIndex((s) => s.id === subId);
      if (idx === -1) return t;

      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= t.subthemes.length) return t;

      const swapped = [...t.subthemes];
      [swapped[idx], swapped[targetIdx]] = [swapped[targetIdx], swapped[idx]];

      return { ...t, subthemes: swapped };
    }),
  }));
}
