import { createClient } from "@/lib/supabase-browser";
import { Database } from "@/types/supabase";

export type Subtheme = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  subthemes?: Subtheme[];
};

export type Pillar = {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
  themes?: Theme[];
};

export async function fetchFramework(): Promise<Pillar[]> {
  const supabase = createClient<Database>();

  const { data: pillars, error: pillarError } = await supabase
    .from("pillars")
    .select("id, name, description, sort_order, themes(id, name, description, sort_order, subthemes(id, name, description, sort_order)))")
    .order("sort_order");

  if (pillarError) {
    console.error("Error fetching framework:", pillarError);
    return [];
  }

  return (pillars as any) || [];
}
