// lib/framework-client.ts
import { createClient } from "./supabase-client";

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
 * Fetches pillars with their nested themes and subthemes
 * in a stable, ordered structure for the Framework Editor.
 */
export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("pillars")
    .select(
      `
      id,
      name,
      themes:themes(
        id,
        name,
        subthemes:subthemes(
          id,
          name
        )
      )
    `
    )
    .order("id");

  if (error) {
    console.error("Error fetching framework:", error);
    return [];
  }

  return data as Pillar[];
}
