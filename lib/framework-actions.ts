// /lib/framework-actions.ts
// All safe DB mutations for the Primary Framework.
// Each Pillar auto-creates a default "General" Theme and Subtheme.
// Each Theme auto-creates a default "General" Subtheme.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//
// ─── PILLARS ──────────────────────────────────────────────
//
export async function addPillar(data: {
  name: string;
  description: string;
  sort_order: number;
}) {
  // Insert the pillar
  const { data: pillarData, error: pillarError } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
      },
    ])
    .select("id")
    .single();

  if (pillarError) {
    console.error("addPillar error:", pillarError);
    throw pillarError;
  }

  const pillarId = pillarData.id;

  // Insert a default "General" theme at sort_order 0
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

  // Insert a default "General" subtheme at sort_order 0
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
  sort_order: number;
}) {
  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .insert([
      {
        pillar_id: data.pillar_id,
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
      },
    ])
    .select("id")
    .single();

  if (themeError) {
    console.error("addTheme error:", themeError);
    throw themeError;
  }

  const themeId = themeData.id;

  // Default "General" subtheme at sort_order 0
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
  sort_order: number;
}) {
  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.theme_id,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
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
// For now, delete/edit can be wired later
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
