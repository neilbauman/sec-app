// /lib/framework-client.ts
// Fetches full framework from Supabase and computes ref codes dynamically.

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Subtheme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  ref_code: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  ref_code: string;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  ref_code: string;
  themes: Theme[];
}

export async function fetchFramework(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      name,
      description,
      sort_order,
      themes (
        id,
        name,
        description,
        sort_order,
        subthemes (
          id,
          name,
          description,
          sort_order
        )
      )
    `
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("fetchFramework error:", error);
    throw error;
  }

  // Add ref codes dynamically
  const pillars: Pillar[] =
    data?.map((p: any, pIndex: number) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sort_order: p.sort_order,
      ref_code: `P${pIndex + 1}`,
      themes:
        p.themes?.map((t: any, tIndex: number) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          sort_order: t.sort_order,
          ref_code: `T${pIndex + 1}.${tIndex + 1}`,
          subthemes:
            t.subthemes?.map((s: any, sIndex: number) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              sort_order: s.sort_order,
              ref_code: `ST${pIndex + 1}.${tIndex + 1}.${sIndex + 1}`,
            })) ?? [],
        })) ?? [],
    })) ?? [];

  return pillars;
}
