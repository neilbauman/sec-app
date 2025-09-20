"use server";

import { createClient } from "@/lib/supabase-server";

// -----------------------------
// Types for inputs
// -----------------------------
export type PillarInput = {
  name: string;
  description: string;
};

export type ThemeInput = {
  pillarId: string;
  name: string;
  description: string;
};

export type SubthemeInput = {
  themeId: string;
  name: string;
  description: string;
};

// -----------------------------
// Pillars
// -----------------------------
export async function addPillar(data: PillarInput) {
  const supabase = createClient();

  // Find max sort_order
  const { data: existing, error: fetchError } = await supabase
    .from("pillars")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextSortOrder = existing?.[0]?.sort_order + 1 || 1;

  const { error } = await supabase.from("pillars").insert([
    {
      name: data.name,
      description: data.description,
      sort_order: nextSortOrder,
    },
  ]);

  if (error) throw error;
}

export async function deletePillar(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Themes
// -----------------------------
export async function addTheme(data: ThemeInput) {
  const supabase = createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("themes")
    .select("sort_order")
    .eq("pillar_id", data.pillarId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextSortOrder = existing?.[0]?.sort_order + 1 || 1;

  const { error } = await supabase.from("themes").insert([
    {
      pillar_id: data.pillarId,
      name: data.name,
      description: data.description,
      sort_order: nextSortOrder,
    },
  ]);

  if (error) throw error;
}

export async function deleteTheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw error;
}

// -----------------------------
// Subthemes
// -----------------------------
export async function addSubtheme(data: SubthemeInput) {
  const supabase = createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("subthemes")
    .select("sort_order")
    .eq("theme_id", data.themeId)
    .order("sort_order", { ascending: false })
    .limit(1);

  if (fetchError) throw fetchError;

  const nextSortOrder = existing?.[0]?.sort_order + 1 || 1;

  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.themeId,
      name: data.name,
      description: data.description,
      sort_order: nextSortOrder,
    },
  ]);

  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
