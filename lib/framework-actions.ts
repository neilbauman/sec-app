"use server";

import { getSupabaseClient } from "@/lib/supabase-server";
import type {
  PillarInsert,
  ThemeInsert,
  SubthemeInsert,
} from "@/lib/framework-client";
import { fetchFramework } from "@/lib/framework-client"; // ✅ re-export

// ---------- Pillars ----------
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

// ---------- Themes ----------
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

// ---------- Subthemes ----------
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

// ---------- Re-export fetch ----------
export { fetchFramework }; // ✅ makes it available here
