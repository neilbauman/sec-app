// lib/framework-actions.ts
import {
  NestedPillar,
  updatePillar,
  updateTheme,
  updateSubtheme,
} from "./framework-client";

// ---- Edit Helpers (persist to Supabase then update local state) ----

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
