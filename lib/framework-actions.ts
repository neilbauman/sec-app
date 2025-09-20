// lib/framework-actions.ts
"use server";

import { createClient } from "@/lib/supabase-browser";

// -----------------------------
// Types
// -----------------------------
export type PillarInput = {
  name: string;
  description: string;
  sort_order: number;
};

export type ThemeInput = {
  pillar_id: string;
  name: string;
  description: string;
  sort_order: number;
};

export type SubthemeInput = {
  theme_id: string;
  name: string;
  description: string;
  sort_order: number;
};

// -----------------------------
// Helpers
// -----------------------------
function makeError(message: string) {
  return { success: false, message };
}
function makeSuccess() {
  return { success: true };
}

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();

  const { error } = await supabase.from("pillars").insert([
    {
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);

  if (error) return makeError(error.message);
  return makeSuccess();
}

export async function deletePillar(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);

  if (error) return makeError(error.message);
  return makeSuccess();
}

// -----------------------------
// Themes
// -----------------------------
export async function addTheme(data: ThemeInput) {
  const supabase = createClient();

  const { error } = await supabase.from("themes").insert([
    {
      pillar_id: data.pillar_id,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);

  if (error) return makeError(error.message);
  return makeSuccess();
}

export async function deleteTheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);

  if (error) return makeError(error.message);
  return makeSuccess();
}

// -----------------------------
// Subthemes
// -----------------------------
export async function addSubtheme(data: SubthemeInput) {
  const supabase = createClient();

  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.theme_id,
      name: data.name,
      description: data.description,
      sort_order: data.sort_order,
    },
  ]);

  if (error) return makeError(error.message);
  return makeSuccess();
}

export async function deleteSubtheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);

  if (error) return makeError(error.message);
  return makeSuccess();
}
