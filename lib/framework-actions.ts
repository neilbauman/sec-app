// lib/framework-actions.ts
import {
  NestedPillar,
  NestedTheme,
  NestedSubtheme,
  Pillar,
  Theme,
  Subtheme,
  getSupabaseClient,
  updatePillar,
  updateTheme,
  updateSubtheme,
} from "@/lib/framework-client";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const sort_order = pillars.length + 1;

  const { data, error } = await supabase
    .from("pillars")
    .insert({
      name: "New Pillar",
      description: "",
      sort_order,
    } satisfies Omit<Pillar, "id">)
    .select()
    .single();

  if (error) throw error;

  const newPillar: NestedPillar = {
    ...data,
    ref_code: `P${sort_order}`,
    themes: [],
  };
  return [...pillars, newPillar];
}

export async function addTheme(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const pillar = pillars.find((p) => p.id === pillarId);
  if (!pillar) return pillars;

  const sort_order = pillar.themes.length + 1;

  const { data, error } = await supabase
    .from("themes")
    .insert({
      pillar_id: pillarId,
      name: "New Theme",
      description: "",
      sort_order,
    } satisfies Omit<Theme, "id">)
    .select()
    .single();

  if (error) throw error;

  const newTheme: NestedTheme = {
    ...data,
    ref_code: `T${sort_order}`,
    subthemes: [],
  };

  return pillars.map((p) =>
    p.id === pillarId ? { ...p, themes: [...p.themes, newTheme] } : p
  );
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

  const sort_order = theme.subthemes.length + 1;

  const { data, error } = await supabase
    .from("subthemes")
    .insert({
      theme_id: themeId,
      name: "New Subtheme",
      description: "",
      sort_order,
    } satisfies Omit<Subtheme, "id">)
    .select()
    .single();

  if (error) throw error;

  const newSub: NestedSubtheme = {
    ...data,
    ref_code: `ST${sort_order}`,
  };

  return pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId
              ? { ...t, subthemes: [...t.subthemes, newSub] }
              : t
          ),
        }
      : p
  );
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) throw error;

  return pillars.filter((p) => p.id !== pillarId);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) throw error;

  return pillars.map((pillar) =>
    pillar.id === pillarId
      ? { ...pillar, themes: pillar.themes.filter((t) => t.id !== themeId) }
      : pillar
  );
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subthemeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("subthemes")
    .delete()
    .eq("id", subthemeId);
  if (error) throw error;

  return pillars.map((pillar) =>
    pillar.id === pillarId
      ? {
          ...pillar,
          themes: pillar.themes.map((theme) =>
            theme.id === themeId
              ? {
                  ...theme,
                  subthemes: theme.subthemes.filter((s) => s.id !== subthemeId),
                }
              : theme
          ),
        }
      : pillar
  );
}

// ---------- Edit (persist) ----------
export async function editPillar(
  pillars: NestedPillar[],
  pillarId: string,
  fields: { name?: string; description?: string }
): Promise<NestedPillar[]> {
  await updatePillar(pillarId, fields);
  return pillars.map((p) =>
    p.id === pillarId ? { ...p, ...fields } : p
  );
}

export async function editTheme(
  pillars: NestedPillar[],
  themeId: string,
  fields: { name?: string; description?: string }
): Promise<NestedPillar[]> {
  await updateTheme(themeId, fields);
  return pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) =>
      t.id === themeId ? { ...t, ...fields } : t
    ),
  }));
}

export async function editSubtheme(
  pillars: NestedPillar[],
  subthemeId: string,
  fields: { name?: string; description?: string }
): Promise<NestedPillar[]> {
  await updateSubtheme(subthemeId, fields);
  return pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) => ({
      ...t,
      subthemes: t.subthemes.map((s) =>
        s.id === subthemeId ? { ...s, ...fields } : s
      ),
    })),
  }));
}
