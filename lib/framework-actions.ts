// lib/framework-actions.ts
"use server";

import { getSupabaseClient } from "@/lib/supabase-server";
import type {
  PillarInsert,
  ThemeInsert,
  SubthemeInsert,
} from "@/lib/framework-client";

/** Small helper to generate a short ref code if the column is required */
function generateRefCode(name: string) {
  const base = name.replace(/\s+/g, "-").toLowerCase().slice(0, 12);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${base}-${rand}`;
}

/** Pillars */
export async function addPillar(
  data: Pick<PillarInsert, "name" | "description" | "sort_order">
) {
  const supabase = getSupabaseClient();
  const payload: PillarInsert = {
    ref_code: generateRefCode(data.name),
    ...data,
  };

  const { error } = await supabase.from("pillars").insert([payload]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

/** Themes */
export async function addTheme(
  data: Pick<ThemeInsert, "pillar_id" | "name" | "description" | "sort_order">
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").insert([data]);
  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

/** Subthemes */
export async function addSubtheme(
  data: Pick<
    SubthemeInsert,
    "theme_id" | "name" | "description" | "sort_order"
  >
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
