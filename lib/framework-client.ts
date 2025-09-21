// lib/framework-client.ts
import { createClient } from "@supabase/supabase-js";

// ---------- Types ----------

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

export type Theme = {
  id: string;
  theme_id: string; // ✅ FK to pillars.id
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

export type Subtheme = {
  id: string;
  theme_id: string; // ✅ FK to themes.id
  name: string;
  description: string | null;
  sort_order: number;
  default_indicator_id?: string | null;
};

// Nested structures for UI
export type NestedSubtheme = Subtheme & {
  ref_code: string;
};

export type NestedTheme = Theme & {
  ref_code: string;
  subthemes: NestedSubtheme[];
};

export type NestedPillar = Pillar & {
  ref_code: string;
  themes: NestedTheme[];
};

// ---------- Supabase client ----------

export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ---------- Update helpers ----------

export async function updatePillar(
  id: string,
  fields: Partial<Pick<Pillar, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("pillars").update(fields).eq("id", id);
  if (error) throw error;
}

export async function updateTheme(
  id: string,
  fields: Partial<Pick<Theme, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("themes").update(fields).eq("id", id);
  if (error) throw error;
}

export async function updateSubtheme(
  id: string,
  fields: Partial<Pick<Subtheme, "name" | "description">>
) {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("subthemes").update(fields).eq("id", id);
  if (error) throw error;
}
