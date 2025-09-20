// /lib/framework-actions.ts
// Safe DB mutations for the Primary Framework.
// Rules:
// - Every Pillar gets one "General" Theme at sort_order 0.
// - Every Theme gets one "General" Subtheme at sort_order 0.
// - User-created Themes/Subthemes start at sort_order >= 1.
// - Sort order is auto-assigned as max(existing) + 1.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//
// ─── HELPERS ──────────────────────────────────────────────
//
async function getNextSortOrder(
  table: string,
  foreignKey: string,
  id: string
): Promise<number> {
  const { data, error } = await supabase
    .from(table)
    .select("sort_order")
    .eq(foreignKey, id);

  if (error) {
    console.error(`getNextSortOrder error for ${table}:`, error);
    throw error;
  }

  if (!data || data.length === 0) return 1; // nothing exists yet, reserve 0 for General

  const maxSort = Math.max(...data.map((r: any) => r.sort_order ?? 0));
  return maxSort + 1;
}

//
// ─── PILLARS ──────────────────────────────────────────────
//
export async function addPillar(data: {
  name: string;
  description: string;
}) {
  // Compute next pillar sort order
  const { data: allPillars, error: pillarsError } = await supabase
    .from("pillars")
    .select("sort_order");

  if (pillarsError) {
    console.error("addPillar fetch pillars error:", pillarsError);
    throw pillarsError;
  }

  const maxSort =
    allPillars && allPillars.length > 0
      ? Math.max(...allPillars.map((p: any) => p.sort_order ?? 0))
      : 0;

  const sortOrder = maxSort + 1;

  // Insert pillar
  const { data: pillarData, error: pillarError } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: sortOrder,
      },
    ])
    .select("id")
    .single();

  if (pillarError) {
    console.error("addPillar error:", pillarError);
    throw pillarError;
  }

  const pillarId = pillarData.id;

  // Insert "General" theme at sort_order 0
  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .insert([
      {
        pillar_id: pillarId,
        name: "General",
        description: "General theme (auto-created)",
        sort_order: 0,
      },
    ])
    .select("id")
    .single();

  if (themeError) {
    console.error("addPillar default theme error:", themeError);
    throw themeError;
  }

  const themeId = themeData.id;

  // Insert "General" subtheme at sort_order 0
  const { error: subthemeError } = await supabase.from("subthemes").insert([
    {
      theme_id: themeId,
      name: "General",
      description: "General subtheme (auto-created)",
      sort_order: 0,
    },
  ]);

  if (subthemeError) {
    console.error("addPillar default subtheme error:", subthemeError);
    throw subthemeError;
  }

  console.log("Pillar with General theme + subtheme added:", data.name);
}

//
// ─── THEMES ───────────────────────────────────────────────
//
export async function addTheme(data: {
  pillar_id: string;
  name: string;
  description: string;
}) {
  const sortOrder = await getNextSortOrder("themes", "pillar_id", data.pillar_id);

  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .insert([
      {
        pillar_id: data.pillar_id,
        name: data.name,
        description: data.description,
        sort_order: sortOrder,
      },
    ])
    .select("id")
    .single();

  if (themeError) {
    console.error("addTheme error:", themeError);
    throw themeError;
  }

  const themeId = themeData.id;

  // Insert "General" subtheme at sort_order 0
  const { error: subthemeError } = await supabase.from("subthemes").insert([
    {
      theme_id: themeId,
      name: "General",
      description: "General subtheme (auto-created)",
      sort_order: 0,
    },
  ]);

  if (subthemeError) {
    console.error("addTheme default subtheme error:", subthemeError);
    throw subthemeError;
  }

  console.log("Theme with General subtheme added:", data.name);
}

//
// ─── SUBTHEMES ────────────────────────────────────────────
//
export async function addSubtheme(data: {
  theme_id: string;
  name: string;
  description: string;
}) {
  const sortOrder = await getNextSortOrder("subthemes", "theme_id", data.theme_id);

  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.theme_id,
      name: data.name,
      description: data.description,
      sort_order: sortOrder,
    },
  ]);

  if (error) {
    console.error("addSubtheme error:", error);
    throw error;
  }

  console.log("Subtheme added:", data.name);
}

//
// ─── PLACEHOLDERS ─────────────────────────────────────────
//
export async function deletePillar(id: string) {
  console.log("deletePillar placeholder:", id);
}

export async function deleteTheme(id: string) {
  console.log("deleteTheme placeholder:", id);
}

export async function deleteSubtheme(id: string) {
  console.log("deleteSubtheme placeholder:", id);
}
