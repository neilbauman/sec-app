// lib/framework.ts
import { createServerSupabase } from "@/lib/supabase-server";

export type Pillar = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type Theme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  pillar_id: string | null;
  pillar_code?: string | null;
};

export type Subtheme = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  sort_order: number;
  theme_id: string | null;
  theme_code?: string | null;
};

// Fetches data on the server (page/route handlers)
export async function fetchFrameworkList(): Promise<{
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
}> {
  const supabase = createServerSupabase();

  const [{ data: pillars }, { data: themes }, { data: subthemes }] =
    await Promise.all([
      supabase.from("pillars").select("*").order("sort_order", { ascending: true }),
      supabase.from("themes").select("*").order("sort_order", { ascending: true }),
      supabase.from("subthemes").select("*").order("sort_order", { ascending: true }),
    ]);

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  };
}
