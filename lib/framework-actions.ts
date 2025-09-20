// lib/framework-actions.ts
"use server";

import { createClient } from "@/lib/supabase-browser";

type PillarInput = {
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();

  const { error } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
      },
    ]);

  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").delete().eq("id", id);

  if (error) throw error;
}

// -----------------------------
// Themes
// -----------------------------
export async function deleteTheme(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("themes").delete().eq("id", id);

  if (error) throw error;
}

// -----------------------------
// Subthemes
// -----------------------------
export async function deleteSubtheme(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("subthemes").delete().eq("id", id);

  if (error) throw error;
}
