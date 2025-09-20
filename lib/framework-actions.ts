// lib/framework-actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";

// -----------------------------
// Types
// -----------------------------
export interface PillarInput {
  name: string;
  description: string;
  sort_order: number;
}

export interface ThemeInput {
  name: string;
  description: string;
  sort_order: number;
  pillar_id: string;
}

export interface SubthemeInput {
  name: string;
  description: string;
  sort_order: number;
  theme_id: string;
}

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient(); // ✅ no await here

  const { error } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
      },
    ]);

  if (error) {
    console.error("Error inserting pillar:", error);
    throw new Error(error.message);
  }
}

export async function updatePillar(id: string, updates: Partial<PillarInput>) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").update(updates).eq("id", id);

  if (error) {
    console.error("Error updating pillar:", error);
    throw new Error(error.message);
  }
}

export async function deletePillar(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").delete().eq("id", id);

  if (error) {
    console.error("Error deleting pillar:", error);
    throw new Error(error.message);
  }
}

// -----------------------------
// Themes
// -----------------------------
export async function addTheme(data: ThemeInput) {
  const supabase = createClient();

  const { error } = await supabase
    .from("themes")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
        pillar_id: data.pillar_id,
      },
    ]);

  if (error) {
    console.error("Error inserting theme:", error);
    throw new Error(error.message);
  }
}

// -----------------------------
// Subthemes
// -----------------------------
export async function addSubtheme(data: SubthemeInput) {
  const supabase = createClient();

  const { error } = await supabase
    .from("subthemes")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
        theme_id: data.theme_id,
      },
    ]);

  if (error) {
    console.error("Error inserting subtheme:", error);
    throw new Error(error.message);
  }
}
