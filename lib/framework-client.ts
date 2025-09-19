"use client";

import { createClient } from "@/lib/supabase-browser";

const supabase = createClient();

/**
 * Fetches the full framework tree (pillars → themes → subthemes).
 * For now, a simple query chain with placeholders.
 */
export async function getFrameworkTree() {
  const { data: pillars, error: pError } = await supabase
    .from("pillars")
    .select("*")
    .order("sort_order", { ascending: true });

  if (pError) throw pError;

  // For now, return pillars only. Expand to include themes/subthemes later.
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
      sort_order: 999, // default placeholder
      ref_code: "", // can be generated later
    },
  ]);

  if (error) throw error;
  return data;
}
