import { supabaseServer } from "@/lib/supabase";

export type Pillar = { code: string; name: string; description?: string | null; sort?: number | null; };
export type Theme = { code: string; pillar_code: string; name: string; description?: string | null; sort?: number | null; };
export type Subtheme = { code: string; theme_code: string; name: string; description?: string | null; sort?: number | null; };

export type FrameworkList = {
  pillars: Pillar[];
  themes: Theme[];
  subthemes: Subtheme[];
};

export async function getFrameworkList(): Promise<FrameworkList> {
  const supabase = supabaseServer();

  // Adjust table names/columns to your schema if different.
  const { data: pillars, error: pErr } = await supabase.from("pillars").select("*").order("sort", { ascending: true });
  if (pErr) throw pErr;

  const { data: themes, error: tErr } = await supabase.from("themes").select("*").order("sort", { ascending: true });
  if (tErr) throw tErr;

  const { data: subthemes, error: sErr } = await supabase.from("subthemes").select("*").order("sort", { ascending: true });
  if (sErr) throw sErr;

  return {
    pillars: (pillars ?? []) as Pillar[],
    themes: (themes ?? []) as Theme[],
    subthemes: (subthemes ?? []) as Subtheme[],
  };
}
