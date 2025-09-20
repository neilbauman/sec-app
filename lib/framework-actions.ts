// lib/framework-actions.ts
"use server";

import { createClient } from "@/lib/supabase-server";
import type { Database } from "@/types/supabase";

// Inline input types
type PillarInsert = {
  name: string;
  description: string;
  sort_order: number;
};

type ThemeInsert = {
  pillarId: string;
  name: string;
  description: string;
  sort_order: number;
};

type SubthemeInsert = {
  themeId: string;
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInsert) {
  const supabase = await createClient();
  const { error } = await supabase.from("pillars").insert([data]);
  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Themes
// -----------------------------
export async function addTheme(data: ThemeInsert) {
  const supabase = await createClient();
  const { error } = await supabase.from("themes").insert([data]);
  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Subthemes
// -----------------------------
export async function addSubtheme(data: SubthemeInsert) {
  const supabase = await createClient();
  const { error } = await supabase.from("subthemes").insert([data]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
