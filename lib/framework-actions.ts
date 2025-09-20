// lib/framework-actions.ts
"use server";

import { getSupabaseClient } from "@/lib/supabase-client";

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: { name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Themes
// -----------------------------
export async function addTheme(data: { pillarId: string; name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
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
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Subthemes
// -----------------------------
export async function addSubtheme(data: { themeId: string; name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
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
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
