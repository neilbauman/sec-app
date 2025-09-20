// lib/framework-actions.ts
import { createClient } from "@/lib/supabase-browser";
import { Database } from "@/types/supabase";

export type PillarInput = {
  name: string;
  description: string;
  sort_order: number; // ✅ added back
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

  const { error } = await supabase
    .from("pillars")
    .insert([
      {
        name: data.name,
        description: data.description,
        sort_order: data.sort_order,
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
  const { error } = await supabase.from("themes").insert([
    {
      pillar_id: data.pillarId,
      name: data.name,
      description: data.description,
      sort_order: 1, // could improve later
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
  const { error } = await supabase.from("subthemes").insert([
    {
      theme_id: data.themeId,
      name: data.name,
      description: data.description,
      sort_order: 1, // could improve later
    },
  ]);
  if (error) throw error;
}

export async function deleteSubtheme(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw error;
}
