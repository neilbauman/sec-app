// lib/framework-actions.ts
"use server";

import { getSupabaseClient } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

// Supabase Insert types
type PillarInsert = Database["public"]["Tables"]["pillars"]["Insert"];
type ThemeInsert = Database["public"]["Tables"]["themes"]["Insert"];
type SubthemeInsert = Database["public"]["Tables"]["subthemes"]["Insert"];

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInsert) {
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
export async function addTheme(data: ThemeInsert) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").insert([data]);
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
export async function addSubtheme(data: SubthemeInsert) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
