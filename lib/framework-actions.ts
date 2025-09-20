// lib/framework-actions.ts
"use server";

import { createClient } from "@/lib/supabase-browser";

type PillarInput = {
  name: string;
  description: string;
  sort_order: number;
};

type ThemeInput = {
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").insert([
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
export async function addTheme(data: ThemeInput) {
  const supabase = createClient();

  const { error } = await supabase.from("themes").insert([
    {
      pillar_id: data.pillar_id,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);

  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Subthemes (stubs until later)
// -----------------------------
export async function deleteSubtheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
