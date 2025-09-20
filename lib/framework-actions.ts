"use server";

import { getSupabaseClient } from "@/lib/supabase-server";

// ---------- Explicit Insert Types ----------
export type PillarInsert = {
  name: string;
  description: string;
  sort_order: number;
};
export type ThemeInsert = {
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
};
export type SubthemeInsert = {
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// -------- Pillars --------
export async function addPillar(data: PillarInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// -------- Themes --------
export async function addTheme(data: ThemeInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("themes").insert([data]);
  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// -------- Subthemes --------
export async function addSubtheme(data: SubthemeInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
