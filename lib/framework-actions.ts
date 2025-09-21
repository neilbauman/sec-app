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

/**
 * Recalculate sort_order and ref_code for all pillars/themes/subthemes,
 * persist the new sort_order values in Supabase,
 * and return the updated nested structure with fresh ref_codes.
 */
async function reindexFramework(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();

  const pillarUpdates: { id: string; sort_order: number }[] = [];
  const themeUpdates: { id: string; sort_order: number }[] = [];
  const subthemeUpdates: { id: string; sort_order: number }[] = [];

  const reindexedPillars: NestedPillar[] = pillars.map((p, pIdx) => {
    const newPillarSort = pIdx + 1;
    pillarUpdates.push({ id: p.id, sort_order: newPillarSort });

    const reindexedThemes: NestedTheme[] = p.themes.map((t, tIdx) => {
      const newThemeSort = tIdx + 1;
      themeUpdates.push({ id: t.id, sort_order: newThemeSort });

      const reindexedSubs: NestedSubtheme[] = t.subthemes.map((s, sIdx) => {
        const newSubSort = sIdx + 1;
        subthemeUpdates.push({ id: s.id, sort_order: newSubSort });

        return {
          ...s,
          sort_order: newSubSort,
          ref_code: `ST${newPillarSort}.${newThemeSort}.${newSubSort}`,
        };
      });

      return {
        ...t,
        sort_order: newThemeSort,
        ref_code: `T${newPillarSort}.${newThemeSort}`,
        subthemes: reindexedSubs,
      };
    });

    return {
      ...p,
      sort_order: newPillarSort,
      ref_code: `P${newPillarSort}`,
      themes: reindexedThemes,
    };
  });

  // Persist updated sort_order values in Supabase
  if (pillarUpdates.length > 0) {
    const { error } = await supabase.from("pillars").upsert(pillarUpdates);
    if (error) {
      console.error("Supabase pillar reindex error:", error);
      throw error;
    }
  }
  if (themeUpdates.length > 0) {
    const { error } = await supabase.from("themes").upsert(themeUpdates);
    if (error) {
      console.error("Supabase theme reindex error:", error);
      throw error;
    }
  }
  if (subthemeUpdates.length > 0) {
    const { error } = await supabase.from("subthemes").upsert(subthemeUpdates);
    if (error) {
      console.error("Supabase subtheme reindex error:", error);
      throw error;
    }
  }

  return reindexedPillars;
}

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("pillars")
    .insert({
      name: "Untitled Pillar",
      description: "",
      sort_order: pillars.length + 1,
    } satisfies Omit<Pillar, "id">)
    .select()
    .single();
  if (error) throw error;

  const newPillars: NestedPillar[] = [
    ...pillars,
    { ...data, ref_code: "", themes: [] }, // ref_code recalculated in reindex
  ];

  return reindexFramework(newPillars);
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
    .insert({
      pillar_id: pillarId,
      name: "Untitled Theme",
      description: "",
      sort_order: pillar.themes.length + 1,
    } satisfies Omit<Theme, "id">)
    .select()
    .single();
  if (error) throw error;

  const newPillars: NestedPillar[] = pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: [...p.themes, { ...data, ref_code: "", subthemes: [] }],
        }
      : p
  );

  return reindexFramework(newPillars);
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
    } satisfies Omit<Subtheme, "id">)
    .select()
    .single();
  if (error) throw error;

  const newPillars: NestedPillar[] = pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId
              ? { ...t, subthemes: [...t.subthemes, { ...data, ref_code: "" }] }
              : t
          ),
        }
      : p
  );

  return reindexFramework(newPillars);
}

// ---------- Remove ----------
export async function removePillar(
  pillars: NestedPillar[],
  pillarId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", pillarId);
  if (error) {
    if (error.message.includes("violates foreign key constraint")) {
      throw new Error("Delete all themes under this pillar first.");
    }
    console.error("Supabase pillar delete error:", error);
    throw error;
  }

  const newPillars = pillars.filter((p) => p.id !== pillarId);
  return reindexFramework(newPillars);
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", themeId);
  if (error) {
    if (error.message.includes("violates foreign key constraint")) {
      throw new Error("Delete all subthemes under this theme first.");
    }
    console.error("Supabase theme delete error:", error);
    throw error;
  }

  const newPillars = pillars.map((p) =>
    p.id === pillarId
      ? { ...p, themes: p.themes.filter((t) => t.id !== themeId) }
      : p
  );
  return reindexFramework(newPillars);
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
  if (error) {
    console.error("Supabase subtheme delete error:", error);
    throw error;
  }

  const newPillars = pillars.map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId
              ? {
                  ...t,
                  subthemes: t.subthemes.filter((s) => s.id !== subthemeId),
                }
              : t
          ),
        }
      : p
  );
  return reindexFramework(newPillars);
}

// ---------- Edit ----------
export async function editPillar(
  pillars: NestedPillar[],
  pillarId: string,
  fields: { name?: string; description?: string }
): Promise<NestedPillar[]> {
  await updatePillar(pillarId, fields);
  return pillars.map((p) => (p.id === pillarId ? { ...p, ...fields } : p));
}

export async function editTheme(
  pillars: NestedPillar[],
  themeId: string,
  fields: { name?: string; description?: string }
): Promise<NestedPillar[]> {
  await updateTheme(themeId, fields);
  return pillars.map((p) => ({
    ...p,
    themes: p.themes.map((t) => (t.id === themeId ? { ...t, ...fields } : t)),
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
