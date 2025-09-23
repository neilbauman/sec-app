// lib/framework-actions.ts
import { getSupabaseClient } from "@/lib/supabase-client";
import type { NestedPillar, NestedTheme, NestedSubtheme } from "@/lib/framework-client";
import { cloneFramework, renumberAll } from "@/lib/framework-utils";
import { v4 as uuidv4 } from "uuid";

// Example: full DB-backed functions (trimmed down for brevity, expand as needed)

// ---------- Add ----------
export async function addPillar(pillars: NestedPillar[]): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("pillars").insert({ name: "New Pillar" }).select().single();
  if (error) throw error;

  const newPillar: NestedPillar = {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: pillars.length + 1,
    ref_code: "",
    themes: [],
  };

  return renumberAll([...pillars, newPillar]);
}

export async function addTheme(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("themes").insert({ pillar_id: pillarId, name: "New Theme" }).select().single();
  if (error) throw error;

  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: [
              ...p.themes,
              {
                id: data.id,
                pillar_id: pillarId,
                name: data.name,
                description: data.description,
                sort_order: p.themes.length + 1,
                ref_code: "",
                subthemes: [],
              },
            ],
          }
    )
  );
}

export async function addSubtheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  const { data, error } = await client.from("subthemes").insert({ theme_id: themeId, name: "New Subtheme" }).select().single();
  if (error) throw error;

  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: p.themes.map((t) =>
              t.id !== themeId
                ? t
                : {
                    ...t,
                    subthemes: [
                      ...t.subthemes,
                      {
                        id: data.id,
                        theme_id: themeId,
                        name: data.name,
                        description: data.description,
                        sort_order: t.subthemes.length + 1,
                        ref_code: "",
                      },
                    ],
                  }
            ),
          }
    )
  );
}

// ---------- Remove ----------
export async function removePillar(pillars: NestedPillar[], pillarId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("pillars").delete().eq("id", pillarId);
  return renumberAll(pillars.filter((p) => p.id !== pillarId));
}

export async function removeTheme(pillars: NestedPillar[], pillarId: string, themeId: string): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("themes").delete().eq("id", themeId);
  return renumberAll(
    pillars.map((p) => (p.id !== pillarId ? p : { ...p, themes: p.themes.filter((t) => t.id !== themeId) }))
  );
}

export async function removeSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string
): Promise<NestedPillar[]> {
  const client = getSupabaseClient();
  await client.from("subthemes").delete().eq("id", subId);
  return renumberAll(
    pillars.map((p) =>
      p.id !== pillarId
        ? p
        : {
            ...p,
            themes: p.themes.map((t) =>
              t.id !== themeId ? t : { ...t, subthemes: t.subthemes.filter((s) => s.id !== subId) }
            ),
          }
    )
  );
}

// ---------- Move (DB stub, adjust as needed) ----------
export async function movePillar(pillars: NestedPillar[], pillarId: string, direction: "up" | "down"): Promise<NestedPillar[]> {
  return renumberAll(cloneFramework(pillars)); // real impl would update DB order
}
export async function moveTheme(pillars: NestedPillar[], pillarId: string, themeId: string, direction: "up" | "down"): Promise<NestedPillar[]> {
  return renumberAll(cloneFramework(pillars));
}
export async function moveSubtheme(
  pillars: NestedPillar[],
  pillarId: string,
  themeId: string,
  subId: string,
  direction: "up" | "down"
): Promise<NestedPillar[]> {
  return renumberAll(cloneFramework(pillars));
}
