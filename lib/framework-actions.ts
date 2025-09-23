// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, recalcRefCodes } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("pillars").insert({ name: "New Pillar" }).select().single();
  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    ref_code: "",
    name: data.name,
    description: data.description,
    sort_order: data.sort_order,
    themes: [],
  };

  return recalcRefCodes([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("themes").insert({ name: "New Theme", pillar_id: pillarId }).select().single();
  if (error) throw error;

  const updated = cloneFramework(pillars).map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: [
            ...p.themes,
            {
              id: data.id,
              ref_code: "",
              pillar_id: pillarId,
              name: data.name,
              description: data.description,
              sort_order: data.sort_order,
              subthemes: [],
            },
          ],
        }
      : p
  );

  return recalcRefCodes(updated);
}

export async function addSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("subthemes")
    .insert({ name: "New Subtheme", theme_id: themeId })
    .select()
    .single();
  if (error) throw error;

  const updated = cloneFramework(pillars).map((p) =>
    p.id === pillarId
      ? {
          ...p,
          themes: p.themes.map((t) =>
            t.id === themeId
              ? {
                  ...t,
                  subthemes: [
                    ...t.subthemes,
                    {
                      id: data.id,
                      ref_code: "",
                      theme_id: themeId,
                      name: data.name,
                      description: data.description,
                      sort_order: data.sort_order,
                    },
                  ],
                }
              : t
          ),
        }
      : p
  );

  return recalcRefCodes(updated);
}

// ---------- Remove ----------
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("pillars").delete().eq("id", pillarId);
  return recalcRefCodes(pillars.filter((p) => p.id !== pillarId));
}

export async function removeTheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("themes").delete().eq("id", themeId);
  const updated = cloneFramework(pillars).map((p) =>
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
  const client = getSupabaseClient();
  await client.from("subthemes").delete().eq("id", subId);
  const updated = cloneFramework(pillars).map((p) =>
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

// ---------- Save ----------
export async function saveFramework(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const client = getSupabaseClient();

  // Flatten and persist to DB if needed (simplified for now)
  for (const pillar of pillars) {
    await client.from("pillars").update({ ref_code: pillar.ref_code }).eq("id", pillar.id);
    for (const theme of pillar.themes) {
      await client.from("themes").update({ ref_code: theme.ref_code }).eq("id", theme.id);
      for (const sub of theme.subthemes) {
        await client.from("subthemes").update({ ref_code: sub.ref_code }).eq("id", sub.id);
      }
    }
  }

  return recalcRefCodes(pillars);
}
