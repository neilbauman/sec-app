// lib/framework-actions.ts
// Server-only CRUD actions for SSC framework

"use server";

import { getSupabaseServer } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

// Explicit insert types (safe + future-proof)
export type PillarInsert =
  Database["public"]["Tables"]["pillars"]["Insert"];
export type ThemeInsert =
  Database["public"]["Tables"]["themes"]["Insert"];
export type SubthemeInsert =
  Database["public"]["Tables"]["subthemes"]["Insert"];

// ------- Pillars -------
export async function addPillar(data: PillarInsert) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// ------- Themes -------
export async function addTheme(data: ThemeInsert) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("themes").insert([data]);
  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// ------- Subthemes -------
export async function addSubtheme(data: SubthemeInsert) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
