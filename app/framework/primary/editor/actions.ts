"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Helper: get Supabase client for server actions
function getSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );
}

//
// ─── PILLARS ──────────────────────────────────────────────
//
export async function addPillar(pillar: {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("pillars").insert([pillar]).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updatePillar(id: string, updates: Partial<{ code: string; name: string; description: string; sort_order: number; }>) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("pillars").update(updates).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deletePillar(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("pillars").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

//
// ─── THEMES ──────────────────────────────────────────────
//
export async function addTheme(theme: {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
  pillar_id: string;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("themes").insert([theme]).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updateTheme(id: string, updates: Partial<{ code: string; name: string; description: string; sort_order: number; }>) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("themes").update(updates).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deleteTheme(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("themes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

//
// ─── SUBTHEMES ──────────────────────────────────────────────
//
export async function addSubtheme(subtheme: {
  code: string;
  name: string;
  description?: string;
  sort_order?: number;
  theme_id: string;
}) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("subthemes").insert([subtheme]).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updateSubtheme(id: string, updates: Partial<{ code: string; name: string; description: string; sort_order: number; }>) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("subthemes").update(updates).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deleteSubtheme(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("subthemes").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

//
// ─── SORTING ──────────────────────────────────────────────
//
export async function reorderItem(table: "pillars" | "themes" | "subthemes", id: string, newSort: number) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from(table).update({ sort_order: newSort }).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
