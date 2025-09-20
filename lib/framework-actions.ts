// lib/framework-actions.ts
"use server";

import { getSupabaseClient } from "@/lib/supabase-server";

/** Small helper to generate a short ref code if the column is required */
function generateRefCode(name: string) {
  const base = name.replace(/\s+/g, "-").toLowerCase().slice(0, 12);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}-${rand}`;
}

/** Pillars */
export async function addPillar(data: { name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
  const payload = {
    ref_code: generateRefCode(data.name),
    ...data,
  };

  // Force insert to bypass type issues
  const { error } = await (supabase.from("pillars") as any).insert([payload]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

/** Themes */
export async function addTheme(data: { pillar_id: string; name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
  const { error } = await (supabase.from("themes") as any).insert([data]);
  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

/** Subthemes */
export async function addSubtheme(data: { theme_id: string; name: string; description: string; sort_order: number }) {
  const supabase = getSupabaseClient();
  const { error } = await (supabase.from("subthemes") as any).insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
