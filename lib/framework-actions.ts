// /lib/framework-actions.ts
// addPillar + editPillar are real, others are still stubs.

import { createClient } from "@supabase/supabase-js";

// Untyped client (avoids TS errors)
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
  const { error } = await supabase.from("pillars").insert([
    {
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);

  if (error) {
    console.error("addPillar error:", error);
    throw error;
  }

  console.log("Pillar added successfully:", data.name);
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
