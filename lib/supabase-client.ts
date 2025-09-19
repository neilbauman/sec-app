// lib/framework-client.ts
"use client";

import { supabase } from "./supabase-browser";

export interface Subtheme {
  id: string;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
  subthemes: Subtheme[];
}

export interface Pillar {
  id: string;
  name: string;
  themes: Theme[];
}

/**
 * Fetch the full SSC framework (pillars → themes → subthemes)
 * from the Supabase database.
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const { data, error } = await supabase
    .from("pillars")
    .select("id, name, themes ( id, name, subthemes ( id, name ) )")
    .order("id");

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return (data as Pillar[]) || [];
}
