// lib/framework-actions.ts
"use server";

import { getSupabaseClient } from "./supabase-server";

// ---------- Explicit Insert Types ----------
export type PillarInsert = {
  id?: string;
  ref_code: string;
  name: string;
  description: string;
  sort_order: number;
};

export type ThemeInsert = {
  id?: string;
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type SubthemeInsert = {
  id?: string;
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// ---------- Server Actions ----------
export async function addPillar(data: PillarInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function addTheme(data: ThemeInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("themes").insert([data]);
  if (error) throw error;
}

export async function addSubtheme(data: SubthemeInsert) {
  const supabase = await getSupabaseClient();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}
