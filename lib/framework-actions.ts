// /lib/framework-actions.ts
// addPillar + editPillar are real, others stubs. Now addPillar creates a default theme and subtheme.

import { createClient } from "@supabase/supabase-js";

// Untyped client (avoids TS schema conflicts)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//
// Pillars
//
export async function addPillar(data: {
  name: string;
  description: string;
  sort_order: number;
}) {
  // Step 1: Insert the pillar
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

  // Step 2: Insert a default theme
  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .insert([
      {
        pillar_id: pillarId,
        name: "Default Theme",
        description: "This is a default theme placeholder.",
        sort_order: 1,
      },
    ])
    .select("id")
    .single();

  if (themeError) {
    console.error("addPillar default theme error:", themeError);
    throw themeError;
  }

  const themeId = themeData.id;

  // Step 3: Insert a default subtheme
  const { error: subthemeError } = await supabase.from("subthemes").insert([
    {
      theme_id: themeId,
      name: "Default Subtheme",
      description: "This is a default subtheme placeholder.",
      sort_order: 1,
    },
  ]);

  if (subthemeError) {
    console.error("addPillar default subtheme error:", subthemeError);
    throw subthemeError;
  }

  console.log("Pillar with defaults added successfully:", data.name);
  return Promise.resolve();
}

export async function editPillar(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  const { error } = await supabase
    .from("pillars")
    .update({
      name: updates.name,
      description: updates.description,
      sort_order: updates.sort_order,
    })
    .eq("id", id);

  if (error) {
    console.error("editPillar error:", error);
    throw error;
  }

  console.log("Pillar updated successfully:", id, updates);
  return Promise.resolve();
}

export async function deletePillar(id: string) {
  console.log("Stub: delete pillar", id);
  return Promise.resolve();
}

//
// Themes
//
export async function addTheme(
  pillarId: string,
  data: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: add theme under pillar", pillarId, data);
  return Promise.resolve();
}

export async function editTheme(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: edit theme", id, updates);
  return Promise.resolve();
}

export async function deleteTheme(id: string) {
  console.log("Stub: delete theme", id);
  return Promise.resolve();
}

//
// Subthemes
//
export async function addSubtheme(
  themeId: string,
  data: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: add subtheme under theme", themeId, data);
  return Promise.resolve();
}

export async function editSubtheme(
  id: string,
  updates: { name: string; description: string; sort_order: number }
) {
  console.log("Stub: edit subtheme", id, updates);
  return Promise.resolve();
}

export async function deleteSubtheme(id: string) {
  console.log("Stub: delete subtheme", id);
  return Promise.resolve();
}
