"use client";

import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

/**
 * Fetches the full framework tree (pillars → themes → subthemes).
 * For now this just fetches pillars. Expand with joins later.
 */
export async function getFrameworkTree() {
  const { data: pillars, error } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return pillars ?? [];
}

/**
 * Adds a new pillar (stub implementation).
 */
export async function addPillar({
  name,
  description,
}: {
  name: string;
  description?: string;
}) {
  const { data, error } = await supabase.from("pillars").insert([
    {
      name,
      description,
      sort_order: 999, // placeholder
      ref_code: "", // can be generated later
    },
  ]);

  if (error) throw error;
  return data;
}

/**
 * Adds a new theme (stub).
 */
export async function addTheme({
  pillar_id,
  name,
  description,
}: {
  pillar_id: string;
  name: string;
  description?: string;
}) {
  const { data, error } = await supabase.from("themes").insert([
    {
      pillar_id,
      name,
      description,
      sort_order: 999,
      ref_code: "",
      pillar_code: "",
    },
  ]);

  if (error) throw error;
  return data;
}

/**
 * Adds a new subtheme (stub).
 */
export async function addSubtheme({
  theme_id,
  name,
  description,
}: {
  theme_id: string;
  name: string;
  description?: string;
}) {
  const { data, error } = await supabase.from("subthemes").insert([
    {
      theme_id,
      name,
      description,
      sort_order: 999,
      ref_code: "",
      theme_code: "",
    },
  ]);

  if (error) throw error;
  return data;
}
