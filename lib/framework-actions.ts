// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert([{ name: "New Pillar", description: "", sort_order: pillars.length + 1 }])
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
  const parent = pillars.find((p) => p.id === pillarId);
  if (!parent) return pillars;

  const { data, error } = await supabase
    .from("themes")
    .insert([{ name: "New Theme", description: "", sort_order: parent.themes.length + 1, pillar_id: pillarId }])
    .select()
    .single();

  if (error) throw error;

  const newTheme: NestedTheme = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
    pillar_id: pillarId,
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
  const parentTheme = pillars
    .find((p) => p.id === pillarId)
    ?.themes.find((t) => t.id === themeId);
  if (!parentTheme) return pillars;

  const { data, error } = await supabase
    .from("subthemes")
    .insert([{ name: "New Subtheme", description: "", sort_order: parentTheme.subthemes.length + 1, theme_id: themeId }])
    .select()
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
    theme_id: themeId,
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
    p.id === pillarId
      ? { ...p, themes: p.themes.filter((t) => t.id !== themeId) }
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
              ? { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) }
              : t
          ),
        }
      : p
  );
  return recalcRefCodes(updated);
}

// ---------- Update ----------
export async function updateRow<T extends NestedPillar | NestedTheme | NestedSubtheme>(
  pillars: NestedPillar[],
  row: T
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const table =
    "pillar_id" in row ? "themes" : "theme_id" in row ? "subthemes" : "pillars";

  const { error } = await supabase.from(table).update(row).eq("id", row.id);
  if (error) throw error;

  const updated = pillars.map((p) => {
    if (table === "pillars" && p.id === row.id) {
      return { ...(row as NestedPillar), themes: p.themes };
    }
    if (table === "themes") {
      return {
        ...p,
        themes: p.themes.map((t) =>
          t.id === row.id ? { ...(row as NestedTheme), subthemes: t.subthemes } : t
        ),
      };
    }
    if (table === "subthemes") {
      return {
        ...p,
        themes: p.themes.map((t) => ({
          ...t,
          subthemes: t.subthemes.map((s) =>
            s.id === row.id ? (row as NestedSubtheme) : s
          ),
        })),
      };
    }
    return p;
  });

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

  const newIdx = direction === "up" ? idx - 1 : idx + 1;
  if (newIdx < 0 || newIdx >= pillars.length) return pillars;

  const reordered = [...pillars];
  const [moved] = reordered.splice(idx, 1);
  reordered.splice(newIdx, 0, moved);

  return reordered.map((p, i) => ({ ...p, sort_order: i + 1 }));
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

    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= p.themes.length) return p;

    const reordered = [...p.themes];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(newIdx, 0, moved);

    return {
      ...p,
      themes: reordered.map((t, i) => ({ ...t, sort_order: i + 1 })),
    };
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

        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= t.subthemes.length) return t;

        const reordered = [...t.subthemes];
        const [moved] = reordered.splice(idx, 1);
        reordered.splice(newIdx, 0, moved);

        return {
          ...t,
          subthemes: reordered.map((s, i) => ({ ...s, sort_order: i + 1 })),
        };
      }),
    };
  });
}
