// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
} from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
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
  const client = getSupabaseClient();
  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const { data, error } = await client
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
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    ref_code: "",
    pillar_id: pillarId,
    subthemes: [],
  };

  const updated = cloneFramework(pillars).map((p) =>
    p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
  );

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  let parentTheme: NestedTheme | null = null;
  for (const p of pillars) {
    const found = p.themes.find((t) => t.id === themeId);
    if (found) {
      parentTheme = found;
      break;
    }
  }
  if (!parentTheme) return pillars;

  const { data, error } = await client
    .from("subthemes")
    .insert([
      {
        theme_id: themeId,
        name: "New Subtheme",
        description: "",
        sort_order: parentTheme.subthemes.length + 1,
      },
    ])
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

  const updated = cloneFramework(pillars).map((p) => ({
    ...p,
    themes: p.themes.map((t) =>
      t.id === themeId ? { ...t, subthemes: [...t.subthemes, newSub] } : t
    ),
  }));

  return recalcRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("pillars").delete().eq("id", pillarId);

  const updated = pillars.filter((p) => p.id !== pillarId);
  return recalcRefCodes(updated);
}

export async function removeTheme(
  pillars: NestedPillar[],
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("themes").delete().eq("id", themeId);

  const updated = pillars.map((p) => ({
    ...p,
    themes: p.themes.filter((t) => t.id !== themeId),
  }));
  return recalcRefCodes(updated);
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  subId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("subthemes").delete().eq("id", subId);

  const updated = pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) => ({
      ...t,
      subthemes: t.subthemes.filter((s) => s.id !== subId),
    })),
  }));
  return recalcRefCodes(updated);
}

// ---------- Update ----------
export async function updateRow(
  pillars: NestedPillar[],
  updatedRow: Partial<NestedPillar | NestedTheme | NestedSubtheme> & { id: string }
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();

  if ("pillar_id" in updatedRow && "subthemes" in (updatedRow as NestedTheme)) {
    // Theme
    await client.from("themes").update(updatedRow).eq("id", updatedRow.id);
  } else if ("theme_id" in updatedRow) {
    // Subtheme
    await client.from("subthemes").update(updatedRow).eq("id", updatedRow.id);
  } else {
    // Pillar
    await client.from("pillars").update(updatedRow).eq("id", updatedRow.id);
  }

  const updated = cloneFramework(pillars).map((p) => {
    if (p.id === updatedRow.id) return { ...p, ...updatedRow };
    return {
      ...p,
      themes: p.themes.map((t) => {
        if (t.id === updatedRow.id) return { ...t, ...updatedRow };
        return {
          ...t,
          subthemes: t.subthemes.map((s) =>
            s.id === updatedRow.id ? { ...s, ...updatedRow } : s
          ),
        };
      }),
    };
  });

  return recalcRefCodes(updated);
}
