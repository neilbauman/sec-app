// lib/framework-actions.ts
import { createClient } from "@/lib/supabase-server";

export type PillarInput = {
  name: string;
  description: string;
  sort_order: number;
};

export type ThemeInput = {
  pillarId: string;
  name: string;
  description: string;
  sort_order: number;
};

export type SubthemeInput = {
  themeId: string;
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Pillar actions
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Theme actions
// -----------------------------
export async function addTheme(data: ThemeInput) {
  const supabase = createClient();
  const { error } = await supabase.from("themes").insert([
    {
      pillar_id: data.pillarId,
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
// Subtheme actions
// -----------------------------
export async function addSubtheme(data: SubthemeInput) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.themeId,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
